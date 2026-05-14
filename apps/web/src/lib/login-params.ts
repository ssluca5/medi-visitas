export type LoginParams = {
  email: string;
  redirectUrl: string | null;
};

export function getLoginParams(url: URL): LoginParams {
  const email = url.searchParams.get("email")?.trim() ?? "";
  const rawRedirectUrl = url.searchParams.get("redirect_url");
  const redirectUrl =
    rawRedirectUrl &&
    rawRedirectUrl.startsWith("/") &&
    !rawRedirectUrl.startsWith("//")
      ? rawRedirectUrl
      : null;

  return { email, redirectUrl };
}
