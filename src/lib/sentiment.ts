import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export async function detectSentiment(content: string) {
  try {
    const { object } = await generateObject({
      model: groq("llama-3-8b-8192"),
      schema: z.object({
        sentiment: z.enum(["calm", "anxious", "distressed", "angry", "happy", "sad"]),
        score: z.number().min(-1).max(1).describe("Valence score where -1 is highly negative/distressed and 1 is highly positive/calm"),
      }),
      prompt: `Classify the emotional sentiment of the following message from a distressed student: "${content}"`,
    });
    return object;
  } catch (error) {
    console.error("Sentiment detection failed:", error);
    return { sentiment: "calm" as const, score: 0 };
  }
}
