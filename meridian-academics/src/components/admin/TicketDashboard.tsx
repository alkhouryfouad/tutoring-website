"use client";

import { useState, useCallback, useMemo } from "react";

export type TicketStatus = "new" | "contacted" | "completed" | "archived";

export interface Ticket {
  id: string;
  student_name: string;
  grade: string;
  subjects: string;
  session_format: string;
  preferred_times: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  notes: string | null;
  status: TicketStatus;
  internal_notes: string | null;
  contacted_at: string | null;
  submitted_at: string;
  updated_at: string;
}

type FilterTab = "all" | TicketStatus;

const STATUS_LABEL: Record<TicketStatus, string> = {
  new: "New",
  contacted: "Contacted",
  completed: "Completed",
  archived: "Archived",
};

const STATUS_BADGE: Record<TicketStatus, string> = {
  new: "bg-amber-400/20 border-amber-400/40 text-charcoal-900",
  contacted: "bg-forest-400/15 border-forest-400/30 text-forest-700",
  completed: "bg-forest-600/15 border-forest-600/30 text-forest-700",
  archived: "bg-cream-200 border-cream-300 text-charcoal-700",
};

const STATUS_DOT: Record<TicketStatus, string> = {
  new: "bg-amber-400",
  contacted: "bg-forest-400",
  completed: "bg-forest-600",
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

interface TicketCardProps {
  ticket: Ticket;
  onUpdate: (updated: Ticket) => void;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

function TicketCard({ ticket, onUpdate, selected, onToggleSelect }: TicketCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [patchError, setPatchError] = useState("");
  const [notes, setNotes] = useState(ticket.internal_notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [expanded, setExpanded] = useState(ticket.status === "new");

  const patch = useCallback(
    async (payload: Record<string, unknown>, label: string) => {
      setLoading(label);
      setPatchError("");
      try {
        const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated: Ticket = await res.json();
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
    [ticket.id, onUpdate]
  );

  const saveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    setNotesError("");
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: notes }),
      });
      if (res.ok) {
        const updated: Ticket = await res.json();
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

  const { status } = ticket;
  const isBusy = loading !== null || savingNotes;

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
      <div className="flex items-stretch">
        {status === "new" && (
          <label
            className="flex items-center px-4 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(ticket.id)}
              className="w-4 h-4 rounded border-cream-300 text-forest-600 focus:ring-forest-600 cursor-pointer"
              aria-label={`Select ${ticket.parent_name}`}
            />
          </label>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex-1 text-left p-4 sm:p-5 ${status === "new" ? "pl-0" : ""}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
                {STATUS_LABEL[status]}
              </span>
              <span className="font-semibold text-charcoal-900 text-sm">
                {ticket.parent_name}
              </span>
              <span className="text-charcoal-700/50 text-xs hidden sm:inline">→</span>
              <span className="text-charcoal-700 text-sm hidden sm:inline">
                {ticket.student_name} · Gr.{ticket.grade}
              </span>
            </div>
            <span className="shrink-0 text-xs text-charcoal-700/60 whitespace-nowrap">
              {relativeTime(ticket.submitted_at)}
            </span>
          </div>
          <div className="mt-1.5 text-xs text-charcoal-700 flex flex-wrap gap-x-3 gap-y-0.5">
            <span>{ticket.subjects}</span>
            <span>·</span>
            <span>{ticket.session_format}</span>
            <span className="sm:hidden">· {ticket.student_name}, Gr.{ticket.grade}</span>
          </div>
        </button>
      </div>

      {expanded && (
        <div className="px-4 sm:px-5 pb-5 border-t border-cream-200 pt-4 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1">
                Parent / Guardian
              </p>
              <p className="font-medium text-charcoal-900">{ticket.parent_name}</p>
              <a href={`tel:${ticket.parent_phone}`} className="text-forest-600 hover:underline block">
                {ticket.parent_phone}
              </a>
              <a href={`mailto:${ticket.parent_email}`} className="text-forest-600 hover:underline block break-all">
                {ticket.parent_email}
              </a>
            </div>
            <div>
              <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1">
                Student
              </p>
              <p className="font-medium text-charcoal-900">{ticket.student_name}</p>
              <p className="text-charcoal-700">Grade {ticket.grade}</p>
              <p className="text-charcoal-700">{ticket.subjects}</p>
              <p className="text-charcoal-700">{ticket.session_format}</p>
              {ticket.preferred_times && (
                <p className="text-charcoal-700/70 text-xs mt-1">{ticket.preferred_times}</p>
              )}
            </div>
          </div>

          {ticket.notes && (
            <div>
              <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1">
                Notes from client
              </p>
              <p className="text-sm text-charcoal-900 bg-cream-100 rounded-lg p-3 whitespace-pre-wrap">
                {ticket.notes}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-charcoal-700/60 uppercase tracking-wide mb-1.5">
              Internal notes
            </p>
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
              <button
                onClick={saveNotes}
                disabled={isBusy}
                className="text-xs font-medium text-forest-600 hover:text-forest-500 disabled:opacity-50"
              >
                {savingNotes ? "Saving…" : notesSaved ? "✓ Saved" : "Save notes"}
              </button>
              {notesError && <span className="text-xs text-red-600">{notesError}</span>}
            </div>
          </div>

          <p className="text-xs text-charcoal-700/60">Submitted {fullDate(ticket.submitted_at)}</p>

          {patchError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {patchError}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {status === "new" && (
              <>
                <ActionButton label="Mark Contacted" busy={loading === "contacted"} disabled={isBusy} variant="primary" onClick={() => patch({ status: "contacted" }, "contacted")} />
                <ActionButton label="Mark Complete" busy={loading === "completed"} disabled={isBusy} variant="strong" onClick={() => patch({ status: "completed" }, "completed")} />
                <ActionButton label="Archive" busy={loading === "archived"} disabled={isBusy} variant="neutral" onClick={() => patch({ status: "archived" }, "archived")} />
              </>
            )}
            {status === "contacted" && (
              <>
                <ActionButton label="Mark Complete" busy={loading === "completed"} disabled={isBusy} variant="strong" onClick={() => patch({ status: "completed" }, "completed")} />
                <ActionButton label="Archive" busy={loading === "archived"} disabled={isBusy} variant="neutral" onClick={() => patch({ status: "archived" }, "archived")} />
              </>
            )}
            {status === "completed" && (
              <ActionButton label="Archive" busy={loading === "archived"} disabled={isBusy} variant="neutral" onClick={() => patch({ status: "archived" }, "archived")} />
            )}
            {(status === "archived" || status === "completed") && (
              <ActionButton label="Reopen" busy={loading === "new"} disabled={isBusy} variant="accent" onClick={() => patch({ status: "new" }, "new")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type Variant = "primary" | "strong" | "neutral" | "accent";

interface ActionButtonProps {
  label: string;
  busy: boolean;
  disabled: boolean;
  variant: Variant;
  onClick: () => void;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-forest-500 hover:bg-forest-400 text-white",
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

function matchesTicket(t: Ticket, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    t.parent_name.toLowerCase().includes(needle) ||
    t.student_name.toLowerCase().includes(needle) ||
    t.parent_email.toLowerCase().includes(needle) ||
    t.parent_phone.toLowerCase().includes(needle) ||
    t.subjects.toLowerCase().includes(needle) ||
    (t.notes ?? "").toLowerCase().includes(needle) ||
    (t.internal_notes ?? "").toLowerCase().includes(needle)
  );
}

interface TicketsPanelProps {
  tickets: Ticket[];
  search: string;
  onTicketsChange: (next: Ticket[]) => void;
}

export function TicketsPanel({ tickets, search, onTicketsChange }: TicketsPanelProps) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkError, setBulkError] = useState("");

  const handleUpdate = useCallback(
    (updated: Ticket) => {
      onTicketsChange(tickets.map((t) => (t.id === updated.id ? updated : t)));
    },
    [tickets, onTicketsChange]
  );

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = () => setSelected(new Set());

  const bulkContact = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBulkBusy(true);
    setBulkError("");
    try {
      const res = await fetch("/api/admin/tickets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status: "contacted" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setBulkError(data.error ?? "Bulk update failed.");
        return;
      }
      // Refetch so we get the server-canonical rows (including contacted_at).
      const refresh = await fetch("/api/admin/tickets");
      if (refresh.ok) onTicketsChange(await refresh.json());
      clearSelection();
    } catch {
      setBulkError("Network error.");
    } finally {
      setBulkBusy(false);
    }
  };

  const counts: Record<FilterTab, number> = {
    all: tickets.length,
    new: tickets.filter((t) => t.status === "new").length,
    contacted: tickets.filter((t) => t.status === "contacted").length,
    completed: tickets.filter((t) => t.status === "completed").length,
    archived: tickets.filter((t) => t.status === "archived").length,
  };

  const byStatus = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  const visible = useMemo(
    () => byStatus.filter((t) => matchesTicket(t, search)),
    [byStatus, search]
  );

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "completed", label: "Completed" },
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
            ? "No submissions yet."
            : `No ${STATUS_LABEL[filter as TicketStatus]?.toLowerCase()} tickets.`}
        </div>
      ) : (
        <div className="space-y-3 pb-24">
          {visible.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onUpdate={handleUpdate}
              selected={selected.has(ticket.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-4 px-4 z-20 pointer-events-none">
          <div className="max-w-md mx-auto bg-forest-600 text-white rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between gap-3 pointer-events-auto">
            <span className="text-sm font-medium">
              {selected.size} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={bulkContact}
                disabled={bulkBusy}
                className="rounded-lg bg-amber-400 hover:bg-amber-500 text-charcoal-900 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60"
              >
                {bulkBusy ? "Working…" : "Mark Contacted"}
              </button>
              <button
                onClick={clearSelection}
                className="text-xs text-white/80 hover:text-white px-2"
              >
                Clear
              </button>
            </div>
          </div>
          {bulkError && (
            <p className="max-w-md mx-auto mt-2 text-xs text-red-100 bg-red-700/80 rounded-lg px-3 py-2 pointer-events-auto">
              {bulkError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
