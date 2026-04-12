import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function detectSentiment(content: string) {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Analyze the emotional sentiment and valence of this message: "${content}"
      Return ONLY a valid JSON object in exactly this format, with absolutely no markdown wrapping or extra text:
      {"sentiment": "calm" | "anxious" | "distressed" | "angry" | "happy" | "sad", "score": float from -1.0 to 1.0}`,
      temperature: 0.1,
    });
    
    // Parse the JSON string
    let parsedText = text.trim();
    if (parsedText.startsWith('\`\`\`json')) {
      parsedText = parsedText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    const result = JSON.parse(parsedText);
    
    // Validate
    if (typeof result.sentiment === 'string' && typeof result.score === 'number') {
      return { sentiment: result.sentiment, score: result.score };
    }
    throw new Error("Invalid schema");
  } catch (error) {
    console.error("Sentiment detection failed:", error);
    return { sentiment: "calm" as const, score: 0 };
  }
}
