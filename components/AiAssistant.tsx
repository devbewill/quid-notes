"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiAssistant() {
  const ask = useAction(api.ai.askAssistant);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm Quid AI. How can I help you with your notes and tasks today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await ask({ prompt: userMessage });
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, an error occurred while generating the response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li>
      {/* Sidebar Nav Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors font-medium border mt-2",
          isOpen
            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            : "text-muted border-transparent hover:text-indigo-400 hover:bg-indigo-500/5 hover:border-indigo-500/10"
        )}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.446-7.189l-.259-1.035a3.375 3.375 0 00-2.455-2.456l-1.036-.259 1.036-.259a3.375 3.375 0 002.455-2.456l.259-1.035.259 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.259 1.035zm-1.365 11.852l-.394-1.183a2.25 2.25 0 00-1.423-1.423l-1.183-.394 1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423l-.394 1.183z" />
        </svg>
        Quid AI
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[440px] h-[600px] max-h-[80vh] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-bg/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">Quid AI</h3>
                  <p className="text-[10px] text-muted">AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-bg border border-border text-muted hover:text-text hover:bg-surface transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-bg/30">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col max-w-[85%]", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user" ? "bg-accent text-bg" : "bg-bg border border-border text-text"
                  )}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm prose-p:leading-snug prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mr-auto items-start flex flex-col max-w-[85%]">
                  <div className="px-5 py-3.5 rounded-2xl bg-bg border border-border flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-surface">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something about your notes..."
                  disabled={loading}
                  className="w-full bg-bg border border-border text-text placeholder:text-muted rounded-xl pl-4 pr-12 py-3 text-sm focus:border-accent outline-none disabled:opacity-50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:bg-bg disabled:text-muted"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 19.5 7.5-7.5-7.5-7.5m-6 15L13.5 12 6 4.5" /></svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
