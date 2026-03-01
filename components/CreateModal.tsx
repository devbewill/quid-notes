"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";

interface Props {
  onClose: () => void;
  defaultType?: "note" | "task";
}

export function CreateModal({ onClose, defaultType = "note" }: Props) {
  const createNote = useMutation(api.notes.create);
  const createTask = useMutation(api.tasks.createDirect);

  const [type, setType] = useState<"note" | "task">(defaultType);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        text: text.trim(),
        startDate: startDate ? new Date(startDate).getTime() : undefined,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      };
      if (type === "note") await createNote(payload);
      else await createTask(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.16 }}
        className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-10"
      >
        {/* Type tabs */}
        <div className="flex gap-1 px-3 pt-3 pb-0">
          {(["note", "task"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                type === t
                  ? t === "note"
                    ? "bg-slate-500/20 text-slate-300"
                    : "bg-violet-500/20 text-violet-300"
                  : "text-muted hover:text-text"
              )}
            >
              {t === "note" ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
              )}
              {t === "note" ? "Note" : "Task"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "note" ? "Note title…" : "Task title…"}
            autoFocus
            required
            className="text-sm font-medium bg-transparent border-b border-border focus:border-accent outline-none pb-2 text-text placeholder:text-muted transition-colors"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Description (optional)…"
            rows={3}
            className="text-sm bg-transparent text-text placeholder:text-muted outline-none resize-none"
          />
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted">Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-bg border border-border rounded px-2 py-1 text-xs text-text outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted">Due</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-bg border border-border rounded px-2 py-1 text-xs text-text outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-1.5 rounded-full text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className={cn(
                "text-xs px-4 py-1.5 rounded-full font-medium disabled:opacity-40 transition-all",
                type === "note"
                  ? "bg-slate-500/30 text-slate-200 hover:bg-slate-500/50"
                  : "bg-brand text-brand-text hover:opacity-90"
              )}
            >
              {loading ? "…" : type === "note" ? "Create note" : "Create task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
