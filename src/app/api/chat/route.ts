import { auth } from "@clerk/nextjs/server";
import { streamText, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { detectSentiment } from "@/lib/sentiment";
import { logger } from "@/lib/logger";
import { waitUntil } from "@vercel/functions";

// In-memory rate limiting: max 60 requests/min per IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 60;

export async function POST(req: Request) {
  // Auth check
  const { userId } = await auth();
  if (!userId) {
    logger.security("Unauthorized chat API access attempt", {
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }
  rateLimitMap.set(ip, userData);
  if (userData.count > MAX_REQUESTS) {
    return new Response(
      JSON.stringify({ error: "Too Many Requests", retryAfter: 60 }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
    );
  }

  // Parse body — useChat from @ai-sdk/react sends { messages: UIMessage[] }
  let body: { messages?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const uiMessages = body?.messages;
  if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
    return Response.json({ error: "Invalid request data" }, { status: 400 });
  }

  // Convert UIMessages (from useChat) to ModelMessages (for streamText)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelMessages = await convertToModelMessages(uiMessages as any);

  // Extract last user text for logging
  const lastMsg = uiMessages[uiMessages.length - 1] as Record<string, unknown>;
  let lastUserText = "";
  if (lastMsg?.role === "user") {
    const parts = lastMsg.parts as Array<{ type: string; text?: string }> | undefined;
    if (parts) {
      lastUserText = parts.filter((p) => p.type === "text").map((p) => p.text ?? "").join("");
    } else if (typeof lastMsg.content === "string") {
      lastUserText = lastMsg.content;
    }
  }

  logger.info("Chat session started", { userId, messageCount: uiMessages.length });

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are Hapi, a zero-latency Emotional Support AI specialized for Indian students (JEE/NEET aspirants).
    - Tone: Warm, empathetic, naturally uses "Hinglish".
    - Role: Companion, not a doctor. Use CBT reframing.
    - Context: Understand academic stress and Indian family dynamics.
    - Safety: Tele-MANAS (14416) for emergencies.
    Keep responses concise (under 100 words).`,
    // uiMessages is converted to ModelMessages for the AI SDK
    messages: modelMessages,
    async onFinish({ text }) {
      waitUntil((async () => {
        try {
        if (lastUserText) {
          const { sentiment, score } = await detectSentiment(lastUserText);

          await supabaseAdmin.from("chat_messages").insert({
            user_id: userId,
            role: "user",
            content: lastUserText,
            sentiment_score: score,
          });

          await supabaseAdmin.from("chat_messages").insert({
            user_id: userId,
            role: "assistant",
            content: text,
          });

          if (score !== null) {
            logger.info("Logging mood trajectory", { userId, sentiment, score });
            await supabaseAdmin.from("mood_logs").insert({
              user_id: userId,
              mood_score: Math.max(1, Math.min(5, Math.round((score + 1) * 2) + 1)), // maps -1 to 1; 0 to 3; 1 to 5
              note: `Session sentiment: ${sentiment}`,
            });
          }
        }
      } catch (err) {
        logger.error("Supabase logging failed in chat API", { userId, error: String(err) });
      }
      })());
    },
  });

  // toUIMessageStreamResponse is the correct protocol for @ai-sdk/react v3 useChat hook
  return result.toUIMessageStreamResponse();
}
