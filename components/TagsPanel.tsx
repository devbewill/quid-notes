"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";

interface Props {
  globalTagColors: Record<string, string>;
  onClose: () => void;
}

export function TagsPanel({ globalTagColors, onClose }: Props) {
  const updateTagColor = useMutation(api.tags.updateTagColor);

  // Local copy of colors so UI updates instantly even before Convex round-trip
  const [localColors, setLocalColors] = useState<Record<string, string>>({ ...globalTagColors });

  const tags = Object.keys(globalTagColors).sort();

  const handleColorChange = useCallback(
    (tagName: string, color: string) => {
      setLocalColors((prev) => ({ ...prev, [tagName]: color }));
    },
    []
  );

  const handleColorCommit = useCallback(
    (tagName: string, color: string) => {
      void updateTagColor({ tagName, color });
    },
    [updateTagColor]
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="tags-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        key="tags-panel"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-sm bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text">Gestisci Tag</p>
              <p className="text-[10px] text-muted mt-0.5">{tags.length} tag {tags.length === 1 ? "configurato" : "configurati"}</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-text text-xl leading-none transition-colors shrink-0"
            >
              ×
            </button>
          </div>

          {/* Tags list */}
          <div className="overflow-y-auto max-h-96">
            {tags.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
                <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center">
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-text font-medium">Nessun tag con colore</p>
                  <p className="text-xs text-muted mt-1">I colori dei tag vengono assegnati quando crei una nota e aggiungi un tag</p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {tags.map((tag) => {
                  const c = localColors[tag] ?? "#a78bfa";
                  return (
                    <li key={tag} className="flex items-center gap-3 px-5 py-3 hover:bg-bg/40 transition-colors">
                      {/* Color picker */}
                      <div className="relative shrink-0">
                        <input
                          type="color"
                          value={c}
                          onChange={(e) => handleColorChange(tag, e.target.value)}
                          onBlur={(e) => handleColorCommit(tag, e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          title="Cambia colore"
                        />
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white/20 shadow cursor-pointer transition-transform hover:scale-110"
                          style={{ background: c }}
                        />
                      </div>

                      {/* Tag badge */}
                      <span
                        className="flex-1 text-sm px-2.5 py-0.5 rounded font-medium"
                        style={{ background: `${c}28`, color: c, boxShadow: `0 0 0 1px ${c}44` }}
                      >
                        {tag}
                      </span>

                      {/* Hex */}
                      <span className="text-[10px] text-muted font-mono uppercase tabular-nums shrink-0">
                        {c.toUpperCase()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          {tags.length > 0 && (
            <div className="px-5 py-3 border-t border-border">
              <p className="text-[10px] text-muted">Clicca sul cerchio colorato per cambiare il colore. La modifica viene applicata a tutte le note che usano quel tag.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
