"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";

interface ActivateBarProps {
  count: number;
  onClear: () => void;
  onActivate: () => void;
}

export function ActivateBar({ count, onClear, onActivate }: ActivateBarProps) {
  const { t } = useLocale();
  const label =
    count === 1 ? t("activate_note_selected") : t("activate_notes_selected");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-6
                 bg-surface border border-border rounded-full
                 px-6 py-3 shadow-2xl"
    >
      <button
        onClick={onClear}
        className="text-sm text-muted hover:text-text transition-colors"
      >
        ✕ {t("activate_clear")}
      </button>

      <span className="text-sm text-text">
        {count} {label}
      </span>

      <button
        onClick={onActivate}
        className="text-sm font-semibold text-bg bg-accent rounded-full px-4 py-1.5
                   hover:opacity-90 transition-opacity"
      >
        ⚡ {t("activate_btn")}
      </button>
    </motion.div>
  );
}
