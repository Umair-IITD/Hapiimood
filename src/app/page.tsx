"use client";

import Navbar from "@/components/layout/Navbar";
import { ArrowRight, Sparkles, ShieldCheck, Zap, HeartPulse } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-bg">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-20 sm:px-6 lg:px-8 relative z-10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] h-64 w-64 rounded-full bg-primary/5 blur-[80px]"
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, -20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] right-[10%] h-96 w-96 rounded-full bg-accent-emerald/5 blur-[100px]"
          />
        </div>

        <div className="mx-auto max-w-5xl text-center relative z-20">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-xl shadow-2xl"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Digital Sanctuary for the Mind</span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-8 text-5xl font-bold tracking-tight text-white sm:text-8xl leading-[1.1]"
          >
            Your mind deserves support <br />
            <span className="text-gradient italic font-serif">whenever it asks.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl font-medium"
          >
            Anonymous, zero-latency AI empathy designed for the distressed brain. 
            No judgment, no stigma &mdash; just a safe space to breathe and reframe.
          </motion.p>

          {/* Primary CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <Link href="/chat" className="btn-primary w-full group sm:w-auto text-lg px-10 py-5">
              Talk to Hapi &mdash; it&apos;s free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
            <button className="btn-secondary w-full sm:w-auto text-lg px-10 py-5 group">
              Our Philosophy
              <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-0.5 mx-auto" />
            </button>
          </motion.div>

          {/* Feature Bento Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3 text-left"
          >
            <div className="bento-card group flex flex-col gap-6">
              <div className="rounded-2xl bg-primary/10 p-4 text-primary w-fit group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-text-primary">Radical Anonymity</h3>
                <p className="text-sm text-text-muted leading-relaxed">No tracking, no logs, no identifiers. Your safety is built into our architecture by default.</p>
              </div>
            </div>

            <div className="bento-card group flex flex-col gap-6">
              <div className="rounded-2xl bg-accent-emerald/10 p-4 text-accent-emerald w-fit group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-text-primary">Instant Empathy</h3>
                <p className="text-sm text-text-muted leading-relaxed">Powered by low-latency architecture for real-time support during high-distress moments.</p>
              </div>
            </div>

            <div className="bento-card group flex flex-col gap-6">
              <div className="rounded-2xl bg-accent-rose/10 p-4 text-accent-rose w-fit group-hover:scale-110 transition-transform duration-500">
                <HeartPulse className="h-7 w-7" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-text-primary">Culturally Grounded</h3>
                <p className="text-sm text-text-muted leading-relaxed">Designed specifically for Indian student experiences, understanding academic and family stress.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Hero Pulse Ornament */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-bg/50 py-12 backdrop-blur-3xl relative z-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:items-start text-center sm:text-left">
            <h2 className="text-xl font-bold text-gradient">Hapiimood</h2>
            <p className="text-xs text-text-muted max-w-[200px]">
              Emotional first-aid for the digital generation. Not a medical substitute.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-rose animate-pulse">Reach Tele-MANAS: 14416 (India)</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
            <Link href="/privacy" className="hover:text-white transition-all duration-300 ease-in-out">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-all duration-300 ease-in-out">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-all duration-300 ease-in-out">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
