import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

type GithubItem = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  default_branch: string;
  owner: { avatar_url: string; login: string };
  language: string | null;
  private: boolean;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ items: [] });

  const params = new URLSearchParams({
    q: `${q} in:name,description`,
    sort: "stars",
    order: "desc",
    per_page: "10",
  });

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "deploy-to-railway",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/search/repositories?${params}`, {
    headers,
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { items: [], error: `GitHub search failed (${res.status}): ${text}` },
      { status: res.status }
    );
  }

  const data = (await res.json()) as { items?: GithubItem[] };
  const items = (data.items ?? []).map((it) => ({
    fullName: it.full_name,
    description: it.description,
    stars: it.stargazers_count,
    url: it.html_url,
    defaultBranch: it.default_branch,
    avatar: it.owner.avatar_url,
    language: it.language,
    isPrivate: it.private,
  }));

  return NextResponse.json({ items });
}
