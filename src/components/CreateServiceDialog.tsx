"use client";

import { useState } from "react";
import { useMutation } from "react-relay";
import { Container, Loader2, Rocket } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import {
  SourceAutocomplete,
  type SourceSelection,
} from "@/components/SourceAutocomplete";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { EnvironmentSummary } from "@/lib/project-types";
import { ServiceCreateMutation } from "@/relay/operations";
import type { operationsServiceCreateMutation } from "@/__generated__/operationsServiceCreateMutation.graphql";

type Kind = "github" | "docker";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  projectName: string | null;
  environments: ReadonlyArray<EnvironmentSummary>;
  onCreated?: (service: { id: string; name: string; projectId: string }) => void;
};

function deriveServiceName(source: SourceSelection): string {
  if (source.kind === "repo") {
    return source.repo.fullName.split("/").pop() ?? source.repo.fullName;
  }
  return source.image.name.split("/").pop() ?? source.image.name;
}

export function CreateServiceDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  environments,
  onCreated,
}: Props) {
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>("github");
  const [source, setSource] = useState<SourceSelection | null>(null);
  const [branch, setBranch] = useState("");
  const [environmentId, setEnvironmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [commit, isInFlight] =
    useMutation<operationsServiceCreateMutation>(ServiceCreateMutation);

  function resetForm() {
    setNameOverride(null);
    setSource(null);
    setBranch("");
    setEnvironmentId(null);
    setError(null);
    setKind("github");
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) resetForm();
  }

  function handleSelectKind(next: Kind) {
    setKind(next);
    setSource(null);
    setBranch("");
  }

  const derivedName = source ? deriveServiceName(source) : "";
  const displayedName = nameOverride ?? derivedName;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectId || !source || isInFlight) return;
    setError(null);

    const serviceName = displayedName.trim() || derivedName;
    const sourceInput =
      source.kind === "repo"
        ? { repo: source.repo.fullName }
        : { image: source.image.name };

    commit({
      variables: {
        input: {
          projectId,
          environmentId: environmentId ?? undefined,
          name: serviceName,
          source: sourceInput,
          branch:
            source.kind === "repo"
              ? branch.trim() || source.repo.defaultBranch || undefined
              : undefined,
        },
      },
      onCompleted: (response, errors) => {
        if (errors?.length) {
          setError(errors.map((e) => e.message).join("\n"));
          return;
        }
        const service = response.serviceCreate;
        onCreated?.({
          id: service.id,
          name: service.name,
          projectId: service.projectId,
        });
        handleOpenChange(false);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  }

  const canSubmit = !!projectId && !!source && !isInFlight;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Deploy a new service</DialogTitle>
          <DialogDescription>
            {projectName ? (
              <>
                Add a service to{" "}
                <span className="font-medium text-foreground">
                  {projectName}
                </span>
                .
              </>
            ) : (
              <>Pick a project first, then deploy.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="service-name">Service name</Label>
            <Input
              id="service-name"
              value={displayedName}
              onChange={(e) => setNameOverride(e.target.value)}
              placeholder={derivedName || "auto-generated"}
            />
          </div>

          <div className="space-y-2">
            <Label>Source</Label>
            <div
              className="inline-flex items-center rounded-3xl bg-muted p-1 text-sm"
              role="tablist"
              aria-label="Source type"
            >
              <button
                type="button"
                role="tab"
                aria-selected={kind === "github"}
                onClick={() => handleSelectKind("github")}
                className={cn(
                  "flex items-center gap-1.5 rounded-2xl px-3 py-1.5 transition-colors",
                  kind === "github"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <GithubIcon className="size-4" />
                GitHub repo
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={kind === "docker"}
                onClick={() => handleSelectKind("docker")}
                className={cn(
                  "flex items-center gap-1.5 rounded-2xl px-3 py-1.5 transition-colors",
                  kind === "docker"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Container className="size-4" />
                Docker image
              </button>
            </div>
            <SourceAutocomplete
              key={kind}
              kind={kind}
              value={source}
              onChange={setSource}
              defaultOpen
            />
          </div>

          {source?.kind === "repo" && (
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder={source.repo.defaultBranch || "main"}
              />
            </div>
          )}

          {environments.length > 1 && (
            <div className="space-y-2">
              <Label>Environment (optional)</Label>
              <Select
                value={environmentId ?? "__all__"}
                onValueChange={(value) =>
                  setEnvironmentId(value === "__all__" ? null : value)
                }
              >
                <SelectTrigger className="h-10 w-full rounded-3xl">
                  <SelectValue placeholder="All non-fork environments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    All non-fork environments
                  </SelectItem>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Failed to create service</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap font-mono text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isInFlight ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deploying…
                </>
              ) : (
                <>
                  <Rocket />
                  Deploy
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
