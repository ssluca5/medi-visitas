import { z } from "zod";
const ContatoEmpresarialSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    telefone: z.string().min(10),
    empresa: z.string().min(2),
    usuariosEstimados: z.number().min(11),
    mensagem: z.string().optional(),
});
const contatoRoutes = async (app) => {
    app.post("/empresarial", { config: { rateLimit: { max: 10, timeWindow: "1 hour" } } }, async (request) => {
        const data = ContatoEmpresarialSchema.parse(request.body);
        const emailBody = [
            "Novo contato Empresarial - MediVisitas",
            "",
            `Nome: ${data.nome}`,
            `Email: ${data.email}`,
            `Telefone: ${data.telefone}`,
            `Empresa: ${data.empresa}`,
            `Usuarios estimados: ${data.usuariosEstimados}`,
            `Mensagem: ${data.mensagem ?? "Nao informada"}`,
            "",
            "Responda em ate 1 dia util.",
        ].join("\n");
        request.log.info({
            emailComercial: process.env.EMAIL_COMERCIAL ?? null,
            contato: data,
            emailBody,
        }, "Contato empresarial recebido");
        return {
            ok: true,
            mensagem: "Entraremos em contato em ate 1 dia util.",
        };
    });
};
export default contatoRoutes;
