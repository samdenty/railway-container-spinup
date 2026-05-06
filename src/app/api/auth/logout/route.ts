import { NextResponse } from "next/server";

import { getRailwaySession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  const session = await getRailwaySession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
