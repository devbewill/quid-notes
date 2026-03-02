"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { TaskDoc, NoteDoc } from "@/lib/types";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { EditPanelLayout } from "@/components/EditPanelLayout";

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

  const handleDelete = async () => {
    await deleteTask({ taskId: task._id });
    onClose();
  };

  return (
    <EditPanelLayout
      title={title}
      onTitleChange={setTitle}
      onTitleBlur={() => commit()}
      titlePlaceholder="Task title…"
      label="TASK"
      updatedAt={displayTask.updatedAt}
      isPinned={displayTask.isPinned ?? false}
      onTogglePin={() => togglePin({ taskId: task._id })}
      onClose={handleClose}
      sidebarContent={
        <>
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
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
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
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
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
        </>
      }
      mainContent={
        <MarkdownEditor
          value={text}
          onChange={setText}
          onBlur={() => commit()}
        />
      }
    />
  );
}
