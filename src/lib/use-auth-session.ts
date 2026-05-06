"use client";

import useSWR from "swr";

export type AuthUser = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type AuthSessionResponse = {
  configured: boolean;
  user: AuthUser | null;
  expiresAt?: number | null;
};

const fetcher = async (url: string): Promise<AuthSessionResponse> => {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`Failed to load auth session (${res.status})`);
  return res.json();
};

export function useAuthSession() {
  const { data, error, isLoading, mutate } = useSWR<AuthSessionResponse>(
    "/api/auth/me",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    configured: data?.configured ?? false,
    user: data?.user ?? null,
    expiresAt: data?.expiresAt ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}

export async function logoutRailway() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}
