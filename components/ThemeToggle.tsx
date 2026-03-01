"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-full px-4 py-2 hover:bg-surface transition-colors group"
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-4 bg-border rounded-full p-0.5 transition-colors group-hover:bg-zinc-700">
          <motion.div
            animate={{ x: theme === "light" ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-3 h-3 rounded-full ${theme === "light" ? "bg-accent" : "bg-text"}`}
          />
        </div>
        <span className="text-sm text-text font-medium uppercase tracking-tight">
          {theme === "light" ? "Light" : "Dark"}
        </span>
      </div>
      <div className="text-muted group-hover:text-text transition-colors">
        {theme === "light" ? <Sun size={14} /> : <Moon size={14} />}
      </div>
    </button>
  );
}
