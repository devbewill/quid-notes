"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────
type AnyItem = (NoteDoc & { _kind: "note" }) | (TaskDoc & { _kind: "task" });

// ─── Time bucketing ───────────────────────────────────────────────────────────
const BUCKET_PINNED = "__pinned__";
const BUCKET_TODAY = "__today__";
const BUCKET_WEEK = "__week__";

function getBucketKey(ts: number): string {
  const d = new Date(ts);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  if (ts >= todayStart.getTime()) return BUCKET_TODAY;
  if (ts >= weekStart.getTime()) return BUCKET_WEEK;
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function getBucketLabel(key: string): string {
  if (key === BUCKET_PINNED) return "Pinned";
  if (key === BUCKET_TODAY) return "Today";
  if (key === BUCKET_WEEK) return "Last week";
  const [year, month] = key.split("-");
  const d = new Date(parseInt(year), parseInt(month));
  const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const BUCKET_ORDER = [BUCKET_PINNED, BUCKET_TODAY, BUCKET_WEEK];

function sortBuckets(keys: string[]): string[] {
  const special = BUCKET_ORDER.filter((k) => keys.includes(k));
  const months = keys
    .filter((k) => !BUCKET_ORDER.includes(k))
    .sort((a, b) => {
      const [ya, ma] = a.split("-").map(Number);
      const [yb, mb] = b.split("-").map(Number);
      return yb !== ya ? yb - ya : mb - ma;
    });
  return [...special, ...months];
}

// ─── Strip markdown for preview ───────────────────────────────────────────────
function stripMd(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "[immagine]")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_~>]+/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

// ─── Status pill ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  idle: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
  active: "bg-sky-500/15 text-sky-400 ring-sky-500/20",
  completed: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
};
const STATUS_LABELS: Record<string, string> = {
  idle: "To Do",
  active: "In Progress",
  completed: "Completed",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded ring-1 font-medium", STATUS_STYLES[status] ?? "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20")}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Tag chip ─────────────────────────────────────────────────────────────────
function TagChip({ name, globalTagColors }: { name: string; globalTagColors: Record<string, string> }) {
  const c = globalTagColors[name];
  return c ? (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
      style={{ background: `${c}28`, color: c, boxShadow: `0 0 0 1px ${c}44` }}
    >
      {name}
    </span>
  ) : (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/25">
      {name}
    </span>
  );
}

// ─── Note card ────────────────────────────────────────────────────────────────
function NoteCard({
  note,
  globalTagColors,
  onEdit,
  index,
}: {
  note: NoteDoc;
  globalTagColors: Record<string, string>;
  onEdit: (n: NoteDoc) => void;
  index: number;
}) {
  const preview = stripMd(note.text);
  const overdue = !!note.dueDate && note.status !== "completed" && note.dueDate < Date.now();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => onEdit(note)}
      className="group relative cursor-pointer rounded-xl border border-border bg-surface hover:border-slate-500/40 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 overflow-hidden"
    >
      {/* Type accent line */}
      <div className="absolute left-0 inset-y-0 w-[3px] bg-slate-500/50 group-hover:bg-slate-400 transition-colors" />

      <div className="pl-5 pr-5 py-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-2.5">
          {note.isPinned && (
            <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          )}
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400/70">nota</span>
          <StatusPill status={note.status} />
          {overdue && (
            <span className="text-[9px] font-bold tracking-wide uppercase text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded ring-1 ring-rose-400/25 animate-pulse">
              Scaduto
            </span>
          )}
          <span className="ml-auto text-[10px] text-muted tabular-nums shrink-0">
            {new Date(note.updatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-text group-hover:text-white transition-colors leading-snug mb-1.5">
          {note.title}
        </p>

        {/* Preview */}
        {preview && (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-3">{preview}</p>
        )}

        {/* Footer: tags + dates */}
        <div className="flex items-center gap-2 flex-wrap">
          {note.tags?.map((t) => <TagChip key={t} name={t} globalTagColors={globalTagColors} />)}
          {note.dueDate && (
            <span className={cn(
              "ml-auto text-[10px] tabular-nums flex items-center gap-1 shrink-0",
              overdue ? "text-rose-400 font-medium" : "text-muted"
            )}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              {new Date(note.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Task card ────────────────────────────────────────────────────────────────
function TaskCard({
  task,
  onEditTask,
  index,
}: {
  task: TaskDoc;
  onEditTask: (t: TaskDoc) => void;
  index: number;
}) {
  const preview = stripMd(task.text);
  const overdue = !!task.dueDate && task.status !== "completed" && task.dueDate < Date.now();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => onEditTask(task)}
      className="group relative cursor-pointer rounded-xl border border-border bg-surface hover:border-violet-500/40 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 overflow-hidden"
    >
      {/* Type accent line */}
      <div className="absolute left-0 inset-y-0 w-[3px] bg-violet-500/50 group-hover:bg-violet-400 transition-colors" />

      <div className="pl-5 pr-5 py-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-2.5">
          {task.isPinned && (
            <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          )}
          <span className="text-[10px] font-bold tracking-widest uppercase text-violet-400/70">task</span>
          <StatusPill status={task.status} />
          {overdue && (
            <span className="text-[9px] font-bold tracking-wide uppercase text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded ring-1 ring-rose-400/25 animate-pulse">
              Scaduto
            </span>
          )}
          {task.linkedNoteIds.length > 0 && (
            <span className="text-[10px] text-muted flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
              {task.linkedNoteIds.length}
            </span>
          )}
          <span className="ml-auto text-[10px] text-muted tabular-nums shrink-0">
            {new Date(task.updatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-text group-hover:text-white transition-colors leading-snug mb-1.5">
          {task.title}
        </p>

        {/* Preview */}
        {preview && (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-3">{preview}</p>
        )}

        {/* Footer: dates */}
        <div className="flex items-center gap-4">
          {task.startDate && (
            <span className="text-[10px] text-muted flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5" /></svg>
              {new Date(task.startDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
            </span>
          )}
          {task.dueDate && (
            <span className={cn(
              "text-[10px] tabular-nums flex items-center gap-1",
              overdue ? "text-rose-400 font-medium" : "text-muted"
            )}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              {new Date(task.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-xs font-semibold text-text/60 uppercase tracking-[0.15em] shrink-0">{label}</span>
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] text-muted tabular-nums shrink-0">{count}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TimelineViewProps {
  onEdit: (note: NoteDoc) => void;
  onEditTask: (task: TaskDoc) => void;
  search: string;
  typeFilter: "all" | "note" | "task";
  tagFilter: string | null;
  statusFilter: "all" | "idle" | "active" | "completed";
  globalTagColors: Record<string, string>;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TimelineView({ onEdit, onEditTask, search, typeFilter, tagFilter, statusFilter, globalTagColors }: TimelineViewProps) {
  const topNotes = useQuery(api.notes.listTopLevel);
  const tasks = useQuery(api.tasks.listAll);

  const buckets = useMemo(() => {
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

    const all: AnyItem[] = [...noteItems, ...taskItems].sort((a, b) => b.updatedAt - a.updatedAt);

    const map = new Map<string, AnyItem[]>();
    for (const item of all) {
      const key = item.isPinned ? BUCKET_PINNED : getBucketKey(item.updatedAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }

    return sortBuckets([...map.keys()]).map((key) => ({
      key,
      label: getBucketLabel(key),
      items: map.get(key)!,
    }));
  }, [topNotes, tasks, search, typeFilter, tagFilter, statusFilter]);

  // Loading
  if (!buckets) {
    return (
      <div className="px-4 py-8 space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 bg-border/40 rounded animate-pulse w-24" />
            {[0, 1].map((j) => (
              <div key={j} className="h-24 bg-surface border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Empty
  if (buckets.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-text font-medium">{search ? "Nessun risultato" : "Nessuna voce ancora"}</p>
          <p className="text-xs text-muted mt-1">{search ? "Prova con parole chiave diverse" : "Crea la tua prima nota con il pulsante \"+ Nuovo\""}</p>
        </div>
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="px-4 py-5 space-y-8 max-w-2xl mx-auto">
      <AnimatePresence mode="popLayout">
        {buckets.map(({ key, label, items }) => (
          <motion.section
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <SectionHeader label={label} count={items.length} />

            <div className="space-y-3">
              {items.map((item) => {
                const idx = globalIndex++;
                return item._kind === "note" ? (
                  <NoteCard
                    key={item._id}
                    note={item as NoteDoc}
                    globalTagColors={globalTagColors}
                    onEdit={onEdit}
                    index={idx}
                  />
                ) : (
                  <TaskCard
                    key={item._id}
                    task={item as TaskDoc}
                    onEditTask={onEditTask}
                    index={idx}
                  />
                );
              })}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  );
}
