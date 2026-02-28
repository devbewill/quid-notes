"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

const CONSENT_KEY = "quid_consent_v1";

export function ConsentBanner() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50
                    bg-surface border border-border rounded-xl px-5 py-4 shadow-2xl">
      <p className="text-sm text-text mb-3">{t("consent_message")}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={handleAccept}
          className="text-sm font-medium bg-accent text-bg rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity"
        >
          {t("consent_accept")}
        </button>
        <Link
          href="/privacy"
          target="_blank"
          className="text-sm text-muted hover:text-text transition-colors underline underline-offset-2"
        >
          {t("consent_privacy_link")}
        </Link>
      </div>
    </div>
  );
}
