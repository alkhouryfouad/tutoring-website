"use client";

import { useState, useCallback, useMemo } from "react";

export type MessageStatus = "new" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  internal_notes: string | null;
  replied_at: string | null;
  submitted_at: string;
  updated_at: string;
}

type FilterTab = "all" | MessageStatus;

const STATUS_LABEL: Record<MessageStatus, string> = {
  new: "New",
  replied: "Replied",
  archived: "Archived",
};

const STATUS_BADGE: Record<MessageStatus, string> = {
  new: "bg-amber-400/20 border-amber-400/40 text-charcoal-900",
  replied: "bg-forest-600/15 border-forest-600/30 text-forest-700",
  archived: "bg-cream-200 border-cream-300 text-charcoal-700",
};

const STATUS_DOT: Record<MessageStatus, string> = {
  new: "bg-amber-400",
  replied: "bg-forest-600",
  archived: "bg-cream-300",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function fullDate(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MessageCardProps {
  message: ContactMessage;
  onUpdate: (updated: ContactMessage) => void;
}

function MessageCard({ message, onUpdate }: MessageCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [patchError, setPatchError] = useState("");
  const [notes, setNotes] = useState(message.internal_notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [expanded, setExpanded] = useState(message.status === "new");

  const patch = useCallback(
    async (payload: Record<string, unknown>, label: string) => {
      setLoading(label);
      setPatchError("");
      try {
        const res = await fetch(`/api/admin/messages/${message.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated: ContactMessage = await res.json();
          onUpdate(updated);
        } else {
          const data = await res.json().catch(() => ({}));
          setPatchError(data.error ?? "Update failed. Please try again.");
        }
      } catch {
        setPatchError("Network error. Please try again.");
      } finally {
        setLoading(null);
      }
    },
    [message.id, onUpdate]
  );

  const saveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    setNotesError("");
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: notes }),
      });
      if (res.ok) {
        const updated: ContactMessage = await res.json();
        onUpdate(updated);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setNotesError(data.error ?? "Could not save notes.");
      }
    } catch {
      setNotesError("Network error. Please try again.");
    } finally {
      setSavingNotes(false);
    }
  };

  const { status } = message;
  const isBusy = loading !== null || savingNotes;
  const preview = message.message.length > 120 ? message.message.slice(0, 120) + "…" : message.message;

  return (
    <div
      className={`bg-cream-50 rounded-2xl border transition-shadow ${
        status === "new"
          ? "border-amber-400/40 shadow-sm"
          : status === "archived"
          ? "border-cream-300 opacity-60"
          : "border-cream-300"
      }`}
    >
      <button onClick={() => setExpanded((v) => !v)} className="w-full text-left p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
              {STATUS_LABEL[status]}
            </span>
            <span className="font-semibold text-charcoal-900 text-sm">{message.name}</span>
            <span className="text-charcoal-700/50 text-xs hidden sm:inline">·</span>
            <span className="text-charcoal-700 text-sm hidden sm:inline break-all">{message.email}</span>
          </div>
          <span className="shrink-0 text-xs text-charcoal-700/60 whitespace-nowrap">
            {relativeTime(message.submitted_at)}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-charcoal-700 line-clamp-1">{preview}</p>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-5 border-t border-cream-200 pt-4 space-y-5">
          <div className="text-sm">
            <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1">From</p>
            <p className="font-medium text-charcoal-900">{message.name}</p>
            <a href={`mailto:${message.email}`} className="text-forest-600 hover:underline break-all">
              {message.email}
            </a>
          </div>

          <div>
            <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1">Message</p>
            <p className="text-sm text-charcoal-900 bg-cream-100 rounded-lg p-3 whitespace-pre-wrap">
              {message.message}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1.5">Internal notes</p>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesSaved(false);
                setNotesError("");
              }}
              rows={3}
              placeholder="Add your follow-up notes here…"
              className="w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-700/50 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent resize-none"
            />
            <div className="flex items-center gap-2 mt-1.5">
              <button onClick={saveNotes} disabled={isBusy} className="text-xs font-medium text-forest-600 hover:text-forest-500 disabled:opacity-50">
                {savingNotes ? "Saving…" : notesSaved ? "✓ Saved" : "Save notes"}
              </button>
              {notesError && <span className="text-xs text-red-600">{notesError}</span>}
            </div>
          </div>

          <p className="text-xs text-charcoal-700/60">Submitted {fullDate(message.submitted_at)}</p>

          {patchError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {patchError}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {status === "new" && (
              <>
                <ActionButton label="Mark Replied" busy={loading === "replied"} disabled={isBusy} variant="strong" onClick={() => patch({ status: "replied" }, "replied")} />
                <ActionButton label="Archive" busy={loading === "archived"} disabled={isBusy} variant="neutral" onClick={() => patch({ status: "archived" }, "archived")} />
              </>
            )}
            {status === "replied" && (
              <ActionButton label="Archive" busy={loading === "archived"} disabled={isBusy} variant="neutral" onClick={() => patch({ status: "archived" }, "archived")} />
            )}
            {(status === "archived" || status === "replied") && (
              <ActionButton label="Reopen" busy={loading === "new"} disabled={isBusy} variant="accent" onClick={() => patch({ status: "new" }, "new")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type Variant = "strong" | "neutral" | "accent";

interface ActionButtonProps {
  label: string;
  busy: boolean;
  disabled: boolean;
  variant: Variant;
  onClick: () => void;
}

const VARIANT_CLASS: Record<Variant, string> = {
  strong: "bg-forest-600 hover:bg-forest-500 text-white",
  neutral: "bg-cream-200 hover:bg-cream-300 text-charcoal-900",
  accent: "bg-amber-400 hover:bg-amber-500 text-charcoal-900",
};

function ActionButton({ label, busy, disabled, variant, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]}`}
    >
      {busy ? "…" : label}
    </button>
  );
}

function matchesMessage(m: ContactMessage, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    m.name.toLowerCase().includes(needle) ||
    m.email.toLowerCase().includes(needle) ||
    m.message.toLowerCase().includes(needle) ||
    (m.internal_notes ?? "").toLowerCase().includes(needle)
  );
}

interface MessagesPanelProps {
  messages: ContactMessage[];
  search: string;
  onMessagesChange: (next: ContactMessage[]) => void;
}

export function MessagesPanel({ messages, search, onMessagesChange }: MessagesPanelProps) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const handleUpdate = useCallback(
    (updated: ContactMessage) => {
      onMessagesChange(messages.map((m) => (m.id === updated.id ? updated : m)));
    },
    [messages, onMessagesChange]
  );

  const counts: Record<FilterTab, number> = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    replied: messages.filter((m) => m.status === "replied").length,
    archived: messages.filter((m) => m.status === "archived").length,
  };

  const byStatus = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const visible = useMemo(
    () => byStatus.filter((m) => matchesMessage(m, search)),
    [byStatus, search]
  );

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "replied", label: "Replied" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div>
      <div className="flex gap-1 bg-cream-50 border border-cream-300 rounded-xl p-1 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === tab.id
                ? "bg-forest-600 text-white shadow-sm"
                : "text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                filter === tab.id ? "bg-white/20 text-white" : "bg-cream-200 text-charcoal-700"
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {search && (
        <p className="text-xs text-charcoal-700 mb-3">
          {visible.length} of {byStatus.length} match &ldquo;{search}&rdquo;
        </p>
      )}

      {visible.length === 0 ? (
        <div className="text-center py-16 text-charcoal-700/60 text-sm font-serif">
          {search
            ? "No matches."
            : filter === "all"
            ? "No messages yet."
            : `No ${STATUS_LABEL[filter as MessageStatus]?.toLowerCase()} messages.`}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((m) => (
            <MessageCard key={m.id} message={m} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
