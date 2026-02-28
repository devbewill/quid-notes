"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import type { NoteDoc } from "@/lib/types";
import { MarkdownEditor } from "@/components/MarkdownEditor";

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

export function NoteEditPanel({ note, onClose, globalTagColors = {} }: Props) {
  const update = useMutation(api.notes.update);
  const remove = useMutation(api.notes.remove);

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [status, setStatus] = useState(note.status);
  const [startDate, setStartDate] = useState(tsToDate(note.startDate));
  const [dueDate, setDueDate] = useState(tsToDate(note.dueDate));
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const [tagColors, setTagColors] = useState<Array<{ name: string; color: string }>>(note.tagColors ?? []);
  const [tagInput, setTagInput] = useState("");
  const [tagColor, setTagColor] = useState("#a78bfa");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Suggestions: existing global tags matching input, not already added
  const suggestions = Object.keys(globalTagColors).filter(
    (t) => !tags.includes(t) && (tagInput === "" || t.includes(tagInput.toLowerCase().trim()))
  ).slice(0, 6);

  // Is the current input an existing tag?
  const isExistingTag = !!globalTagColors[tagInput.toLowerCase().trim()];

  useEffect(() => {
    setTitle(note.title);
    setText(note.text);
    setStatus(note.status);
    setStartDate(tsToDate(note.startDate));
    setDueDate(tsToDate(note.dueDate));
    setTags(note.tags ?? []);
    setTagColors(note.tagColors ?? []);
    setTagInput("");
    setTagColor("#a78bfa");
  }, [note._id]);

  const commit = (overrides: { status?: "idle" | "active" | "completed"; tags?: string[]; tagColors?: Array<{ name: string; color: string }> } = {}) =>
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
    if (!name || tags.includes(name)) { setTagInput(""); setShowSuggestions(false); return; }
    const nextTags = [...tags, name];
    const nextColors = [...tagColors.filter((c) => c.name !== name), { name, color }];
    setTags(nextTags);
    setTagColors(nextColors);
    setTagInput("");
    setShowSuggestions(false);
    commit({ tags: nextTags, tagColors: nextColors });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || tags.includes(t)) { setTagInput(""); return; }
    // Use established global color if tag already exists, otherwise use current picker color
    const color = globalTagColors[t] ?? tagColor;
    addTagWithColor(t, color);
  };

  const removeTag = (tag: string) => {
    const nextTags = tags.filter((t) => t !== tag);
    setTags(nextTags);
    commit({ tags: nextTags, tagColors });
  };

  // Helper: get color for a tag
  const getTagColor = (tag: string) => tagColors.find((c) => c.name === tag)?.color ?? "#a78bfa";

  const handleClose = () => { commit(); onClose(); };

  // Keep a stable ref so the ESC listener always calls the latest handleClose
  const handleCloseRef = useRef(handleClose);
  useEffect(() => { handleCloseRef.current = handleClose; });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleCloseRef.current(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleDelete = async () => {
    await remove({ noteId: note._id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-4xl min-w-[55%] h-[72vh] bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-6 py-4 border-b border-border">
          <div className="flex-1 min-w-0">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => commit()}
              placeholder="Titolo nota…"
              className="w-full text-lg font-semibold bg-transparent outline-none text-text placeholder:text-muted border-none"
            />
            <p className="text-[10px] text-muted mt-0.5 tabular-nums">
              Modificato {new Date(note.updatedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-muted hover:text-text text-2xl leading-none transition-colors shrink-0 mt-0.5"
          >
            ×
          </button>
        </div>

        {/* Body — two columns */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: meta */}
          <div className="w-56 shrink-0 border-r border-border p-5 flex flex-col gap-5 overflow-y-auto">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Stato
              </label>
              <select
                value={status}
                onChange={(e) => {
                  const s = e.target.value as "idle" | "active" | "completed";
                  setStatus(s);
                  commit({ status: s });
                }}
                className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-accent transition-colors"
              >
                <option value="idle">To Do</option>
                <option value="active">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Start date */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                Inizio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={() => commit()}
                className="bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Scadenza
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={() => commit()}
                className="bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-widest">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /></svg>
                Tag
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const c = getTagColor(tag);
                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium"
                      style={{ background: `${c}28`, color: c, boxShadow: `0 0 0 1px ${c}44` }}
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:opacity-70 leading-none">×</button>
                    </span>
                  );
                })}
              </div>

              {/* Tag input with autocomplete */}
              <div className="relative">
                <div className="flex gap-1.5 items-center">
                  {!isExistingTag && (
                    <input
                      type="color"
                      value={tagColor}
                      onChange={(e) => setTagColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 outline-none p-0 shrink-0"
                      title="Scegli colore (solo per nuovi tag)"
                    />
                  )}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
                      if (e.key === "Escape") setShowSuggestions(false);
                    }}
                    placeholder="Aggiungi tag..."
                    className="flex-1 bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none focus:border-accent transition-colors placeholder:text-muted"
                  />
                </div>

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                    {suggestions.map((s) => {
                      const c = globalTagColors[s];
                      return (
                        <button
                          key={s}
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); addTagWithColor(s, c); }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-bg/60 transition-colors flex items-center gap-2"
                        >
                          <span
                            className="px-1.5 py-0.5 rounded font-medium"
                            style={{ background: `${c}28`, color: c, boxShadow: `0 0 0 1px ${c}44` }}
                          >
                            {s}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Delete */}
            <div className="mt-auto pt-4 border-t border-border">
              <button
                onClick={handleDelete}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Elimina nota
              </button>
            </div>
          </div>

          {/* Right: markdown editor */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <MarkdownEditor
              value={text}
              onChange={setText}
              onBlur={() => commit()}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
