"use client";

import { useState, useEffect } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "@/hooks/useLocale";
import type { NoteDoc } from "@/lib/types";

interface ActivateModalProps {
  selectedNoteIds: Id<"notes">[];
  onClose: () => void;
}

type Tab = "manual" | "ai";

export function ActivateModal({
  selectedNoteIds,
  onClose,
}: ActivateModalProps) {
  const { t } = useTranslation();
  const createFromNotes = useMutation(api.tasks.createFromNotes);
  const generateProposals = useAction(api.ai.generateProposals);
  const topNotes = useQuery(api.notes.listTopLevel);

  const [tab, setTab] = useState<Tab>("manual");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [proposals, setProposals] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill description if exactly 1 note selected
  const selectedNotes =
    (topNotes as NoteDoc[] | undefined)?.filter((n) =>
      selectedNoteIds.includes(n._id as Id<"notes">),
    ) ?? [];

  // Initialize taskText with note text when 1 note selected
  useEffect(() => {
    if (selectedNotes.length === 1) {
      setTaskText(selectedNotes[0].text);
    } else {
      setTaskText("");
    }
  }, [selectedNotes]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await generateProposals({
        notes: selectedNotes.map((n) => ({ title: n.title, text: n.text })),
      });
      setProposals(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI error");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreate = async () => {
    if (!taskTitle.trim()) return;
    setCreating(true);
    try {
      await createFromNotes({
        title: taskTitle.trim(),
        text: taskText.trim(),
        linkedNoteIds: selectedNoteIds,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating task");
      setCreating(false);
    }
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="relative bg-bg-surface border border-border-subtle rounded-2xl p-8 w-full max-w-md mx-4 shadow-lg"
      >
        <h2 className="text-lg font-semibold tracking-tight mb-6 text-text-primary">
          ⚡ {t("activate_modal_title")}
        </h2>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-6 bg-bg-elevated rounded-lg p-1">
          {(["manual", "ai"] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${
                tab === tabKey
                  ? "bg-bg-surface text-text-primary font-medium"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tabKey === "manual"
                ? t("activate_tab_manual")
                : t("activate_tab_ai")}
            </button>
          ))}
        </div>

        {/* ── Manual tab ── */}
        {tab === "manual" && (
          <div className="flex flex-col gap-4">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={t("activate_task_title_placeholder")}
              required
              autoFocus
              className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-primary transition-colors"
            />
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder={t("activate_task_desc_placeholder")}
              rows={3}
              className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none resize-none"
            />
          </div>
        )}

        {/* ── AI tab ── */}
        {tab === "ai" && (
          <div className="flex flex-col gap-4">
            {/* Selected note chips */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
                {t("activate_ai_hint")}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedNotes.map((n) => (
                  <span
                    key={n._id}
                    className="text-xs bg-bg-elevated border border-border-subtle rounded-full px-3 py-1 text-text-primary"
                  >
                    {n.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Analyze button */}
            {proposals.length === 0 && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="text-sm font-medium bg-bg-surface border border-border-subtle rounded-lg py-2 text-text-primary hover:border-accent-primary transition-colors disabled:opacity-50"
              >
                {analyzing ? t("activate_analyzing") : t("activate_analyze")}
              </button>
            )}

            {/* Proposal cards */}
            {proposals.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-text-muted uppercase tracking-widest">
                  {t("activate_ai_pick")}
                </p>
                {proposals.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setTaskTitle(p)}
                    className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-colors ${
                      taskTitle === p
                        ? "border-accent-primary text-text-primary bg-bg-elevated"
                        : "border-border-subtle text-text-muted hover:border-border-default hover:text-text-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Task title input (after proposal selected) */}
            {taskTitle && (
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder={t("activate_task_title_placeholder")}
                className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-primary transition-colors"
              />
            )}
          </div>
        )}

        {/* Error */}
        {error && <p className="mt-3 text-xs text-semantic-error">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-sm text-text-muted hover:text-text-primary transition-colors px-3"
          >
            {t("activate_clear")}
          </button>
          <button
            onClick={handleCreate}
            disabled={!taskTitle.trim() || creating}
            className="text-sm font-semibold bg-accent-primary text-text-inverse rounded-full px-5 py-1.5 disabled:opacity-40 hover:bg-accent-secondary transition-colors"
          >
            {creating ? "…" : t("activate_create_task")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
