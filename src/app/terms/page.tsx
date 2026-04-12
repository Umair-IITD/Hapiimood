"use client";

import Navbar from "@/components/layout/Navbar";
import { AlertTriangle, UserCheck, Activity, Trash2, HeartPulse } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function TermsAndConditions() {
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
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-rose/10 text-accent-rose shadow-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            Terms of Support
          </h1>
          <p className="text-lg text-text-muted italic max-w-xl mx-auto leading-relaxed">
            By using Hapiimood, you agree to our approach to emotional safety and support.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          <motion.section variants={item} className="bento-card bg-accent-rose/[0.03] border-accent-rose/15 p-8 sm:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <HeartPulse className="h-24 w-24" />
            </div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="rounded-xl bg-accent-rose/20 p-4 text-accent-rose shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">1. Not a Medical Substitute</h2>
                <p className="text-white font-medium bg-accent-rose/10 px-4 py-2 rounded-lg mb-4 inline-block">
                  Important: Hapiimood is NOT a diagnostic tool.
                </p>
                <p className="text-text-muted leading-relaxed text-lg">
                  Hapiimood provides AI-powered emotional support, NOT medical advice, diagnosis, or treatment. Always seek guidance from a qualified health provider for medical conditions. 
                </p>
                <div className="mt-8 p-6 rounded-2xl bg-black/20 border border-white/5 space-y-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-accent-rose">CRITICAL HELP:</p>
                  <p className="text-text-primary">If you are in immediate danger or a crisis, please contact your local emergency services or call <span className="font-bold text-white underline">Tele-MANAS</span> at <span className="font-bold text-white underline">14416 (India)</span>.</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="bento-card border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-primary/10 p-4 text-primary shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">2. Appropriate Use</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  Hapiimood is a safe space. You agree not to use this platform for illegal activities, harassment, or to impersonate others. Any usage that compromises the safety of other individuals will result in immediate termination of access.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="bento-card border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-accent-emerald/10 p-4 text-accent-emerald shrink-0">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">3. System Availability</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  We strive for zero-latency, 24/7 availability. However, the service is provided &quot;as is&quot; and we do not guarantee uninterrupted access during maintenance windows or systemic outages.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={item} className="bento-card border-white/5 hover:border-primary/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <div className="rounded-xl bg-accent-rose/10 p-4 text-accent-rose shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">4. Account Termination</h2>
                <p className="text-text-muted leading-relaxed text-lg">
                  You are free to end your sessions or delete your account at any time. We reserve the right to modify or discontinue Hapiimood if we determine that the service is being used in a manner that bypasses our core safety protocols.
                </p>
              </div>
            </div>
          </motion.section>
          
          <motion.div variants={item} className="pt-12 text-center text-sm font-bold uppercase tracking-widest text-text-muted border-t border-white/5 opacity-50">
            Last updated: April 2026. Your emotional safety stays our first priority.
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative pulse ornament */}
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-accent-rose/[0.02] blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
}
