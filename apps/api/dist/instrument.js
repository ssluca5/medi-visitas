// Sentry deve ser importado ANTES de qualquer outro módulo
import * as Sentry from "@sentry/node";
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? "development",
    enabled: !!process.env.SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    // Não enviar dados pessoais para o Sentry
    beforeSend(event) {
        // Remover headers com tokens
        if (event.request?.headers) {
            delete event.request.headers["authorization"];
            delete event.request.headers["cookie"];
        }
        return event;
    },
});
export { Sentry };
