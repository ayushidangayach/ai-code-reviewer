import { getPrompt } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { diff } = await request.json();

    // Validate input
    if (!diff || typeof diff !== "string") {
      return NextResponse.json(
        { error: "Diff is required and must be a string" },
        { status: 400 }
      );
    }

    const prompt = getPrompt(diff);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    return NextResponse.json({ review: completion.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process review request" },
      { status: 500 }
    );
  }
}
