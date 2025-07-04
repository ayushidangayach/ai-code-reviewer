import { getPrompt } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

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

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return withCORS(
        NextResponse.json(
          { error: "OpenAI API key not configured" },
          { status: 500 }
        )
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { diff } = await request.json();

    if (!diff || typeof diff !== "string") {
      return withCORS(
        NextResponse.json(
          { error: "Diff is required and must be a string" },
          { status: 400 }
        )
      );
    }

    const prompt = getPrompt(diff);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    return withCORS(
      NextResponse.json({ review: completion.choices[0].message.content })
    );
  } catch (error) {
    console.error("API Error:", error);
    return withCORS(
      NextResponse.json(
        { error: "Failed to process review request" },
        { status: 500 }
      )
    );
  }
}
