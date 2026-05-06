import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import { isOAuthConfigured } from "@/lib/oauth-config";
import { buildAuthorizeUrl, buildRedirectUri } from "@/lib/railway-oauth";
import { getOAuthStateSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isOAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "OAuth not configured. Set RAILWAY_CLIENT_ID and RAILWAY_CLIENT_SECRET in .env.",
      },
      { status: 500 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ||request.nextUrl.origin;
  const redirectUri = buildRedirectUri(origin);
  const state = randomBytes(24).toString("hex");

  const stateSession = await getOAuthStateSession();
  stateSession.state = state;
  stateSession.redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  await stateSession.save();

  const url = buildAuthorizeUrl({ redirectUri, state });
  return NextResponse.redirect(url, { status: 302 });
}
