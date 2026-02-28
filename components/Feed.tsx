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
  typeFilter: "all" | "note" | "task";
  tagFilter: string | null;
  selectedTaskIds: Set<Id<"tasks">>;
  onSelectTask: (id: Id<"tasks">) => void;
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
type TagColorEntry = { name: string; color: string };
function TagsCell({ tags, tagColors }: { tags?: string[]; tagColors?: TagColorEntry[] }) {
  if (!tags || tags.length === 0) return <span className="text-muted text-xs">—</span>;
  const colorMap = Object.fromEntries((tagColors ?? []).map((e) => [e.name, e.color]));
  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((t) => {
        const c = colorMap[t];
        return c ? (
          <span
            key={t}
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: `${c}28`, color: c, boxShadow: `0 0 0 1px ${c}44` }}
          >
            {t}
          </span>
        ) : (
          <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/25">
            {t}
          </span>
        );
      })}
    </div>
  );
}


// ─── Skeleton row ───────────────────────────────────────────────────────────
const SKELETON_WIDTHS = [160, 120, 180, 140, 200, 130, 170];
function SkeletonRow({ index }: { index: number }) {
  const w = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];
  return (
    <tr className="border-b border-border">
      <td className="w-10 pl-3 py-3.5"><div className="w-4 h-4 rounded bg-border/40 animate-pulse" /></td>
      <td className="pr-4 py-3.5"><div className="h-2.5 bg-border/40 rounded animate-pulse" style={{ width: w }} /></td>
      <td className="pr-4"><div className="h-5 bg-border/40 rounded-full animate-pulse w-12" /></td>
      <td className="pr-4"><div className="h-5 bg-border/40 rounded-full animate-pulse w-20" /></td>
      <td className="pr-4"><div className="h-2.5 bg-border/40 rounded animate-pulse w-14" /></td>
      <td className="pr-4"><div className="h-2.5 bg-border/40 rounded animate-pulse w-14" /></td>
      <td className="pr-4" />
    </tr>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <tr><td colSpan={7}>
      <div className="py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
          {hasSearch ? (
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
          )}
        </div>
        <div>
          <p className="text-sm text-text font-medium">{hasSearch ? "Nessun risultato" : "Nessuna nota ancora"}</p>
          <p className="text-xs text-muted mt-1">{hasSearch ? "Prova con parole chiave diverse" : "Crea la tua prima nota con il pulsante \"+ Nuovo\""}</p>
        </div>
      </div>
    </td></tr>
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
      <td className="pr-4"><TagsCell tags={note.tags} tagColors={(note as NoteDoc).tagColors} /></td>
    </motion.tr>
  );
}

// ─── Task row (Level 1) ───────────────────────────────────────────────────────
function TaskRow({ task, onEdit, onEditTask, selected, onSelectTask }: {
  task: TaskDoc;
  onEdit: (note: NoteDoc) => void;
  onEditTask: (task: TaskDoc) => void;
  selected: boolean;
  onSelectTask: (id: Id<"tasks">) => void;
}) {
  const hasChildren = task.linkedNoteIds.length > 0;
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.18 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => hasChildren && setExpanded((v) => !v)}
        className={cn("border-b border-border transition-colors", hasChildren ? "cursor-pointer hover:bg-surface/40" : "hover:bg-surface/20")}
      >
        <td className="w-10 pl-3">
          <div className="flex items-center justify-center">
            {hasChildren ? (
              <span className={cn("inline-block text-muted text-xs transition-transform", expanded && "rotate-90")}>▶</span>
            ) : (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => { e.stopPropagation(); onSelectTask(task._id); }}
                className={cn(
                  "rounded border-border bg-transparent accent-violet-500 transition-opacity",
                  hovered || selected ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
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
export function Feed({ selectedNoteIds, onSelect, onEdit, onEditTask, search, typeFilter, tagFilter, selectedTaskIds, onSelectTask }: FeedProps) {
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

    const showNotes = typeFilter === "all" || typeFilter === "note";
    const showTasks = typeFilter === "all" || typeFilter === "task";

    const filtered = <T extends { title: string; status: string; tags?: string[] }>(
      items: T[]
    ): T[] => {
      let result = items;
      if (q) {
        result = result.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            ("text" in i && typeof (i as { text?: string }).text === "string" &&
              ((i as { text: string }).text.toLowerCase().includes(q))) ||
            i.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      if (tagFilter) {
        result = result.filter((i) => i.tags?.includes(tagFilter));
      }
      return result;
    };

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
      sortedNotes: showNotes ? applySort(filtered(topNotes as NoteDoc[])) : [],
      sortedTasks: showTasks ? applySort(filtered(tasks as TaskDoc[])) : [],
    };
  }, [topNotes, tasks, q, sort, typeFilter, tagFilter]);

  if (!topNotes || !tasks) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-text">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10" />
              <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">Titolo</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">Tipo</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">Stato</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">Inizio</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">Scadenza</th>
              <th className="text-left text-xs text-muted uppercase tracking-widest pb-2 pr-4">Tag</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((i) => <SkeletonRow key={i} index={i} />)}
          </tbody>
        </table>
      </div>
    );
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
                <TaskRow
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onEditTask={onEditTask}
                  selected={selectedTaskIds.has(task._id as Id<"tasks">)}
                  onSelectTask={onSelectTask}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

              {!hasItems && <EmptyState hasSearch={!!search} />}
      </div>
    </div>
  );
}
