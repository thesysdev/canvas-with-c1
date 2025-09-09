import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { transformStream } from "@crayonai/stream";
import { SYSTEM_PROMPT } from "./systemPrompt";

const client = new OpenAI({
  baseURL: "http://localhost:3102/v1/embed",
  apiKey: process.env.THESYS_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt, previousC1Response, context } = (await req.json()) as {
    prompt: string;
    previousC1Response?: string;
    context?: string;
  };

  const messages: ChatCompletionMessageParam[] = [];

  if (previousC1Response) {
    messages.push({
      role: "assistant",
      content: previousC1Response,
    });
  }

  if (context) {
    const message = `{prompt: ${prompt}, context: ${context}}`;
    messages.push({
      role: "user",
      content: message,
    });
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const llmStream = await client.chat.completions.create({
    model: "c1/anthropic/claude-3.5-sonnet/v-20250815",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: true,
  });

  const responseStream = transformStream(llmStream, (chunk) => {
    return chunk.choices[0]?.delta?.content || "";
  });

  return new Response(responseStream as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
