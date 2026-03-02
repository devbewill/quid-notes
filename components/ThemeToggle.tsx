"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  expanded?: boolean;
}

export function ThemeToggle({ expanded = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold",
        "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-8 h-4 bg-bg-elevated border border-border-subtle rounded-full p-0.5">
        <motion.div
          animate={{ x: theme === "light" ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-3 h-3 rounded-full bg-accent-primary"
        />
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text-primary"
          >
            {theme === "light" ? "Light" : "Dark"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
