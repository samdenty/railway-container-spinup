"use client";

const TOKEN_KEY = "railway_api_token";

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function getRailwayToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setRailwayToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token && token.trim()) {
    window.localStorage.setItem(TOKEN_KEY, token.trim());
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
  for (const listener of listeners) listener(getRailwayToken());
}

export function subscribeRailwayToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
