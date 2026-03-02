"use client";

import { motion } from "framer-motion";

interface ActivateBarProps {
  noteCount: number;
  taskCount: number;
  onClear: () => void;
  onActivate: () => void;
  onTrash: () => void;
  onStatusChange: (status: "idle" | "active" | "completed") => void;
}

export function ActivateBar({
  noteCount,
  taskCount,
  onClear,
  onActivate,
  onTrash,
  onStatusChange,
}: ActivateBarProps) {
  const count = noteCount + taskCount;
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-3
                 bg-bg-surface border border-border-default rounded-lg
                 px-4 py-2.5 shadow-lg"
    >
      {/* Clear button */}
      <button
        onClick={onClear}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-elevated border border-border-subtle text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
        title="Deselect all"
      >
        ×
      </button>

      {/* Count */}
      <div className="flex items-center gap-2 px-2">
        <span className="text-sm font-semibold text-text-primary tabular-nums">{count}</span>
        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wide">
          selected
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border-subtle" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Status buttons — Clean segmented control */}
        <div className="flex bg-bg-elevated border border-border-subtle rounded-md p-0.5">
          <button
            onClick={() => onStatusChange("idle")}
            className="px-2.5 py-1 text-[11px] rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover font-medium transition-colors"
          >
            To Do
          </button>
          <button
            onClick={() => onStatusChange("active")}
            className="px-2.5 py-1 text-[11px] rounded-md text-semantic-warning hover:text-semantic-warning/80 hover:bg-bg-hover font-medium transition-colors"
          >
            Active
          </button>
          <button
            onClick={() => onStatusChange("completed")}
            className="px-2.5 py-1 text-[11px] rounded-md text-semantic-success hover:text-semantic-success/80 hover:bg-bg-hover font-medium transition-colors"
          >
            Done
          </button>
        </div>

        {/* Activate button */}
        {noteCount > 0 && taskCount === 0 && (
          <button
            onClick={onActivate}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-inverse bg-accent-primary border border-accent-primary rounded-md px-3 py-1.5 hover:bg-accent-secondary transition-colors shadow-sm"
            title="Activate (convert to task if note)"
          >
            <span>⚡</span>
            Activate
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={onTrash}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-semantic-error bg-bg-elevated border border-border-subtle rounded-md px-3 py-1.5 hover:bg-semantic-error hover:text-text-inverse transition-colors"
          title="Move to trash"
        >
          <span>🗑️</span>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </motion.div>
  );
}
