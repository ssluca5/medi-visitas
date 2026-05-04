import { env } from "$env/dynamic/public";
import * as Sentry from "@sentry/sveltekit";
import type { ClientInit } from "@sveltejs/kit";

export const init: ClientInit = () => {
  const savedTheme = localStorage.getItem("theme");
  document.documentElement.setAttribute(
    "data-theme",
    savedTheme === "dark" ? "dark" : "light",
  );

  if (env.PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: env.PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

export const handleError = Sentry.handleErrorWithSentry();
