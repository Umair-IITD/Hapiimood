import { auth } from "@clerk/nextjs/server";
import { createAgentUIStreamResponse } from "ai";
import { hapiAgent } from "@/lib/agent";
import { supabase } from "@/lib/supabase";
import { detectSentiment } from "@/lib/sentiment";
import { logger } from "@/lib/logger";
import { z } from "zod";

// Validate the AI SDK message format (parts-based)
const partSchema = z.object({
  type: z.string(),
  text: z.string().max(2000).optional(), // Enforce per-message character limit
});

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        parts: z.array(partSchema).optional(),
        content: z.string().max(2000).optional(),
      })
    )
    .min(1)
    .max(50), // Prevent context-stuffing attacks
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    logger.security("Unauthorized chat API access attempt", {
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = chatSchema.safeParse(body);
  if (!result.success) {
    logger.warn("Chat API: invalid payload rejected", {
      userId,
      errors: result.error.issues,
    });
    return Response.json({ error: "Invalid request data" }, { status: 400 });
  }

  const { messages } = result.data;

  logger.info("Chat session started", { userId, messageCount: messages.length });

  return createAgentUIStreamResponse({
    agent: hapiAgent,
    uiMessages: messages,
    async onFinish({ responseMessage }) {
      try {
        // Extract text content from part-based response
        const content = responseMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");

        const userLastMessage =
          messages[messages.length - 1]?.parts
            ?.filter((p: { type: string; text?: string }) => p.type === "text")
            .map((p: { type: string; text?: string }) => p.text)
            .join("") ||
          messages[messages.length - 1]?.content ||
          "";

        if (userLastMessage) {
          const { sentiment, score } = await detectSentiment(userLastMessage);

          // Log user message — userId is explicit for IDOR prevention (RLS also enforces this at DB layer)
          await supabase.from("chat_messages").insert({
            user_id: userId,
            role: "user",
            content: userLastMessage,
            sentiment_score: score,
          });

          // Log assistant message
          await supabase.from("chat_messages").insert({
            user_id: userId,
            role: "assistant",
            content,
          });

          // Auto-log mood entry when distress detected
          if (score < -0.5) {
            logger.info("Distress detected — auto-logging mood", {
              userId,
              sentiment,
              score,
            });
            await supabase.from("mood_logs").insert({
              user_id: userId,
              mood_score: Math.max(1, Math.floor((score + 1) * 2.5)),
              note: `Auto-logged from sentiment: ${sentiment}`,
            });
          }
        }
      } catch (err) {
        logger.error("Supabase logging failed in chat API", {
          userId,
          error: String(err),
        });
      }
    },
  });
}
