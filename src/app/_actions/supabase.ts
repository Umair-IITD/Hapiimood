"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getChatHistory(limit = 60) {
  const { userId } = await auth();
  if (!userId) {
    return { data: null, error: "Unauthorized" };
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getMoodLogs(limit = 60) {
  const { userId } = await auth();
  if (!userId) {
    return { data: null, error: "Unauthorized" };
  }

  const { data, error } = await supabaseAdmin
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getAnalyticsData() {
  const { userId } = await auth();
  if (!userId) {
    return { chatRes: null, moodRes: null };
  }

  const [chatRes, moodRes] = await Promise.all([
    supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }), // For analytics we want chronological
    supabaseAdmin
      .from("mood_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
  ]);

  return { chatRes: chatRes.data, moodRes: moodRes.data };
}
