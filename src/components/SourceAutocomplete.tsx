"use client";

import { useId, useState } from "react";
import useSWR from "swr";
import { Boxes, ChevronsUpDown, Container, Loader2, Star } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { cn } from "@/lib/utils";

export type GithubRepoResult = {
  fullName: string;
  description: string | null;
  stars: number;
  url: string;
  defaultBranch: string;
  avatar: string;
  language: string | null;
  isPrivate: boolean;
};

export type DockerImageResult = {
  name: string;
  description: string | null;
  stars: number;
  pulls: number;
  isOfficial: boolean;
};

export type SourceSelection =
  | { kind: "repo"; repo: GithubRepoResult }
  | { kind: "image"; image: DockerImageResult };

type Props = {
  kind: "github" | "docker";
  value: SourceSelection | null;
  onChange: (next: SourceSelection | null) => void;
  defaultOpen?: boolean;
};

type SearchResponse =
  | { items: GithubRepoResult[]; error?: never }
  | { items: DockerImageResult[]; error?: never }
  | { items: never[]; error: string };

const fetcher = async (url: string): Promise<SearchResponse> => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error ?? `Search failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

function compactNumber(n: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function SourceAutocomplete({
  kind,
  value,
  onChange,
  defaultOpen = false,
}: Props) {
  const triggerId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const trimmed = debouncedQuery.trim();

  const swrKey: [string, string] | null = trimmed
    ? [kind === "github" ? "/api/search/github" : "/api/search/docker", trimmed]
    : null;

  const { data, error, isLoading, isValidating } = useSWR<
    SearchResponse,
    Error,
    [string, string] | null
  >(swrKey, ([url, q]) => fetcher(`${url}?q=${encodeURIComponent(q)}`), {
    keepPreviousData: true,
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });

  const items = (data?.items ?? []) as GithubRepoResult[] | DockerImageResult[];
  const loading = isLoading || isValidating;

  const selectedLabel =
    value?.kind === "repo"
      ? value.repo.fullName
      : value?.kind === "image"
        ? value.image.name
        : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={triggerId}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-11 w-full justify-between rounded-3xl text-left font-normal"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {kind === "github" ? (
              <GithubIcon className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Container className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span
              className={cn(
                "truncate",
                !selectedLabel && "text-muted-foreground",
              )}
            >
              {selectedLabel ??
                (kind === "github"
                  ? "Search GitHub repositories…"
                  : "Search Docker Hub images…")}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-(--radix-popover-trigger-width) max-w-[min(var(--radix-popover-trigger-width),28rem)] p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={
              kind === "github"
                ? "owner/repo or keyword"
                : "image name (e.g. nginx)"
            }
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching…
              </div>
            )}
            {!loading && error && (
              <div className="px-4 py-6 text-center text-sm text-destructive">
                {error.message}
              </div>
            )}
            {!loading && !error && trimmed === "" && (
              <div className="flex flex-col items-center gap-1.5 py-8 text-center text-sm text-muted-foreground">
                <Boxes className="size-5" />
                Start typing to search{" "}
                {kind === "github" ? "GitHub" : "Docker Hub"}.
              </div>
            )}
            {!loading && !error && trimmed !== "" && items.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {!loading && !error && items.length > 0 && (
              <CommandGroup
                heading={kind === "github" ? "Repositories" : "Images"}
              >
                {kind === "github"
                  ? (items as GithubRepoResult[]).map((repo) => (
                      <CommandItem
                        key={repo.fullName}
                        value={repo.fullName}
                        onSelect={() => {
                          onChange({ kind: "repo", repo });
                          setOpen(false);
                        }}
                        data-checked={
                          value?.kind === "repo" &&
                          value.repo.fullName === repo.fullName
                        }
                        className="flex items-start gap-3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={repo.avatar}
                          alt=""
                          className="mt-0.5 size-6 shrink-0 rounded-full ring-1 ring-border"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                              {repo.fullName}
                            </span>
                            {repo.language && (
                              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {repo.language}
                              </span>
                            )}
                          </div>
                          {repo.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {repo.description}
                            </p>
                          )}
                        </div>
                        <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Star className="size-3" />
                          {compactNumber(repo.stars)}
                        </span>
                      </CommandItem>
                    ))
                  : (items as DockerImageResult[]).map((image) => (
                      <CommandItem
                        key={image.name}
                        value={image.name}
                        onSelect={() => {
                          onChange({ kind: "image", image });
                          setOpen(false);
                        }}
                        data-checked={
                          value?.kind === "image" &&
                          value.image.name === image.name
                        }
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                          <Container className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                              {image.name}
                            </span>
                            {image.isOfficial && (
                              <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-500">
                                official
                              </span>
                            )}
                          </div>
                          {image.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {image.description}
                            </p>
                          )}
                        </div>
                        <span className="ml-auto flex shrink-0 flex-col items-end text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="size-3" />
                            {compactNumber(image.stars)}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
