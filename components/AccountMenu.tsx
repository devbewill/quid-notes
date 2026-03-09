"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/hooks/useLocale";
import { ExportDataButton } from "./ExportDataButton";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { MarketingToggle } from "./MarketingToggle";

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-3">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-2 px-4">
        {label}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function MenuItem({
  onClick,
  children,
  danger,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left text-sm px-4 py-2 transition-colors ${
        danger
          ? "text-semantic-error hover:text-semantic-error/80"
          : "text-text-primary hover:bg-bg-hover"
      }`}
    >
      {children}
    </button>
  );
}

export function AccountMenu() {
  const { t } = useTranslation();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.current);
  const updateProfile = useMutation(api.users.updateProfile);

  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    await updateProfile({ name: nameInput.trim() });
    setEditingName(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-3 w-full hover:bg-bg-hover transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-xs font-semibold text-text-primary flex-shrink-0">
          {initials}
        </span>
        <span className="text-sm text-text-primary truncate">
          {user.name ?? user.email}
        </span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-14 left-2 z-50 w-72 bg-bg-surface border border-border-subtle rounded-lg shadow-lg overflow-hidden"
            >
              {/* User info */}
              <div className="px-4 py-4 border-b border-border-subtle">
                <p className="text-sm font-medium text-text-primary">
                  {user.name ?? user.email}
                </p>
                <p className="text-xs text-text-muted">{user.email}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {t("auth_registered_via")}{" "}
                  {user.authProvider === "google"
                    ? t("auth_google")
                    : t("auth_email")}
                </p>
              </div>

              {/* ACCOUNT section */}
              <Section label={t("account_section")}>
                {editingName ? (
                  <div className="px-4 py-2 flex gap-2">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={t("account_name_placeholder")}
                      className="flex-1 bg-bg-elevated border border-border-subtle rounded-md px-2 py-1 text-sm text-text-primary outline-none focus:border-accent-primary"
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-xs text-accent-primary font-medium"
                    >
                      {t("account_save")}
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="text-xs text-text-muted"
                    >
                      {t("account_cancel")}
                    </button>
                  </div>
                ) : (
                  <MenuItem
                    onClick={() => {
                      setNameInput(user.name ?? "");
                      setEditingName(true);
                    }}
                  >
                    {t("account_edit_profile")}
                  </MenuItem>
                )}

                {/* Change password — email auth only */}
                {user.authProvider === "email" && (
                  <MenuItem>{t("account_change_password")}</MenuItem>
                )}

                {/* Marketing toggle */}
                <div className="flex items-center justify-between px-4 py-2">
                  <MarketingToggle />
                </div>
              </Section>

              <div className="border-t border-border-subtle" />

              {/* DATA & PRIVACY section */}
              <Section label={t("privacy_section")}>
                <div className="px-4 py-2">
                  <ExportDataButton />
                </div>
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-sm text-text-primary hover:bg-bg-hover px-4 py-2 transition-colors block"
                >
                  {t("privacy_policy_link")}
                </Link>
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-sm text-text-primary hover:bg-bg-hover px-4 py-2 transition-colors block"
                >
                  {t("terms_link")}
                </Link>
              </Section>

              <div className="border-t border-border-subtle" />

              {/* DANGER ZONE */}
              <Section label={t("danger_zone_section")}>
                <MenuItem
                  danger
                  onClick={() => {
                    setOpen(false);
                    setShowDeleteModal(true);
                  }}
                >
                  {t("danger_zone_delete")}
                </MenuItem>
              </Section>

              <div className="border-t border-border-subtle" />

              {/* Sign out */}
              <button
                onClick={() => signOut()}
                className="w-full text-left text-sm text-text-muted hover:text-text-primary px-4 py-3 transition-colors"
              >
                {t("account_sign_out")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete modal — outside of dropdown */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
