"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";
import { AccountMenu } from "./AccountMenu";
import { ThemeToggle } from "./ThemeToggle";
import {
  Inbox,
  Zap,
  CheckCircle,
  Tag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

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

export function Sidebar({
  viewMode,
  setViewMode,
  onShowTagsPanel,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  activeFilter,
  setActiveFilter,
}: SidebarProps) {
  const { isAuthenticated } = useConvexAuth();
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const shouldExpand = expanded || (isHovering && !pinned);

  const sidebarNotes = useQuery(
    api.notes.listTopLevel,
    isAuthenticated ? {} : "skip",
  );
  const sidebarTasks = useQuery(
    api.tasks.listAll,
    isAuthenticated ? {} : "skip",
  );

  const navItems = [
    {
      id: "inbox",
      label: "Inbox",
      icon: Inbox,
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
      icon: Zap,
      count:
        (sidebarNotes?.filter((n) => n.status === "active").length ?? 0) +
        (sidebarTasks?.filter((t) => t.status === "active").length ?? 0),
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
      icon: CheckCircle,
      count:
        (sidebarNotes?.filter((n) => n.status === "idle").length ?? 0) +
        (sidebarTasks?.filter((t) => t.status === "idle").length ?? 0),
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
      icon: CheckCircle,
      count:
        (sidebarNotes?.filter((n) => n.status === "completed").length ?? 0) +
        (sidebarTasks?.filter((t) => t.status === "completed").length ?? 0),
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
      icon: Tag,
      count: new Set(sidebarNotes?.flatMap((n) => n.tags ?? [])).size,
      onClick: onShowTagsPanel,
    },
    {
      id: "trash",
      label: "Trash",
      icon: Trash2,
      count: 0,
      onClick: () => setViewMode("trash"),
    },
  ];

  return (
    <motion.aside
      ref={sidebarRef}
      initial={false}
      animate={{ width: shouldExpand ? 300 : 60 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative bg-bg-surface border-r border-border-subtle flex flex-col shrink-0 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ willChange: "width" }}
    >
      {/* Logo — Purple Tech Accent */}
      <div
        className={cn(
          "px-5 py-6 border-b border-border-subtle flex items-center gap-3 transition-opacity duration-200",
          !shouldExpand && "justify-center px-0",
        )}
      >
        <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-accent-primary shadow-md">
          <span className="text-text-inverse font-black text-2xl">Q</span>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: shouldExpand ? 1 : 0, x: shouldExpand ? 0 : -8 }}
          transition={{ duration: 0.15 }}
          className="leading-none overflow-hidden"
          style={{ willChange: "opacity, transform" }}
        >
          <p className="text-lg font-bold text-text-primary tracking-tight whitespace-nowrap">
            QUID
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5 font-semibold whitespace-nowrap">
            Operative Engine
          </p>
        </motion.div>
      </div>

      {/* Quick Stats — Minimal inline */}
      <motion.div
        initial={false}
        animate={{
          opacity: shouldExpand ? 1 : 0,
          height: shouldExpand ? "auto" : 0,
          marginTop: shouldExpand ? 0 : -16,
        }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden"
        style={{ willChange: "opacity, height" }}
      >
        <div className="px-5 py-4 border-b border-border-subtle">
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
        </div>
      </motion.div>

      {/* Navigation — Clean list */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          {shouldExpand ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              style={{ willChange: "opacity" }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold",
                      activeFilter === item.id
                        ? "bg-accent-lighter text-accent-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.count > 0 && (
                      <span className="ml-auto text-xs font-semibold text-text-muted tabular-nums">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ChevronsRight className="w-6 h-6 text-text-muted" />
            </div>
          )}
        </div>
      </nav>

      {/* Pin Toggle - Only show when expanded */}
      <motion.div
        initial={false}
        animate={{
          opacity: shouldExpand ? 1 : 0,
          height: shouldExpand ? "auto" : 0,
        }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden"
        style={{ willChange: "opacity, height" }}
      >
        <div className="border-t border-border-subtle px-3 py-3">
          <button
            onClick={() => setPinned(!pinned)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold",
              pinned
                ? "bg-accent-lighter text-accent-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
            )}
            title={pinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {pinned ? (
              <ChevronRight className="w-5 h-5 shrink-0" />
            ) : (
              <ChevronLeft className="w-5 h-5 shrink-0" />
            )}
            <span>{pinned ? "Unpin" : "Pin"}</span>
          </button>
        </div>
      </motion.div>

      {/* Theme Toggle - Only show when expanded */}
      <motion.div
        initial={false}
        animate={{
          opacity: shouldExpand ? 1 : 0,
          height: shouldExpand ? "auto" : 0,
        }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden"
        style={{ willChange: "opacity, height" }}
      >
        <div className="border-t border-border-subtle px-3 py-3">
          <ThemeToggle expanded={true} />
        </div>
      </motion.div>

      {/* Account - Only show when expanded */}
      <motion.div
        initial={false}
        animate={{
          opacity: shouldExpand ? 1 : 0,
          height: shouldExpand ? "auto" : 0,
        }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden"
        style={{ willChange: "opacity, height" }}
      >
        <div className="border-t border-border-subtle">
          <AccountMenu />
        </div>
      </motion.div>
    </motion.aside>
  );
}
