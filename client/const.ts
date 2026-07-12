// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = (): string | null => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL?.trim();
  const appId = import.meta.env.VITE_APP_ID?.trim();

  if (!oauthPortalUrl || !appId) {
    console.error("[Auth] VITE_OAUTH_PORTAL_URL and VITE_APP_ID must be configured");
    return null;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  const url = new URL("app-auth", `${oauthPortalUrl.replace(/\/$/, "")}/`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
