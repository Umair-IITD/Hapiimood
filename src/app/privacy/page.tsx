"use client";

import Navbar from "@/components/layout/Navbar";
import { Shield, Eye, Lock, RefreshCw, MessageCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function PrivacyPolicy() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-bg overflow-hidden">
      <Navbar />
      <div className="bg-mesh opacity-40" aria-hidden="true" />
      
      <main className="mx-auto w-full max-w-4xl flex-grow px-6 pt-40 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xl">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            Privacy Protocol
          </h1>
          <p className="text-lg text-text-muted italic max-w-xl mx-auto leading-relaxed">
            Hapiimood is built for the distressed brain, which means safety and anonymity are completely paramount.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          <motion.section variants={item} className="bento-card bg-white/[0.02] border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-accent-emerald/10 p-4 text-accent-emerald shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">1. Anonymous By Default</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  We do not require your real name, email, or any personally identifiable information (PII) to use the core features of the platform. If you sign in anonymously, you remain completely anonymous. We believe in your right to safe, private expression.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="bento-card bg-white/[0.02] border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-primary/10 p-4 text-primary shrink-0">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">2. Data We Collect</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  To provide emotional support and track your mood trends, we securely collect chat content, sentiment scores, and dashboard interactions. This data is linked only to your anonymous session ID or user ID &mdash; never your real identity.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="bento-card bg-white/[0.02] border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-accent-rose/10 p-4 text-accent-rose shrink-0">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">3. How We Use Data</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  Your data is strictly used to power the Hapi AI and render your personal mood dashboard. We never sell your data to advertisers, data brokers, or third parties. We use trusted infrastructure like Vercel and Groq for hosting and AI inference.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="bento-card bg-white/[0.02] border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-accent-amber/10 p-4 text-accent-amber shrink-0">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">4. Absolute Control</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  You have absolute control over your sessions. Anonymous sessions are ephemeral. If you choose to create an account, you can request full data deletion at any time via the Contact page.
                </p>
              </div>
            </div>
          </motion.section>
          
          <motion.div variants={item} className="pt-12 text-center text-sm font-bold uppercase tracking-widest text-text-muted border-t border-white/5 opacity-50">
            Last updated: April 2026. This policy may be updated periodically to enhance your safety.
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative pulse element */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-primary/[0.03] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
