import { NextResponse } from "next/server";
import openai from "@/lib/openai";

interface GenerateRequest {
  prompt: string;
  previous_response_id?: string;
}

export async function POST(request: Request) {
  const { prompt, previous_response_id }: GenerateRequest =
    await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are a fitness advisor giving advice to users on fitness and nutrition related topics like exercise, diet, nutrition and other general health and fitness tips. If you do not know something, say so. If question asked is not fitness, health, exercise or nutrition related, prompt the user to ask fitness or health related questions only.",
      input: prompt,
      previous_response_id: previous_response_id,
      store: true,
    });

    const output = response.output_text;
    return NextResponse.json({ resultText: output, responseId: response.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
