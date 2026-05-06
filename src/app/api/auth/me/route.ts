import { NextResponse } from "next/server";

import { isOAuthConfigured } from "@/lib/oauth-config";
import { getRailwaySession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const configured = isOAuthConfigured();
  if (!configured) {
    return NextResponse.json({ configured: false, user: null });
  }
  const session = await getRailwaySession();
  if (!session.accessToken || !session.user) {
    return NextResponse.json({ configured: true, user: null });
  }
  return NextResponse.json({
    configured: true,
    user: session.user,
    expiresAt: session.expiresAt ?? null,
  });
}
