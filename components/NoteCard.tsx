"use client";

import { motion } from "framer-motion";
import { type Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/cn";
import type { NoteDoc, TaskDoc } from "@/lib/types";

interface NoteCardProps {
  note: NoteDoc;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  globalTagColors?: Record<string, string>;
}

interface TaskCardProps {
  task: TaskDoc;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function NoteCard({ note, selected, onSelect, onEdit, globalTagColors = {} }: NoteCardProps) {
  const statusDot = {
    idle: "bg-semantic-error",
    active: "bg-semantic-warning",
    completed: "bg-semantic-success",
  }[note.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -1 }}
      onClick={() => onEdit()}
      className={cn(
        "relative group flat-card p-4 cursor-pointer",
        selected && "border-accent-primary"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox — Minimal */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            "mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
            selected
              ? "bg-accent-primary border-accent-primary"
              : "bg-bg-secondary border-border-light hover:border-border-medium"
          )}
        >
          {selected && (
            <svg className="w-3 h-3 text-text-inverse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-text-primary truncate">{note.title}</h3>
            {note.isPinned && <span className="text-base">📌</span>}
          </div>

          {/* Preview */}
          {note.text && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">{note.text}</p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status dot */}
            <div className={cn("w-1.5 h-1.5 rounded-full", statusDot)} />

            {/* Tags — Minimal flat badges */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 3).map((tag) => {
                  const color = globalTagColors[tag];
                  return (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md font-medium text-text-inverse"
                      style={{ backgroundColor: color || "var(--tag-blue)" }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Dates */}
            {(note.startDate || note.dueDate) && (
              <div className="flex items-center gap-2 text-[10px] text-text-tertiary ml-auto">
                {note.startDate && <span>📅 {new Date(note.startDate).toLocaleDateString()}</span>}
                {note.dueDate && (
                  <span
                    className={cn(
                      new Date(note.dueDate) < new Date() && "text-semantic-error font-medium"
                    )}
                  >
                    🎯 {new Date(note.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TaskCard({ task, selected, onSelect, onEdit }: TaskCardProps) {
  const statusDot = {
    idle: "bg-semantic-error",
    active: "bg-semantic-warning",
    completed: "bg-semantic-success",
  }[task.status];

  const statusLabel = {
    idle: "To Do",
    active: "Active",
    completed: "Done",
  }[task.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -1 }}
      onClick={() => onEdit()}
      className={cn(
        "relative group flat-card p-4 cursor-pointer",
        selected && "border-accent-primary"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            "mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
            selected
              ? "bg-accent-primary border-accent-primary"
              : "bg-bg-secondary border-border-light hover:border-border-medium"
          )}
        >
          {selected && (
            <svg className="w-3 h-3 text-text-inverse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={cn(
                "text-sm font-medium truncate",
                task.status === "completed" && "line-through text-text-tertiary"
              )}
            >
              {task.title}
            </h3>
            {task.isPinned && <span className="text-base">📌</span>}
          </div>

          {/* Preview */}
          {task.text && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">{task.text}</p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status badge — Minimal */}
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-md font-medium uppercase tracking-wide",
                statusDot === "bg-semantic-error" && "bg-semantic-error/10 text-semantic-error",
                statusDot === "bg-semantic-warning" && "bg-semantic-warning/10 text-semantic-warning",
                statusDot === "bg-semantic-success" && "bg-semantic-success/10 text-semantic-success"
              )}
            >
              {statusLabel}
            </span>

            {/* Linked notes */}
            {task.linkedNoteIds && task.linkedNoteIds.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-text-tertiary">
                <span>📎</span>
                <span>{task.linkedNoteIds.length}</span>
              </div>
            )}

            {/* Dates */}
            {(task.startDate || task.dueDate) && (
              <div className="flex items-center gap-2 text-[10px] text-text-tertiary ml-auto">
                {task.startDate && <span>📅 {new Date(task.startDate).toLocaleDateString()}</span>}
                {task.dueDate && (
                  <span
                    className={cn(
                      new Date(task.dueDate) < new Date() && "text-semantic-error font-medium"
                    )}
                  >
                    🎯 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
