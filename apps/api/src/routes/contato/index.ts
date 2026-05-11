import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ContatoEmpresarialSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(10),
  empresa: z.string().min(2),
  usuariosEstimados: z.number().min(11),
  mensagem: z.string().optional(),
});

const contatoRoutes: FastifyPluginAsync = async (app) => {
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

  app.post(
    "/empresarial",
    { config: { rateLimit: { max: 10, timeWindow: "1 hour" } } },
    async (request, reply) => {
      const data = ContatoEmpresarialSchema.parse(request.body);
      const emailComercial = process.env.EMAIL_COMERCIAL;

      const emailHtml = `
<h2>Novo Contato Empresarial — MediVisitas</h2>
<table style="border-collapse:collapse;">
  <tr><td><strong>Nome:</strong></td><td>${esc(data.nome)}</td></tr>
  <tr><td><strong>Email:</strong></td><td>${esc(data.email)}</td></tr>
  <tr><td><strong>Telefone:</strong></td><td>${esc(data.telefone)}</td></tr>
  <tr><td><strong>Empresa:</strong></td><td>${esc(data.empresa)}</td></tr>
  <tr><td><strong>Usuários estimados:</strong></td><td>${data.usuariosEstimados}</td></tr>
  <tr><td><strong>Mensagem:</strong></td><td>${esc(data.mensagem ?? "Não informada")}</td></tr>
</table>
<p style="color:#6b7280;margin-top:16px;">Responda em até 1 dia útil.</p>`;

      // Log sempre (auditoria)
      request.log.info(
        { contato: data, emailComercial: emailComercial ?? null },
        "Contato empresarial recebido",
      );

      // Enviar via Resend se configurado
      if (resend && emailComercial) {
        try {
          const result = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [process.env.EMAIL_COMERCIAL!],
            replyTo: data.email,
            subject: `[MediVisitas] Contato Empresarial — ${data.empresa}`,
            html: emailHtml,
          });

          if (result.error) {
            console.error("[Resend] Erro da API:", result.error);
            console.warn("[Resend] Email não enviado, verificar configuração");
            request.log.error(
              { err: result.error },
              "Falha ao enviar email via Resend (Erro da API)",
            );
          } else {
            console.log("[Resend] Email enviado com sucesso:", result.data?.id);
          }
        } catch (emailError) {
          console.error("[Resend] Erro detalhado:", JSON.stringify(emailError));
          request.log.error(
            { err: emailError },
            "Falha na requisição ao enviar email via Resend",
          );
          // Não retornamos 502 aqui. O erro é interno, o formulário foi preenchido corretamente.
        }
      } else {
        request.log.warn(
          "RESEND_API_KEY ou EMAIL_COMERCIAL não configurados — email não enviado",
        );
      }

      return {
        ok: true,
        mensagem: "Entraremos em contato em até 1 dia útil.",
      };
    },
  );
};

export default contatoRoutes;
