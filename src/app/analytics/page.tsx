"use client";

import Navbar from "@/components/layout/Navbar";
import { useUser } from "@clerk/nextjs";
import { getAnalyticsData } from "@/app/_actions/supabase";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  TrendingUp, Brain, Activity, Calendar, MessageSquare, Heart,
  Smile, Frown, Meh, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { format, subDays, isToday, isYesterday } from "date-fns";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const SENTIMENT_COLORS = ["#4FD1C5", "#A5B4FC", "#FCD34D", "#FF8A8A"];

interface ChatMessage {
  id: string;
  user_id: string;
  role: string;
  content: string;
  sentiment_score: number | null;
  created_at: string;
}

interface MoodLog {
  id: string;
  user_id: string;
  mood_score: number;
  note: string | null;
  created_at: string;
}

export default function AnalyticsPage() {
  const { user } = useUser();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const { chatRes, moodRes } = await getAnalyticsData();

      if (chatRes) setChatMessages(chatRes as any);
      if (moodRes) setMoodLogs(moodRes as any);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  // --- Derived Data ---

  const moodTrend = moodLogs.map((log, i) => ({
    id: i, // Unique key for Recharts XAxis
    date: format(new Date(log.created_at), "MMM d"),
    mood: log.mood_score,
  }));

  // Sentiment distribution (pie chart)
  const userMessages = chatMessages.filter((m) => m.role === "user" && m.sentiment_score !== null);
  const sentimentBuckets = { Positive: 0, Neutral: 0, Mixed: 0, Distressed: 0 };
  userMessages.forEach((m) => {
    const s = m.sentiment_score!;
    if (s > 0.3) sentimentBuckets.Positive++;
    else if (s > -0.3) sentimentBuckets.Neutral++;
    else if (s > -0.6) sentimentBuckets.Mixed++;
    else sentimentBuckets.Distressed++;
  });
  const sentimentData = Object.entries(sentimentBuckets)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  // Weekly activity (bar chart)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStr = format(date, "yyyy-MM-dd");
    const count = chatMessages.filter(
      (m) => m.role === "user" && format(new Date(m.created_at), "yyyy-MM-dd") === dayStr
    ).length;
    return {
      day: isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "EEE"),
      messages: count,
    };
  });

  // Stats
  const totalSessions = new Set(
    chatMessages
      .filter((m) => m.role === "user")
      .map((m) => format(new Date(m.created_at), "yyyy-MM-dd"))
  ).size;
  const totalMessages = chatMessages.filter((m) => m.role === "user").length;
  const avgMood =
    moodLogs.length > 0
      ? (moodLogs.reduce((s, l) => s + l.mood_score, 0) / moodLogs.length).toFixed(1)
      : "—";
  const avgSentiment =
    userMessages.length > 0
      ? (userMessages.reduce((s, m) => s + m.sentiment_score!, 0) / userMessages.length).toFixed(2)
      : "—";

  const getMoodEmoji = (score: string) => {
    const n = parseFloat(score);
    if (isNaN(n)) return <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-lg shadow-xl">😐</div>;
    if (n >= 4) return <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-emerald/20 backdrop-blur-md border border-accent-emerald/30 text-lg shadow-[0_0_15px_rgba(79,209,197,0.3)] hover:scale-110 transition-transform cursor-default">🤩</div>;
    if (n >= 2.5) return <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-amber/20 backdrop-blur-md border border-accent-amber/30 text-lg shadow-[0_0_15px_rgba(252,211,77,0.3)] hover:scale-110 transition-transform cursor-default">🙂</div>;
    return <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-rose/20 backdrop-blur-md border border-accent-rose/30 text-lg shadow-[0_0_15px_rgba(255,138,138,0.3)] hover:scale-110 transition-transform cursor-default">🥺</div>;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-bg overflow-hidden">
      <div className="bg-mesh opacity-40" aria-hidden="true" />
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pt-32 pb-20 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="rounded-xl p-2 text-text-muted hover:bg-white/5 hover:text-white transition-all duration-300 cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Emotional Analytics</h1>
              <p className="text-text-muted text-sm mt-1">Your mental wellness journey, visualized.</p>
            </div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-white/5 px-4 py-2 rounded-full border border-white/5">
            All Time Data
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: Calendar, label: "Sessions", value: totalSessions, color: "#A5B4FC" },
            { icon: MessageSquare, label: "Messages Sent", value: totalMessages, color: "#4FD1C5" },
            { icon: Heart, label: "Avg Mood", value: avgMood, color: "#FF8A8A", extra: getMoodEmoji(String(avgMood)) },
            { icon: Activity, label: "Avg Sentiment", value: avgSentiment, color: "#FCD34D" },
          ].map(({ icon: Icon, label, value, color, extra }) => (
            <motion.div key={label} variants={item} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                {extra}
              </div>
              <div>
                <div className="text-3xl font-bold text-white tabular-nums">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mood Trend — Large */}
          <motion.div variants={item} className="lg:col-span-8">
            <div className="bento-card h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Mood Trend
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-white/5 px-3 py-1 rounded-full">Over Time</span>
              </div>
              <div className="h-[280px]">
                {moodTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moodTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A5B4FC" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#A5B4FC" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="id" hide />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            return (
                              <div className="rounded-xl border border-white/10 bg-surface/80 p-3 backdrop-blur-xl shadow-2xl">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{payload[0].payload.date}</p>
                                <p className="text-sm font-bold text-primary">Mood: {Number(payload[0].payload.mood).toFixed(1)}/5</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="mood" stroke="#A5B4FC" strokeWidth={3} fillOpacity={1} fill="url(#moodGrad)" dot={{ r: 4, fill: "#A5B4FC", stroke: "#0F121D", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#4FD1C5", strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-text-muted/60 text-sm">
                    Mood data will appear as Hapi detects your emotional patterns.
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sentiment Distribution — Pie */}
          <motion.div variants={item} className="lg:col-span-4">
            <div className="bento-card h-full min-h-[320px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold flex items-center gap-3">
                    <Brain className="h-5 w-5 text-accent-emerald" />
                    Sentiment Mix
                  </h2>
                </div>
                <div className="h-[200px]">
                  {sentimentData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" strokeWidth={0}>
                          {sentimentData.map((_, i) => (
                            <Cell key={i} fill={SENTIMENT_COLORS[i % SENTIMENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload?.length) {
                              return (
                                <div className="rounded-xl border border-white/10 bg-surface/80 p-3 backdrop-blur-xl shadow-2xl">
                                  <p className="text-sm font-bold text-white">{payload[0].name}: {payload[0].value}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-muted/60 text-sm text-center px-4">
                      Chat with Hapi to generate your sentiment breakdown.
                    </div>
                  )}
                </div>
              </div>
              {/* Legend */}
              {sentimentData.length > 0 && (
                <div className="flex flex-wrap justify-center gap-y-3 gap-x-2 mt-6 px-2">
                  {sentimentData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
                      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: SENTIMENT_COLORS[i] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Weekly Activity — Bar */}
          <motion.div variants={item} className="lg:col-span-12">
            <div className="bento-card">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold flex items-center gap-3">
                  <Activity className="h-5 w-5 text-accent-amber" />
                  Weekly Activity
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted bg-white/5 px-3 py-1 rounded-full">Last 7 Days</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7Days} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          return (
                            <div className="rounded-xl border border-white/10 bg-surface/80 p-3 backdrop-blur-xl shadow-2xl">
                              <p className="text-sm font-bold text-white">{payload[0].value} messages</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="messages" fill="#A5B4FC" radius={[8, 8, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-primary/[0.02] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
}
