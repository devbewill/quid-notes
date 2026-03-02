"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

interface EditPanelLayoutProps {
  title: string;
  onTitleChange: (v: string) => void;
  onTitleBlur: () => void;
  titlePlaceholder?: string;
  label: string;
  updatedAt: number;
  isPinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
  sidebarContent: ReactNode;
  mainContent: ReactNode;
}

export function EditPanelLayout({
  title,
  onTitleChange,
  onTitleBlur,
  titlePlaceholder = "Title…",
  label,
  updatedAt,
  isPinned,
  onTogglePin,
  onClose,
  sidebarContent,
  mainContent,
}: EditPanelLayoutProps) {
  // Keep a stable ref so that ESC listener always calls latest handleClose
  const handleCloseRef = useRef(onClose);
  useEffect(() => {
    handleCloseRef.current = onClose;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseRef.current();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/60"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="relative z-10 w-full max-w-5xl min-w-[60%] lg:w-3/5 h-[72vh] bg-bg-surface border border-border-subtle rounded-lg shadow-lg flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start gap-3 px-6 py-4 border-b border-border-subtle">
            {label && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-lighter text-accent-primary ring-1 ring-accent-primary/30 font-medium shrink-0 mt-1">
                {label.toUpperCase()}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={onTitleBlur}
                placeholder={titlePlaceholder}
                className="w-full text-lg font-semibold bg-transparent outline-none text-text-primary placeholder:text-text-muted border-none"
              />
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-text-muted mb-4 px-1">Details</h4>
              <p className="text-[10px] text-text-muted mt-0.5 tabular-nums">
                Modified {new Date(updatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <button
                onClick={onTogglePin}
                className={cn("p-1.5 rounded-md transition-colors", isPinned ? "text-semantic-warning bg-accent-lighter hover:bg-accent-light" : "text-text-muted hover:text-text-primary hover:bg-bg-hover")}
                title={isPinned ? "Remove from pinned" : "Pin to top"}
              >
                <svg className={cn("w-4 h-4", isPinned && "fill-semantic-warning")} viewBox="0 0 20 20" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isPinned ? 0 : 1.5} d={isPinned ? "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" : "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"} />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-text-muted hover:text-text-primary text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Body — two columns */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left: meta */}
            <div className="w-56 shrink-0 border-r border-border-subtle p-5 flex flex-col gap-5 overflow-y-auto">
              {sidebarContent}
            </div>

            {/* Right: content */}
            <div className="flex-1 overflow-y-auto p-6">
              {mainContent}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
