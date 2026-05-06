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
import { ServiceDeleteMutation } from "@/relay/operations";
import type { operationsServiceDeleteMutation } from "@/__generated__/operationsServiceDeleteMutation.graphql";

type Props = {
  serviceId: string;
  serviceName: string;
  onDeleted?: (serviceId: string) => void;
};

export function DeleteServiceButton({
  serviceId,
  serviceName,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commit, isInFlight] =
    useMutation<operationsServiceDeleteMutation>(ServiceDeleteMutation);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setError(null);
  }

  function handleDelete() {
    setError(null);
    commit({
      variables: { id: serviceId },
      onCompleted: (_response, errors) => {
        if (errors?.length) {
          setError(errors.map((e) => e.message).join("\n"));
          return;
        }
        handleOpenChange(false);
        onDeleted?.(serviceId);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${serviceName}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete service?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{serviceName}</span>{" "}
              and all of its deployments. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Failed to delete service</AlertTitle>
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
              disabled={isInFlight}
            >
              {isInFlight ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 />
                  Delete service
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
