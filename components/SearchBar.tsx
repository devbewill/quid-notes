"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  shortcut?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search notes, tasks, tags…",
  shortcut = "⌘K",
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-md",
          "bg-bg-surface border border-border-subtle",
          "transition-colors",
          focused ? "border-accent-primary" : ""
        )}
      >
        {/* Icon */}
        <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        {/* Input */}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent text-sm outline-none transition-colors",
            focused ? "text-text-primary" : "text-text-secondary"
          )}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={onClear}
            className="text-text-muted hover:text-text-secondary text-lg leading-none transition-colors"
          >
            ×
          </button>
        )}

        {/* Shortcut badge */}
        {!value && (
          <span className="hidden md:inline-flex text-[10px] text-text-muted border border-border-subtle rounded-md px-2 py-0.5 font-mono">
            {shortcut}
          </span>
        )}
      </div>

      {/* Keyboard hint */}
      {focused && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-0 text-[10px] text-text-muted font-mono"
        >
          Press <span className="text-accent-primary">Escape</span> to clear
        </motion.div>
      )}
    </div>
  );
}
