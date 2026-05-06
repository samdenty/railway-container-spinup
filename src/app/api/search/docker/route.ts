import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

type DockerHubResult = {
  repo_name: string;
  short_description?: string;
  star_count: number;
  pull_count: number;
  is_official: boolean;
  is_automated?: boolean;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ items: [] });

  const params = new URLSearchParams({ query: q, page_size: "10" });
  const url = `https://hub.docker.com/v2/search/repositories/?${params}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { items: [], error: `Docker Hub search failed (${res.status}): ${text}` },
      { status: res.status }
    );
  }

  const data = (await res.json()) as { results?: DockerHubResult[] };
  const items = (data.results ?? []).map((it) => ({
    name: it.repo_name,
    description: it.short_description ?? null,
    stars: it.star_count,
    pulls: it.pull_count,
    isOfficial: it.is_official,
  }));

  return NextResponse.json({ items });
}
