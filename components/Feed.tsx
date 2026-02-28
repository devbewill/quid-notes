"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/cn";
import type { NoteDoc, TaskDoc } from "@/lib/types";

interface FeedProps {
  selectedNoteIds: Set<Id<"notes">>;
  onSelect: (id: Id<"notes">) => void;
  onEdit: (note: NoteDoc) => void;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "idle" | "active" | "completed" }) {
  const map = {
    idle: "bg-zinc-500/20 text-zinc-400",
    active: "bg-blue-500/20 text-blue-400",
    completed: "bg-emerald-500/20 text-emerald-400",
  } as const;
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
        map[status]
      )}
    >
      {status}
    </span>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: "NOTE" | "TASK" }) {
  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium",
        type === "NOTE"
          ? "bg-slate-500/20 text-slate-400"
          : "bg-violet-500/20 text-violet-400"
      )}
    >
      {type}
    </span>
  );
}

// ─── Date cell ────────────────────────────────────────────────────────────────
function DateCell({ ts }: { ts?: number }) {
  if (!ts) return <span className="text-muted text-xs">—</span>;
  return (
    <span className="text-xs text-muted">
      {new Date(ts).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
      })}
    </span>
  );
}

// ─── Child notes (Level 2) ────────────────────────────────────────────────────
function ChildNoteRows({
  taskId,
  onEdit,
}: {
  taskId: Id<"tasks">;
  onEdit: (note: NoteDoc) => void;
}) {
  const notes = useQuery(api.notes.listByTask, { taskId });

  if (!notes || notes.length === 0) return null;

  return (
    <>
      {(notes as NoteDoc[]).map((note) => (
        <NoteRow
          key={note._id}
          note={note}
          isChild
          selected={false}
          onSelect={() => {}}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}

// ─── Note row ─────────────────────────────────────────────────────────────────
function NoteRow({
  note,
  isChild,
  selected,
  onSelect,
  onEdit,
}: {
  note: NoteDoc;
  isChild?: boolean;
  selected: boolean;
  onSelect: (id: Id<"notes">) => void;
  onEdit: (note: NoteDoc) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (!isChild) onSelect(note._id);
    } else {
      onEdit(note);
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isChild) return;
    e.stopPropagation();
    onSelect(note._id);
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={cn(
        "group border-b border-border cursor-pointer transition-colors",
        selected ? "bg-surface/80" : "hover:bg-surface/40",
        isChild && "opacity-70"
      )}
    >
      {/* Checkbox / indent */}
      <td className="w-10 pl-3">
        {isChild ? (
          <span className="inline-block w-4 border-l border-border ml-4" />
        ) : (
          <input
            type="checkbox"
            checked={selected}
            onChange={handleCheckbox}
            className={cn(
              "rounded border-border bg-transparent accent-accent transition-opacity",
              hovered || selected ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </td>

      {/* Title */}
      <td className={cn("py-3 pr-4 text-sm", isChild && "pl-8")}>
        {note.title}
      </td>

      {/* Type */}
      <td className="pr-4">
        <TypeBadge type="NOTE" />
      </td>

      {/* Status */}
      <td className="pr-4">
        <StatusBadge status={note.status} />
      </td>

      {/* Start */}
      <td className="pr-4">
        <DateCell ts={note.startDate} />
      </td>

      {/* Due */}
      <td className="pr-4">
        <DateCell ts={note.dueDate} />
      </td>
    </motion.tr>
  );
}

// ─── Task row (Level 1) ───────────────────────────────────────────────────────
function TaskRow({
  task,
  onEdit,
}: {
  task: TaskDoc;
  onEdit: (note: NoteDoc) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setExpanded((v) => !v)}
        className="border-b border-border cursor-pointer hover:bg-surface/40 transition-colors"
      >
        {/* No checkbox for tasks */}
        <td className="w-10 pl-3">
          <span
            className={cn(
              "inline-block text-muted text-xs transition-transform",
              expanded && "rotate-90"
            )}
          >
            ▶
          </span>
        </td>

        {/* Title */}
        <td className="py-3 pr-4 text-sm font-medium">{task.title}</td>

        {/* Type */}
        <td className="pr-4">
          <TypeBadge type="TASK" />
        </td>

        {/* Status */}
        <td className="pr-4">
          <StatusBadge status={task.status} />
        </td>

        {/* Start */}
        <td className="pr-4">
          <DateCell ts={task.startDate} />
        </td>

        {/* Due */}
        <td className="pr-4">
          <DateCell ts={task.dueDate} />
        </td>
      </motion.tr>

      {/* Level 2 child notes */}
      <AnimatePresence>
        {expanded && (
          <ChildNoteRows taskId={task._id} onEdit={onEdit} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export function Feed({ selectedNoteIds, onSelect, onEdit }: FeedProps) {
  const { t } = useLocale();
  const topNotes = useQuery(api.notes.listTopLevel);
  const tasks = useQuery(api.tasks.listAll);

  if (!topNotes || !tasks) {
    return (
      <div className="py-12 text-center text-muted text-sm">Loading…</div>
    );
  }

  const hasItems = topNotes.length > 0 || tasks.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-text">
        <thead>
          <tr className="border-b border-border">
            <th className="w-10" />
            <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">
              {t("feed_col_title")}
            </th>
            <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">
              {t("feed_col_type")}
            </th>
            <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">
              {t("feed_col_status")}
            </th>
            <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">
              {t("feed_col_start")}
            </th>
            <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">
              {t("feed_col_due")}
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {/* Top-level notes (Level 1) */}
            {(topNotes as NoteDoc[]).map((note) => (
              <NoteRow
                key={note._id}
                note={note}
                selected={selectedNoteIds.has(note._id as Id<"notes">)}
                onSelect={onSelect}
                onEdit={onEdit}
              />
            ))}

            {/* Tasks (Level 1) with expandable Level 2 children */}
            {(tasks as TaskDoc[]).map((task) => (
              <TaskRow key={task._id} task={task} onEdit={onEdit} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {!hasItems && (
        <p className="py-12 text-center text-muted text-sm">
          {t("feed_empty")}
        </p>
      )}
    </div>
  );
}
