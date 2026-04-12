"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";

const meditations = [
  {
    id: 1,
    title: "Anulom Vilom",
    duration: "5 mins",
    color: "#4FD1C5", // Emerald
    description: "Alternate nostril breathing to balance the left and right hemispheres of your brain.",
  },
  {
    id: 2,
    title: "Kapalbhati",
    duration: "3 mins",
    color: "#FCD34D", // Amber
    description: "Active exhalations to generate heat, detoxify, and invigorate the mind.",
  },
  {
    id: 3,
    title: "Bhramari",
    duration: "4 mins",
    color: "#A5B4FC", // Periwinkle
    description: "Humming bee breath to instantly calm nerves and reduce anxiety or stress.",
  },
  {
    id: 4,
    title: "Vipassana Mini",
    duration: "10 mins",
    color: "#FF8A8A", // Rose
    description: "Body scan meditation to build profound awareness and emotional regulation.",
  },
  {
    id: 5,
    title: "Trataka",
    duration: "5 mins",
    color: "#818CF8", // Indigo
    description: "Steady gazing at a single point (or candle flame) to improve focus and memory.",
  },
];

// Stylized meditating figure SVG with glowing elements
const MeditatingFigure = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    <AnimatePresence mode="wait">
      <motion.div
        key={`aura-${color}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isActive ? [0.4, 0.7, 0.4] : 0.4, scale: isActive ? [0.9, 1.1, 0.9] : 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full blur-[24px]"
        style={{ backgroundColor: color }}
      />
    </AnimatePresence>
    
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10 drop-shadow-xl"
      initial={{ y: 5 }}
      animate={{ y: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="12" cy="6" r="2" fill={`${color}40`} />
      <path d="M12 10v4" />
      <path d="M8 14l4-4 4 4" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M7 18c-1.5 0-2.5-1-2.5-2.5S5.5 13 7 13c1 0 1.5.5 2 1" />
      <path d="M17 18c1.5 0 2.5-1 2.5-2.5S18.5 13 17 13c-1 0-1.5.5-2 1" />
    </motion.svg>
  </div>
);

export default function MeditationCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play the carousel if not actively "playing" a meditation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPlaying) {
      interval = setInterval(() => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % meditations.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + meditations.length) % meditations.length);
  };

  const current = meditations[index];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="bento-card h-full flex flex-col justify-between overflow-hidden relative group">
      {/* Dynamic Background Hint */}
      <motion.div
        className="absolute inset-0 opacity-10 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${current.color}, transparent 70%)`
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Activity className="h-5 w-5" style={{ color: current.color }} />
          Meditation
        </h2>
        <div className="flex gap-1">
          {meditations.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-4" : "w-1 bg-white/10"
              }`}
              style={{ backgroundColor: i === index ? current.color : undefined }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center py-4 relative z-10 w-full min-h-[160px]">
        {/* Carousel Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full"
          >
            <MeditatingFigure color={current.color} isActive={isPlaying} />
            
            <h3 className="text-lg font-bold text-white mt-4">{current.title}</h3>
            <div 
              className="text-[10px] font-bold uppercase tracking-widest mt-1 mb-2"
              style={{ color: current.color }}
            >
              {current.duration}
            </div>
            
            <p className="text-xs text-text-muted leading-relaxed px-2 max-w-[260px]">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 relative z-10 w-full px-2">
        <button
          onClick={() => paginate(-1)}
          className="h-10 w-10 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 hover:scale-110 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 font-bold backdrop-blur-xl cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 backdrop-blur-xl"
          style={{ 
            backgroundColor: isPlaying ? "rgba(255,255,255,0.05)" : `${current.color}25`,
            color: isPlaying ? "#94A3B8" : current.color,
            border: `1px solid ${isPlaying ? "rgba(255,255,255,0.05)" : `${current.color}50`}`
          }}
        >
           {isPlaying ? "Pause" : "Practice"}
        </button>

        <button
          onClick={() => paginate(1)}
          className="h-10 w-10 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 hover:scale-110 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 font-bold backdrop-blur-xl cursor-pointer"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
