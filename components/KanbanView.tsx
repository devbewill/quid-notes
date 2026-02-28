"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import { cn } from "@/lib/cn";

// ─── Helpers ──────────────────────────────────────────────────────────────────
type AnyItem = (NoteDoc & { _kind: "note" }) | (TaskDoc & { _kind: "task" });

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "idle", label: "To Do", color: "border-zinc-500/40" },
  { key: "active", label: "In Progress", color: "border-sky-500/40" },
  { key: "completed", label: "Completed", color: "border-emerald-500/40" },
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
  const preview = stripMd("text" in item ? (item as { text: string }).text : "");
  const overdue = isOverdue(item.dueDate, item.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onClick={() => item._kind === "note" ? onEdit(item as NoteDoc) : onEditTask(item as TaskDoc)}
      className="group cursor-pointer rounded-lg border border-border bg-bg hover:border-slate-400/30 hover:shadow-md hover:shadow-black/20 transition-all duration-150 p-3.5"
    >
      {/* Type pill */}
      <div className="flex items-center gap-2 mb-2">
        {item.isPinned && (
          <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        )}
        <span className={cn(
          "text-[9px] font-bold tracking-widest uppercase",
          item._kind === "note" ? "text-slate-400/70" : "text-violet-400/70"
        )}>
          {item._kind === "note" ? "nota" : "task"}
        </span>
        {overdue && (
          <span className="text-[9px] font-bold tracking-wide uppercase text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded ring-1 ring-rose-400/25 animate-pulse">
            Overdue
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-text group-hover:text-white transition-colors leading-snug mb-1.5 line-clamp-2">
        {item.title}
      </p>

      {/* Preview */}
      {preview && (
        <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mb-2">{preview}</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {item._kind === "note" && (item as NoteDoc).tags?.map((tag) => {
          const c = globalTagColors[tag];
          return c ? (
            <span
              key={tag}
              className="text-[9px] px-1 py-0.5 rounded font-medium"
              style={{ background: `${c}28`, color: c, boxShadow: `0 0 0 1px ${c}44` }}
            >
              {tag}
            </span>
          ) : (
            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/25">
              {tag}
            </span>
          );
        })}

        {item.dueDate && (
          <span className={cn(
            "ml-auto text-[9px] tabular-nums flex items-center gap-0.5 shrink-0",
            overdue ? "text-rose-400" : "text-muted"
          )}>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            {new Date(item.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────
function KanbanColumn({
  colKey,
  label,
  color,
  items,
  globalTagColors,
  onEdit,
  onEditTask,
  onUpdateStatus,
}: {
  colKey: string;
  label: string;
  color: string;
  items: AnyItem[];
  globalTagColors: Record<string, string>;
  onEdit: (n: NoteDoc) => void;
  onEditTask: (t: TaskDoc) => void;
  onUpdateStatus: (item: AnyItem, newStatus: "idle" | "active" | "completed") => void;
}) {
  return (
    <div
      className={cn("flex-1 min-w-[260px] rounded-xl border-t-2 bg-surface/30 flex flex-col", color)}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        try {
          const parsed = JSON.parse(data);
          onUpdateStatus(parsed, colKey as "idle" | "active" | "completed");
        } catch { /* noop */ }
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="text-xs font-semibold text-text/70 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] text-muted tabular-nums bg-bg/60 rounded px-1.5 py-0.5">{items.length}</span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <div
              key={item._id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify({ _id: item._id, _kind: item._kind }));
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
            <p className="text-xs text-muted/50">Trascina qui gli elementi</p>
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
export function KanbanView({ onEdit, onEditTask, search, typeFilter, tagFilter, statusFilter, globalTagColors }: KanbanViewProps) {
  const topNotes = useQuery(api.notes.listTopLevel);
  const tasks = useQuery(api.tasks.listAll);
  const updateNote = useMutation(api.notes.update);
  const updateTask = useMutation(api.tasks.update);

  const columns = useMemo(() => {
    if (!topNotes || !tasks) return null;

    const q = search.toLowerCase().trim();

    const filterItem = <T extends { title: string; status: string; tags?: string[] }>(items: T[]): T[] => {
      let result = items;
      if (q) {
        result = result.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            ("text" in i && typeof (i as { text?: string }).text === "string" &&
              (i as { text: string }).text.toLowerCase().includes(q)) ||
            i.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (tagFilter) result = result.filter((i) => i.tags?.includes(tagFilter));
      if (statusFilter !== "all") result = result.filter((i) => i.status === statusFilter);
      return result;
    };

    const noteItems: AnyItem[] = (typeFilter === "all" || typeFilter === "note")
      ? filterItem(topNotes as NoteDoc[]).map((n) => ({ ...n, _kind: "note" as const }))
      : [];
    const taskItems: AnyItem[] = (typeFilter === "all" || typeFilter === "task")
      ? filterItem(tasks as TaskDoc[]).map((t) => ({ ...t, _kind: "task" as const }))
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

  const handleUpdateStatus = (droppedData: { _id: string; _kind: string }, newStatus: "idle" | "active" | "completed") => {
    if (droppedData._kind === "note") {
      // Find note to get current data for required fields
      const note = (topNotes as NoteDoc[])?.find((n) => n._id === droppedData._id);
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
          <div key={i} className="flex-1 rounded-xl bg-surface/30 border-t-2 border-border animate-pulse min-h-[300px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 h-full overflow-x-auto">
      {columns.map((col) => (
        <KanbanColumn
          key={col.key}
          colKey={col.key}
          label={col.label}
          color={col.color}
          items={col.items}
          globalTagColors={globalTagColors}
          onEdit={onEdit}
          onEditTask={onEditTask}
          onUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
}
