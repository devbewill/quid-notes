"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CreateButtonProps {
  onClick: () => void;
  label?: string;
  shortcut?: string;
}

export function CreateButton({
  onClick,
  label = "New",
  shortcut,
}: CreateButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 rounded-md",
        "bg-accent-primary text-text-inverse",
        "border border-accent-primary",
        "text-sm font-medium",
        "transition-colors",
        "shadow-sm"
      )}
    >
      <span className="text-base">+</span>
      <span>{label}</span>
      {shortcut && (
        <span className="ml-2 px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono">
          {shortcut}
        </span>
      )}
    </motion.button>
  );
}
