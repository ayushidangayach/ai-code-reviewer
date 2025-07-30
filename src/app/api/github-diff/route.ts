import { NextRequest, NextResponse } from "next/server";

// CORS helper
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prUrl = searchParams.get("url");
  const token = searchParams.get("token");

  if (!prUrl) {
    return withCORS(
      NextResponse.json({ error: "Missing PR URL" }, { status: 400 })
    );
  }

  if (!token) {
    return withCORS(
      NextResponse.json({ error: "Missing GitHub token" }, { status: 400 })
    );
  }

  const match = prUrl.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/
  );

  if (!match) {
    return withCORS(
      NextResponse.json({ error: "Invalid GitHub PR URL" }, { status: 400 })
    );
  }

  const [, owner, repo, pullNumber] = match;
  const diffUrl = `https://patch-diff.githubusercontent.com/raw/${owner}/${repo}/pull/${pullNumber}.diff`;

  try {
    const response = await fetch(diffUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3.diff",
      },
    });

    if (!response.ok) {
      return withCORS(
        NextResponse.json(
          { error: "Failed to fetch diff from GitHub" },
          { status: response.status }
        )
      );
    }

    const diff = await response.text();
    return withCORS(NextResponse.json({ diff }));
  } catch (error) {
    console.error("GitHub Diff API Error:", error);
    return withCORS(
      NextResponse.json({ error: "Error fetching PR diff" }, { status: 500 })
    );
  }
}
