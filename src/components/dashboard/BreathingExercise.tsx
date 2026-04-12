"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phases = [
  { text: "Inhale", duration: 4, color: "#A5B4FC" }, // Electric Periwinkle
  { text: "Hold", duration: 4, color: "#818CF8" },
  { text: "Exhale", duration: 4, color: "#4FD1C5" }, // Soft Emerald
  { text: "Hold", duration: 4, color: "#818CF8" },
];

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setTimeout(() => {
        setPhaseIndex((prev) => (prev + 1) % phases.length);
      }, phases[phaseIndex].duration * 1000);
    }
    return () => clearTimeout(timer);
  }, [isActive, phaseIndex]);

  const currentPhase = phases[phaseIndex];

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key={`pulse-${phaseIndex}`}
              initial={{ scale: phaseIndex % 2 === 0 ? 0.8 : 1.3, opacity: 0.1 }}
              animate={{ 
                scale: phaseIndex % 2 === 0 ? 1.3 : 0.8, 
                opacity: [0.2, 0.4, 0.2],
                backgroundColor: currentPhase.color
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full blur-[60px]"
            />
          ) : (
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-[40px] animate-pulse" />
          )}
        </AnimatePresence>

        <motion.div
          animate={isActive ? {
            scale: phaseIndex % 2 === 0 ? 1.2 : 0.8,
          } : { scale: 1 }}
          transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
          className="z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl transition-all duration-1000"
          style={{ borderColor: isActive ? `${currentPhase.color}40` : "rgba(255,255,255,0.1)" }}
        >
          <motion.span 
            key={currentPhase.text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-white uppercase tracking-[0.3em]"
          >
            {isActive ? currentPhase.text : "REST"}
          </motion.span>
        </motion.div>
        
        {/* Animated Ring */}
        {isActive && (
          <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
             <motion.circle
               cx="80"
               cy="80"
               r="76"
               fill="none"
               stroke={currentPhase.color}
               strokeWidth="2"
               strokeDasharray="478"
               initial={{ strokeDashoffset: 478 }}
               animate={{ strokeDashoffset: 0 }}
               transition={{ duration: currentPhase.duration, ease: "linear" }}
               className="opacity-30"
             />
          </svg>
        )}
      </div>

      <button
        onClick={() => {
          setIsActive(!isActive);
          setPhaseIndex(0);
        }}
        className={`mt-10 rounded-2xl px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer ${
          isActive 
            ? "bg-white/5 text-text-muted hover:bg-white/10 border border-white/5" 
            : "btn-primary"
        }`}
      >
        {isActive ? "End Practice" : "Start Quick Calm"}
      </button>

      <p className="mt-6 text-[10px] text-text-muted/60 font-bold uppercase tracking-widest text-center max-w-[220px] leading-relaxed">
        Guided box breathing to restore emotional balance.
      </p>
    </div>
  );
}
