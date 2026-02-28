"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocale } from "@/hooks/useLocale";

export function ExportDataButton() {
  const { t } = useLocale();
  const exportData = useAction(api.users.exportData);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const json = await exportData({});
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      a.download = `quid-export-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="text-sm text-text hover:text-accent transition-colors disabled:opacity-50 text-left"
    >
      {loading ? t("export_loading") : t("export_btn")}
    </button>
  );
}
