"use client";

import { useState } from "react";
import {
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  LogOut,
  Trash2,
} from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setRailwayToken } from "@/lib/token-storage";
import { useAuthSession, logoutRailway } from "@/lib/use-auth-session";
import { useRailwayToken } from "@/lib/use-railway-token";
import { cn } from "@/lib/utils";

function maskToken(token: string) {
  if (token.length <= 10) return "•".repeat(token.length);
  return `${token.slice(0, 4)}${"•".repeat(token.length - 8)}${token.slice(-4)}`;
}

function RailwayLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.5 8.5h19v2h-19v-2zm0 5h19v2h-19v-2zM6 4l-2 2h16l-2-2H6zm0 16l-2-2h16l-2 2H6z" />
    </svg>
  );
}

export function TokenSettings() {
  const auth = useAuthSession();
  const token = useRailwayToken();
  const [draft, setDraft] = useState("");
  const [reveal, setReveal] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isOauthLoggedIn = auth.user !== null;

  if (isOauthLoggedIn) {
    const user = auth.user!;
    return (
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-muted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt=""
              className="size-9 shrink-0 rounded-full ring-1 ring-border"
            />
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
              <GithubIcon className="size-4 text-foreground/70" />
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {user.name ?? user.email ?? user.sub}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {user.email ? `${user.email} · ` : ""}Logged in via Railway OAuth
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            setLoggingOut(true);
            try {
              await logoutRailway();
              await auth.refresh();
            } finally {
              setLoggingOut(false);
            }
          }}
          disabled={loggingOut}
        >
          <LogOut />
          {loggingOut ? "Logging out…" : "Log out"}
        </Button>
      </div>
    );
  }

  if (token) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-muted/40 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-background text-foreground/80 ring-1 ring-border">
              <KeyRound className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">
                Railway API token connected
              </div>
              <code className="block truncate font-mono text-xs text-muted-foreground">
                {reveal ? token : maskToken(token)}
              </code>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={reveal ? "Hide token" : "Show token"}
              onClick={() => setReveal((r) => !r)}
            >
              {reveal ? <EyeOff /> : <Eye />}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove token"
              onClick={() => {
                setRailwayToken(null);
                setDraft("");
              }}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {auth.configured && (
        <Button asChild size="lg" className="w-full">
          <a href="/api/auth/login">
            <RailwayLogo className="size-4" />
            Login with Railway
          </a>
        </Button>
      )}

      {!auth.configured && (
        <Alert>
          <KeyRound />
          <AlertTitle>OAuth not configured</AlertTitle>
          <AlertDescription>
            Set <code className="font-mono">RAILWAY_CLIENT_ID</code> and{" "}
            <code className="font-mono">RAILWAY_CLIENT_SECRET</code> in{" "}
            <code className="font-mono">.env</code> to enable Login with
            Railway.
          </AlertDescription>
        </Alert>
      )}

      <button
        type="button"
        onClick={() => setShowManual((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl px-1 py-1 text-xs text-muted-foreground hover:text-foreground"
        aria-expanded={showManual}
      >
        <span>Or use a personal API token</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            showManual && "rotate-180"
          )}
        />
      </button>

      {showManual && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) setRailwayToken(draft);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="token">Railway API token</Label>
            <div className="flex gap-2">
              <Input
                id="token"
                type="password"
                autoComplete="off"
                placeholder="rlwy_…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="font-mono"
              />
              <Button type="submit" disabled={!draft.trim()}>
                <LogIn />
                Save
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Create one at{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="https://railway.com/account/tokens"
              target="_blank"
              rel="noreferrer"
            >
              railway.com/account/tokens
            </a>
            . Stored only in your browser.
          </p>
        </form>
      )}
    </div>
  );
}
