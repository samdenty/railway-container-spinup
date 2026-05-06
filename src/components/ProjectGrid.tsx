"use client";

import { Box, Layers } from "lucide-react";

import { DeleteProjectButton } from "@/components/DeleteProjectButton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/project-types";

type Props = {
  projects: ReadonlyArray<ProjectSummary>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onProjectDeleted?: (projectId: string) => void;
};

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const seconds = Math.round(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.round(months / 12);
  return `${years}y ago`;
}

export function ProjectGrid({
  projects,
  selectedId,
  onSelect,
  onProjectDeleted,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const selected = project.id === selectedId;
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelect(project.id)}
            aria-pressed={selected}
            className={cn(
              "group relative flex h-full flex-col items-start gap-3 rounded-3xl border bg-card p-4 text-left transition-all",
              "hover:border-foreground/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
              selected
                ? "border-foreground/40 ring-2 ring-foreground/10 shadow-sm"
                : "border-border/70"
            )}
          >
            <div className="flex w-full items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {project.name}
                </div>
                {project.workspaceName && (
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {project.workspaceName}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {selected && (
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground/80">
                    Selected
                  </span>
                )}
                <DeleteProjectButton
                  projectId={project.id}
                  projectName={project.name}
                  onDeleted={onProjectDeleted}
                />
              </div>
            </div>
            {project.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {project.description}
              </p>
            )}
            <div className="mt-auto flex w-full items-center justify-between gap-3 pt-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Box className="size-3.5" />
                {project.services.length}{" "}
                {project.services.length === 1 ? "service" : "services"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3.5" />
                {project.environments.length}{" "}
                {project.environments.length === 1 ? "env" : "envs"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px] rounded-3xl" />
      ))}
    </div>
  );
}

export { formatRelative };
