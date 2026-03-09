"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useLocale";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MarketingToggle() {
  const { t } = useTranslation();
  const user = useQuery(api.users.current);
  const updateMarketing = useMutation(api.users.updateMarketingConsent);

  if (!user) return null;

  const enabled = user.marketingConsent;

  return (
    <button
      onClick={() => updateMarketing({ marketingConsent: !enabled })}
      className="flex items-center justify-between w-full py-2 px-4 hover:bg-bg-hover transition-colors"
      aria-label="Toggle marketing emails"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-4 bg-bg-elevated border border-border-subtle rounded-full p-0.5">
          <motion.div
            animate={{ x: enabled ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-3 h-3 rounded-full ${enabled ? "bg-accent-primary" : "bg-text-muted"}`}
          />
        </div>
        <span className="text-sm text-text-primary font-medium">
          {enabled
            ? t("account_marketing_enabled")
            : t("account_marketing_disabled")}
        </span>
      </div>
      <div className="text-text-muted hover:text-text-primary transition-colors">
        <Mail size={14} />
      </div>
    </button>
  );
}
