import "server-only";

import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  STATE_COOKIE_NAME,
  getOAuthEnv,
} from "@/lib/oauth-config";

export type RailwayUserInfo = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type RailwaySession = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: RailwayUserInfo;
};

export type OAuthStateSession = {
  state?: string;
  redirectTo?: string;
};

function baseOptions(): SessionOptions["cookieOptions"] {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

function sessionOptions(): SessionOptions {
  return {
    cookieName: SESSION_COOKIE_NAME,
    password: getOAuthEnv().sessionPassword,
    cookieOptions: { ...baseOptions(), maxAge: 60 * 60 * 24 * 30 },
    ttl: 60 * 60 * 24 * 30,
  };
}

function stateOptions(): SessionOptions {
  return {
    cookieName: STATE_COOKIE_NAME,
    password: getOAuthEnv().sessionPassword,
    cookieOptions: { ...baseOptions(), maxAge: 60 * 10 },
    ttl: 60 * 10,
  };
}

export async function getRailwaySession() {
  const store = await cookies();
  return getIronSession<RailwaySession>(store, sessionOptions());
}

export async function getOAuthStateSession() {
  const store = await cookies();
  return getIronSession<OAuthStateSession>(store, stateOptions());
}
