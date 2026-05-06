import { NextResponse, type NextRequest } from "next/server";

import { getValidAccessToken } from "@/lib/railway-oauth";

export const runtime = "nodejs";

const RAILWAY_GRAPHQL_ENDPOINT = "https://backboard.railway.com/graphql/v2";

export async function POST(request: NextRequest) {
  let authorization = request.headers.get("authorization");

  if (!authorization) {
    const session = await getValidAccessToken();
    if (session) {
      authorization = `Bearer ${session.accessToken}`;
    }
  }

  if (!authorization) {
    return NextResponse.json(
      {
        errors: [
          {
            message:
              "Not authenticated. Log in with Railway or provide an API token.",
          },
        ],
      },
      { status: 401 }
    );
  }

  const body = await request.text();

  const upstream = await fetch(RAILWAY_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authorization,
    },
    body,
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
