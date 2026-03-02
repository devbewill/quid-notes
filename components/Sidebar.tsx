"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";
import { AccountMenu } from "./AccountMenu";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  viewMode: "table" | "timeline" | "kanban" | "trash";
  setViewMode: (mode: "table" | "timeline" | "kanban" | "trash") => void;
  onShowTagsPanel: () => void;
  statusFilter: "all" | "idle" | "active" | "completed";
  setStatusFilter: (filter: "all" | "idle" | "active" | "completed") => void;
  typeFilter: "all" | "note" | "task";
  setTypeFilter: (filter: "all" | "note" | "task") => void;
  activeFilter: "inbox" | "active" | "todo" | "completed";
  setActiveFilter: (filter: "inbox" | "active" | "todo" | "completed") => void;
}

export function Sidebar({ viewMode, setViewMode, onShowTagsPanel, statusFilter, setStatusFilter, typeFilter, setTypeFilter, activeFilter, setActiveFilter }: SidebarProps) {
  const { isAuthenticated } = useConvexAuth();
  const [expanded, setExpanded] = useState(true);

  const sidebarNotes = useQuery(api.notes.listTopLevel, isAuthenticated ? {} : "skip");
  const sidebarTasks = useQuery(api.tasks.listAll, isAuthenticated ? {} : "skip");

  const navItems = [
    {
      id: "inbox",
      label: "Inbox",
      count: (sidebarNotes?.length ?? 0) + (sidebarTasks?.length ?? 0),
      onClick: () => {
        setStatusFilter("all");
        setTypeFilter("all");
        setActiveFilter("inbox");
        setViewMode("table");
      },
    },
    {
      id: "active",
      label: "Active",
      count: (sidebarNotes?.filter((n) => n.status === "active").length ?? 0) + (sidebarTasks?.filter((t) => t.status === "active").length ?? 0),
      onClick: () => {
        setStatusFilter("active");
        setTypeFilter("all");
        setActiveFilter("active");
        setViewMode("table");
      },
    },
    {
      id: "todo",
      label: "Todo",
      count: (sidebarNotes?.filter((n) => n.status === "idle").length ?? 0) + (sidebarTasks?.filter((t) => t.status === "idle").length ?? 0),
      onClick: () => {
        setStatusFilter("idle");
        setTypeFilter("all");
        setActiveFilter("todo");
        setViewMode("table");
      },
    },
    {
      id: "completed",
      label: "Done",
      count: (sidebarNotes?.filter((n) => n.status === "completed").length ?? 0) + (sidebarTasks?.filter((t) => t.status === "completed").length ?? 0),
      onClick: () => {
        setStatusFilter("completed");
        setTypeFilter("all");
        setActiveFilter("completed");
        setViewMode("table");
      },
    },
    {
      id: "tags",
      label: "Tags",
      count: new Set(sidebarNotes?.flatMap((n) => n.tags ?? [])).size,
      onClick: onShowTagsPanel,
    },
    {
      id: "trash",
      label: "Trash",
      count: 0,
      onClick: () => setViewMode("trash"),
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 300 : 60 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-bg-surface border-r border-border-subtle flex flex-col shrink-0 overflow-hidden"
    >
      {/* Logo — Purple Tech Accent */}
      <div
        className={cn(
          "px-5 py-6 border-b border-border-subtle flex items-center gap-3",
          !expanded && "justify-center px-0"
        )}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-accent-primary shadow-md"
        >
          <span className="text-text-inverse font-black text-2xl">Q</span>
        </motion.div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="leading-none"
            >
              <p className="text-lg font-bold text-text-primary tracking-tight">QUID</p>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5 font-semibold">
                Operative Engine
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats — Minimal inline */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 py-4 border-b border-border-subtle"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Notes</span>
              <span className="text-sm font-semibold text-text-primary tabular-nums">
                {sidebarNotes?.length ?? "–"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-accent-primary">Tasks</span>
              <span className="text-sm font-semibold text-accent-primary tabular-nums">
                {sidebarTasks?.length ?? "–"}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation — Clean list */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold",
                activeFilter === item.id
                  ? "bg-accent-lighter text-accent-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              )}
            >
              <AnimatePresence>
                {expanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.label}</motion.span>}
              </AnimatePresence>
              {item.count > 0 && expanded && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-auto text-xs font-semibold text-text-muted tabular-nums"
                >
                  {item.count}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="border-t border-border-subtle px-3 py-3">
        <ThemeToggle expanded={expanded} />
      </div>

      {/* Expand/Collapse Toggle — Minimal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-bg-surface border border-border-default flex items-center justify-center shadow-md text-text-muted hover:text-text-primary"
      >
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          ◀
        </motion.span>
      </motion.button>

      {/* Account */}
      <div className="border-t border-border-subtle">
        <AccountMenu />
      </div>
    </motion.aside>
  );
}
