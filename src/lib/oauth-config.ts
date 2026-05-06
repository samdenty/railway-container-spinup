import "server-only";

export const RAILWAY_AUTHORIZE_URL =
  "https://backboard.railway.com/oauth/auth";
export const RAILWAY_TOKEN_URL = "https://backboard.railway.com/oauth/token";
export const RAILWAY_USERINFO_URL = "https://backboard.railway.com/oauth/me";

export const OAUTH_SCOPES =
  "openid email profile workspace:admin offline_access";

export const SESSION_COOKIE_NAME = "rlw_session";
export const STATE_COOKIE_NAME = "rlw_oauth_state";

export type OAuthEnv = {
  clientId: string;
  clientSecret: string;
  sessionPassword: string;
};

let cached: OAuthEnv | null = null;

export function getOAuthEnv(): OAuthEnv {
  if (cached) return cached;
  const clientId = process.env.RAILWAY_CLIENT_ID?.trim();
  const clientSecret = process.env.RAILWAY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Railway OAuth credentials. Set RAILWAY_CLIENT_ID and RAILWAY_CLIENT_SECRET in .env"
    );
  }
  const sessionPassword =
    process.env.RAILWAY_SESSION_SECRET?.trim() ||
    `${clientSecret}::session::${clientId}`;
  if (sessionPassword.length < 32) {
    throw new Error(
      "Session password must be at least 32 characters. Set RAILWAY_SESSION_SECRET to a long random string."
    );
  }
  cached = { clientId, clientSecret, sessionPassword };
  return cached;
}

export function isOAuthConfigured(): boolean {
  return (
    !!process.env.RAILWAY_CLIENT_ID?.trim() &&
    !!process.env.RAILWAY_CLIENT_SECRET?.trim()
  );
}
