import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
} from "relay-runtime";

import { getRailwayToken } from "@/lib/token-storage";

export const RAILWAY_GRAPHQL_PROXY = "/api/railway";

const fetchFn: FetchFunction = async (request, variables) => {
  const token = getRailwayToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(RAILWAY_GRAPHQL_PROXY, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      if (json.errors?.length) {
        throw new Error(
          json.errors.map((e: { message: string }) => e.message).join("\n")
        );
      }
    } catch {
      // fallthrough
    }
    throw new Error(`Railway API error ${response.status}: ${text}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    const message = json.errors
      .map((e: { message: string }) => e.message)
      .join("\n");
    throw new Error(message);
  }
  return json;
};

let environment: Environment | null = null;

export function getRelayEnvironment(): Environment {
  if (!environment) {
    environment = new Environment({
      network: Network.create(fetchFn),
      store: new Store(new RecordSource()),
    });
  }
  return environment;
}

export function resetRelayEnvironment(): Environment {
  environment = new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
  return environment;
}
