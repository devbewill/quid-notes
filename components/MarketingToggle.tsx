"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MarketingToggle() {
  const { t } = useLocale();
  const user = useQuery(api.users.current);
  const updateMarketing = useMutation(api.users.updateMarketingConsent);

  if (!user) return null;

  const enabled = user.marketingConsent;

  return (
    <button
      onClick={() => updateMarketing({ marketingConsent: !enabled })}
      className="relative flex items-center justify-between w-full px-4 py-2 hover:bg-surface transition-colors group"
      aria-label="Toggle marketing emails"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-4 bg-border rounded-full p-0.5 transition-colors group-hover:bg-zinc-700">
          <motion.div
            animate={{ x: enabled ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-3 h-3 rounded-full ${enabled ? "bg-accent" : "bg-text"}`}
          />
        </div>
        <span className="text-sm text-text font-medium uppercase tracking-tight">
          {enabled ? t("account_marketing_enabled") : t("account_marketing_disabled")}
        </span>
      </div>
      <div className="text-muted group-hover:text-text transition-colors">
        <Mail size={14} />
      </div>
    </button>
  );
}
