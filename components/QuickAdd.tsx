"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useLocale } from "@/hooks/useLocale";

export function QuickAdd() {
  const { t } = useLocale();
  const createNote = useMutation(api.notes.create);

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setExpanded(true);
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Collapse only if focus leaves the entire container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (!title && !text) setExpanded(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createNote({
        title: title.trim(),
        text: text.trim(),
        startDate: startDate ? new Date(startDate).getTime() : undefined,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      });
      setTitle("");
      setText("");
      setStartDate("");
      setDueDate("");
      setExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mb-4 border border-border rounded-lg bg-surface overflow-hidden"
      onBlur={handleBlur}
    >
      {/* Collapsed state */}
      {!expanded && (
        <button
          type="button"
          onClick={handleFocus}
          className="w-full text-left px-4 py-3 text-sm text-muted hover:text-text transition-colors"
        >
          {t("quickadd_placeholder")}
        </button>
      )}

      {/* Expanded state */}
      <AnimatePresence>
        {expanded && (
          <motion.form
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleSubmit}
            className="p-4 flex flex-col gap-3"
          >
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("quickadd_title_placeholder")}
              required
              className="bg-transparent text-sm text-text placeholder:text-muted outline-none border-b border-border pb-1 focus:border-accent transition-colors"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("quickadd_text_placeholder")}
              rows={2}
              className="bg-transparent text-sm text-text placeholder:text-muted outline-none resize-none"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder={t("quickadd_start_placeholder")}
                className="bg-transparent text-xs text-muted outline-none"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder={t("quickadd_due_placeholder")}
                className="bg-transparent text-xs text-muted outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!title.trim() || loading}
                className="text-xs px-4 py-1.5 rounded-full bg-accent text-bg font-medium disabled:opacity-40 transition-opacity"
              >
                {loading ? "…" : t("quickadd_submit")}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
