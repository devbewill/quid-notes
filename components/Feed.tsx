"use client";

import { useState, useMemo } from "react";
import { useQuery, useConvexAuth } from "convex/react";
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
  statusFilter: "all" | "idle" | "active" | "completed";
  selectedTaskIds: Set<Id<"tasks">>;
  onSelectTask: (id: Id<"tasks">) => void;
}

type SortCol = "title" | "type" | "status" | "startDate" | "dueDate" | "tags";
type SortDir = "asc" | "desc";
type SortState = { col: SortCol; dir: SortDir } | null;

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "idle" | "active" | "completed" }) {
  const map = {
    idle: "bg-semantic-error/10 text-semantic-error",
    active: "bg-semantic-warning/10 text-semantic-warning",
    completed: "bg-semantic-success/10 text-semantic-success",
  } as const;
  const label = { idle: "To Do", active: "Active", completed: "Done" };
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider", map[status])}>
      {label[status]}
    </span>
  );
}

// ─── Date cell ────────────────────────────────────────────────────────────────
function DateCell({ ts, overdue }: { ts?: number; overdue?: boolean }) {
  if (!ts) return <span className="text-text-muted text-xs">—</span>;
  return (
    <span className={cn("text-xs tabular-nums flex items-center gap-1", overdue ? "text-semantic-error font-medium" : "text-text-muted")}>
      {overdue && <span className="w-1.5 h-1.5 rounded-full bg-semantic-error shrink-0" />}
      {new Date(ts).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
    </span>
  );
}


// ─── Tags cell ────────────────────────────────────────────────────────────────
type TagColorEntry = { name: string; color: string };
function TagsCell({ tags, tagColors }: { tags?: string[]; tagColors?: TagColorEntry[] }) {
  if (!tags || tags.length === 0) return <span className="text-text-muted text-xs">—</span>;
  const colorMap = Object.fromEntries((tagColors ?? []).map((e) => [e.name, e.color]));
  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((t) => {
        const c = colorMap[t];
        return c ? (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-md font-medium text-text-inverse"
            style={{ backgroundColor: c }}
          >
            {t}
          </span>
        ) : (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-md font-medium text-text-inverse bg-accent-primary">
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
    <tr className="border-b border-border-subtle">
      <td className="w-10 pl-3 py-3.5"><div className="w-4 h-4 rounded bg-bg-surface animate-pulse" /></td>
      <td className="w-8 py-3.5"><div className="w-4 h-4 rounded bg-bg-surface animate-pulse" /></td>
      <td className="pr-4 py-3.5"><div className="h-2.5 bg-bg-surface rounded animate-pulse" style={{ width: w }} /></td>
      <td className="pr-4"><div className="h-5 bg-bg-surface rounded-full animate-pulse w-20" /></td>
      <td className="pr-4"><div className="h-2.5 bg-bg-surface rounded animate-pulse w-14" /></td>
      <td className="pr-4"><div className="h-2.5 bg-bg-surface rounded animate-pulse w-14" /></td>
      <td className="pr-4" />
    </tr>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <tr><td colSpan={7}>
      <div className="py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center">
          {hasSearch ? (
            <span className="text-2xl">🔍</span>
          ) : (
            <span className="text-2xl">📝</span>
          )}
        </div>
        <div>
          <p className="text-sm text-text-primary font-medium">{hasSearch ? "No results" : "No notes yet"}</p>
          <p className="text-xs text-text-muted mt-1">{hasSearch ? "Try different keywords" : "Create your first note with \"New\" button"}</p>
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
        "text-left text-xs text-text-muted uppercase tracking-widest pb-2 pr-4 cursor-pointer select-none whitespace-nowrap",
        "hover:text-text-secondary transition-colors group",
        className
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span className={cn("text-[10px]", active ? "text-accent-primary" : "text-border-subtle group-hover:text-text-muted")}>
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
        "group border-b border-border-subtle transition-colors",
        selected ? "bg-accent-light" : "hover:bg-bg-hover",
        isChild && "opacity-70"
      )}
    >
      <td className="w-10 pl-3">
        {isChild ? (
          <span className="inline-block w-4 border-l border-border-default ml-4" />
        ) : (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => { e.stopPropagation(); onSelect(note._id); }}
            className={cn(
              "appearance-none w-[14px] h-[14px] rounded border border-border-default bg-bg-surface checked:bg-accent-primary checked:border-accent-primary cursor-pointer transition-all relative outline-none",
              "after:content-[''] after:hidden checked:after:block after:absolute after:left-[4px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-solid after:border-text-inverse after:border-b-[1.5px] after:border-r-[1.5px] after:rotate-45",
              hovered || selected ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </td>
      <td className="w-8 pr-2">
        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zM15 12h-3m3 3h-3m3 3h-3" />
        </svg>
      </td>
      <td
        className={cn("py-3 pr-4 text-sm cursor-pointer hover:text-accent-primary transition-colors flex items-center gap-1.5", isChild && "pl-8")}
        onClick={() => onEdit(note)}
      >
        {note.isPinned && <span className="text-base text-accent-primary">📌</span>}
        <span className="truncate text-text-primary">{note.title}</span>
      </td>
      <td className="pr-4"><StatusBadge status={note.status} /></td>
      <td className="pr-4"><DateCell ts={note.startDate} /></td>
      <td className="pr-4"><DateCell ts={note.dueDate} overdue={!!note.dueDate && note.status !== "completed" && note.dueDate < Date.now()} /></td>
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
        className={cn("border-b border-border-subtle transition-colors", hasChildren ? "cursor-pointer hover:bg-bg-hover" : "hover:bg-bg-hover")}
      >
        <td className="w-10 pl-3">
          <div className="flex items-center justify-center">
            {hasChildren ? (
              <span className={cn("inline-block text-text-muted text-xs transition-transform", expanded && "rotate-90")}>▶</span>
            ) : (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => { e.stopPropagation(); onSelectTask(task._id); }}
                className={cn(
                  "appearance-none w-[14px] h-[14px] rounded border border-border-default bg-bg-surface checked:bg-accent-primary checked:border-accent-primary cursor-pointer transition-all relative outline-none",
                  "after:content-[''] after:hidden checked:after:block after:absolute after:left-[4px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-solid after:border-text-inverse after:border-b-[1.5px] after:border-r-[1.5px] after:rotate-45",
                  hovered || selected ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        </td>
        <td className="w-8 pr-2">
          <svg className="w-4 h-4 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </td>
        <td
          className="py-3 pr-4 text-sm font-medium cursor-pointer hover:text-accent-primary transition-colors flex items-center gap-1.5"
          onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
        >
          {task.isPinned && <span className="text-base text-accent-primary">📌</span>}
          <span className="truncate text-text-primary">{task.title}</span>
        </td>
        <td className="pr-4"><StatusBadge status={task.status} /></td>
        <td className="pr-4"><DateCell ts={task.startDate} /></td>
        <td className="pr-4"><DateCell ts={task.dueDate} overdue={!!task.dueDate && task.status !== "completed" && task.dueDate < Date.now()} /></td>
        <td className="pr-4"><TagsCell tags={undefined} /></td>
      </motion.tr>
      <AnimatePresence>
        {expanded && <ChildNoteRows taskId={task._id} onEdit={onEdit} />}
      </AnimatePresence>
    </>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────
export function Feed({ selectedNoteIds, onSelect, onEdit, onEditTask, search, typeFilter, tagFilter, statusFilter, selectedTaskIds, onSelectTask }: FeedProps) {
  const { t } = useLocale();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip");

  const topNotes = useQuery(api.notes.listTopLevel, isAuthenticated && user ? {} : "skip");
  const tasks = useQuery(api.tasks.listAll, isAuthenticated && user ? {} : "skip");

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
      if (statusFilter !== "all") {
        result = result.filter((i) => i.status === statusFilter);
      }
      return result;
    };

    const applySort = <T extends { title: string; status: string; startDate?: number; dueDate?: number; tags?: string[]; isPinned?: boolean }>(
      items: T[]
    ): T[] => {
      return [...items].sort((a, b) => {
        // Pinned to the top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (!sort) return 0;
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
  }, [topNotes, tasks, q, sort, typeFilter, tagFilter, statusFilter]);

  if (!topNotes || !tasks) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-text-primary">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="w-10" />
              <th className="w-8" />
              <th className="text-left text-xs text-text-muted uppercase tracking-widest pb-2 pr-4">{t("feed_col_title")}</th>
              <th className="text-left text-xs text-text-muted uppercase tracking-widest pb-2 pr-4">{t("feed_col_status")}</th>
              <th className="text-left text-xs text-text-muted uppercase tracking-widest pb-2 pr-4">{t("feed_col_start")}</th>
              <th className="text-left text-xs text-text-muted uppercase tracking-widest pb-2 pr-4">{t("feed_col_due")}</th>
              <th className="text-left text-xs text-text-muted uppercase tracking-widest pb-2 pr-4">Tags</th>
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
        <table className="w-full text-text-primary">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="w-10" />
              <th className="w-8" />
              <SortTh col="title" sort={sort} onSort={handleSort}>{t("feed_col_title")}</SortTh>
              <SortTh col="status" sort={sort} onSort={handleSort}>{t("feed_col_status")}</SortTh>
              <SortTh col="startDate" sort={sort} onSort={handleSort}>{t("feed_col_start")}</SortTh>
              <SortTh col="dueDate" sort={sort} onSort={handleSort}>{t("feed_col_due")}</SortTh>
              <SortTh col="tags" sort={sort} onSort={handleSort}>Tags</SortTh>
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
              {!hasItems && <EmptyState hasSearch={!!search} />}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
