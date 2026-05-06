"use client";

import { useMemo, type ReactNode } from "react";
import { RelayEnvironmentProvider } from "react-relay";

import { getRelayEnvironment } from "@/relay/environment";

export function RelayProvider({ children }: { children: ReactNode }) {
  const environment = useMemo(() => getRelayEnvironment(), []);
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
