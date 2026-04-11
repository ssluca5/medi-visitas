import { P as PUBLIC_API_URL } from "./public.js";
async function apiFetch(path, token, options = {}) {
  const headers = {
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return res;
}
export { apiFetch as a };
