"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for production visibility
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <div className="bg-mesh opacity-30" aria-hidden="true" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-rose/10 shadow-2xl shadow-accent-rose/10">
          <AlertTriangle className="h-10 w-10 text-accent-rose" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">Something shifted in the sanctuary</h1>
        <p className="mb-8 max-w-md text-text-muted">
          Even in the quietest spaces, unexpected shifts occur. We've logged this moment and are looking into it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="btn-primary flex items-center gap-2 px-8"
          >
            <RefreshCcw className="h-4 w-4" />
            Restore Peace
          </button>
          
          <Link
            href="/"
            className="btn-secondary flex items-center gap-2 px-8"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-12 max-w-2xl overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-rose mb-2">Developer Trace:</p>
            <pre className="text-xs text-text-muted/60 overflow-x-auto whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
        )}
      </motion.div>
    </div>
  );
}
