"use client";

import { useEffect } from "react";
import { fetchQuery, useRelayEnvironment } from "react-relay";
import type {
  GraphQLTaggedNode,
  OperationType,
  VariablesOf,
} from "relay-runtime";

export function usePollQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  variables: VariablesOf<TQuery>,
  intervalMs: number
) {
  const environment = useRelayEnvironment();
  const variablesKey = JSON.stringify(variables);

  useEffect(() => {
    if (intervalMs <= 0) return;
    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      fetchQuery(environment, query, variables, {
        fetchPolicy: "network-only",
      }).subscribe({});
    };
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
    // variablesKey covers `variables` change (objects shouldn't be deps directly)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment, query, intervalMs, variablesKey]);
}
