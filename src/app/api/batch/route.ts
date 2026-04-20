import { NextRequest, NextResponse } from "next/server";
import { batchAnalyze } from "@/lib/openai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      prompts?: string[];
      model?: "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo";
    };
    if (!body.prompts?.length || !body.model) {
      return NextResponse.json({ error: "prompts and model are required" }, { status: 400 });
    }

    return NextResponse.json(await batchAnalyze(body.prompts, body.model));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to batch-analyze prompts with OpenAI API.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
