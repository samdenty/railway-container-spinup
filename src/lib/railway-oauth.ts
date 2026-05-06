import "server-only";

import {
  OAUTH_SCOPES,
  RAILWAY_AUTHORIZE_URL,
  RAILWAY_TOKEN_URL,
  RAILWAY_USERINFO_URL,
  getOAuthEnv,
} from "@/lib/oauth-config";
import {
  getRailwaySession,
  type RailwaySession,
  type RailwayUserInfo,
} from "@/lib/session";

export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
};

export function buildAuthorizeUrl(params: {
  redirectUri: string;
  state: string;
}): string {
  const { clientId } = getOAuthEnv();
  const search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: params.redirectUri,
    scope: OAUTH_SCOPES,
    state: params.state,
    prompt: "consent",
  });
  return `${RAILWAY_AUTHORIZE_URL}?${search.toString()}`;
}

function basicAuthHeader(): string {
  const { clientId, clientSecret } = getOAuthEnv();
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  )}`;
}

export async function exchangeCode(params: {
  code: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
  });
  const res = await fetch(RAILWAY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
      Accept: "application/json",
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch(RAILWAY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
      Accept: "application/json",
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function fetchUserInfo(
  accessToken: string
): Promise<RailwayUserInfo> {
  const res = await fetch(RAILWAY_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch user info (${res.status}): ${text}`);
  }
  return (await res.json()) as RailwayUserInfo;
}

export function applyTokenResponse(
  session: RailwaySession,
  tokens: TokenResponse,
  user?: RailwayUserInfo
) {
  session.accessToken = tokens.access_token;
  if (tokens.refresh_token) session.refreshToken = tokens.refresh_token;
  session.expiresAt = Date.now() + tokens.expires_in * 1000;
  if (user) session.user = user;
}

const REFRESH_SKEW_MS = 60_000; // refresh 1 minute early

/**
 * Returns a valid access token, refreshing if needed.
 * Mutates and saves the session if a refresh occurred.
 */
export async function getValidAccessToken(): Promise<{
  accessToken: string;
  user?: RailwayUserInfo;
} | null> {
  const session = await getRailwaySession();
  if (!session.accessToken || !session.expiresAt) return null;

  if (session.expiresAt - REFRESH_SKEW_MS > Date.now()) {
    return { accessToken: session.accessToken, user: session.user };
  }

  if (!session.refreshToken) {
    session.destroy();
    return null;
  }

  try {
    const tokens = await refreshAccessToken(session.refreshToken);
    applyTokenResponse(session, tokens);
    await session.save();
    return { accessToken: session.accessToken!, user: session.user };
  } catch {
    session.destroy();
    return null;
  }
}

export function buildRedirectUri(origin: string): string {
  return new URL(`/api/auth/callback`,origin).toString();
}
