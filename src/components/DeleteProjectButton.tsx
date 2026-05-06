"use client";

import { useState } from "react";
import { useMutation } from "react-relay";
import { Loader2, Trash2 } from "lucide-react";

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
import { ProjectDeleteMutation } from "@/relay/operations";
import type { operationsProjectDeleteMutation } from "@/__generated__/operationsProjectDeleteMutation.graphql";

type Props = {
  projectId: string;
  projectName: string;
  onDeleted?: (projectId: string) => void;
  className?: string;
};

export function DeleteProjectButton({
  projectId,
  projectName,
  onDeleted,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [commit, isInFlight] =
    useMutation<operationsProjectDeleteMutation>(ProjectDeleteMutation);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setError(null);
      setConfirm("");
    }
  }

  function handleDelete() {
    setError(null);
    commit({
      variables: { id: projectId },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          setError(errors.map((e) => e.message).join("\n"));
          return;
        }
        handleOpenChange(false);
        onDeleted?.(projectId);
      },
      onError: (err) => setError(err.message),
    });
  }

  const canConfirm = confirm.trim() === projectName.trim();

  return (
    <>
      <button
        type="button"
        aria-label={`Delete project ${projectName}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={
          className ??
          "flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-destructive/30"
        }
      >
        <Trash2 className="size-3.5" />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{projectName}</span>{" "}
              and all of its environments, services, deployments, and volumes.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="confirm-project-name">
              Type{" "}
              <code className="font-mono text-foreground">{projectName}</code>{" "}
              to confirm
            </Label>
            <Input
              id="confirm-project-name"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={projectName}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Failed to delete project</AlertTitle>
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
              disabled={isInFlight}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isInFlight || !canConfirm}
            >
              {isInFlight ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 />
                  Delete project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
