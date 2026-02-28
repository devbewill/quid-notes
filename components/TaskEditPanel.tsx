"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { TaskDoc } from "@/lib/types";

interface Props {
  task: TaskDoc;
  onClose: () => void;
}

function tsToDate(ts?: number) {
  return ts ? new Date(ts).toISOString().slice(0, 10) : "";
}

function dateToTs(val: string): number | undefined {
  return val ? new Date(val).getTime() : undefined;
}

export function TaskEditPanel({ task, onClose }: Props) {
  const update = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.deleteAndRestoreNotes);

  const linkedNotes = useQuery(api.notes.listByTask, { taskId: task._id });

  const [title, setTitle] = useState(task.title);
  const [text, setText] = useState(task.text);
  const [status, setStatus] = useState(task.status);
  const [startDate, setStartDate] = useState(tsToDate(task.startDate));
  const [dueDate, setDueDate] = useState(tsToDate(task.dueDate));

  useEffect(() => {
    setTitle(task.title);
    setText(task.text);
    setStatus(task.status);
    setStartDate(tsToDate(task.startDate));
    setDueDate(tsToDate(task.dueDate));
  }, [task._id]);

  const commit = (overrides: { status?: "idle" | "active" | "completed" } = {}) =>
    void update({
      taskId: task._id,
      title,
      text,
      status: overrides.status ?? status,
      startDate: dateToTs(startDate),
      dueDate: dateToTs(dueDate),
    });

  const handleClose = () => { commit(); onClose(); };

  const handleCloseRef = useRef(handleClose);
  useEffect(() => { handleCloseRef.current = handleClose; });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleCloseRef.current(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleDelete = async () => {
    await deleteTask({ taskId: task._id });
    onClose();
  };

  const statusLabel = { idle: "To Do", active: "In Progress", completed: "Completed" };

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
          {/* Task badge */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/25 text-violet-300 ring-1 ring-violet-400/30 font-medium shrink-0">
            TASK
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => commit()}
            placeholder="Titolo task…"
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

            {/* Linked notes */}
            {linkedNotes && linkedNotes.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-muted uppercase tracking-widest">
                  Note collegate ({linkedNotes.length})
                </label>
                <div className="flex flex-col gap-1.5">
                  {linkedNotes.map((note) => (
                    <div
                      key={note._id}
                      className="text-xs px-2 py-1.5 rounded-lg bg-bg border border-border text-text"
                    >
                      <p className="font-medium truncate">{note.title}</p>
                      <span
                        className={`mt-0.5 inline-block text-[10px] px-1.5 py-0.5 rounded-full ${
                          note.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : note.status === "active"
                            ? "bg-sky-500/20 text-sky-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {statusLabel[note.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete */}
            <div className="mt-auto pt-4 border-t border-border">
              <button
                onClick={handleDelete}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Elimina task
              </button>
            </div>
          </div>

          {/* Right: description */}
          <div className="flex-1 p-6 overflow-y-auto">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => commit()}
              placeholder="Scrivi qui la descrizione del task…"
              className="w-full h-full min-h-full bg-transparent text-sm text-text outline-none resize-none placeholder:text-muted leading-relaxed"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
