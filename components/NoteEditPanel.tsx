"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc } from "@/lib/types";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { EditPanelLayout } from "@/components/EditPanelLayout";
import { cn } from "@/lib/cn";

interface Props {
  note: NoteDoc;
  onClose: () => void;
  globalTagColors?: Record<string, string>;
}

function tsToDate(ts?: number) {
  return ts ? new Date(ts).toISOString().slice(0, 10) : "";
}

function dateToTs(val: string): number | undefined {
  return val ? new Date(val).getTime() : undefined;
}

// ─── Compact status selector - technical design ─────────────────────────────────────
function CompactStatusSelector({
  value,
  onChange,
}: {
  value: "idle" | "active" | "completed";
  onChange: (v: "idle" | "active" | "completed") => void;
}) {
  const options = [
    {
      value: "idle" as const,
      label: "TODO",
      color: "text-semantic-error border-semantic-error/30",
    },
    {
      value: "active" as const,
      label: "ACTIVE",
      color: "text-semantic-warning border-semantic-warning/30",
    },
    {
      value: "completed" as const,
      label: "DONE",
      color: "text-semantic-success border-semantic-success/30",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-mono font-bold text-accent-primary uppercase tracking-wider mr-2 border-b border-accent-primary/30 pb-0.5">
        STATUS:
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors",
            value === option.value
              ? `${option.color} bg-current/5`
              : "text-text-muted/40 border-border-subtle hover:text-text-muted/60",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ─── Compact date picker - technical design ──────────────────────────────────────
function CompactDatePicker({
  label,
  value,
  onChange,
  overdue = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  overdue?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "px-2 py-1 text-xs font-mono bg-bg-elevated border outline-none transition-colors",
            overdue
              ? "border-semantic-error/50 text-semantic-error"
              : "border-border-subtle text-text-muted hover:border-border-default",
          )}
        />
        {overdue && (
          <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-semantic-error" />
        )}
      </div>
    </div>
  );
}

// ─── Compact tag input - technical design ──────────────────────────────────────────
function CompactTagInput({
  tags,
  tagColors,
  globalTagColors,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[];
  tagColors: Array<{ name: string; color: string }>;
  globalTagColors: Record<string, string>;
  onAddTag: (name: string, color: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = Object.keys(globalTagColors)
    .filter(
      (t) =>
        !tags.includes(t) &&
        (input === "" || t.toLowerCase().includes(input.toLowerCase())),
    )
    .slice(0, 5);

  const handleAddTag = (name: string, color?: string) => {
    const t = name.trim().toLowerCase();
    if (!t || tags.includes(t)) {
      setInput("");
      setShowSuggestions(false);
      return;
    }
    const c = color ?? globalTagColors[t] ?? "#8B5CF6";
    onAddTag(t, c);
    setInput("");
    setShowSuggestions(false);
  };

  const getTagColor = (tag: string) =>
    tagColors.find((c) => c.name === tag)?.color ?? "#8B5CF6";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-text-muted/60 uppercase tracking-wider whitespace-nowrap">
          TAGS
        </span>

        {/* Tags display */}
        <div className="flex gap-1 flex-wrap">
          <AnimatePresence mode="popLayout">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border border-border-subtle"
                style={{
                  backgroundColor: `${getTagColor(tag)}15`,
                  color: getTagColor(tag),
                }}
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-semantic-error transition-colors"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(input);
              }
            }}
            placeholder="+"
            className="w-8 px-1 py-1 text-xs font-mono bg-bg-elevated border border-border-subtle text-text-muted outline-none focus:border-border-default transition-colors text-center"
          />

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 mt-1 bg-bg-surface border border-border-subtle z-50 min-w-[120px]"
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAddTag(s, globalTagColors[s])}
                    className="w-full text-left px-2 py-1 text-[10px] font-mono text-text-muted hover:bg-bg-hover border-b border-border-subtle/50 last:border-0 flex items-center gap-2"
                  >
                    <div
                      className="w-2 h-2 border border-border-subtle"
                      style={{ backgroundColor: globalTagColors[s] }}
                    />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function NoteEditPanel({ note, onClose, globalTagColors = {} }: Props) {
  const update = useMutation(api.notes.update);
  const remove = useMutation(api.notes.remove);
  const togglePin = useMutation(api.notes.togglePin);
  const liveNote = useQuery(api.notes.get, { noteId: note._id });
  const displayNote = liveNote ?? note;

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [status, setStatus] = useState(note.status);
  const [startDate, setStartDate] = useState(tsToDate(note.startDate));
  const [dueDate, setDueDate] = useState(tsToDate(note.dueDate));
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const [tagColors, setTagColors] = useState<
    Array<{ name: string; color: string }>
  >(note.tagColors ?? []);

  useEffect(() => {
    setTitle(note.title);
    setText(note.text);
    setStatus(note.status);
    setStartDate(tsToDate(note.startDate));
    setDueDate(tsToDate(note.dueDate));
    setTags(note.tags ?? []);
    setTagColors(note.tagColors ?? []);
  }, [note._id]);

  const commit = (
    overrides: {
      status?: "idle" | "active" | "completed";
      tags?: string[];
      tagColors?: Array<{ name: string; color: string }>;
    } = {},
  ) =>
    void update({
      noteId: note._id,
      title,
      text,
      status: overrides.status ?? status,
      startDate: dateToTs(startDate),
      dueDate: dateToTs(dueDate),
      tags: overrides.tags ?? tags,
      tagColors: overrides.tagColors ?? tagColors,
    });

  const addTagWithColor = (name: string, color: string) => {
    if (!name || tags.includes(name)) return;
    const nextTags = [...tags, name];
    const nextColors = [
      ...tagColors.filter((c) => c.name !== name),
      { name, color },
    ];
    setTags(nextTags);
    setTagColors(nextColors);
    commit({ tags: nextTags, tagColors: nextColors });
  };

  const removeTag = (tag: string) => {
    const nextTags = tags.filter((t) => t !== tag);
    const nextColors = tagColors.filter((c) => c.name !== tag);
    setTags(nextTags);
    setTagColors(nextColors);
    commit({ tags: nextTags, tagColors: nextColors });
  };

  const handleClose = () => {
    commit();
    onClose();
  };

  const handleDelete = async () => {
    await remove({ noteId: note._id });
    onClose();
  };

  const isOverdue =
    !!dueDate &&
    status !== "completed" &&
    new Date(dueDate).getTime() < Date.now();

  return (
    <EditPanelLayout
      title={title}
      onTitleChange={setTitle}
      onTitleBlur={() => commit()}
      titlePlaceholder="Note title…"
      label="NOTE"
      updatedAt={displayNote.updatedAt}
      isPinned={displayNote.isPinned ?? false}
      onTogglePin={() => togglePin({ noteId: note._id })}
      onClose={handleClose}
      toolbarContent={
        <div className="flex items-center gap-4 flex-wrap">
          <CompactStatusSelector
            value={status}
            onChange={(s) => {
              setStatus(s);
              commit({ status: s });
            }}
          />

          <div className="w-px h-4 bg-border-subtle" />

          <CompactDatePicker
            label="START"
            value={startDate}
            onChange={setStartDate}
          />

          <CompactDatePicker
            label="DUE"
            value={dueDate}
            onChange={setDueDate}
            overdue={isOverdue}
          />

          <div className="w-px h-4 bg-border-subtle" />

          <CompactTagInput
            tags={tags}
            tagColors={tagColors}
            globalTagColors={globalTagColors}
            onAddTag={addTagWithColor}
            onRemoveTag={removeTag}
          />

          <div className="ml-auto">
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-[10px] font-mono font-bold text-semantic-error border border-semantic-error/30 hover:bg-semantic-error/10 transition-colors uppercase tracking-wider"
            >
              [DELETE]
            </button>
          </div>
        </div>
      }
      mainContent={
        <MarkdownEditor
          value={text}
          onChange={setText}
          onBlur={() => commit()}
        />
      }
    />
  );
}
