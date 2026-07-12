export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function validateEnvironment(): void {
  const missingCore = [
    ["JWT_SECRET", process.env.JWT_SECRET],
    ["DATABASE_URL", process.env.DATABASE_URL],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingCore.length > 0) {
    console.error(`[ENV] Missing core variables: ${missingCore.join(", ")}`);
  }

  const oauthConfigured = Boolean(
    process.env.OAUTH_SERVER_URL &&
    process.env.VITE_OAUTH_PORTAL_URL &&
    process.env.VITE_APP_ID
  );
  if (!oauthConfigured) {
    console.warn("[ENV] OAuth is not fully configured; authenticated features are disabled");
  }

  const hubspotConfigured = Boolean(
    process.env.HUBSPOT_ACCESS_TOKEN ||
    (process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_FORM_GUID)
  );
  if (!hubspotConfigured) {
    console.warn("[ENV] HubSpot is not configured; persisted leads will remain pending CRM sync");
  }
}
