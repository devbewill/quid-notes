"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/cn";

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
          active ? "bg-accent-lighter text-accent-primary" : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
        )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-4 bg-border-subtle mx-0.5 shrink-0" />;
}

type ViewMode = "edit" | "split" | "preview";

function MarkdownPreview({ content }: { content: string }) {
  if (!content)
    return <p className="text-text-muted text-sm italic p-4">No content to display.</p>;

  return (
    <div className="p-5 overflow-y-auto h-full text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-text-primary mt-4 mb-2 pb-1 border-b border-border-subtle first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-text-primary mt-4 mb-1.5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-text-primary mt-3 mb-1 first:mt-0">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-text-primary mb-3 leading-relaxed last:mb-0">{children}</p>
          ),
          strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through text-text-muted">{children}</del>,
          a: ({ href, children }) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:opacity-80 underline underline-offset-2"
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
          li: ({ children }) => <li className="text-text-primary">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-primary pl-4 my-3 text-text-muted italic">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="bg-bg-elevated border border-border-subtle rounded-lg my-3 overflow-x-auto">
              {children}
            </pre>
          ),
          code: ({ children, className }) => {
            const isBlock = !!className;
            return isBlock ? (
              <code className="block text-xs text-text-primary font-mono p-4 leading-relaxed">
                {children}
              </code>
            ) : (
              <code className="bg-bg-elevated border border-border-subtle text-accent-primary px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          hr: () => <hr className="border-border-subtle my-5" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full rounded-lg my-3 border border-border-subtle"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-border-subtle">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-3 py-2 border-b border-border-subtle bg-bg-elevated font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-border-subtle text-text-primary last:border-b-0">
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.files.getImageUrl);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

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

  const handleLinkInsert = () => {
    if (linkUrl && linkUrl !== "https://") {
      const text = linkText.trim() || linkUrl;
      insert(`[${text}](${linkUrl})`);
    }
    setShowLinkDialog(false);
    setLinkUrl("https://");
    setLinkText("");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorContent = (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col overflow-hidden bg-bg-primary",
        isFullscreen ? "fixed inset-0 z-50" : "h-full"
      )}
    >
      <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border-subtle bg-bg-surface flex-wrap shrink-0">
        <TB title="Bold" onClick={() => insert("**", "**", "text")}>
          <strong className="font-bold">B</strong>
        </TB>
        <TB title="Italic" onClick={() => insert("*", "*", "text")}>
          <em className="italic">I</em>
        </TB>
        <TB title="Strikethrough" onClick={() => insert("~~", "~~", "text")}>
          <span className="line-through">S</span>
        </TB>
        <Divider />

        <TB title="Heading H1" onClick={() => insert("# ", "", "Heading")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </TB>
        <TB title="Heading H2" onClick={() => insert("## ", "", "Heading")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 15h13" />
          </svg>
        </TB>
        <TB title="Heading H3" onClick={() => insert("### ", "", "Heading")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h12" />
          </svg>
        </TB>
        <Divider />

        <TB title="Bulleted list" onClick={() => insert("- ", "", "item")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </TB>
        <TB title="Numbered list" onClick={() => insert("1. ", "", "item")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h12M8 12h12M8 18h12M4 5v2M3 11h2M3 17h2" />
          </svg>
        </TB>
        <TB title="Quote" onClick={() => insert("> ", "", "quote")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </TB>
        <Divider />

        <TB title="Inline code" onClick={() => insert("`", "`", "code")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16" />
          </svg>
        </TB>
        <TB title="Code block" onClick={() => insert("```\n", "\n```", "code")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </TB>
        <TB title="Horizontal divider" onClick={() => insert("\n---\n\n")}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </TB>
        <Divider />

        <TB title="Insert link" onClick={() => setShowLinkDialog((v) => !v)} active={showLinkDialog}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </TB>
        <TB title="Upload image" onClick={() => fileInputRef.current?.click()}>
          {uploading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </TB>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        <span className="flex-1" />
        <div className="flex gap-0.5 bg-bg-elevated border border-border-subtle rounded-md p-0.5 ml-2">
          {(["edit", "split", "preview"] as ViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "text-[10px] px-2 py-0.5 rounded transition-all duration-200",
                mode === m ? "bg-bg-primary text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
              )}
            >
              {m === "edit" ? "Write" : m === "split" ? "Split" : "Preview"}
            </button>
          ))}
        </div>
        <Divider />
        <TB title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={toggleFullscreen}>
          {isFullscreen ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </TB>
      </div>

      {showLinkDialog && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-bg-surface shrink-0 flex-wrap">
          <input
            autoFocus
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Link text"
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-xs text-text-primary outline-none focus:border-accent-primary w-32"
          />
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => e.key === "Enter" && handleLinkInsert()}
            className="flex-1 min-w-40 bg-bg-elevated border border-border-subtle rounded px-2 py-1 text-xs text-text-primary outline-none focus:border-accent-primary"
          />
          <button
            type="button"
            onClick={handleLinkInsert}
            className="text-xs px-3 py-1 rounded bg-accent-primary text-text-inverse font-medium hover:bg-accent-secondary transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowLinkDialog(false)}
            className="text-xs px-3 py-1 rounded text-text-muted hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {(mode === "edit" || mode === "split") && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="Write markdown content here..."
            spellCheck={false}
            className={cn(
              "resize-none outline-none bg-transparent text-sm text-text-primary placeholder:text-text-muted p-5 font-mono leading-relaxed h-full",
              mode === "split" ? "w-1/2 border-r border-border-subtle" : "w-full"
            )}
          />
        )}

        {(mode === "preview" || mode === "split") && (
          <div className={cn(mode === "split" ? "w-1/2 overflow-y-auto" : "w-full overflow-y-auto")}>
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        <div className="fixed inset-0 bg-bg-deep/90 z-40" />
        {editorContent}
      </>
    );
  }

  return editorContent;
}
