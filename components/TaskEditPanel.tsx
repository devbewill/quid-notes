"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { TaskDoc, NoteDoc } from "@/lib/types";
import { cn } from "@/lib/cn";
import { MarkdownEditor } from "@/components/MarkdownEditor";

interface Props {
  task: TaskDoc;
  onClose: () => void;
  onEditNote?: (note: NoteDoc) => void;
}

function tsToDate(ts?: number) {
  return ts ? new Date(ts).toISOString().slice(0, 10) : "";
}

function dateToTs(val: string): number | undefined {
  return val ? new Date(val).getTime() : undefined;
}

export function TaskEditPanel({ task, onClose, onEditNote }: Props) {
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

  // Keep a stable ref so that ESC listener always calls latest handleClose
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
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/60"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="relative z-10 w-3/5 max-w-5xl min-w-[60%] h-[72vh] bg-bg-surface border border-border-subtle rounded-lg shadow-lg flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start gap-3 px-6 py-4 border-b border-border-subtle">
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-lighter text-accent-primary ring-1 ring-accent-primary/30 font-medium shrink-0 mt-1">
              TASK
            </span>
            <div className="flex-1 min-w-0">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => commit()}
                placeholder="Task title…"
                className="w-full text-lg font-semibold bg-transparent outline-none text-text-primary placeholder:text-text-muted border-none"
              />
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-text-muted mb-4 px-1">Details</h4>
              <p className="text-[10px] text-text-muted mt-0.5 tabular-nums">
                Modified {new Date(displayTask.updatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <button
                onClick={() => togglePin({ taskId: task._id })}
                className={cn("p-1.5 rounded-md transition-colors", displayTask.isPinned ? "text-semantic-warning bg-accent-lighter hover:bg-accent-light" : "text-text-muted hover:text-text-primary hover:bg-bg-hover")}
                title={displayTask.isPinned ? "Remove from pinned" : "Pin to top"}
              >
                <svg className={cn("w-4 h-4", displayTask.isPinned && "fill-semantic-warning")} viewBox="0 0 20 20" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={displayTask.isPinned ? 0 : 1.5} d={displayTask.isPinned ? "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" : "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"} />
                </svg>
              </button>
              <button
                onClick={handleClose}
                className="p-1 text-text-muted hover:text-text-primary text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Body — two columns */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left: meta */}
            <div className="w-56 shrink-0 border-r border-border-subtle p-5 flex flex-col gap-5 overflow-y-auto">
              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
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
                  className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
                >
                  <option value="idle">To Do</option>
                  <option value="active">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Start date */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.2.0 0 0 21 18.75m-18 0v-7.5A2.25 2.2.0 0 0 5.25 9h13.5A2.25 2.2 0 0 0 21 11.25v7.5" /></svg>
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
                />
              </div>

              {/* Due date */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 0 21 11.25v7.5" /></svg>
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
                />
              </div>

              {/* Linked Notes */}
              {linkedNotes && linkedNotes.length > 0 && onEditNote && (
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-border-subtle">
                  <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    Linked Notes
                  </label>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {linkedNotes.map((note) => (
                      <button
                        key={note._id}
                        onClick={() => {
                          onClose();
                          onEditNote(note as NoteDoc);
                        }}
                        className="text-left text-sm px-3 py-2 rounded-md hover:bg-bg-hover transition-colors text-text-primary border border-transparent hover:border-border-subtle truncate"
                        title={note.title || "Untitled"}
                      >
                        {note.title || "Untitled"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delete */}
              <div className="mt-auto pt-4 border-t border-border-subtle">
                <button
                  onClick={handleDelete}
                  className="w-full text-xs text-semantic-error hover:bg-accent-lighter py-2 rounded-lg transition-colors"
                >
                  Delete task
                </button>
              </div>
            </div>

            {/* Right: content */}
            <div className="flex-1 overflow-y-auto p-6">
              <MarkdownEditor
                value={text}
                onChange={setText}
                onBlur={() => commit()}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
