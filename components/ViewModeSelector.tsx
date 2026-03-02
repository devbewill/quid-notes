"use client";

import { motion } from "framer-motion";
import { Grid3X3, Calendar, LayoutList } from "lucide-react";
import { cn } from "@/lib/cn";

interface ViewModeSelectorProps {
  viewMode: "table" | "timeline" | "kanban";
  setViewMode: (mode: "table" | "timeline" | "kanban") => void;
}

const viewModes = [
  { id: "table" as const, icon: Grid3X3, label: "Grid" },
  { id: "timeline" as const, icon: Calendar, label: "Timeline" },
  { id: "kanban" as const, icon: LayoutList, label: "Board" },
];

export function ViewModeSelector({ viewMode, setViewMode }: ViewModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-bg-elevated border border-border-subtle rounded-lg p-0.5">
      {viewModes.map((mode) => {
        const Icon = mode.icon;
        const isActive = viewMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={cn(
              "relative p-2 rounded-md transition-all duration-200",
              isActive
                ? "text-accent-primary"
                : "text-text-muted hover:text-text-secondary"
            )}
            title={mode.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeViewMode"
                className="absolute inset-0 bg-bg-surface rounded-md border border-border-subtle"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
          </button>
        );
      })}
    </div>
  );
}
