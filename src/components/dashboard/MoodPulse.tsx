"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { format, subDays, startOfDay } from "date-fns";

export default function MoodPulse() {
  const { user } = useUser();
  const [data, setData] = useState<{ name: string; mood: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMoodLogs() {
      if (!user) return;
      
        const { data: logs } = await supabase
        .from("mood_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(30);

      if (logs) {
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
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                    <p className="text-sm font-bold text-primary">Mood: {payload[0].value}/5</p>
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
      <div className="mt-6 flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-muted/60 font-bold">
        <span>Mon</span>
        <span>Today</span>
      </div>
    </div>
  );
}
