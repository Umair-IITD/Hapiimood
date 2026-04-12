"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { getMoodLogs } from "@/app/_actions/supabase";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MoodPulse() {
  const { user } = useUser();
  const [data, setData] = useState<{ name: string; mood: number }[]>([]);
  const [trend, setTrend] = useState<{ status: "up" | "down" | "flat", label: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMoodLogs() {
      if (!user) return;
      
      const { data: logs } = await getMoodLogs(30);

      if (logs && logs.length > 0) {
        // Simple smoothing: average scores per day
        const dayMap: Record<string, { sum: number, count: number }> = {};
        logs.forEach(log => {
          const day = format(new Date(log.created_at), "EEE");
          if (!dayMap[day]) dayMap[day] = { sum: 0, count: 0 };
          dayMap[day].sum += log.mood_score;
          dayMap[day].count += 1;
        });

        const formatted = Object.entries(dayMap).map(([name, val]) => ({
          name,
          mood: val.sum / val.count,
        }));
        
        setData(formatted);

        // Trend calculation (compare most recent half vs older half)
        if (logs.length > 2) {
          const midpoint = Math.floor(logs.length / 2);
          const recentHalf = logs.slice(0, midpoint);
          const olderHalf = logs.slice(midpoint);
          
          const recentAvg = recentHalf.reduce((s, l) => s + l.mood_score, 0) / recentHalf.length;
          const olderAvg = olderHalf.reduce((s, l) => s + l.mood_score, 0) / olderHalf.length;
          
          const diff = recentAvg - olderAvg;
          if (diff > 0.3) setTrend({ status: "up", label: "Improving" });
          else if (diff < -0.3) setTrend({ status: "down", label: "Dropping" });
          else setTrend({ status: "flat", label: "Stable" });
        }
      }
      setIsLoading(false);
    }

    fetchMoodLogs();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[180px] w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[180px] w-full flex-col items-center justify-center text-center">
        <p className="text-xs text-text-muted font-medium mb-1">No data yet.</p>
        <p className="text-[10px] text-text-muted/60">Your emotional trends will appear here as you chat.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* Trend Badge (Top Right of Card) */}
      {trend && (
        <div className={`absolute top-8 right-8 flex items-center gap-2 rounded-full px-4 py-1.5 border backdrop-blur-3xl transition-all duration-500 shadow-2xl z-20 
          ${trend.status === "up" ? "bg-accent-emerald/20 border-accent-emerald/40 shadow-accent-emerald/20" : 
            trend.status === "down" ? "bg-accent-rose/20 border-accent-rose/40 shadow-accent-rose/20" : 
            "bg-white/10 border-white/20 shadow-black/40"}`}
        >
          <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${trend.status === "up" ? "bg-accent-emerald" : trend.status === "down" ? "bg-accent-rose" : "bg-text-muted"}`} />
          {trend.status === "up" && <TrendingUp className="h-3.5 w-3.5 text-accent-emerald" />}
          {trend.status === "down" && <TrendingDown className="h-3.5 w-3.5 text-accent-rose" />}
          {trend.status === "flat" && <Minus className="h-3.5 w-3.5 text-text-muted" />}
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
            {trend.label}
          </span>
        </div>
      )}

      {/* Last 7 Days (Bottom Left of Card) */}
      <div className="absolute bottom-8 left-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted/60 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          Last 7 Days
        </span>
      </div>

      <div className="h-[180px] w-full relative z-10 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A5B4FC" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A5B4FC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 6]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-white/10 bg-surface/60 p-3 backdrop-blur-xl shadow-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{payload[0].payload.name}</p>
                      <p className="text-sm font-bold text-primary">Mood: {Number(payload[0].value).toFixed(1)}/5</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#A5B4FC"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMood)"
              animationBegin={500}
              animationDuration={3000}
              dot={{ r: 4, fill: "#A5B4FC", strokeWidth: 2, stroke: "#0F121D" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#4FD1C5" }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-muted/60 font-bold">
          <span>Mon</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

