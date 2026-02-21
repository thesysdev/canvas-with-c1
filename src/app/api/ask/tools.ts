import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import type { RunnableToolFunctionWithoutParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { JSONSchema } from "openai/lib/jsonschema.mjs";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

type ThinkingStateCallback = (title: string, description: string) => void;

async function searchUnsplash(query: string): Promise<string> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.results?.length) {
    throw new Error(`No images found for "${query}"`);
  }

  return data.results[0].urls.regular;
}

export function getImageSearchTool(writeThinkItem?: ThinkingStateCallback): RunnableToolFunctionWithParse<{ altText: string }> {
  return {
    type: "function",
    function: {
      name: "getImageSrc",
      description: "Get the image src for the given alt text",
      parse: JSON.parse,
      parameters: zodToJsonSchema(
        z.object({
          altText: z.string().describe("The alt text of the image"),
        })
      ) as JSONSchema,
      function: async ({ altText }: { altText: string }) => {
        if (writeThinkItem) {
          writeThinkItem("Searching for images...", `Finding the perfect image for your canvas.`);
        }

        return searchUnsplash(altText);
      },
      strict: true,
    },
  };
}

// Default tools without thinking states for backwards compatibility
export const tools: (
  | RunnableToolFunctionWithoutParse
  | RunnableToolFunctionWithParse<{ altText: string }>
)[] = [
  getImageSearchTool(),
];
