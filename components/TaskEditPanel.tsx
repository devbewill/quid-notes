"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { TaskDoc } from "@/lib/types";
import { cn } from "@/lib/cn";

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
  const togglePin = useMutation(api.tasks.togglePin);
  const liveTask = useQuery(api.tasks.get, { taskId: task._id });
  const displayTask = liveTask ?? task;

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
        <div className="flex items-start gap-3 px-6 py-4 border-b border-border">
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/25 text-violet-300 ring-1 ring-violet-400/30 font-medium shrink-0 mt-1">
            TASK
          </span>
          <div className="flex-1 min-w-0">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => commit()}
              placeholder="Add tag..."
              className="w-full text-lg font-semibold bg-transparent outline-none text-text placeholder:text-muted border-none"
            />
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted mb-4 px-1">Details</h4>
            <p className="text-[10px] text-muted mt-0.5 tabular-nums">
              Modified {new Date(displayTask.updatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <button
              onClick={() => togglePin({ taskId: task._id })}
              className={cn("p-1.5 rounded-md transition-colors", displayTask.isPinned ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" : "text-muted hover:text-text hover:bg-surface/60")}
              title={displayTask.isPinned ? "Remove from pinned" : "Pin to top"}
            >
              <svg className={cn("w-4 h-4", displayTask.isPinned && "fill-amber-500")} viewBox="0 0 20 20" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={displayTask.isPinned ? 0 : 1.5} d={displayTask.isPinned ? "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" : "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"} />
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="p-1 text-muted hover:text-text text-2xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body — two columns */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: meta */}
          <div className="w-56 shrink-0 border-r border-border p-5 flex flex-col gap-5 overflow-y-auto">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Status
              </label>
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
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                Start Date
              </label>
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
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Due Date
              </label>
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
                <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                  Note collegate ({linkedNotes.length})
                </label>
                <div className="flex flex-col gap-1.5">
                  {linkedNotes.map((note) => (
                    <div
                      key={note._id}
                      className="text-xs px-2 py-1.5 rounded-lg bg-bg border border-border text-text"
                    >
                      <span className="text-xs text-text font-medium min-w-[70px]">Start</span>
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
                Delete task
              </button>
            </div>
          </div>

          {/* Right: description */}
          <div className="flex-1 p-6 overflow-y-auto">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => commit()}
              placeholder="Write the task description here…"
              className="w-full h-full min-h-full bg-transparent text-sm text-text outline-none resize-none placeholder:text-muted leading-relaxed"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
