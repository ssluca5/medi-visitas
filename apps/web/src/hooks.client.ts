import { env } from "$env/dynamic/public";
import * as Sentry from "@sentry/sveltekit";

if (env.PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const handleError = Sentry.handleErrorWithSentry();
