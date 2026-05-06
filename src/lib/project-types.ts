export type ServiceSummary = {
  id: string;
  name: string;
  icon: string | null;
  updatedAt: string;
};

export type EnvironmentSummary = {
  id: string;
  name: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  workspaceId: string | null;
  workspaceName: string | null;
  services: ReadonlyArray<ServiceSummary>;
  environments: ReadonlyArray<EnvironmentSummary>;
};
