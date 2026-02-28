"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import { Feed } from "@/components/Feed";
import { ActivateBar } from "@/components/ActivateBar";
import { ActivateModal } from "@/components/ActivateModal";
import { AccountMenu } from "@/components/AccountMenu";
import { ConsentBanner } from "@/components/ConsentBanner";
import { NoteEditPanel } from "@/components/NoteEditPanel";
import { TaskEditPanel } from "@/components/TaskEditPanel";
import { CreateModal } from "@/components/CreateModal";

export default function Home() {
  const router = useRouter();
  useAuthActions();
  const user = useQuery(api.users.current);

  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<Id<"notes">>>(new Set());
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editNote, setEditNote] = useState<NoteDoc | null>(null);
  const [editTask, setEditTask] = useState<TaskDoc | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

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

  const handleClear = () => setSelectedNoteIds(new Set());

  const handleActivateClose = () => {
    setShowActivateModal(false);
    handleClear();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
        <nav className="flex-1 pt-6 px-2">
          <p className="text-xs text-muted uppercase tracking-widest px-2 mb-3">QUID</p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <button className="w-full text-left text-sm px-3 py-2 rounded-lg text-text bg-bg/40">
                Inbox
              </button>
            </li>
            <li>
              <button className="w-full text-left text-sm px-3 py-2 rounded-lg text-muted hover:text-text transition-colors">
                Active Tasks
              </button>
            </li>
          </ul>
        </nav>
        <div className="border-t border-border relative">
          <AccountMenu />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 bg-bg overflow-hidden flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 focus-within:border-accent transition-colors">
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca note e task per titolo, testo o tag…"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted hover:text-text text-lg leading-none transition-colors">
                ×
              </button>
            )}
          </div>

          {/* Create button */}
          <button
            onClick={() => setShowCreate(true)}
            className="shrink-0 flex items-center gap-1.5 bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Nuovo
          </button>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Feed
            selectedNoteIds={selectedNoteIds}
            onSelect={handleSelect}
            onEdit={setEditNote}
            onEditTask={setEditTask}
            search={search}
          />
        </div>
      </main>

      {/* ── Note edit overlay ────────────────────────────────────────────── */}
      <AnimatePresence>
        {editNote && (
          <NoteEditPanel note={editNote} onClose={() => setEditNote(null)} />
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
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>

      {/* ── ACTIVATE bar ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedNoteIds.size > 0 && (
          <ActivateBar
            count={selectedNoteIds.size}
            onClear={handleClear}
            onActivate={() => setShowActivateModal(true)}
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

      {/* ── Consent banner ───────────────────────────────────────────────── */}
      <ConsentBanner />
    </div>
  );
}
