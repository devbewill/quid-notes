"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { NoteDoc } from "@/lib/types";
import { Feed } from "@/components/Feed";
import { QuickAdd } from "@/components/QuickAdd";
import { ActivateBar } from "@/components/ActivateBar";
import { ActivateModal } from "@/components/ActivateModal";
import { AccountMenu } from "@/components/AccountMenu";
import { ConsentBanner } from "@/components/ConsentBanner";
import { NoteEditPanel } from "@/components/NoteEditPanel";

export default function Home() {
  const router = useRouter();
  useAuthActions(); // signOut available via AccountMenu
  const user = useQuery(api.users.current);

  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<Id<"notes">>>(
    new Set()
  );
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [editNote, setEditNote] = useState<NoteDoc | null>(null);

  // Redirect to sign-in if not authenticated
  if (user === null) {
    router.push("/signin");
    return null;
  }

  const handleSelect = (id: Id<"notes">) => {
    setSelectedNoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
        {/* Nav */}
        <nav className="flex-1 pt-6 px-2">
          <p className="text-xs text-muted uppercase tracking-widest px-2 mb-3">
            QUID
          </p>
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

        {/* Account menu at bottom */}
        <div className="border-t border-border relative">
          <AccountMenu />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 bg-bg overflow-y-auto min-w-0">
        <div className="px-4 py-4">
          <QuickAdd />
          <Feed
            selectedNoteIds={selectedNoteIds}
            onSelect={handleSelect}
            onEdit={setEditNote}
          />
        </div>
      </main>

      {/* ── Note edit panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {editNote && (
          <NoteEditPanel
            note={editNote}
            onClose={() => setEditNote(null)}
          />
        )}
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
