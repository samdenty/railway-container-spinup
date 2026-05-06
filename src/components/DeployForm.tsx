"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import {
  fetchQuery,
  useLazyLoadQuery,
  useRelayEnvironment,
} from "react-relay";
import { CheckCircle2, ShieldAlert, Train } from "lucide-react";

import { CreateServiceDialog } from "@/components/CreateServiceDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  ProjectGrid,
  ProjectGridSkeleton,
} from "@/components/ProjectGrid";
import { ServiceList } from "@/components/ServiceList";
import { TokenSettings } from "@/components/TokenSettings";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectSummary } from "@/lib/project-types";
import { useAuthSession } from "@/lib/use-auth-session";
import { usePollQuery } from "@/lib/use-poll-query";
import { useRailwayToken } from "@/lib/use-railway-token";
import { ProjectQuery, ProjectsQuery } from "@/relay/operations";
import type { operationsProjectQuery } from "@/__generated__/operationsProjectQuery.graphql";
import type { operationsProjectsQuery } from "@/__generated__/operationsProjectsQuery.graphql";

const POLL_INTERVAL_MS = 5000;

type CreatedService = {
  id: string;
  name: string;
  projectId: string;
};

type ProjectsViewProps = {
  selectedId: string | null;
  highlightServiceId: string | null;
  onSelect: (project: ProjectSummary | null) => void;
  onCreateNew: (project: ProjectSummary | null) => void;
  onServiceDeleted: (serviceId: string) => void;
  onProjectDeleted: (projectId: string) => void;
};

function isAuthError(error: Error): boolean {
  return /not authorized|unauthori[sz]ed|forbidden|401|403/i.test(
    error.message
  );
}

function ProjectsFromMe({
  selectedId,
  highlightServiceId,
  onSelect,
  onCreateNew,
  onServiceDeleted,
  onProjectDeleted,
}: ProjectsViewProps) {
  const data = useLazyLoadQuery<operationsProjectsQuery>(
    ProjectsQuery,
    {},
    { fetchPolicy: "store-or-network" }
  );

  usePollQuery<operationsProjectsQuery>(ProjectsQuery, {}, POLL_INTERVAL_MS);

  const projects = useMemo<ProjectSummary[]>(
    () =>
      data.me.workspaces.flatMap((workspace) =>
        workspace.projects.edges.map(({ node }) => ({
          id: node.id,
          name: node.name,
          description: node.description ?? null,
          updatedAt: node.updatedAt,
          workspaceId: workspace.id,
          workspaceName: workspace.name,
          environments: node.environments.edges.map((e) => ({
            id: e.node.id,
            name: e.node.name,
          })),
          services: node.services.edges.map((e) => ({
            id: e.node.id,
            name: e.node.name,
            icon: e.node.icon ?? null,
            updatedAt: e.node.updatedAt,
          })),
        }))
      ),
    [data]
  );

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  return (
    <ProjectsLayout
      projects={projects}
      selected={selected}
      highlightServiceId={highlightServiceId}
      onSelect={onSelect}
      onCreateNew={onCreateNew}
      onServiceDeleted={onServiceDeleted}
      onProjectDeleted={onProjectDeleted}
    />
  );
}

function ProjectFromId({
  projectId,
  selectedId,
  highlightServiceId,
  onSelect,
  onCreateNew,
  onServiceDeleted,
  onProjectDeleted,
}: ProjectsViewProps & { projectId: string }) {
  const data = useLazyLoadQuery<operationsProjectQuery>(
    ProjectQuery,
    { id: projectId },
    { fetchPolicy: "store-or-network" }
  );

  usePollQuery<operationsProjectQuery>(
    ProjectQuery,
    { id: projectId },
    POLL_INTERVAL_MS
  );

  const project: ProjectSummary = {
    id: data.project.id,
    name: data.project.name,
    description: data.project.description ?? null,
    updatedAt: data.project.updatedAt,
    workspaceId: null,
    workspaceName: null,
    environments: data.project.environments.edges.map((e) => ({
      id: e.node.id,
      name: e.node.name,
    })),
    services: data.project.services.edges.map((e) => ({
      id: e.node.id,
      name: e.node.name,
      icon: e.node.icon ?? null,
      updatedAt: e.node.updatedAt,
    })),
  };

  return (
    <ProjectsLayout
      projects={[project]}
      selected={
        selectedId === project.id || selectedId === null ? project : null
      }
      highlightServiceId={highlightServiceId}
      onSelect={(p) => onSelect(p)}
      onCreateNew={onCreateNew}
      onServiceDeleted={onServiceDeleted}
      onProjectDeleted={onProjectDeleted}
    />
  );
}

function ProjectsLayout({
  projects,
  selected,
  highlightServiceId,
  onSelect,
  onCreateNew,
  onServiceDeleted,
  onProjectDeleted,
}: {
  projects: ReadonlyArray<ProjectSummary>;
  selected: ProjectSummary | null;
  highlightServiceId: string | null;
  onSelect: (project: ProjectSummary | null) => void;
  onCreateNew: (project: ProjectSummary | null) => void;
  onServiceDeleted: (serviceId: string) => void;
  onProjectDeleted: (projectId: string) => void;
}) {
  return (
    <div className="space-y-5">
      {projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-8 text-center text-sm text-muted-foreground">
          No projects found. Create one in the{" "}
          <a
            className="underline underline-offset-4 hover:text-foreground"
            href="https://railway.com/new"
            target="_blank"
            rel="noreferrer"
          >
            Railway dashboard
          </a>
          .
        </div>
      ) : (
        <ProjectGrid
          projects={projects}
          selectedId={selected?.id ?? null}
          onSelect={(id) => {
            const next = projects.find((p) => p.id === id) ?? null;
            onSelect(next);
          }}
          onProjectDeleted={onProjectDeleted}
        />
      )}
      {selected && (
        <ServiceList
          project={selected}
          highlightServiceId={highlightServiceId}
          onCreate={() => onCreateNew(selected)}
          onDeleted={onServiceDeleted}
        />
      )}
    </div>
  );
}

function ManualProjectIdEntry({
  reason,
  message,
  onSubmit,
  onRetry,
}: {
  reason: "auth" | "error";
  message?: string;
  onSubmit: (id: string) => void;
  onRetry: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-3">
      <Alert>
        <ShieldAlert />
        <AlertTitle>
          {reason === "auth"
            ? "Project token detected"
            : "Couldn't load your projects"}
        </AlertTitle>
        <AlertDescription>
          {reason === "auth" ? (
            <>
              The token you provided can&apos;t list your workspaces. Paste a
              project ID below, or switch to an{" "}
              <a
                className="underline underline-offset-4 hover:text-foreground"
                href="https://railway.com/account/tokens"
                target="_blank"
                rel="noreferrer"
              >
                account token
              </a>{" "}
              and{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-foreground"
                onClick={onRetry}
              >
                retry
              </button>
              .
            </>
          ) : (
            <>
              {message ?? "Unknown error"}.{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-foreground"
                onClick={onRetry}
              >
                Retry
              </button>
              .
            </>
          )}
        </AlertDescription>
      </Alert>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onSubmit(value.trim());
        }}
      >
        <div className="flex-1 space-y-1">
          <Label htmlFor="manual-project-id" className="sr-only">
            Project ID
          </Label>
          <Input
            id="manual-project-id"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Project ID (UUID)"
            className="font-mono text-xs"
          />
        </div>
        <Button type="submit" disabled={!value.trim()}>
          Load
        </Button>
      </form>
    </div>
  );
}

export function DeployForm() {
  const token = useRailwayToken();
  const auth = useAuthSession();
  const isAuthenticated = !!token || !!auth.user;
  const environment = useRelayEnvironment();
  const [pickerEpoch, setPickerEpoch] = useState(0);
  const [manualProjectId, setManualProjectId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProject, setDialogProject] = useState<ProjectSummary | null>(
    null
  );
  const [created, setCreated] = useState<CreatedService | null>(null);

  const refreshActiveProjects = useCallback(() => {
    if (manualProjectId) {
      fetchQuery<operationsProjectQuery>(
        environment,
        ProjectQuery,
        { id: manualProjectId },
        { fetchPolicy: "network-only" }
      ).subscribe({});
    } else {
      fetchQuery<operationsProjectsQuery>(
        environment,
        ProjectsQuery,
        {},
        { fetchPolicy: "network-only" }
      ).subscribe({});
    }
  }, [environment, manualProjectId]);

  return (
    <div className="space-y-6">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="gap-1">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Train className="size-5 text-primary" />
            Authentication
          </CardTitle>
          <CardDescription>
            Log in with Railway, or paste an API token. Tokens stay in your
            browser; OAuth sessions live in an httpOnly cookie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TokenSettings />
        </CardContent>
      </Card>

      {isAuthenticated && (
        <>
          {created && (
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Service created</AlertTitle>
              <AlertDescription>
                Created{" "}
                <span className="font-medium text-foreground">
                  {created.name}
                </span>{" "}
                (<code className="font-mono text-xs">{created.id}</code>) in
                project{" "}
                <a
                  className="underline underline-offset-4 hover:text-foreground"
                  href={`https://railway.com/project/${created.projectId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {created.projectId}
                </a>
                .
              </AlertDescription>
            </Alert>
          )}

          <ErrorBoundary
            resetKeys={[token, auth.user?.sub, pickerEpoch, manualProjectId]}
            fallback={(boundaryError, reset) => (
              <ManualProjectIdEntry
                reason={isAuthError(boundaryError) ? "auth" : "error"}
                message={boundaryError.message}
                onSubmit={(id) => {
                  setManualProjectId(id);
                  setSelectedId(id);
                  reset();
                }}
                onRetry={() => {
                  setManualProjectId(null);
                  setSelectedId(null);
                  reset();
                  setPickerEpoch((n) => n + 1);
                }}
              />
            )}
          >
            <Suspense
              fallback={
                <div className="space-y-3">
                  <ProjectGridSkeleton />
                </div>
              }
            >
              {manualProjectId ? (
                <ProjectFromId
                  key={`pid-${manualProjectId}-${pickerEpoch}`}
                  projectId={manualProjectId}
                  selectedId={selectedId}
                  highlightServiceId={created?.id ?? null}
                  onSelect={(p) => setSelectedId(p?.id ?? null)}
                  onCreateNew={(project) => {
                    setDialogProject(project);
                    setDialogOpen(true);
                  }}
                  onServiceDeleted={(deletedId) => {
                    if (created?.id === deletedId) setCreated(null);
                    refreshActiveProjects();
                  }}
                  onProjectDeleted={(deletedId) => {
                    if (manualProjectId === deletedId) {
                      setManualProjectId(null);
                    }
                    if (selectedId === deletedId) setSelectedId(null);
                    refreshActiveProjects();
                  }}
                />
              ) : (
                <ProjectsFromMe
                  key={`me-${pickerEpoch}`}
                  selectedId={selectedId}
                  highlightServiceId={created?.id ?? null}
                  onSelect={(p) => setSelectedId(p?.id ?? null)}
                  onCreateNew={(project) => {
                    setDialogProject(project);
                    setDialogOpen(true);
                  }}
                  onServiceDeleted={(deletedId) => {
                    if (created?.id === deletedId) setCreated(null);
                    refreshActiveProjects();
                  }}
                  onProjectDeleted={(deletedId) => {
                    if (selectedId === deletedId) setSelectedId(null);
                    refreshActiveProjects();
                  }}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </>
      )}

      <CreateServiceDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setDialogProject(null);
        }}
        projectId={dialogProject?.id ?? null}
        projectName={dialogProject?.name ?? null}
        environments={dialogProject?.environments ?? []}
        onCreated={(service) => {
          setCreated(service);
          setSelectedId(service.projectId);
          refreshActiveProjects();
        }}
      />
    </div>
  );
}
