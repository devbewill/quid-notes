"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";

// ─── Toolbar button ───────────────────────────────────────────────────────────
function TB({
  title,
  onClick,
  active,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        "px-1.5 py-0.5 rounded text-xs font-medium transition-colors select-none",
        active ? "bg-accent/20 text-accent" : "text-muted hover:text-text hover:bg-bg"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-4 bg-border mx-0.5 shrink-0" />;
}

type ViewMode = "edit" | "split" | "preview";

// ─── Markdown preview ─────────────────────────────────────────────────────────
function MarkdownPreview({ content }: { content: string }) {
  if (!content)
    return <p className="text-muted text-sm italic p-4">Nessun contenuto da visualizzare.</p>;

  return (
    <div className="p-5 overflow-y-auto h-full text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-text mt-4 mb-2 pb-1 border-b border-border first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-text mt-4 mb-1.5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-text mt-3 mb-1 first:mt-0">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-text mb-3 leading-relaxed last:mb-0">{children}</p>
          ),
          strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through text-muted">{children}</del>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="text-text">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-violet-400 pl-4 my-3 text-muted italic">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="bg-bg border border-border rounded-lg my-3 overflow-x-auto">
              {children}
            </pre>
          ),
          code: ({ children, className }) => {
            const isBlock = !!className;
            return isBlock ? (
              <code className="block text-xs text-green-300 font-mono p-4 leading-relaxed">
                {children}
              </code>
            ) : (
              <code className="bg-bg border border-border text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          hr: () => <hr className="border-border my-5" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full rounded-lg my-3 border border-border"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-border">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left text-[10px] text-muted uppercase tracking-wider px-3 py-2 border-b border-border bg-bg/60 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-border text-text last:border-b-0">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
}

export function MarkdownEditor({ value, onChange, onBlur }: Props) {
  const [mode, setMode] = useState<ViewMode>("edit");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const [uploading, setUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.files.getImageUrl);

  // Insert markdown at textarea cursor
  const insert = useCallback(
    (before: string, after = "", placeholder = "") => {
      const ta = textareaRef.current;
      if (!ta) { onChange(value + before + placeholder + after); return; }
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      const sel = value.slice(s, e) || placeholder;
      const next = value.slice(0, s) + before + sel + after + value.slice(e);
      onChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        const pos = s + before.length + sel.length;
        ta.setSelectionRange(pos, pos);
      });
    },
    [value, onChange]
  );

  // Image upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json() as { storageId: string };
      const publicUrl = await getImageUrl({ storageId: storageId as Parameters<typeof getImageUrl>[0]["storageId"] });
      if (publicUrl) {
        const alt = file.name.replace(/\.[^.]*$/, "");
        insert(`![${alt}](${publicUrl})`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Link insert
  const handleLinkInsert = () => {
    if (linkUrl && linkUrl !== "https://") {
      const text = linkText.trim() || linkUrl;
      insert(`[${text}](${linkUrl})`);
    }
    setShowLinkDialog(false);
    setLinkUrl("https://");
    setLinkText("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-bg/20 flex-wrap shrink-0">
        {/* Text */}
        <TB title="Grassetto" onClick={() => insert("**", "**", "testo")}><strong>B</strong></TB>
        <TB title="Corsivo" onClick={() => insert("*", "*", "testo")}><em>I</em></TB>
        <TB title="Barrato" onClick={() => insert("~~", "~~", "testo")}><span className="line-through">S</span></TB>
        <Divider />

        {/* Headings */}
        <TB title="Titolo H1" onClick={() => insert("# ", "", "Titolo")}>H1</TB>
        <TB title="Titolo H2" onClick={() => insert("## ", "", "Titolo")}>H2</TB>
        <TB title="Titolo H3" onClick={() => insert("### ", "", "Titolo")}>H3</TB>
        <Divider />

        {/* Lists */}
        <TB title="Lista puntata" onClick={() => insert("- ", "", "elemento")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
        </TB>
        <TB title="Lista numerata" onClick={() => insert("1. ", "", "elemento")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99" /></svg>
        </TB>
        <TB title="Citazione" onClick={() => insert("> ", "", "citazione")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
        </TB>
        <Divider />

        {/* Code */}
        <TB title="Codice inline" onClick={() => insert("`", "`", "codice")}><code className="text-xs">` `</code></TB>
        <TB title="Blocco codice" onClick={() => insert("```\n", "\n```", "codice")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>
        </TB>
        <TB title="Divisore orizzontale" onClick={() => insert("\n\n---\n\n")}>―</TB>
        <Divider />

        {/* Link & Image */}
        <TB title="Inserisci link" onClick={() => setShowLinkDialog((v) => !v)} active={showLinkDialog}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
        </TB>
        <TB title="Carica immagine" onClick={() => fileInputRef.current?.click()}>
          {uploading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
          )}
        </TB>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {/* Spacer + view mode */}
        <span className="flex-1" />
        <div className="flex gap-0.5 bg-bg rounded-md p-0.5 ml-2">
          {(["edit", "split", "preview"] as ViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "text-[10px] px-2 py-0.5 rounded transition-colors",
                mode === m ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
              )}
            >
              {m === "edit" ? "Scrivi" : m === "split" ? "Dividi" : "Anteprima"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Link dialog (inline bar) ── */}
      {showLinkDialog && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-bg/40 shrink-0 flex-wrap">
          <input
            autoFocus
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Testo del link"
            className="bg-surface border border-border rounded px-2 py-1 text-xs text-text outline-none focus:border-accent w-32"
          />
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => e.key === "Enter" && handleLinkInsert()}
            className="flex-1 min-w-40 bg-surface border border-border rounded px-2 py-1 text-xs text-text outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleLinkInsert}
            className="text-xs px-3 py-1 rounded bg-violet-500 text-white font-medium hover:bg-violet-400 transition-colors"
          >
            Inserisci
          </button>
          <button
            type="button"
            onClick={() => setShowLinkDialog(false)}
            className="text-xs text-muted hover:text-text transition-colors"
          >
            Annulla
          </button>
        </div>
      )}

      {/* ── Editor + Preview ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Textarea */}
        {(mode === "edit" || mode === "split") && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="Scrivi il contenuto in markdown..."
            spellCheck={false}
            className={cn(
              "resize-none outline-none bg-transparent text-sm text-text/90 placeholder:text-muted p-5 font-mono leading-relaxed",
              mode === "split" ? "w-1/2 border-r border-border" : "w-full"
            )}
          />
        )}

        {/* Preview */}
        {(mode === "preview" || mode === "split") && (
          <div className={cn(mode === "split" ? "w-1/2 overflow-y-auto" : "w-full overflow-y-auto")}>
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
}
