"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { LogOut, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  const handleQuickExit = () => {
    // Quick Exit: Immediate redirect to a neutral page
    window.location.href = "https://www.google.com";
  };

  return (
    <motion.nav 
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 z-50 h-[80px] w-full border-b border-white/5 bg-bg/40 backdrop-blur-3xl transition-all"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-emerald shadow-xl shadow-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            <HeartPulse className="h-6 w-6 text-bg" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-500">
            Hapii<span className="text-primary group-hover:text-white transition-colors duration-500">mood</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {isLoaded && isSignedIn && (
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-1">
                <Link href="/dashboard" className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-text-muted hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer">
                  Dashboard
                </Link>
                <Link href="/analytics" className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-text-muted hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer">
                  Analytics
                </Link>
                <Link href="/chat" className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-text-muted hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer">
                  Chat
                </Link>
              </div>
              <div className="hidden items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-1.5 lg:flex">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Safe & Active</span>
              </div>
              <UserButton
                appearance={{
                  baseTheme: dark,
                  elements: {
                    avatarBox: "h-9 w-9 border-2 border-white/5 ring-2 ring-primary/10",
                  },
                }}
              />
            </div>
          )}

          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <button className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white cursor-pointer transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
          )}

          {/* Quick Exit Button */}
          <button
            onClick={handleQuickExit}
            className="flex items-center gap-2 rounded-xl bg-accent-rose/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-accent-rose border border-accent-rose/20 hover:bg-accent-rose hover:text-white cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-accent-rose/20 active:scale-95"
            title="Quickly exit to Google"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Exit</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
