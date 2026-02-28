"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ActivateBarProps {
  noteCount: number;
  taskCount: number;
  onClear: () => void;
  onActivate: () => void;
  onTrash: () => void;
  onStatusChange: (status: "idle" | "active" | "completed") => void;
}

export function ActivateBar({ noteCount, taskCount, onClear, onActivate, onTrash, onStatusChange }: ActivateBarProps) {
  const count = noteCount + taskCount;
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-8 left-[calc(50%+112px)] -translate-x-1/2 z-50
                 flex items-center gap-4
                 bg-surface/90 backdrop-blur-xl border border-border/60 rounded-full
                 px-4 py-3 shadow-2xl ring-1 ring-white/5 shadow-black/50"
    >
      <button
        onClick={onClear}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-bg border border-border text-muted hover:text-text hover:bg-surface transition-colors flex-shrink-0"
        title="Deselect all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="flex items-center gap-1.5 px-2">
        <span className="text-sm font-semibold text-text shadow-sm bg-accent/20 text-accent px-2 py-0.5 rounded-md tabular-nums">{count}</span>
        <span className="text-[11px] text-muted font-medium tracking-wide uppercase">selected</span>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <div className="flex bg-bg border border-border rounded-lg p-0.5" title="Change status">
          <button onClick={() => onStatusChange("idle")} className="px-2.5 py-1 text-[11px] rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/20 font-medium transition-colors">To Do</button>
          <button onClick={() => onStatusChange("active")} className="px-2.5 py-1 text-[11px] rounded text-sky-400 hover:text-sky-200 hover:bg-sky-500/20 font-medium transition-colors">In Progress</button>
          <button onClick={() => onStatusChange("completed")} className="px-2.5 py-1 text-[11px] rounded text-emerald-400 hover:text-emerald-200 hover:bg-emerald-500/20 font-medium transition-colors">Completed</button>
        </div>

        {noteCount > 0 && taskCount === 0 && (
          <button
            onClick={onActivate}
            className="flex items-center gap-1.5 text-xs font-semibold text-bg bg-violet-400 border border-violet-400/50 rounded-lg px-3 py-1.5 hover:bg-violet-300 transition-colors shadow-sm shadow-violet-500/20"
            title="Activate (convert to task if note)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
            Activate
          </button>
        )}

        <button
          onClick={onTrash}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 bg-bg border border-border rounded-lg px-3 py-1.5 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
          title="Move to trash"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
