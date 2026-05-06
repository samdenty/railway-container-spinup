"use client";

import { Box, ExternalLink, Plus } from "lucide-react";

import { DeleteServiceButton } from "@/components/DeleteServiceButton";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/components/ProjectGrid";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/project-types";

type Props = {
  project: ProjectSummary;
  highlightServiceId?: string | null;
  onCreate: () => void;
  onDeleted?: (serviceId: string) => void;
};

export function ServiceList({
  project,
  highlightServiceId,
  onCreate,
  onDeleted,
}: Props) {
  return (
    <div className="space-y-3 rounded-3xl border border-border/70 bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Services in
          </div>
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold">
              {project.name}
            </div>
            <a
              href={`https://railway.com/project/${project.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Open project in Railway"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus />
          Deploy
        </Button>
      </div>

      {project.services.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-background py-8 text-center">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Box className="size-4" />
          </div>
          <div className="text-sm font-medium">No services yet</div>
          <div className="text-xs text-muted-foreground">
            Click <span className="font-medium">Deploy</span> to add one.
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {project.services.map((service) => {
            const isHighlighted = service.id === highlightServiceId;
            return (
              <li
                key={service.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-background p-3 transition-colors",
                  isHighlighted
                    ? "border-foreground/40 ring-2 ring-foreground/10"
                    : "border-border/70"
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground ring-1 ring-border">
                  {service.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.icon}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <Box className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {service.name}
                    </span>
                    {isHighlighted && (
                      <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        new
                      </span>
                    )}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    Updated {formatRelative(service.updatedAt)} ·{" "}
                    <code className="font-mono">
                      {service.id.slice(0, 8)}
                    </code>
                  </div>
                </div>
                <DeleteServiceButton
                  serviceId={service.id}
                  serviceName={service.name}
                  onDeleted={onDeleted}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
