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
  toolbarContent: ReactNode;
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
  toolbarContent,
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
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        {/* Backdrop - simple, clean */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Modal - technical, clean design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl h-[85vh] bg-bg-surface border border-border-subtle flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-border-subtle">
            {/* Top bar - label, pin, close */}
            <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated/50">
              <div className="flex items-center gap-2">
                {label && (
                  <span className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider">
                    [{label}]
                  </span>
                )}
                <span className="text-[10px] font-mono text-text-muted/40">
                  {new Date(updatedAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onTogglePin}
                  className={cn(
                    "p-1.5 transition-colors",
                    isPinned
                      ? "text-semantic-warning"
                      : "text-text-muted/40 hover:text-text-muted",
                  )}
                  title={isPinned ? "Remove from pinned" : "Pin to top"}
                >
                  <svg
                    className={cn("w-4 h-4", isPinned && "fill-current")}
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={isPinned ? 0 : 1.5}
                      d={
                        isPinned
                          ? "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                          : "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                      }
                    />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-text-muted/40 hover:text-text-muted transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Title input */}
            <div className="px-4 py-3">
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={onTitleBlur}
                placeholder={titlePlaceholder}
                className="w-full text-lg font-mono bg-transparent outline-none text-text-primary placeholder:text-text-muted/30 border-none"
              />
            </div>
          </div>

          {/* Toolbar - controls inline */}
          <div className="border-b border-border-subtle px-4 py-2 bg-bg-elevated/30">
            {toolbarContent}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4">{mainContent}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
