import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { Resend } from "resend";
import { verifyClerkToken } from "../../hooks/auth.js";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const SuporteSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  assunto: z.string().min(2),
  mensagem: z.string().min(10),
});

const suporteRoutes: FastifyPluginAsync = async (app) => {
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

  app.post(
    "/",
    {
      preHandler: [verifyClerkToken],
      config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
    },
    async (request, reply) => {
      const data = SuporteSchema.parse(request.body);

      // O e-mail de suporte pode ser configurado separadamente,
      // mas se não existir, usamos o EMAIL_COMERCIAL como fallback
      const emailSuporte =
        process.env.EMAIL_SUPORTE ?? process.env.EMAIL_COMERCIAL;

      const emailHtml = `
<h2>Novo Ticket de Suporte — MediVisitas</h2>
<table style="border-collapse:collapse;">
  <tr><td><strong>Usuário (ID):</strong></td><td>${esc(request.userId ?? "unknown")}</td></tr>
  <tr><td><strong>Nome:</strong></td><td>${esc(data.nome)}</td></tr>
  <tr><td><strong>Email:</strong></td><td>${esc(data.email)}</td></tr>
  <tr><td><strong>Assunto:</strong></td><td>${esc(data.assunto)}</td></tr>
  <tr><td colspan="2"><br/><strong>Mensagem:</strong><br/><p style="white-space: pre-wrap;">${esc(data.mensagem)}</p></td></tr>
</table>
<p style="color:#6b7280;margin-top:16px;">Ticket gerado a partir do Dashboard.</p>`;

      request.log.info(
        {
          suporte: data,
          emailSuporte: emailSuporte ?? null,
          userId: request.userId,
        },
        "Ticket de suporte recebido",
      );

      // Enviar via Resend se configurado
      if (resend && emailSuporte) {
        try {
          const result = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [emailSuporte],
            replyTo: data.email,
            subject: `[Suporte] ${data.assunto} — ${data.nome}`,
            html: emailHtml,
          });

          if (result.error) {
            console.error("[Resend Suporte] Erro da API:", result.error);
            request.log.error(
              { err: result.error },
              "Falha ao enviar email de suporte via Resend",
            );
          } else {
            console.log(
              "[Resend Suporte] Email enviado com sucesso:",
              result.data?.id,
            );
          }
        } catch (emailError) {
          console.error(
            "[Resend Suporte] Erro detalhado:",
            JSON.stringify(emailError),
          );
          request.log.error(
            { err: emailError },
            "Falha na requisição ao enviar email de suporte via Resend",
          );
        }
      } else {
        request.log.warn(
          "RESEND_API_KEY ou EMAIL_SUPORTE/COMERCIAL não configurados — ticket de suporte não enviado por email",
        );
      }

      return reply.code(200).send({
        ok: true,
        mensagem: "Mensagem de suporte recebida com sucesso.",
      });
    },
  );
};

export default suporteRoutes;
