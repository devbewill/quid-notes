"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc } from "@/lib/types";

interface Props {
  note: NoteDoc;
  onClose: () => void;
}

function tsToDate(ts?: number) {
  return ts ? new Date(ts).toISOString().slice(0, 10) : "";
}

function dateToTs(val: string): number | undefined {
  return val ? new Date(val).getTime() : undefined;
}

export function NoteEditPanel({ note, onClose }: Props) {
  const update = useMutation(api.notes.update);
  const remove = useMutation(api.notes.remove);

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [status, setStatus] = useState(note.status);
  const [startDate, setStartDate] = useState(tsToDate(note.startDate));
  const [dueDate, setDueDate] = useState(tsToDate(note.dueDate));
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setTitle(note.title);
    setText(note.text);
    setStatus(note.status);
    setStartDate(tsToDate(note.startDate));
    setDueDate(tsToDate(note.dueDate));
    setTags(note.tags ?? []);
    setTagInput("");
  }, [note._id]);

  const commit = (overrides: { status?: "idle" | "active" | "completed"; tags?: string[] } = {}) =>
    void update({
      noteId: note._id,
      title,
      text,
      status: overrides.status ?? status,
      startDate: dateToTs(startDate),
      dueDate: dateToTs(dueDate),
      tags: overrides.tags ?? tags,
    });

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || tags.includes(t)) { setTagInput(""); return; }
    const next = [...tags, t];
    setTags(next);
    setTagInput("");
    commit({ tags: next });
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    commit({ tags: next });
  };

  const handleClose = () => { commit(); onClose(); };

  // Keep a stable ref so the ESC listener always calls the latest handleClose
  const handleCloseRef = useRef(handleClose);
  useEffect(() => { handleCloseRef.current = handleClose; });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleCloseRef.current(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleDelete = async () => {
    await remove({ noteId: note._id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-4xl min-w-[55%] h-[72vh] bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => commit()}
            placeholder="Titolo nota…"
            className="flex-1 text-lg font-semibold bg-transparent outline-none text-text placeholder:text-muted border-none"
          />
          <button
            onClick={handleClose}
            className="text-muted hover:text-text text-2xl leading-none transition-colors shrink-0"
          >
            ×
          </button>
        </div>

        {/* Body — two columns */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: meta */}
          <div className="w-56 shrink-0 border-r border-border p-5 flex flex-col gap-5 overflow-y-auto">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted uppercase tracking-widest">Stato</label>
              <select
                value={status}
                onChange={(e) => {
                  const s = e.target.value as "idle" | "active" | "completed";
                  setStatus(s);
                  commit({ status: s });
                }}
                className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent transition-colors"
              >
                <option value="idle">To Do</option>
                <option value="active">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Start date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted uppercase tracking-widest">Inizio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={() => commit()}
                className="bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted uppercase tracking-widest">Scadenza</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={() => commit()}
                className="bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted uppercase tracking-widest">Tag</label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/25"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white leading-none">×</button>
                  </span>
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                onBlur={addTag}
                placeholder="Aggiungi tag…"
                className="bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>

            {/* Delete */}
            <div className="mt-auto pt-4 border-t border-border">
              <button
                onClick={handleDelete}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Elimina nota
              </button>
            </div>
          </div>

          {/* Right: text body */}
          <div className="flex-1 p-6 overflow-y-auto">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => commit()}
              placeholder="Scrivi qui il contenuto della nota…"
              className="w-full h-full min-h-full bg-transparent text-sm text-text outline-none resize-none placeholder:text-muted leading-relaxed"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
