"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

interface Props {
  onClose: () => void;
  onSelectNote: () => void;
  onSelectTask: () => void;
}

export function CreateTypeSelector({
  onClose,
  onSelectNote,
  onSelectTask,
}: Props) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
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
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.16 }}
          className="relative w-full max-w-lg bg-bg-surface border border-border-subtle rounded-lg shadow-lg overflow-hidden z-10"
        >
          <div className="p-4">
            <h2 className="text-sm font-medium text-text-primary mb-4">
              Create new...
            </h2>
            <div className="flex gap-3">
              <button
                onClick={onSelectNote}
                className={cn(
                  "flex-1 flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all",
                  "border-border-subtle hover:border-accent-primary hover:bg-accent-primary/5",
                )}
              >
                <svg
                  className="w-8 h-8 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                  />
                </svg>
                <span className="text-sm font-medium text-text-primary">
                  Note
                </span>
              </button>

              <button
                onClick={onSelectTask}
                className={cn(
                  "flex-1 flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all",
                  "border-border-subtle hover:border-accent-secondary hover:bg-accent-secondary/5",
                )}
              >
                <svg
                  className="w-8 h-8 text-accent-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>
                <span className="text-sm font-medium text-text-primary">
                  Task
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
