"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Feed } from "@/components/Feed";
import { ActivateBar } from "@/components/ActivateBar";
import { ActivateModal } from "@/components/ActivateModal";
import { AccountMenu } from "@/components/AccountMenu";
import { ConsentBanner } from "@/components/ConsentBanner";
import { NoteEditPanel } from "@/components/NoteEditPanel";
import { TaskEditPanel } from "@/components/TaskEditPanel";
import { CreateModal } from "@/components/CreateModal";
import { TagsPanel } from "@/components/TagsPanel";
import { TimelineView } from "@/components/TimelineView";
import { CommandPalette } from "@/components/CommandPalette";
import { KanbanView } from "@/components/KanbanView";
import { TrashView } from "@/components/TrashView";
import { AiAssistant } from "@/components/AiAssistant";

export default function Home() {
  const router = useRouter();
  useAuthActions();
  const user = useQuery(api.users.current);
  const sidebarNotes = useQuery(api.notes.listTopLevel);
  const sidebarTasks = useQuery(api.tasks.listAll);


  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<Id<"notes">>>(new Set());
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editNote, setEditNote] = useState<NoteDoc | null>(null);
  const [editTask, setEditTask] = useState<TaskDoc | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "note" | "task">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "idle" | "active" | "completed">("all");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<Id<"tasks">>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "timeline" | "kanban" | "trash">("table");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [createDefaultType, setCreateDefaultType] = useState<"note" | "task">("note");

  const uniqueTags = useMemo(() => {
    if (!sidebarNotes) return [];
    const set = new Set<string>();
    sidebarNotes.forEach((n) => (n as NoteDoc).tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [sidebarNotes]);

  const globalTagColors = useMemo((): Record<string, string> => {
    if (!sidebarNotes) return {};
    const map: Record<string, string> = {};
    sidebarNotes.forEach((n) => {
      (n as NoteDoc).tagColors?.forEach((tc) => {
        if (!map[tc.name]) map[tc.name] = tc.color; // first occurrence wins
      });
    });
    return map;
  }, [sidebarNotes]);

  if (user === null) {
    router.push("/signin");
    return null;
  }

  const handleSelect = (id: Id<"notes">) => {
    setSelectedNoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectTask = (id: Id<"tasks">) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClear = () => {
    setSelectedNoteIds(new Set());
    setSelectedTaskIds(new Set());
  };

  const trashNote = useMutation(api.notes.bin);
  const trashTask = useMutation(api.tasks.bin);
  const updateNote = useMutation(api.notes.update);
  const updateTask = useMutation(api.tasks.update);

  const handleBulkTrash = async () => {
    if (!confirm("Spostare gli elementi selezionati nel cestino?")) return;
    for (const id of selectedNoteIds) await trashNote({ noteId: id });
    for (const id of selectedTaskIds) await trashTask({ taskId: id });
    handleClear();
  };

  const handleBulkStatusChange = async (status: "idle" | "active" | "completed") => {
    for (const id of selectedNoteIds) await updateNote({ noteId: id, status });
    for (const id of selectedTaskIds) await updateTask({ taskId: id, status });
    handleClear();
  };

  const handleActivateClose = () => {
    setShowActivateModal(false);
    handleClear();
  };

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCreateNoteFromPalette = () => {
    setCreateDefaultType("note");
    setShowCreate(true);
  };
  const handleCreateTaskFromPalette = () => {
    setCreateDefaultType("task");
    setShowCreate(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="text-bg text-xs font-black">Q</span>
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-text tracking-tight">QUID</p>
            <p className="text-[9px] text-muted tracking-widest mt-0.5 uppercase">Notes & Tasks</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 px-3 py-3 border-b border-border">
          <div className="rounded-lg bg-bg border border-border px-3 py-2">
            <p className="text-[9px] text-muted uppercase tracking-widest font-medium">Note</p>
            <p className="text-xl font-bold text-text tabular-nums leading-tight">{sidebarNotes?.length ?? "–"}</p>
          </div>
          <div className="rounded-lg bg-bg border border-border px-3 py-2">
            <p className="text-[9px] text-muted uppercase tracking-widest font-medium">Task</p>
            <p className="text-xl font-bold text-text tabular-nums leading-tight">{sidebarTasks?.length ?? "–"}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 pt-3 px-2">
          <p className="text-[9px] text-muted uppercase tracking-widest px-2 mb-2 font-medium">Views</p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <button
                onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setViewMode("table"); }}
                className={cn("w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors", typeFilter === "all" && statusFilter === "all" && viewMode !== "trash" ? "text-text bg-bg/40 font-medium" : "text-muted hover:text-text")}
              >
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" /></svg>
                Inbox
                {sidebarNotes !== undefined && (
                  <span className="ml-auto text-[10px] text-muted tabular-nums bg-border/50 rounded px-1.5 py-0.5">{sidebarNotes.length}</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => { setTypeFilter("task"); setStatusFilter("active"); setViewMode("table"); }}
                className={cn("w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors", typeFilter === "task" && statusFilter === "active" && viewMode !== "trash" ? "text-text bg-bg/40 font-medium" : "text-muted hover:text-text")}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                Active Tasks
                {sidebarTasks !== undefined && (
                  <span className="ml-auto text-[10px] text-muted tabular-nums">{sidebarTasks.filter((t) => t.status === "active").length}</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => { setTypeFilter("all"); setStatusFilter("completed"); setViewMode("table"); }}
                className={cn("w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors", typeFilter === "all" && statusFilter === "completed" && viewMode !== "trash" ? "text-text bg-bg/40 font-medium" : "text-muted hover:text-text")}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Completed
                {sidebarTasks !== undefined && (
                  <span className="ml-auto text-[10px] text-muted tabular-nums">{sidebarTasks.filter((t) => t.status === "completed").length}</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowTagsPanel(true)}
                className="w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg text-muted hover:text-text transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /></svg>
                Tags
                {uniqueTags.length > 0 && (
                  <span className="ml-auto text-[10px] text-muted tabular-nums">{uniqueTags.length}</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setViewMode("trash")}
                className={cn(
                  "w-full text-left flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors",
                  viewMode === "trash" ? "text-text bg-bg/40 font-medium" : "text-muted hover:text-text"
                )}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                Trash
              </button>
            </li>
            <AiAssistant />
          </ul>

        </nav>

        {/* Account */}
        <div className="border-t border-border relative">
          <AccountMenu />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 bg-bg overflow-hidden flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-3 border-b border-border shrink-0">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 focus-within:border-accent transition-colors">
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes, tasks, tags…"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
            />
            {search ? (
              <button onClick={() => setSearch("")} className="text-muted hover:text-text text-lg leading-none transition-colors">×</button>
            ) : (
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden md:inline-flex text-[10px] text-muted border border-border rounded px-1.5 py-0.5 font-mono leading-none hover:text-text hover:border-slate-500 transition-colors"
              >
                ⌘K
              </button>
            )}
          </div>

          {/* Create button */}
          <button
            onClick={() => setShowCreate(true)}
            className="shrink-0 flex items-center gap-1.5 bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-violet-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New
          </button>
        </div>

        {/* Filter bar */}
        {viewMode !== "trash" && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border shrink-0 flex-wrap min-h-[40px]">
            {/* Type toggle */}
          <div className="flex gap-0.5 bg-bg rounded-lg p-0.5">
            {(["all", "note", "task"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "text-xs px-3 py-1 rounded-md font-medium transition-colors",
                  typeFilter === t ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
                )}
              >
                {t === "all" ? "Tutti" : t === "note" ? "Note" : "Task"}
              </button>
            ))}
          </div>

          {uniqueTags.length > 0 && <div className="w-px h-4 bg-border" />}

          {/* Tag chips */}
          <div className="flex gap-1.5 flex-wrap">
            {uniqueTags.map((tag) => {
              const c = globalTagColors[tag];
              return (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded font-medium transition-all",
                    !c && (tagFilter === tag
                      ? "bg-amber-500/40 text-amber-200 ring-1 ring-amber-400/60"
                      : "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/25 hover:bg-amber-500/30")
                  )}
                  style={c ? {
                    background: tagFilter === tag ? `${c}50` : `${c}28`,
                    color: tagFilter === tag ? `${c}` : c,
                    boxShadow: tagFilter === tag ? `0 0 0 1px ${c}80` : `0 0 0 1px ${c}44`,
                  } : undefined}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {(typeFilter !== "all" || tagFilter !== null || statusFilter !== "all") && (
            <button
              onClick={() => { setTypeFilter("all"); setTagFilter(null); setStatusFilter("all"); }}
              className="text-xs text-muted hover:text-text transition-colors flex items-center gap-1"
            >
              <span>×</span> Remove filters
            </button>
          )}

          {/* View toggle */}
          <div className={cn("flex gap-0.5 bg-bg rounded-lg p-0.5 shrink-0", typeFilter !== "all" || tagFilter !== null ? "" : "ml-auto")}>
            {/* Table view */}
            <button
              onClick={() => setViewMode("table")}
              title="Table view"
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "table" ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125" /></svg>
            </button>
            {/* Timeline view */}
            <button
              onClick={() => setViewMode("timeline")}
              title="Timeline view"
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "timeline" ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            </button>
            {/* Kanban view */}
            <button
              onClick={() => setViewMode("kanban")}
              title="Kanban view"
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === "kanban" ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4.5v15m6-15v15m-10.875 0c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125h-.375c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h.375Zm5.625 0c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125h-.375c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h.375Zm5.625 0c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125h-.375c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h.375Z" /></svg>
            </button>
          </div>
        </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "trash" ? (
            <TrashView />
          ) : viewMode === "table" ? (
            <div className="px-4 py-4">
              <Feed
                selectedNoteIds={selectedNoteIds}
                onSelect={handleSelect}
                onEdit={setEditNote}
                onEditTask={setEditTask}
                search={search}
                typeFilter={typeFilter}
                tagFilter={tagFilter}
                statusFilter={statusFilter}
                selectedTaskIds={selectedTaskIds}
                onSelectTask={handleSelectTask}
              />
            </div>
          ) : viewMode === "timeline" ? (
            <TimelineView
              onEdit={setEditNote}
              onEditTask={setEditTask}
              search={search}
              typeFilter={typeFilter}
              tagFilter={tagFilter}
              statusFilter={statusFilter}
              globalTagColors={globalTagColors}
            />
          ) : (
            <KanbanView
              onEdit={setEditNote}
              onEditTask={setEditTask}
              search={search}
              typeFilter={typeFilter}
              tagFilter={tagFilter}
              statusFilter={statusFilter}
              globalTagColors={globalTagColors}
            />
          )}
        </div>
      </main>

      {/* ── Note edit overlay ────────────────────────────────────────────── */}
      <AnimatePresence>
        {editNote && (
          <NoteEditPanel note={editNote} onClose={() => setEditNote(null)} globalTagColors={globalTagColors} />
        )}
      </AnimatePresence>

      {/* ── Task edit overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {editTask && (
          <TaskEditPanel task={editTask} onClose={() => setEditTask(null)} />
        )}
      </AnimatePresence>

      {/* ── Create modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} defaultType={createDefaultType} />}
      </AnimatePresence>

      {/* ── ACTIVATE bar ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {(selectedNoteIds.size > 0 || selectedTaskIds.size > 0) && (
          <ActivateBar
            noteCount={selectedNoteIds.size}
            taskCount={selectedTaskIds.size}
            onClear={handleClear}
            onActivate={() => setShowActivateModal(true)}
            onTrash={handleBulkTrash}
            onStatusChange={handleBulkStatusChange}
          />
        )}
      </AnimatePresence>

      {/* ── ACTIVATE modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showActivateModal && (
          <ActivateModal
            selectedNoteIds={[...selectedNoteIds]}
            onClose={handleActivateClose}
          />
        )}
      </AnimatePresence>

      {/* ── Tags panel ────────────────────────────────────────────────────── */}
      {showTagsPanel && (
        <TagsPanel
          globalTagColors={globalTagColors}
          onClose={() => setShowTagsPanel(false)}
        />
      )}

      {/* ── Command Palette ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette
            onClose={() => setShowCommandPalette(false)}
            onEditNote={setEditNote}
            onEditTask={setEditTask}
            onCreateNote={handleCreateNoteFromPalette}
            onCreateTask={handleCreateTaskFromPalette}
            onSwitchView={setViewMode}
            onOpenTags={() => { setShowCommandPalette(false); setShowTagsPanel(true); }}
          />
        )}
      </AnimatePresence>

      {/* ── Consent banner ─────────────────────────────────────────────────────── */}
      <ConsentBanner />

    </div>
  );
}
