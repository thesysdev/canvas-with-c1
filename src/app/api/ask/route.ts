import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { transformStream } from "@crayonai/stream";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { getImageSearchTool } from "./tools";
import { makeC1Response } from "@thesysai/genui-sdk/server";

const client = new OpenAI({
  baseURL: "https://api.thesys.dev/v1/embed",
  apiKey: process.env.THESYS_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt, previousC1Response, context } = (await req.json()) as {
    prompt: string;
    previousC1Response?: string;
    context?: string;
  };

  const c1Response = makeC1Response();

  // Write initial thinking state
  c1Response.writeThinkItem({
    title: "Processing your request...",
    description:
      "Analyzing your input and preparing to generate visual content.",
  });

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

  // Create tools with thinking state callback
  const toolsWithThinking = [
    getImageSearchTool((title: string, description: string) => {
      c1Response.writeThinkItem({
        title,
        description,
      });
    }),
  ];

  const llmStream = await client.beta.chat.completions.runTools({
    model: "c1/anthropic/claude-sonnet-4/v-20251230",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    stream: true,
    tools: toolsWithThinking,
  });

  // Transform stream to write content to c1Response
  transformStream(
    llmStream,
    (chunk) => {
      const contentDelta = chunk.choices[0]?.delta?.content;
      if (contentDelta) {
        c1Response.writeContent(contentDelta);
      }
      return contentDelta;
    },
    {
      onEnd: () => {
        c1Response.end(); // This is necessary to stop showing the "loading" state once the response is done streaming.
      },
    }
  ) as ReadableStream<string>;

  return new Response(c1Response.responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
