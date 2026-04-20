import { NextRequest, NextResponse } from "next/server";
import { getLogprobs } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = (await request.json()) as {
      prompt?: string;
      model?: "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo";
    };
    if (!body.prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    return NextResponse.json(await getLogprobs(body.prompt, body.model ?? "gpt-4o-mini"));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze prompt with OpenAI API.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
