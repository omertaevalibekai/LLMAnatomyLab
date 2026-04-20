import { NextRequest, NextResponse } from "next/server";
import { getMultipleCompletions } from "@/lib/openai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      models?: Array<"gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo">;
    };
    if (!body.prompt || !body.models?.length) {
      return NextResponse.json({ error: "prompt and models are required" }, { status: 400 });
    }

    return NextResponse.json({
      results: await getMultipleCompletions(body.prompt, body.models),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to compare models with OpenAI API.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
