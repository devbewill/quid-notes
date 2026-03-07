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

// ─── Status badge - technical design ─────────────────────────────────────────────
function StatusBadge({ status }: { status: "idle" | "active" | "completed" }) {
  const config = {
    idle: {
      bg: "bg-semantic-error/5",
      text: "text-semantic-error",
      border: "border-semantic-error/20",
      label: "TODO",
    },
    active: {
      bg: "bg-semantic-warning/5",
      text: "text-semantic-warning",
      border: "border-semantic-warning/20",
      label: "ACTIVE",
    },
    completed: {
      bg: "bg-semantic-success/5",
      text: "text-semantic-success",
      border: "border-semantic-success/20",
      label: "DONE",
    },
  } as const;

  const { bg, text, border, label } = config[status];

  return (
    <span
      className={cn(
        "px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border",
        bg,
        text,
        border,
      )}
    >
      {label}
    </span>
  );
}

// ─── Date cell - technical design ───────────────────────────────────────────────
function DateCell({ ts, overdue }: { ts?: number; overdue?: boolean }) {
  if (!ts)
    return <span className="text-text-muted/40 text-xs font-mono">—</span>;

  const date = new Date(ts);
  const display = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return (
    <span
      className={cn(
        "text-xs font-mono tabular-nums",
        overdue ? "text-semantic-error" : "text-text-muted",
      )}
    >
      {display}
    </span>
  );
}

// ─── Tags cell - technical design ───────────────────────────────────────────────
type TagColorEntry = { name: string; color: string };
function TagsCell({
  tags,
  tagColors,
}: {
  tags?: string[];
  tagColors?: TagColorEntry[];
}) {
  if (!tags || tags.length === 0)
    return <span className="text-text-muted/40 text-xs font-mono">—</span>;
  const colorMap = Object.fromEntries(
    (tagColors ?? []).map((e) => [e.name, e.color]),
  );

  return (
    <div className="flex gap-1">
      {tags.slice(0, 2).map((t) => {
        const c = colorMap[t];
        return (
          <span
            key={t}
            className="text-[9px] px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider border border-border-subtle"
            style={{
              backgroundColor: c ? `${c}15` : undefined,
              color: c || undefined,
            }}
          >
            {t}
          </span>
        );
      })}
      {tags.length > 2 && (
        <span className="text-[9px] px-1.5 py-0.5 font-mono font-bold text-text-muted/60">
          +{tags.length - 2}
        </span>
      )}
    </div>
  );
}

// ─── Skeleton row - technical design ────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-border-subtle/40">
      <td className="w-8 px-2 py-2">
        <div className="w-3 h-3 bg-border-subtle/30" />
      </td>
      <td className="w-6 px-2 py-2">
        <div className="w-3 h-3 bg-border-subtle/30" />
      </td>
      <td className="px-3 py-2">
        <div className="h-3 bg-border-subtle/30 w-32" />
      </td>
      <td className="px-3 py-2">
        <div className="h-3 bg-border-subtle/30 w-16" />
      </td>
      <td className="px-3 py-2">
        <div className="h-3 bg-border-subtle/30 w-14" />
      </td>
      <td className="px-3 py-2">
        <div className="h-3 bg-border-subtle/30 w-14" />
      </td>
      <td className="px-3 py-2" />
    </tr>
  );
}

// ─── Empty state - technical design ────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <tr>
      <td colSpan={7}>
        <div className="py-20 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 border border-border-subtle flex items-center justify-center">
            <span className="text-lg">{hasSearch ? "∅" : "∅"}</span>
          </div>
          <div>
            <p className="text-sm text-text-primary font-mono">
              {hasSearch ? "NO_RESULTS" : "EMPTY"}
            </p>
            <p className="text-xs text-text-muted/60 mt-1 font-mono">
              {hasSearch ? "try_different_query" : "create_first_item"}
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Sort header - technical design ─────────────────────────────────────────────
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
        "text-left text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider pb-2 px-3 cursor-pointer select-none whitespace-nowrap",
        "hover:text-text-muted transition-colors",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <span
          className={cn(
            "text-[8px]",
            active ? "text-accent-primary" : "text-border-subtle",
          )}
        >
          {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "◀▶"}
        </span>
      </span>
    </th>
  );
}

// ─── Child notes (Level 2) - technical design ───────────────────────────────────
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

// ─── Note row - technical design ────────────────────────────────────────────────
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "border-b border-border-subtle/40 transition-colors",
        selected ? "bg-accent-primary/5" : hovered ? "bg-bg-hover/30" : "",
        isChild && "opacity-60",
      )}
    >
      <td className="w-8 px-2 py-2">
        {isChild ? (
          <div className="w-3 h-3 border-l border-border-subtle ml-3" />
        ) : (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(note._id);
            }}
            className={cn(
              "w-3 h-3 border border-border-subtle bg-bg-surface cursor-pointer appearance-none relative flex items-center justify-center",
              "checked:bg-[#a855f7] checked:border-[#a855f7]",
              "after:content-[''] after:hidden checked:after:block after:absolute after:left-[3px] after:top-[0.5px] after:w-[1.5px] after:h-[3px] after:border-solid after:border-text-inverse after:border-b-[1.5px] after:border-r-[1.5px] after:rotate-45",
              hovered || selected ? "opacity-100" : "opacity-0",
            )}
          />
        )}
      </td>
      <td className="w-6 px-2 py-2">
        <svg
          className="w-3 h-3 text-[#a855f7]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zM15 12h-3m3 3h-3m3 3h-3"
          />
        </svg>
      </td>
      <td
        className={cn(
          "px-3 py-2 text-sm cursor-pointer hover:text-accent-primary transition-colors",
          isChild && "pl-6",
        )}
        onClick={() => onEdit(note)}
      >
        <div className="flex items-center gap-1.5">
          {note.isPinned && (
            <span className="text-xs text-accent-primary">📌</span>
          )}
          <span className="font-mono text-text-primary truncate">
            {note.title}
          </span>
        </div>
      </td>
      <td className="px-3 py-2">
        <StatusBadge status={note.status} />
      </td>
      <td className="px-3 py-2">
        <DateCell ts={note.startDate} />
      </td>
      <td className="px-3 py-2">
        <DateCell
          ts={note.dueDate}
          overdue={
            !!note.dueDate &&
            note.status !== "completed" &&
            note.dueDate < Date.now()
          }
        />
      </td>
      <td className="px-3 py-2">
        <TagsCell tags={note.tags} tagColors={note.tagColors} />
      </td>
    </motion.tr>
  );
}

// ─── Task row (Level 1) - technical design ───────────────────────────────────────
function TaskRow({
  task,
  onEdit,
  onEditTask,
  selected,
  onSelectTask,
}: {
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => hasChildren && setExpanded((v) => !v)}
        className={cn(
          "border-b border-border-subtle/40 transition-colors",
          hasChildren ? "cursor-pointer" : "",
          hovered ? "bg-bg-hover/30" : "",
        )}
      >
        <td className="w-8 px-2 py-2">
          {hasChildren ? (
            <span
              className={cn(
                "inline-block text-text-muted/40 text-[10px] font-mono transition-transform",
                expanded && "rotate-90",
              )}
            >
              ▶
            </span>
          ) : (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelectTask(task._id);
              }}
              className={cn(
                "w-3 h-3 border border-border-subtle bg-bg-surface cursor-pointer appearance-none relative flex items-center justify-center",
                "checked:bg-[#0ea5e9] checked:border-[#0ea5e9]",
                "after:content-[''] after:hidden checked:after:block after:absolute after:left-[3px] after:top-[0.5px] after:w-[1.5px] after:h-[3px] after:border-solid after:border-text-inverse after:border-b-[1.5px] after:border-r-[1.5px] after:rotate-45",
                hovered || selected ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </td>
        <td className="w-6 px-2 py-2">
          <svg
            className="w-3 h-3 text-[#0ea5e9]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </td>
        <td
          className="px-3 py-2 text-sm cursor-pointer hover:text-accent-secondary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEditTask(task);
          }}
        >
          <div className="flex items-center gap-1.5">
            {task.isPinned && (
              <span className="text-xs text-accent-secondary">📌</span>
            )}
            <span className="font-mono text-text-primary truncate">
              {task.title}
            </span>
          </div>
        </td>
        <td className="px-3 py-2">
          <StatusBadge status={task.status} />
        </td>
        <td className="px-3 py-2">
          <DateCell ts={task.startDate} />
        </td>
        <td className="px-3 py-2">
          <DateCell
            ts={task.dueDate}
            overdue={
              !!task.dueDate &&
              task.status !== "completed" &&
              task.dueDate < Date.now()
            }
          />
        </td>
        <td className="px-3 py-2">
          <TagsCell tags={undefined} />
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && <ChildNoteRows taskId={task._id} onEdit={onEdit} />}
      </AnimatePresence>
    </>
  );
}

// ─── Feed - technical design ─────────────────────────────────────────────────────
export function Feed({
  selectedNoteIds,
  onSelect,
  onEdit,
  onEditTask,
  search,
  typeFilter,
  tagFilter,
  statusFilter,
  selectedTaskIds,
  onSelectTask,
}: FeedProps) {
  const { t } = useLocale();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip");

  const topNotes = useQuery(
    api.notes.listTopLevel,
    isAuthenticated && user ? {} : "skip",
  );
  const tasks = useQuery(
    api.tasks.listAll,
    isAuthenticated && user ? {} : "skip",
  );

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

    const filtered = <
      T extends { title: string; status: string; tags?: string[] },
    >(
      items: T[],
    ): T[] => {
      let result = items;
      if (q) {
        result = result.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            ("text" in i &&
              typeof (i as { text?: string }).text === "string" &&
              (i as { text: string }).text.toLowerCase().includes(q)) ||
            i.tags?.some((tag) => tag.toLowerCase().includes(q)),
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

    const applySort = <
      T extends {
        title: string;
        status: string;
        startDate?: number;
        dueDate?: number;
        tags?: string[];
        isPinned?: boolean;
      },
    >(
      items: T[],
    ): T[] => {
      return [...items].sort((a, b) => {
        // Pinned to the top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (!sort) return 0;
        let cmp = 0;
        switch (sort.col) {
          case "title":
            cmp = a.title.localeCompare(b.title);
            break;
          case "status":
            cmp = a.status.localeCompare(b.status);
            break;
          case "startDate":
            cmp = (a.startDate ?? 0) - (b.startDate ?? 0);
            break;
          case "dueDate":
            cmp = (a.dueDate ?? 0) - (b.dueDate ?? 0);
            break;
          case "tags":
            cmp = (a.tags?.[0] ?? "").localeCompare(b.tags?.[0] ?? "");
            break;
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
      <div className="border border-border-subtle/40">
        <table className="w-full text-text-primary">
          <thead>
            <tr className="border-b border-border-subtle/40">
              <th className="w-8" />
              <th className="w-6" />
              <th className="text-left text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider pb-2 px-3">
                {t("feed_col_title")}
              </th>
              <th className="text-left text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider pb-2 px-3">
                {t("feed_col_status")}
              </th>
              <th className="text-left text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider pb-2 px-3">
                {t("feed_col_start")}
              </th>
              <th className="text-left text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider pb-2 px-3">
                {t("feed_col_due")}
              </th>
              <th className="text-left text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider pb-2 px-3">
                TAGS
              </th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const hasItems = sortedNotes.length > 0 || sortedTasks.length > 0;

  return (
    <div className="border border-border-subtle/40">
      <table className="w-full text-text-primary">
        <thead>
          <tr className="border-b border-border-subtle/40">
            <th className="w-8" />
            <th className="w-6" />
            <SortTh col="title" sort={sort} onSort={handleSort}>
              {t("feed_col_title")}
            </SortTh>
            <SortTh col="status" sort={sort} onSort={handleSort}>
              {t("feed_col_status")}
            </SortTh>
            <SortTh col="startDate" sort={sort} onSort={handleSort}>
              {t("feed_col_start")}
            </SortTh>
            <SortTh col="dueDate" sort={sort} onSort={handleSort}>
              {t("feed_col_due")}
            </SortTh>
            <SortTh col="tags" sort={sort} onSort={handleSort}>
              TAGS
            </SortTh>
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
  );
}
