import { ExternalLink, Train } from "lucide-react";

import { DeployForm } from "@/components/DeployForm";
import { GithubIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:py-12">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Train className="size-3.5" />
          Powered by the Railway GraphQL API
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Deploy to Railway
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Pick a project, then deploy a GitHub repo or Docker image as a new
          service. Built with Next.js, Facebook Relay, and shadcn/ui.
        </p>
      </header>

      <DeployForm />

      <footer className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <a
          className="inline-flex items-center gap-1.5 hover:text-foreground"
          href="https://docs.railway.com/reference/public-api"
          target="_blank"
          rel="noreferrer"
        >
          Railway API docs <ExternalLink className="size-3" />
        </a>
        <a
          className="inline-flex items-center gap-1.5 hover:text-foreground"
          href="https://relay.dev"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon className="size-3" /> built with Relay
        </a>
      </footer>
    </div>
  );
}
