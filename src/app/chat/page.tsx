"use client";

import { useChat } from "@ai-sdk/react";
import Navbar from "@/components/layout/Navbar";
import { Send, ArrowLeft, MoreVertical, Shield, Sparkles, Trash2, Download, RefreshCw, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getChatHistory } from "@/app/_actions/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const { messages, status, sendMessage, setMessages } = useChat();
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  // Load chat history on mount
  useEffect(() => {
    if (user && !isHistoryLoaded) {
      getChatHistory(60).then(({ data }) => {
        if (data && data.length > 0) {
          const history = data.reverse().map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            parts: [{ type: "text", text: m.content }],
          }));
          // @ts-expect-error AI SDK type matching
          setMessages(history);
        }
        setIsHistoryLoaded(true);
      });
    }
  }, [user, isHistoryLoaded, setMessages]);

  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setShowMenu(false);
  };

  const handleExportChat = () => {
    const text = messages
      .map((m) => {
        const content = m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");
        return `[${m.role.toUpperCase()}]\n${content}`;
      })
      .join("\n\n---\n\n");

    const blob = new Blob(
      [`Hapiimood Chat Export — ${new Date().toLocaleDateString()}\n\n${text}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hapiimood-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setShowMenu(false);
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-bg overflow-hidden">
      {/* Background Sentiment Glow */}
      <div className="bg-mesh opacity-40" aria-hidden="true" />
      <motion.div 
        animate={{ 
          opacity: status === "streaming" ? [0.05, 0.15, 0.05] : 0,
          scale: status === "streaming" ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-primary/10 blur-[120px]" 
      />

      <Navbar />

      {/* Chat Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-[60px] z-40 w-full border-b border-white/5 bg-bg/40 backdrop-blur-3xl"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="rounded-xl p-2 text-text-muted hover:bg-white/5 hover:text-white transition-all duration-300 cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-white flex items-center gap-2 leading-none">
                Hapi 
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
                </span>
              </h2>
              <span className="text-[10px] text-primary/70 uppercase tracking-[0.2em] font-bold mt-1.5">Deep Empathy Engine</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/[0.03] px-3 py-1 text-[10px] font-bold text-text-muted border border-white/5 tracking-widest">
              <Shield className="h-3 w-3" />
              ANONYMOUS
            </div>
            {/* Three-dots menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-xl p-2 text-text-muted hover:bg-white/5 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute right-0 top-12 w-56 rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-3xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <button
                        onClick={handleNewChat}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-primary hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 text-primary" />
                        New Session
                      </button>
                      <button
                        onClick={handleExportChat}
                        disabled={messages.length === 0}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-primary hover:bg-white/5 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4 text-accent-emerald" />
                        Export Chat
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      <button
                        onClick={handleClearHistory}
                        disabled={messages.length === 0}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-accent-rose hover:bg-accent-rose/5 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear History
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="mx-auto flex w-full max-w-4xl flex-grow flex-col overflow-y-auto px-6 pt-36 pb-32 scroll-smooth no-scrollbar"
      >
        <div className="flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="my-20 text-center flex flex-col items-center"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-2xl shadow-primary/10">
                  <Sparkles className="h-10 w-10 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Soft landing.</h3>
                <p className="text-text-muted max-w-md italic leading-relaxed text-lg">
                  I&apos;m here to hold space for whatever involves your mind today. No judgment. Just listening.
                </p>

                {/* Quick prompts */}
                <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-lg">
                  {[
                    "I'm feeling overwhelmed",
                    "Can't stop overthinking",
                    "I need to vent",
                    "Help me relax",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        sendMessage({ text: prompt });
                      }}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-white hover:border-white/10 transition-all duration-300 cursor-pointer backdrop-blur-xl"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((m, idx) => (
              <motion.div
                key={m.id || idx}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-3xl px-6 py-4 shadow-2xl transition-all duration-500 ${
                    m.role === "user" 
                      ? "bg-primary/5 border border-primary/20 text-text-primary rounded-tr-none" 
                      : "bg-surface/40 border border-white/5 text-text-primary rounded-tl-none backdrop-blur-xl"
                  }`}
                >
                  <div className="text-[16px] leading-[1.6] whitespace-pre-wrap font-medium">
                    {m.parts.map((part, i) => {
                      if (part.type === "text") {
                        return <span key={i}>{part.text}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card rounded-2xl py-4 px-6 flex items-center gap-2 rounded-tl-none bg-white/[0.02]">
                <div className="h-1.5 w-1.5 animate-bounce bg-primary/40 rounded-full" />
                <div className="h-1.5 w-1.5 animate-bounce bg-primary/40 rounded-full [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 animate-bounce bg-primary/40 rounded-full [animation-delay:-0.3s]" />
              </div>
            </motion.div>
          )}
          {/* Invisible anchor to ensure smooth scrolling to the very bottom */}
          <div ref={messagesEndRef} className="h-4 w-full" />
        </div>
      </main>

      {/* Input Bar */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 z-40 w-full border-t border-white/5 bg-bg/60 backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-4xl px-6 py-6">
          <form 
            className="relative flex items-center gap-3" 
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Venting helps. Tell me what's on your mind..."
              className="input-glass pr-16 bg-white/[0.02] border-white/5 py-4 px-6 text-lg focus:bg-white/[0.04] transition-all duration-700"
              maxLength={2000}
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/90 text-bg transition-all duration-500 cursor-pointer hover:bg-primary hover:scale-110 hover:shadow-[0_0_20px_rgba(165,180,252,0.4)] hover:backdrop-blur-xl active:scale-95 disabled:bg-white/5 disabled:text-text-muted disabled:cursor-not-allowed disabled:shadow-none shadow-lg shadow-primary/20"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-text-muted/60 font-bold uppercase tracking-widest">
               Hapi is listening. You are safe and anonymous.
            </span>
            <span className={`text-[10px] font-bold tabular-nums ${
              input.length > 1800 ? "text-accent-rose" : input.length > 1500 ? "text-accent-amber" : "text-text-muted/40"
            }`}>
              {input.length}/2000
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
