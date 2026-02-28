"use client";

import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";
import { useMemo, useState } from "react";
import type { NoteDoc, TaskDoc } from "@/lib/types";

export function TrashView() {
  const trashedNotes = useQuery(api.notes.listTrashed);
  const trashedTasks = useQuery(api.tasks.listTrashed);

  const restoreNote = useMutation(api.notes.restore);
  const removeNote = useMutation(api.notes.remove);

  const restoreTask = useMutation(api.tasks.restore);
  // Optional: add a hard delete for tasks. tasks.deleteAndRestoreNotes clears children.
  // Wait, if we want to hard-delete a task, we need a specific mutation or just delete it.
  // Let's create a hard delete if it doesn't exist, but tasks already has deleteAndRestoreNotes.
  // We'll reuse deleteAndRestoreNotes which will delete the task and restore its notes to top level.
  // Wait, if the notes are also trashed, they stay trashed but become top level.
  const removeTask = useMutation(api.tasks.deleteAndRestoreNotes);

  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    if (!trashedNotes || !trashedTasks) return null;
    const notes = trashedNotes.map((n) => ({ ...n, _kind: "note" as const }));
    const tasks = trashedTasks.map((t) => ({ ...t, _kind: "task" as const }));
    return [...notes, ...tasks].sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
  }, [trashedNotes, trashedTasks]);

  const handleRestore = async (item: { _id: string; _kind: "note" | "task" }) => {
    setLoadingIds((prev) => new Set(prev).add(item._id));
    try {
      if (item._kind === "note") {
        await restoreNote({ noteId: item._id as any });
      } else {
        await restoreTask({ taskId: item._id as any });
      }
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
    }
  };

  const handleDelete = async (item: { _id: string; _kind: "note" | "task" }) => {
    if (!confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) return;
    setLoadingIds((prev) => new Set(prev).add(item._id));
    try {
      if (item._kind === "note") {
        await removeNote({ noteId: item._id as any });
      } else {
        await removeTask({ taskId: item._id as any });
      }
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
    }
  };

  if (!items) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <div className="h-8 w-48 bg-surface/50 rounded-lg animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 py-2 border-b border-border">
          <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          <h2 className="text-xl font-bold text-text">Trash</h2>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text">The trash is empty</p>
            <p className="text-xs text-muted mt-1">Deleted items will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 group hover:border-slate-500/40 transition-colors overflow-hidden"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[10px] font-bold tracking-widest uppercase",
                        item._kind === "note" ? "text-slate-400" : "text-violet-400"
                      )}>
                        {item._kind}
                      </span>
                      <span className="text-[10px] text-muted">
                        Deleted on {item.deletedAt && new Date(item.deletedAt).toLocaleDateString("en-US", { day: "2-digit", month: "long" })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-text truncate group-hover:text-white transition-colors">{item.title}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRestore(item)}
                      disabled={loadingIds.has(item._id)}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={loadingIds.has(item._id)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
