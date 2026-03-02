"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { NoteDoc } from "@/lib/types";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { EditPanelLayout } from "@/components/EditPanelLayout";

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
  const togglePin = useMutation(api.notes.togglePin);
  const liveNote = useQuery(api.notes.get, { noteId: note._id });
  const displayNote = liveNote ?? note;

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [status, setStatus] = useState(note.status);
  const [startDate, setStartDate] = useState(tsToDate(note.startDate));
  const [dueDate, setDueDate] = useState(tsToDate(note.dueDate));
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const [tagColors, setTagColors] = useState<Array<{ name: string; color: string }>>(note.tagColors ?? []);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Suggestions: existing global tags matching input, not already added
  const suggestions = Object.keys(globalTagColors).filter(
    (t) => !tags.includes(t) && (tagInput === "" || t.includes(tagInput.toLowerCase().trim()))
  ).slice(0, 6);

  useEffect(() => {
    setTitle(note.title);
    setText(note.text);
    setStatus(note.status);
    setStartDate(tsToDate(note.startDate));
    setDueDate(tsToDate(note.dueDate));
    setTags(note.tags ?? []);
    setTagColors(note.tagColors ?? []);
    setTagInput("");
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
    const color = globalTagColors[t] ?? "#8B5CF6";
    addTagWithColor(t, color);
  };

  const removeTag = (tag: string) => {
    const nextTags = tags.filter((t) => t !== tag);
    setTags(nextTags);
    commit({ tags: nextTags, tagColors });
  };

  const getTagColor = (tag: string) => tagColors.find((c) => c.name === tag)?.color ?? "#8B5CF6";

  const handleClose = () => { commit(); onClose(); };

  const handleDelete = async () => {
    await remove({ noteId: note._id });
    onClose();
  };

  return (
    <EditPanelLayout
      title={title}
      onTitleChange={setTitle}
      onTitleBlur={() => commit()}
      titlePlaceholder="Note title…"
      label=""
      updatedAt={displayNote.updatedAt}
      isPinned={displayNote.isPinned ?? false}
      onTogglePin={() => togglePin({ noteId: note._id })}
      onClose={handleClose}
      sidebarContent={
        <>
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                const s = e.target.value as "idle" | "active" | "completed";
                setStatus(s);
                commit({ status: s });
              }}
              className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
            >
              <option value="idle">To Do</option>
              <option value="active">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Start date */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l6 6a2 2 0 0 1 0 2.828l-6 6a2 2 0 0 1-1.414.586H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /></svg>
              Tags
            </label>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="relative group px-2 py-0.5 rounded-md text-xs font-medium text-text-inverse transition-opacity"
                  style={{ backgroundColor: getTagColor(tag) }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-bg-elevated border border-border-subtle rounded-full flex items-center justify-center text-[8px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag…"
                className="flex-1 bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors"
              />
            </div>
            {/* Tag suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="relative mt-1 w-full bg-bg-surface border border-border-subtle rounded-lg shadow-lg p-1 z-50">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => addTagWithColor(s, globalTagColors[s])}
                    className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-bg-hover transition-colors text-text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="mt-auto pt-4 border-t border-border-subtle">
            <button
              onClick={handleDelete}
              className="w-full text-xs text-semantic-error hover:bg-accent-lighter py-2 rounded-lg transition-colors"
            >
              Delete note
            </button>
          </div>
        </>
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
