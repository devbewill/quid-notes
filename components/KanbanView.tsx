"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import { cn } from "@/lib/cn";

// ─── Helpers ──────────────────────────────────────────────────────────────────
type AnyItem = (NoteDoc & { _kind: "note" }) | (TaskDoc & { _kind: "task" });

const COLUMNS: {
  key: string;
  label: string;
  borderColor: string;
  bgColor: string;
}[] = [
  {
    key: "idle",
    label: "TODO",
    borderColor: "border-semantic-error/30",
    bgColor: "bg-semantic-error",
  },
  {
    key: "active",
    label: "ACTIVE",
    borderColor: "border-semantic-warning/30",
    bgColor: "bg-semantic-warning",
  },
  {
    key: "completed",
    label: "DONE",
    borderColor: "border-semantic-success/30",
    bgColor: "bg-semantic-success",
  },
];

function stripMd(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_~>]+/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function isOverdue(dueDate?: number, status?: string): boolean {
  if (!dueDate || status === "completed") return false;
  return dueDate < Date.now();
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function KanbanCard({
  item,
  globalTagColors,
  onEdit,
  onEditTask,
}: {
  item: AnyItem;
  globalTagColors: Record<string, string>;
  onEdit: (n: NoteDoc) => void;
  onEditTask: (t: TaskDoc) => void;
}) {
  const preview = stripMd(
    "text" in item ? (item as { text: string }).text : "",
  );
  const overdue = isOverdue(item.dueDate, item.status);

  return (
    <div
      draggable={true}
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() =>
        item._kind === "note"
          ? onEdit(item as NoteDoc)
          : onEditTask(item as TaskDoc)
      }
      className={cn(
        "group cursor-pointer border border-border-subtle bg-bg-elevated hover:border-border-default transition-all duration-150 p-3.5 relative overflow-hidden",
        item._kind === "note"
          ? "hover:border-[#a855f7]/50"
          : "hover:border-[#0ea5e9]/50",
      )}
    >
      {/* Type accent line */}
      <div
        className={cn(
          "absolute left-0 inset-y-0 w-[2px]",
          item._kind === "note" ? "bg-[#a855f7]" : "bg-[#0ea5e9]",
        )}
      />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        {/* Type pill */}
        <div className="flex items-center gap-2 mb-2">
          {item.isPinned && (
            <svg
              className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0"
              viewBox="0 0 20 20"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          )}
          <span
            className={cn(
              "text-[9px] font-mono font-bold tracking-wider uppercase",
              item._kind === "note"
                ? "text-text-muted/60"
                : "text-text-muted/60",
            )}
          >
            {item._kind === "note" ? "note" : "task"}
          </span>
          {overdue && (
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-semantic-error border border-semantic-error/30">
              OVERDUE
            </span>
          )}
        </div>

        {/* Title */}
        <p
          className={cn(
            "text-sm font-mono font-medium text-text-primary transition-all duration-150 leading-snug mb-1.5 line-clamp-2",
            item._kind === "note"
              ? "group-hover:text-[#a855f7]"
              : "group-hover:text-[#0ea5e9]",
          )}
        >
          {item.title}
        </p>

        {/* Preview */}
        {preview && (
          <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mb-2">
            {preview}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {item._kind === "note" &&
            (item as NoteDoc).tags?.map((tag) => {
              const c = globalTagColors[tag];
              return c ? (
                <span
                  key={tag}
                  className="text-[9px] px-1 py-0.5 font-mono font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${c}15`,
                    color: c,
                    borderColor: c,
                  }}
                >
                  {tag}
                </span>
              ) : (
                <span
                  key={tag}
                  className="text-[9px] px-1 py-0.5 font-mono font-bold uppercase tracking-wider border border-border-subtle text-text-muted"
                >
                  {tag}
                </span>
              );
            })}

          {item.dueDate && (
            <span
              className={cn(
                "ml-auto text-[9px] tabular-nums flex items-center gap-0.5 shrink-0",
                overdue ? "text-rose-400" : "text-muted",
              )}
            >
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {new Date(item.dueDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────
function KanbanColumn({
  colKey,
  label,
  borderColor,
  bgColor,
  items,
  globalTagColors,
  onEdit,
  onEditTask,
  onUpdateStatus,
}: {
  colKey: string;
  label: string;
  borderColor: string;
  bgColor: string;
  items: AnyItem[];
  globalTagColors: Record<string, string>;
  onEdit: (n: NoteDoc) => void;
  onEditTask: (t: TaskDoc) => void;
  onUpdateStatus: (
    item: AnyItem,
    newStatus: "idle" | "active" | "completed",
  ) => void;
}) {
  return (
    <div
      className={cn("flex-1 min-w-[260px] flex flex-col")}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        try {
          const parsed = JSON.parse(data);
          onUpdateStatus(parsed, colKey as "idle" | "active" | "completed");
        } catch {
          /* noop */
        }
      }}
    >
      {/* Status line indicator */}
      <div className={cn("h-1 w-full shrink-0 mb-3 opacity-80", bgColor)} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-text-muted/60 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-text-muted/40 tabular-nums border border-border-subtle px-1.5 py-0.5">
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <div
              key={item._id}
              draggable
              onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({ _id: item._id, _kind: item._kind }),
                );
                e.dataTransfer.effectAllowed = "move";
              }}
            >
              <KanbanCard
                item={item}
                globalTagColors={globalTagColors}
                onEdit={onEdit}
                onEditTask={onEditTask}
              />
            </div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-xs font-mono text-text-muted/40">
              DRAG_ITEMS_HERE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface KanbanViewProps {
  onEdit: (note: NoteDoc) => void;
  onEditTask: (task: TaskDoc) => void;
  search: string;
  typeFilter: "all" | "note" | "task";
  tagFilter: string | null;
  statusFilter: "all" | "idle" | "active" | "completed";
  globalTagColors: Record<string, string>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function KanbanView({
  onEdit,
  onEditTask,
  search,
  typeFilter,
  tagFilter,
  statusFilter,
  globalTagColors,
}: KanbanViewProps) {
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
  const updateNote = useMutation(api.notes.update);
  const updateTask = useMutation(api.tasks.update);

  const columns = useMemo(() => {
    if (!topNotes || !tasks) return null;

    const q = search.toLowerCase().trim();

    const filterItem = <
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
            i.tags?.some((t) => t.toLowerCase().includes(q)),
        );
      }
      if (tagFilter) result = result.filter((i) => i.tags?.includes(tagFilter));
      if (statusFilter !== "all")
        result = result.filter((i) => i.status === statusFilter);
      return result;
    };

    const noteItems: AnyItem[] =
      typeFilter === "all" || typeFilter === "note"
        ? filterItem(topNotes as NoteDoc[]).map((n) => ({
            ...n,
            _kind: "note" as const,
          }))
        : [];
    const taskItems: AnyItem[] =
      typeFilter === "all" || typeFilter === "task"
        ? filterItem(tasks as TaskDoc[]).map((t) => ({
            ...t,
            _kind: "task" as const,
          }))
        : [];

    const all = [...noteItems, ...taskItems].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

    return COLUMNS.map((col) => ({
      ...col,
      items: all.filter((item) => item.status === col.key),
    }));
  }, [topNotes, tasks, search, typeFilter, tagFilter, statusFilter]);

  const handleUpdateStatus = (
    droppedData: { _id: string; _kind: string },
    newStatus: "idle" | "active" | "completed",
  ) => {
    if (droppedData._kind === "note") {
      // Find note to get current data for required fields
      const note = (topNotes as NoteDoc[])?.find(
        (n) => n._id === droppedData._id,
      );
      if (!note) return;
      void updateNote({
        noteId: note._id,
        title: note.title,
        text: note.text,
        status: newStatus,
        startDate: note.startDate,
        dueDate: note.dueDate,
        tags: note.tags,
        tagColors: note.tagColors,
      });
    } else {
      void updateTask({
        taskId: droppedData._id as Parameters<typeof updateTask>[0]["taskId"],
        status: newStatus,
      });
    }
  };

  // Loading
  if (!columns) {
    return (
      <div className="flex gap-4 p-4 h-full">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 bg-bg-elevated/30 border-t-2 border-border-subtle animate-pulse min-h-[300px]"
          />
        ))}
      </div>
    );
  }

  const itemsByStatus = columns.reduce(
    (acc, col) => {
      acc[col.key] = col.items;
      return acc;
    },
    {} as Record<string, AnyItem[]>,
  );

  return (
    <div className="flex gap-4 p-4 h-full overflow-x-auto">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.key}
          colKey={col.key}
          label={col.label}
          borderColor={col.borderColor}
          bgColor={col.bgColor}
          items={itemsByStatus[col.key as keyof typeof itemsByStatus] || []}
          globalTagColors={globalTagColors}
          onEdit={onEdit}
          onEditTask={onEditTask}
          onUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
}
