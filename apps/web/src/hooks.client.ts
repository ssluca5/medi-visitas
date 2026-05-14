import { env } from "$env/dynamic/public";
import type { ClientInit, HandleClientError } from "@sveltejs/kit";

export const init: ClientInit = async () => {
  const savedTheme = localStorage.getItem("theme");
  document.documentElement.setAttribute(
    "data-theme",
    savedTheme === "dark" ? "dark" : "light",
  );

  if (env.PUBLIC_SENTRY_DSN) {
    const Sentry = await import("@sentry/sveltekit");
    Sentry.init({
      dsn: env.PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

export const handleError: HandleClientError = async ({ error, event }) => {
  if (env.PUBLIC_SENTRY_DSN) {
    const Sentry = await import("@sentry/sveltekit");
    Sentry.captureException(error, {
      tags: { source: "client" },
      extra: { url: event.url.toString() },
    });
  }
};
