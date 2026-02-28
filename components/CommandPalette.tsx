"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc, TaskDoc } from "@/lib/types";
import { cn } from "@/lib/cn";

// ─── Action types ─────────────────────────────────────────────────────────────
type ActionKind = "note" | "task" | "action";

interface PaletteItem {
  id: string;
  kind: ActionKind;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const NoteIcon = (
  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
  </svg>
);
const TaskIcon = (
  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);
const ActionIcon = (
  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
  onEditNote: (note: NoteDoc) => void;
  onEditTask: (task: TaskDoc) => void;
  onCreateNote: () => void;
  onCreateTask: () => void;
  onSwitchView: (view: "table" | "timeline" | "kanban") => void;
  onOpenTags: () => void;
}

export function CommandPalette({
  onClose,
  onEditNote,
  onEditTask,
  onCreateNote,
  onCreateTask,
  onSwitchView,
  onOpenTags,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const notes = useQuery(api.notes.listTopLevel);
  const tasks = useQuery(api.tasks.listAll);

  // Build items list
  const items = useMemo((): PaletteItem[] => {
    const q = query.toLowerCase().trim();
    const result: PaletteItem[] = [];

    // Quick actions (always visible, filtered by name)
    const actions: PaletteItem[] = [
      { id: "a:new-note", kind: "action", title: "Nuova nota", subtitle: "Crea una nota", icon: ActionIcon, onSelect: () => { onClose(); onCreateNote(); } },
      { id: "a:new-task", kind: "action", title: "Nuovo task", subtitle: "Crea un task", icon: ActionIcon, onSelect: () => { onClose(); onCreateTask(); } },
      { id: "a:view-table", kind: "action", title: "Vista tabella", subtitle: "Cambia visualizzazione", icon: ActionIcon, onSelect: () => { onClose(); onSwitchView("table"); } },
      { id: "a:view-timeline", kind: "action", title: "Vista timeline", subtitle: "Cambia visualizzazione", icon: ActionIcon, onSelect: () => { onClose(); onSwitchView("timeline"); } },
      { id: "a:view-kanban", kind: "action", title: "Vista kanban", subtitle: "Cambia visualizzazione", icon: ActionIcon, onSelect: () => { onClose(); onSwitchView("kanban"); } },
      { id: "a:tags", kind: "action", title: "Gestisci tag", subtitle: "Apri pannello tag", icon: ActionIcon, onSelect: () => { onClose(); onOpenTags(); } },
    ];
    const filteredActions = q ? actions.filter((a) => a.title.toLowerCase().includes(q)) : actions;
    result.push(...filteredActions);

    // Notes
    if (notes) {
      const noteItems: PaletteItem[] = (notes as NoteDoc[])
        .filter((n) => !q || n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q) || n.tags?.some((t) => t.includes(q)))
        .slice(0, 8)
        .map((n) => ({
          id: `n:${n._id}`,
          kind: "note" as const,
          title: n.title || "Senza titolo",
          subtitle: n.tags?.join(", "),
          icon: NoteIcon,
          onSelect: () => { onClose(); onEditNote(n); },
        }));
      result.push(...noteItems);
    }

    // Tasks
    if (tasks) {
      const taskItems: PaletteItem[] = (tasks as TaskDoc[])
        .filter((t) => !q || t.title.toLowerCase().includes(q) || t.text.toLowerCase().includes(q))
        .slice(0, 5)
        .map((t) => ({
          id: `t:${t._id}`,
          kind: "task" as const,
          title: t.title || "Senza titolo",
          subtitle: t.status === "active" ? "In corso" : t.status === "completed" ? "Completato" : "To Do",
          icon: TaskIcon,
          onSelect: () => { onClose(); onEditTask(t); },
        }));
      result.push(...taskItems);
    }

    return result;
  }, [query, notes, tasks, onClose, onEditNote, onEditTask, onCreateNote, onCreateTask, onSwitchView, onOpenTags]);

  // Reset selection when items change
  useEffect(() => setSelectedIndex(0), [items.length, query]);

  // Auto focus
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].onSelect();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [items, selectedIndex, onClose]
  );

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Category labels
  const getCategory = (item: PaletteItem, index: number, list: PaletteItem[]) => {
    const prev = list[index - 1];
    if (!prev || prev.kind !== item.kind) {
      return item.kind === "action" ? "Azioni rapide" : item.kind === "note" ? "Note" : "Task";
    }
    return null;
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[61] w-full max-w-lg"
      >
        <div className="bg-surface border border-border rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cerca note, task o azioni…"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
            />
            <kbd className="text-[10px] text-muted border border-border rounded px-1.5 py-0.5 font-mono leading-none">ESC</kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted">Nessun risultato per &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              items.map((item, i) => {
                const cat = getCategory(item, i, items);
                return (
                  <div key={item.id}>
                    {cat && (
                      <p className="text-[10px] text-muted uppercase tracking-widest font-medium px-4 pt-3 pb-1">{cat}</p>
                    )}
                    <button
                      type="button"
                      onClick={item.onSelect}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                        selectedIndex === i ? "bg-bg/80 text-text" : "text-text/70 hover:bg-bg/40"
                      )}
                    >
                      {item.icon}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.subtitle && <p className="text-[10px] text-muted truncate">{item.subtitle}</p>}
                      </div>
                      {selectedIndex === i && (
                        <kbd className="text-[9px] text-muted border border-border rounded px-1 py-0.5 font-mono shrink-0">↵</kbd>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted">
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 font-mono">↑↓</kbd> naviga</span>
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 font-mono">↵</kbd> seleziona</span>
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 font-mono">esc</kbd> chiudi</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
