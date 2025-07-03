import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const prUrl = searchParams.get("url");

  if (!prUrl) {
    return NextResponse.json({ error: "Missing PR URL" }, { status: 400 });
  }

  // Extract owner, repo, and pull number from the URL
  const match = prUrl.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/
  );

  if (!match) {
    return NextResponse.json(
      { error: "Invalid GitHub PR URL" },
      { status: 400 }
    );
  }

  const [, owner, repo, pullNumber] = match;
  const diffUrl = `https://patch-diff.githubusercontent.com/raw/${owner}/${repo}/pull/${pullNumber}.diff`;

  try {
    const response = await fetch(diffUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.diff",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch diff from GitHub" },
        { status: response.status }
      );
    }

    const diff = await response.text();
    return NextResponse.json({ diff });
  } catch (error) {
    console.error("GitHub Diff API Error:", error);
    return NextResponse.json(
      { error: "Error fetching PR diff" },
      { status: 500 }
    );
  }
}
