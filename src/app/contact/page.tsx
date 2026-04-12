"use client";

import Navbar from "@/components/layout/Navbar";
import { Mail, MessageCircle, AlertCircle, Sparkles } from "lucide-react";
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

export default function Contact() {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-bg">
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
            <MessageCircle className="h-6 w-6" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            Connect with us
          </h1>
          <p className="text-lg text-text-muted italic max-w-xl mx-auto leading-relaxed">
            Have questions or just need to say hi? We handle every message with care and respond within 24 hours.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div variants={item} className="bento-card bg-white/[0.02] border-white/5 hover:border-primary/20 p-8 flex flex-col justify-between group">
            <div>
              <div className="mb-6 rounded-xl bg-primary/10 p-4 text-primary w-fit group-hover:scale-110 transition-transform duration-500">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Email Support</h2>
              <p className="text-text-muted leading-relaxed mb-8">
                For partnerships, feedback, or general inquiries about our empathy engine.
              </p>
            </div>
            <a 
              href="mailto:mdumairalam10@gmail.com" 
              className="btn-primary w-full text-center"
            >
              Reach Out
            </a>
          </motion.div>

          <motion.div variants={item} className="bento-card border-accent-rose/10 bg-accent-rose/[0.03] p-8 flex flex-col justify-between group">
            <div>
              <div className="mb-6 rounded-xl bg-accent-rose/10 p-4 text-accent-rose w-fit group-hover:scale-110 transition-transform duration-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Immediate Help</h2>
              <p className="text-text-muted leading-relaxed mb-8">
                If you are in distress or crisis, please do not wait for an email. Use our emergency partner lines.
              </p>
            </div>
            <div className="rounded-2xl bg-black/20 border border-white/5 p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-rose mb-2">Tele-MANAS (India)</p>
              <p className="font-bold text-white text-xl">14416</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="md:col-span-2 bento-card bg-white/[0.02] border-white/5 hover:border-primary/20 p-10 flex flex-col items-center gap-6 text-center">
             <div className="mx-auto rounded-xl bg-accent-amber/10 p-4 text-accent-amber w-fit">
                <Sparkles className="h-6 w-6" />
             </div>
             <div>
               <h3 className="text-2xl font-bold text-white mb-2">Community Feedback</h3>
               <p className="text-text-muted max-w-lg mx-auto">
                 We are constantly evolving Hapiimood to better serve Indian students. Your insights specifically on cultural context help us improve our empathy models.
               </p>
             </div>
             <button className="btn-secondary px-10 cursor-pointer">Submit Insights</button>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative pulse element */}
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-primary/[0.03] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
    </div>
  );
}
