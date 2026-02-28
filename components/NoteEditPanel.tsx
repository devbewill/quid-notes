"use client";

import { useState, useEffect } from "react";
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

  // Re-sync when a different note is selected
  useEffect(() => {
    setTitle(note.title);
    setText(note.text);
    setStatus(note.status);
    setStartDate(tsToDate(note.startDate));
    setDueDate(tsToDate(note.dueDate));
  }, [note._id]);

  const commit = (statusOverride?: "idle" | "active" | "completed") =>
    void update({
      noteId: note._id,
      title,
      text,
      status: statusOverride ?? status,
      startDate: dateToTs(startDate),
      dueDate: dateToTs(dueDate),
    });

  const handleDelete = async () => {
    await remove({ noteId: note._id });
    onClose();
  };

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="w-72 bg-surface border-l border-border flex flex-col shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs text-muted uppercase tracking-widest">Nota</span>
        <button
          onClick={onClose}
          className="text-muted hover:text-text text-xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => commit()}
          placeholder="Titolo"
          className="text-sm font-medium bg-transparent border-b border-border focus:border-accent outline-none pb-1 text-text w-full transition-colors"
        />

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted uppercase tracking-widest">Stato</label>
          <select
            value={status}
            onChange={(e) => {
              const s = e.target.value as "idle" | "active" | "completed";
              setStatus(s);
              commit(s);
            }}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent transition-colors"
          >
            <option value="idle">Idle</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-muted uppercase tracking-widest">Note</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => commit()}
            rows={6}
            placeholder="Scrivi qui…"
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent resize-none transition-colors"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={handleDelete}
          className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
        >
          Elimina nota
        </button>
      </div>
    </motion.aside>
  );
}
