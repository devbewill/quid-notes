"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const requestDeletion = useMutation(api.users.requestDeletion);

  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmWord = t("delete_modal_confirm_word"); // "ELIMINA" or "DELETE"
  const isConfirmed = confirmText === confirmWord;

  const handleConfirm = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    try {
      await requestDeletion({});
      await signOut();
      router.replace("/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="bg-bg-surface border border-border-subtle rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
      >
        <h2 className="text-base text-text-primary font-semibold mb-2">
          ⚠️ {t("delete_modal_title")}
        </h2>
        <p className="text-sm text-text-muted mb-6">{t("delete_modal_desc")}</p>

        <label className="block text-xs text-text-muted uppercase tracking-widest mb-2">
          {t("delete_modal_type_hint")}
        </label>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={confirmWord}
          className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-semantic-error transition-colors mb-6"
        />

        {error && <p className="text-xs text-semantic-error mb-4">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="text-sm text-text-muted hover:text-text-primary transition-colors px-3"
          >
            {t("delete_modal_cancel_btn")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed || loading}
            className="text-sm font-semibold bg-semantic-error text-white rounded-full px-5 py-1.5
                       disabled:opacity-40 hover:bg-semantic-error/80 transition-colors"
          >
            {loading ? "…" : t("delete_modal_confirm_btn")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
