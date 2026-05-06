import { NextResponse, type NextRequest } from "next/server";

import {
  applyTokenResponse,
  buildRedirectUri,
  exchangeCode,
  fetchUserInfo,
} from "@/lib/railway-oauth";
import {
  getOAuthStateSession,
  getRailwaySession,
} from "@/lib/session";

export const runtime = "nodejs";

function errorRedirect(origin: string, message: string) {
  const url = new URL("/", origin);
  url.searchParams.set("auth_error", message);
  return NextResponse.redirect(url, { status: 302 });
}

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const errorParam = request.nextUrl.searchParams.get("error");

  if (errorParam) {
    return errorRedirect(origin, errorParam);
  }
  if (!code || !state) {
    return errorRedirect(origin, "missing_code_or_state");
  }

  const stateSession = await getOAuthStateSession();
  if (!stateSession.state || stateSession.state !== state) {
    stateSession.destroy();
    return errorRedirect(origin, "invalid_state");
  }
  const redirectTo = stateSession.redirectTo || "/";
  stateSession.destroy();

  try {
    const tokens = await exchangeCode({
      code,
      redirectUri: buildRedirectUri(origin),
    });
    const user = await fetchUserInfo(tokens.access_token);
    const session = await getRailwaySession();
    applyTokenResponse(session, tokens, user);
    await session.save();
  } catch (err) {
    return errorRedirect(
      origin,
      err instanceof Error ? err.message : "auth_failed"
    );
  }

  const dest = new URL(redirectTo, origin);
  return NextResponse.redirect(dest, { status: 302 });
}
