"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, BookOpen, Brain, Heart, Shield } from "lucide-react";

const insights = [
  {
    id: 1,
    icon: Brain,
    color: "#A5B4FC",
    label: "Cognitive Reframe",
    title: "Reframing Academic Stress",
    description: "A 3-minute guided check-in focused on handling pressure during exam season. Learn to separate your self-worth from grades.",
    action: "I notice you're carrying a lot of academic pressure. Let's reframe this: exams measure preparation, not your value. Take a deep breath — what's ONE thing you can control right now?",
  },
  {
    id: 2,
    icon: Heart,
    color: "#FF8A8A",
    label: "Emotional Release",
    title: "Processing Overwhelming Emotions",
    description: "When everything feels like too much, this 2-minute practice helps you name, validate, and release bottled-up feelings.",
    action: "It sounds like emotions are building up. That's completely okay. Let's try this: name three things you're feeling right now without judging them. Just name them. I'm here to listen.",
  },
  {
    id: 3,
    icon: Shield,
    color: "#4FD1C5",
    label: "Boundary Setting",
    title: "Saying No Without Guilt",
    description: "Setting boundaries isn't selfish — it's survival. Learn a gentle framework to protect your energy without damaging relationships.",
    action: "Boundaries are bridges, not walls. Here's a framework: 'I care about you AND I need this for myself.' Practice saying it. What's one boundary you've been wanting to set?",
  },
  {
    id: 4,
    icon: BookOpen,
    color: "#FCD34D",
    label: "Mindful Pause",
    title: "The 5-4-3-2-1 Grounding Technique",
    description: "When anxiety spirals, use your senses to anchor yourself to the present. This clinically-proven technique takes only 60 seconds.",
    action: "Let's ground you right now. Name: 5 things you can SEE, 4 things you can TOUCH, 3 things you can HEAR, 2 things you can SMELL, and 1 thing you can TASTE. Take it slow.",
  },
  {
    id: 5,
    icon: Brain,
    color: "#818CF8",
    label: "Sleep Hygiene",
    title: "Quieting Your Racing Mind at Night",
    description: "Can't sleep because your brain won't shut off? This cognitive offloading technique helps you park your worries before bed.",
    action: "Racing thoughts at night are your brain trying to solve problems it can't. Let's do a 'brain dump': tell me everything on your mind right now, and we'll sort them into 'can control' and 'can't control.'",
  },
];

export default function InsightCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const current = insights[index];
  const Icon = current.icon;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIsExpanded(false);
    setIndex((prev) => (prev + newDirection + insights.length) % insights.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="bento-card h-full flex flex-col cursor-default overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary opacity-80">
          Recommended Insight
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tabular-nums text-text-muted/60">
            {index + 1}/{insights.length}
          </span>
          <div className="flex gap-1">
            {insights.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-5 bg-primary" : "w-1 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-grow relative min-h-[180px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col md:flex-row items-start gap-8"
          >
            {/* Icon */}
            <div
              className="h-20 w-20 shrink-0 flex items-center justify-center rounded-3xl border border-white/5 transition-all duration-700"
              style={{
                backgroundColor: `${current.color}10`,
                boxShadow: `0 0 40px ${current.color}10`,
              }}
            >
              <Icon className="h-10 w-10" style={{ color: current.color }} />
            </div>

            {/* Text */}
            <div className="flex-grow">
              <div
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60"
                style={{ color: current.color }}
              >
                {current.label}
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">{current.title}</h2>
              <p className="text-text-muted leading-relaxed max-w-lg">
                {current.description}
              </p>

              {/* Expanded action content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5 overflow-hidden"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                      <Play className="h-3 w-3" /> Guided Prompt
                    </div>
                    <p className="text-text-primary leading-relaxed text-sm italic">
                      &ldquo;{current.action}&rdquo;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(-1)}
            className="h-10 w-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
            aria-label="Previous insight"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="h-10 w-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
            aria-label="Next insight"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-primary text-sm px-6 py-3 cursor-pointer"
        >
          {isExpanded ? "Close" : "Begin"}
        </button>
      </div>
    </div>
  );
}
