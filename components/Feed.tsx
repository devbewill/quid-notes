"use client";

import { useState, useMemo } from "react";
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
  onEditTask: (task: TaskDoc) => void;
  search: string;
}

type SortCol = "title" | "type" | "status" | "startDate" | "dueDate" | "tags";
type SortDir = "asc" | "desc";
type SortState = { col: SortCol; dir: SortDir } | null;

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "idle" | "active" | "completed" }) {
  const map = {
    idle: "bg-rose-500/25 text-rose-300 ring-1 ring-rose-400/30",
    active: "bg-sky-500/25 text-sky-300 ring-1 ring-sky-400/30",
    completed: "bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/30",
  } as const;
  const label = { idle: "To Do", active: "In Progress", completed: "Completed" };
  return (
    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap", map[status])}>
      {label[status]}
    </span>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: "NOTE" | "TASK" }) {
  return (
    <span
      className={cn(
        "text-xs px-2.5 py-0.5 rounded-full font-medium",
        type === "NOTE"
          ? "bg-slate-400/20 text-slate-300 ring-1 ring-slate-400/25"
          : "bg-violet-500/25 text-violet-300 ring-1 ring-violet-400/30"
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
    <span className="text-xs text-muted tabular-nums">
      {new Date(ts).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
    </span>
  );
}

// ─── Tags cell ────────────────────────────────────────────────────────────────
function TagsCell({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return <span className="text-muted text-xs">—</span>;
  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((t) => (
        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/25">
          {t}
        </span>
      ))}
    </div>
  );
}

// ─── Sort header ──────────────────────────────────────────────────────────────
function SortTh({
  col,
  sort,
  onSort,
  className,
  children,
}: {
  col: SortCol;
  sort: SortState;
  onSort: (col: SortCol) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const active = sort?.col === col;
  const dir = active ? sort!.dir : null;
  return (
    <th
      onClick={() => onSort(col)}
      className={cn(
        "text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4 cursor-pointer select-none whitespace-nowrap",
        "hover:text-text transition-colors group",
        className
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span className={cn("text-[10px]", active ? "text-accent" : "text-border group-hover:text-muted")}>
          {dir === "asc" ? "↑" : dir === "desc" ? "↓" : "↕"}
        </span>
      </span>
    </th>
  );
}

// ─── Child notes (Level 2) ────────────────────────────────────────────────────
function ChildNoteRows({ taskId, onEdit }: { taskId: Id<"tasks">; onEdit: (note: NoteDoc) => void }) {
  const notes = useQuery(api.notes.listByTask, { taskId });
  if (!notes || notes.length === 0) return null;
  return (
    <>
      {(notes as NoteDoc[]).map((note) => (
        <NoteRow key={note._id} note={note} isChild selected={false} onSelect={() => {}} onEdit={onEdit} />
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

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group border-b border-border transition-colors",
        selected ? "bg-surface/80" : "hover:bg-surface/40",
        isChild && "opacity-70"
      )}
    >
      <td className="w-10 pl-3">
        {isChild ? (
          <span className="inline-block w-4 border-l border-border ml-4" />
        ) : (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => { e.stopPropagation(); onSelect(note._id); }}
            className={cn(
              "rounded border-border bg-transparent accent-accent transition-opacity",
              hovered || selected ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </td>
      <td
        className={cn("py-3 pr-4 text-sm cursor-pointer hover:text-accent transition-colors", isChild && "pl-8")}
        onClick={() => onEdit(note)}
      >
        {note.title}
      </td>
      <td className="pr-4"><TypeBadge type="NOTE" /></td>
      <td className="pr-4"><StatusBadge status={note.status} /></td>
      <td className="pr-4"><DateCell ts={note.startDate} /></td>
      <td className="pr-4"><DateCell ts={note.dueDate} /></td>
      <td className="pr-4"><TagsCell tags={note.tags} /></td>
    </motion.tr>
  );
}

// ─── Task row (Level 1) ───────────────────────────────────────────────────────
function TaskRow({ task, onEdit, onEditTask }: { task: TaskDoc; onEdit: (note: NoteDoc) => void; onEditTask: (task: TaskDoc) => void }) {
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
        <td className="w-10 pl-3">
          <span className={cn("inline-block text-muted text-xs transition-transform", expanded && "rotate-90")}>
            ▶
          </span>
        </td>
        <td
          className="py-3 pr-4 text-sm font-medium cursor-pointer hover:text-accent transition-colors"
          onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
        >
          {task.title}
        </td>
        <td className="pr-4"><TypeBadge type="TASK" /></td>
        <td className="pr-4"><StatusBadge status={task.status} /></td>
        <td className="pr-4"><DateCell ts={task.startDate} /></td>
        <td className="pr-4"><DateCell ts={task.dueDate} /></td>
        <td className="pr-4"><TagsCell tags={undefined} /></td>
      </motion.tr>
      <AnimatePresence>
        {expanded && <ChildNoteRows taskId={task._id} onEdit={onEdit} />}
      </AnimatePresence>
    </>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export function Feed({ selectedNoteIds, onSelect, onEdit, onEditTask, search }: FeedProps) {
  const { t } = useLocale();
  const topNotes = useQuery(api.notes.listTopLevel);
  const tasks = useQuery(api.tasks.listAll);

  const [sort, setSort] = useState<SortState>(null);

  const handleSort = (col: SortCol) => {
    setSort((prev) => {
      if (prev?.col !== col) return { col, dir: "asc" };
      if (prev.dir === "asc") return { col, dir: "desc" };
      return null;
    });
  };

  const q = search.toLowerCase().trim();

  const { sortedNotes, sortedTasks } = useMemo(() => {
    if (!topNotes || !tasks) return { sortedNotes: [], sortedTasks: [] };

    const filtered = <T extends { title: string; status: string; tags?: string[] }>(
      items: T[]
    ): T[] =>
      !q
        ? items
        : items.filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              ("text" in i && typeof (i as { text?: string }).text === "string" &&
                ((i as { text: string }).text.toLowerCase().includes(q))) ||
              i.tags?.some((tag) => tag.toLowerCase().includes(q))
          );

    const applySort = <T extends { title: string; status: string; startDate?: number; dueDate?: number; tags?: string[] }>(
      items: T[]
    ): T[] => {
      if (!sort) return items;
      return [...items].sort((a, b) => {
        let cmp = 0;
        switch (sort.col) {
          case "title":     cmp = a.title.localeCompare(b.title); break;
          case "status":    cmp = a.status.localeCompare(b.status); break;
          case "startDate": cmp = (a.startDate ?? 0) - (b.startDate ?? 0); break;
          case "dueDate":   cmp = (a.dueDate ?? 0) - (b.dueDate ?? 0); break;
          case "tags":      cmp = (a.tags?.[0] ?? "").localeCompare(b.tags?.[0] ?? ""); break;
        }
        return sort.dir === "asc" ? cmp : -cmp;
      });
    };

    return {
      sortedNotes: applySort(filtered(topNotes as NoteDoc[])),
      sortedTasks: applySort(filtered(tasks as TaskDoc[])),
    };
  }, [topNotes, tasks, q, sort]);

  if (!topNotes || !tasks) {
    return <div className="py-12 text-center text-muted text-sm">Loading…</div>;
  }

  const hasItems = sortedNotes.length > 0 || sortedTasks.length > 0;

  return (
    <div className="flex flex-col gap-2">
      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-text">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10" />
              <SortTh col="title" sort={sort} onSort={handleSort}>{t("feed_col_title")}</SortTh>
              <SortTh col="type" sort={sort} onSort={handleSort}>{t("feed_col_type")}</SortTh>
              <SortTh col="status" sort={sort} onSort={handleSort}>{t("feed_col_status")}</SortTh>
              <SortTh col="startDate" sort={sort} onSort={handleSort}>{t("feed_col_start")}</SortTh>
              <SortTh col="dueDate" sort={sort} onSort={handleSort}>{t("feed_col_due")}</SortTh>
              <SortTh col="tags" sort={sort} onSort={handleSort}>Tag</SortTh>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sortedNotes.map((note) => (
                <NoteRow
                  key={note._id}
                  note={note}
                  selected={selectedNoteIds.has(note._id as Id<"notes">)}
                  onSelect={onSelect}
                  onEdit={onEdit}
                />
              ))}
              {sortedTasks.map((task) => (
                <TaskRow key={task._id} task={task} onEdit={onEdit} onEditTask={onEditTask} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {!hasItems && (
          <p className="py-12 text-center text-muted text-sm">
            {search ? "Nessun risultato per questa ricerca." : t("feed_empty")}
          </p>
        )}
      </div>
    </div>
  );
}
