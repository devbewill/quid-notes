"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Feed } from "@/components/Feed";
import { ActivateBar } from "@/components/ActivateBar";
import { ActivateModal } from "@/components/ActivateModal";
import { ConsentBanner } from "@/components/ConsentBanner";
import { NoteEditPanel } from "@/components/NoteEditPanel";
import { TaskEditPanel } from "@/components/TaskEditPanel";
import { CreateModal } from "@/components/CreateModal";
import { TagsPanel } from "@/components/TagsPanel";
import { TimelineView } from "@/components/TimelineView";
import { CommandPalette } from "@/components/CommandPalette";
import { KanbanView } from "@/components/KanbanView";
import { TrashView } from "@/components/TrashView";
import { Sidebar } from "@/components/Sidebar";
import { CreateButton } from "@/components/CreateButton";
import { SearchBar } from "@/components/SearchBar";
import { ViewModeSelector } from "@/components/ViewModeSelector";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.current, isAuthenticated ? {} : "skip");
  const userWithDeleted = useQuery(
    api.users.currentWithDeleted,
    isAuthenticated ? {} : "skip",
  );
  const sidebarNotes = useQuery(
    api.notes.listTopLevel,
    isAuthenticated && user ? {} : "skip",
  );

  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<Id<"notes">>>(
    new Set(),
  );
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editNote, setEditNote] = useState<NoteDoc | null>(null);
  const [editTask, setEditTask] = useState<TaskDoc | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "note" | "task">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "idle" | "active" | "completed"
  >("all");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<Id<"tasks">>>(
    new Set(),
  );
  const [viewMode, setViewMode] = useState<
    "table" | "timeline" | "kanban" | "trash"
  >("table");
  const [activeFilter, setActiveFilter] = useState<
    "inbox" | "active" | "todo" | "completed"
  >("inbox");
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K → Toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Redirect to signin if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect to signin if user is soft-deleted
  useEffect(() => {
    if (!isLoading && isAuthenticated && userWithDeleted?.isDeleted) {
      console.log(
        "Soft-deleted user detected on home page, redirecting to signin...",
      );
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, userWithDeleted, router]);

  const uniqueTags = useMemo(() => {
    if (!sidebarNotes) return [];
    const set = new Set<string>();
    sidebarNotes.forEach((n) =>
      (n as NoteDoc).tags?.forEach((t) => set.add(t)),
    );
    return [...set].sort();
  }, [sidebarNotes]);

  const globalTagColors = useMemo((): Record<string, string> => {
    if (!sidebarNotes) return {};
    const map: Record<string, string> = {};
    sidebarNotes.forEach((n) => {
      (n as NoteDoc).tagColors?.forEach((tc) => (map[tc.name] = tc.color));
    });
    return map;
  }, [sidebarNotes]);

  const existingTags = useMemo((): Set<string> => {
    const set = new Set<string>();

    sidebarNotes?.forEach((n) => {
      (n as NoteDoc).tags?.forEach((t) => set.add(t.toLowerCase()));
    });

    return set;
  }, [sidebarNotes]);

  const filteredGlobalTagColors = useMemo((): Record<string, string> => {
    const filtered: Record<string, string> = {};
    Object.entries(globalTagColors).forEach(([tag, color]) => {
      if (existingTags.has(tag.toLowerCase())) {
        filtered[tag] = color;
      }
    });
    return filtered;
  }, [globalTagColors, existingTags]);

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

  const handleBulkTrash = async () => {
    if (selectedTaskIds.size > 0) {
      // Cannot bulk trash tasks via single API - implement if needed
    }
    if (selectedNoteIds.size > 0) {
      // Cannot bulk trash notes via single API - implement if needed
    }
    handleClear();
  };

  const handleBulkStatusChange = async (
    status: "idle" | "active" | "completed",
  ) => {
    // Implement bulk status change if needed
    handleClear();
  };

  const handleActivateClose = () => {
    setShowActivateModal(false);
    handleClear();
  };

  const handleCreateNoteFromPalette = () => {
    setShowCreate(true);
    setShowCommandPalette(false);
  };

  const handleCreateTaskFromPalette = () => {
    setShowCreate(true);
    setShowCommandPalette(false);
  };

  if (isLoading || !isAuthenticated || user === undefined) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 font-mono text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowTagsPanel={() => setShowTagsPanel(true)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-1 bg-bg-surface overflow-hidden flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center gap-4 px-6 pt-5 pb-4 border-b border-border-subtle shrink-0">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search notes, tasks, tags…"
              shortcut="⌘K"
            />
          </div>

          {/* View Mode Selector */}
          <ViewModeSelector
            viewMode={viewMode as "table" | "timeline" | "kanban"}
            setViewMode={setViewMode}
          />

          {/* Create button */}
          <CreateButton onClick={() => setShowCreate(true)} label="New" />
        </div>

        {/* Filter bar */}
        {viewMode !== "trash" && (
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border-subtle shrink-0 flex-wrap min-h-[44px]">
            {/* Type toggle */}
            <div className="flex gap-0.5 bg-bg-elevated rounded-md p-0.5 border border-border-subtle">
              {(["all", "note", "task"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-md font-medium transition-colors",
                    typeFilter === t
                      ? "bg-bg-surface text-text-primary"
                      : "text-text-muted hover:text-text-secondary",
                  )}
                >
                  {t === "all" ? "All" : t === "note" ? "Note" : "Task"}
                </button>
              ))}
            </div>

            {uniqueTags.length > 0 && (
              <div className="w-px h-5 bg-border-default mx-1" />
            )}

            {/* Tag chips */}
            <div className="flex gap-1.5 flex-wrap">
              {uniqueTags.map((tag) => {
                const c = globalTagColors[tag];
                return (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-md font-medium text-text-inverse",
                      !c &&
                        (tagFilter === tag
                          ? "bg-accent-primary"
                          : "bg-accent-primary/80"),
                    )}
                    style={
                      c
                        ? {
                            background: tagFilter === tag ? c : `${c}80`,
                          }
                        : undefined
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {(typeFilter !== "all" ||
              tagFilter !== null ||
              statusFilter !== "all") && (
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setTagFilter(null);
                  setStatusFilter("all");
                }}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1 ml-2"
              >
                <span>×</span> Clear filters
              </button>
            )}
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
          <NoteEditPanel
            note={editNote}
            onClose={() => setEditNote(null)}
            globalTagColors={globalTagColors}
          />
        )}
      </AnimatePresence>

      {/* ── Task edit overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {editTask && (
          <TaskEditPanel
            task={editTask}
            onClose={() => setEditTask(null)}
            onEditNote={setEditNote}
          />
        )}
      </AnimatePresence>

      {/* ── Create modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>

      {/* ── ACTIVATE bar ─────────────────────────────────────────── */}
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

      {/* ── Tags panel ────────────────────────────────────────────── */}
      {showTagsPanel && (
        <TagsPanel
          globalTagColors={filteredGlobalTagColors}
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
            onOpenTags={() => {
              setShowCommandPalette(false);
              setShowTagsPanel(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Consent banner ───────────────────────────────────────────────── */}
      <ConsentBanner />
    </div>
  );
}
