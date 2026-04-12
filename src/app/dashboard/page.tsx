"use client";

import Navbar from "@/components/layout/Navbar";
import MoodPulse from "@/components/dashboard/MoodPulse";
import BreathingExercise from "@/components/dashboard/BreathingExercise";
import InsightCarousel from "@/components/dashboard/InsightCarousel";
import MeditationCarousel from "@/components/dashboard/MeditationCarousel";
import { MessageSquare, Sparkles, Brain, Wind, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Dashboard() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-bg overflow-hidden">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pt-32 pb-20 sm:px-6 lg:px-8 relative z-10">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Welcome back.</h1>
            <p className="text-lg text-text-muted font-medium italic">Take a deep breath. You&apos;re in a safe space.</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border-white/5 bg-white/[0.02]">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Daily Anchor</div>
              <div className="text-sm font-semibold text-text-primary">&quot;Your thoughts are clouds, not the sky.&quot;</div>
            </div>
          </div>
        </motion.header>

        {/* Bento Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:grid-rows-3"
        >
          {/* Talk to Hapi (Large) */}
          <motion.div variants={item} className="md:col-span-12 lg:col-span-7">
            <Link
              href="/chat"
              className="bento-card h-full relative overflow-hidden group flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-bg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-700">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">Talk to Hapi</h2>
                <p className="text-text-muted max-w-md text-lg leading-relaxed">
                  Venting helps. Hapi is here 24/7 to listen without judgment and help you reframe your thoughts.
                </p>
              </div>

              <div className="mt-12 flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-sm relative z-10">
                Start a session <ArrowRight className="h-4 w-4 group-hover:translate-x-3 transition-transform duration-500" />
              </div>
            </Link>
          </motion.div>

          {/* Mood Pulse (Medium) */}
          <motion.div variants={item} className="md:col-span-6 lg:col-span-5 h-full">
            <div className="bento-card h-full flex flex-col relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-accent-amber" />
                  Emotional Pulse
                </h2>
              </div>
              <div className="flex-grow min-h-[220px]">
                <MoodPulse />
              </div>
            </div>
          </motion.div>

          {/* Quick Calm (Small) */}
          <motion.div variants={item} className="md:col-span-6 lg:col-span-4 h-full">
            <div className="bento-card h-full flex flex-col items-center justify-center group overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-emerald/0 via-accent-emerald/40 to-accent-emerald/0" />
              <h2 className="text-xl font-bold flex items-center gap-3 mb-10 w-full text-left relative z-10">
                <Wind className="h-6 w-6 text-accent-emerald" />
                Quick Calm
              </h2>
              <div className="relative z-10 w-full">
                <BreathingExercise />
              </div>
            </div>
          </motion.div>

          {/* Analytics Quick View */}
          <motion.div variants={item} className="md:col-span-6 lg:col-span-4 h-full">
            <Link
              href="/analytics"
              className="bento-card h-full relative overflow-hidden group flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-emerald/10 text-accent-emerald shadow-lg shadow-accent-emerald/10 group-hover:scale-110 transition-transform duration-700">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold mb-3 text-white">Emotional Analytics</h2>
                <p className="text-text-muted text-sm leading-relaxed">
                  Deep insights into your emotional patterns, sentiment trends, and personal growth journey.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-accent-emerald font-bold uppercase tracking-widest text-[11px] relative z-10">
                View Analytics <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-3 transition-transform duration-500" />
              </div>
            </Link>
          </motion.div>

          {/* Meditation Carousel */}
          <motion.div variants={item} className="md:col-span-12 lg:col-span-4 h-full">
            <MeditationCarousel />
          </motion.div>

          {/* Recommended Insight (Full Width) */}
          <motion.div variants={item} className="md:col-span-12 lg:col-span-12 h-full">
            <InsightCarousel />
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative pulse element */}
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-primary/[0.02] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
}
