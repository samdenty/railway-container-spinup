"use client";

import { useSyncExternalStore } from "react";

import {
  getRailwayToken,
  subscribeRailwayToken,
} from "@/lib/token-storage";

function getServerSnapshot(): string | null {
  return null;
}

export function useRailwayToken(): string | null {
  return useSyncExternalStore(subscribeRailwayToken, getRailwayToken, getServerSnapshot);
}
