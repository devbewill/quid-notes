"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { TaskDoc, NoteDoc } from "@/lib/types";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { EditPanelLayout } from "@/components/EditPanelLayout";
import { cn } from "@/lib/cn";

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

// ─── Compact status selector - technical design ─────────────────────────────────────
function CompactStatusSelector({
  value,
  onChange,
}: {
  value: "idle" | "active" | "completed";
  onChange: (v: "idle" | "active" | "completed") => void;
}) {
  const options = [
    {
      value: "idle" as const,
      label: "TODO",
      color: "text-semantic-error border-semantic-error/30",
    },
    {
      value: "active" as const,
      label: "ACTIVE",
      color: "text-semantic-warning border-semantic-warning/30",
    },
    {
      value: "completed" as const,
      label: "DONE",
      color: "text-semantic-success border-semantic-success/30",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-mono font-bold text-accent-secondary uppercase tracking-wider mr-2 border-b border-accent-secondary/30 pb-0.5">
        STATUS:
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors",
            value === option.value
              ? `${option.color} bg-current/5`
              : "text-text-muted/40 border-border-subtle hover:text-text-muted/60",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ─── Compact date picker - technical design ──────────────────────────────────────
function CompactDatePicker({
  label,
  value,
  onChange,
  overdue = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  overdue?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "px-2 py-1 text-xs font-mono bg-bg-elevated border outline-none transition-colors",
            overdue
              ? "border-semantic-error/50 text-semantic-error"
              : "border-border-subtle text-text-muted hover:border-border-default",
          )}
        />
        {overdue && (
          <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-semantic-error" />
        )}
      </div>
    </div>
  );
}

// ─── Compact linked notes - technical design ──────────────────────────────────────
function CompactLinkedNotes({
  notes,
  onEditNote,
  onClose,
}: {
  notes: NoteDoc[];
  onEditNote: (note: NoteDoc) => void;
  onClose: () => void;
}) {
  if (notes.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider whitespace-nowrap">
        LINKED
      </span>
      <div className="flex gap-1">
        {notes.slice(0, 3).map((note) => (
          <button
            key={note._id}
            onClick={() => {
              onClose();
              onEditNote(note);
            }}
            className="px-2 py-1 text-[10px] font-mono text-text-muted border border-border-subtle hover:border-accent-secondary/50 hover:text-accent-secondary transition-colors truncate max-w-[120px]"
            title={note.title || "Untitled"}
          >
            {note.title || "Untitled"}
          </button>
        ))}
        {notes.length > 3 && (
          <span className="px-2 py-1 text-[10px] font-mono text-text-muted/40">
            +{notes.length - 3}
          </span>
        )}
      </div>
    </div>
  );
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

  const commit = (
    overrides: { status?: "idle" | "active" | "completed" } = {},
  ) =>
    void update({
      taskId: task._id,
      title,
      text,
      status: overrides.status ?? status,
      startDate: dateToTs(startDate),
      dueDate: dateToTs(dueDate),
    });

  const handleClose = () => {
    commit();
    onClose();
  };

  const handleDelete = async () => {
    await deleteTask({ taskId: task._id });
    onClose();
  };

  const isOverdue =
    !!dueDate &&
    status !== "completed" &&
    new Date(dueDate).getTime() < Date.now();

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
      toolbarContent={
        <div className="flex items-center gap-4 flex-wrap">
          <CompactStatusSelector
            value={status}
            onChange={(s) => {
              setStatus(s);
              commit({ status: s });
            }}
          />

          <div className="w-px h-4 bg-border-subtle" />

          <CompactDatePicker
            label="START"
            value={startDate}
            onChange={setStartDate}
          />

          <CompactDatePicker
            label="DUE"
            value={dueDate}
            onChange={setDueDate}
            overdue={isOverdue}
          />

          <div className="w-px h-4 bg-border-subtle" />

          {linkedNotes && linkedNotes.length > 0 && onEditNote && (
            <CompactLinkedNotes
              notes={linkedNotes as NoteDoc[]}
              onEditNote={onEditNote}
              onClose={onClose}
            />
          )}

          <div className="ml-auto">
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-[10px] font-mono font-bold text-semantic-error border border-semantic-error/30 hover:bg-semantic-error/10 transition-colors uppercase tracking-wider"
            >
              [DELETE]
            </button>
          </div>
        </div>
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
