"use client";

import { useState, useCallback } from "react";

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
  new: "bg-amber-100 text-amber-700 border-amber-200",
  contacted: "bg-sky-100 text-sky-700 border-sky-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_DOT: Record<TicketStatus, string> = {
  new: "bg-amber-400",
  contacted: "bg-sky-400",
  completed: "bg-emerald-500",
  archived: "bg-gray-300",
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
}

function TicketCard({ ticket, onUpdate }: TicketCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState(ticket.internal_notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [expanded, setExpanded] = useState(ticket.status === "new");

  const patch = useCallback(
    async (payload: Record<string, unknown>, label: string) => {
      setLoading(label);
      try {
        const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated: Ticket = await res.json();
          onUpdate(updated);
        }
      } finally {
        setLoading(null);
      }
    },
    [ticket.id, onUpdate]
  );

  const saveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
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
      }
    } finally {
      setSavingNotes(false);
    }
  };

  const { status } = ticket;
  const isBusy = loading !== null || savingNotes;

  return (
    <div
      className={`bg-white rounded-2xl border transition-shadow ${
        status === "new"
          ? "border-amber-200 shadow-sm"
          : status === "archived"
          ? "border-gray-200 opacity-60"
          : "border-gray-200"
      }`}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
              {STATUS_LABEL[status]}
            </span>
            <span className="font-semibold text-gray-900 text-sm">
              {ticket.parent_name}
            </span>
            <span className="text-gray-400 text-xs hidden sm:inline">→</span>
            <span className="text-gray-600 text-sm hidden sm:inline">
              {ticket.student_name} · Gr.{ticket.grade}
            </span>
          </div>
          <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap">
            {relativeTime(ticket.submitted_at)}
          </span>
        </div>
        <div className="mt-1.5 text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
          <span>{ticket.subjects}</span>
          <span>·</span>
          <span>{ticket.session_format}</span>
          <span className="sm:hidden">· {ticket.student_name}, Gr.{ticket.grade}</span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Parent / Guardian
              </p>
              <p className="font-medium text-gray-900">{ticket.parent_name}</p>
              <a
                href={`tel:${ticket.parent_phone}`}
                className="text-sky-600 hover:underline block"
              >
                {ticket.parent_phone}
              </a>
              <a
                href={`mailto:${ticket.parent_email}`}
                className="text-sky-600 hover:underline block break-all"
              >
                {ticket.parent_email}
              </a>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Student
              </p>
              <p className="font-medium text-gray-900">{ticket.student_name}</p>
              <p className="text-gray-600">Grade {ticket.grade}</p>
              <p className="text-gray-600">{ticket.subjects}</p>
              <p className="text-gray-600">{ticket.session_format}</p>
              {ticket.preferred_times && (
                <p className="text-gray-500 text-xs mt-1">{ticket.preferred_times}</p>
              )}
            </div>
          </div>

          {/* Client notes */}
          {ticket.notes && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                Notes from client
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                {ticket.notes}
              </p>
            </div>
          )}

          {/* Internal notes */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
              Internal notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesSaved(false);
              }}
              rows={3}
              placeholder="Add your follow-up notes here…"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={saveNotes}
                disabled={isBusy}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
              >
                {savingNotes ? "Saving…" : notesSaved ? "✓ Saved" : "Save notes"}
              </button>
            </div>
          </div>

          {/* Submitted date */}
          <p className="text-xs text-gray-400">
            Submitted {fullDate(ticket.submitted_at)}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {status === "new" && (
              <>
                <ActionButton
                  label="Mark Contacted"
                  busy={loading === "contacted"}
                  disabled={isBusy}
                  color="sky"
                  onClick={() => patch({ status: "contacted" }, "contacted")}
                />
                <ActionButton
                  label="Mark Complete"
                  busy={loading === "completed"}
                  disabled={isBusy}
                  color="emerald"
                  onClick={() => patch({ status: "completed" }, "completed")}
                />
                <ActionButton
                  label="Archive"
                  busy={loading === "archived"}
                  disabled={isBusy}
                  color="gray"
                  onClick={() => patch({ status: "archived" }, "archived")}
                />
              </>
            )}
            {status === "contacted" && (
              <>
                <ActionButton
                  label="Mark Complete"
                  busy={loading === "completed"}
                  disabled={isBusy}
                  color="emerald"
                  onClick={() => patch({ status: "completed" }, "completed")}
                />
                <ActionButton
                  label="Archive"
                  busy={loading === "archived"}
                  disabled={isBusy}
                  color="gray"
                  onClick={() => patch({ status: "archived" }, "archived")}
                />
              </>
            )}
            {status === "completed" && (
              <ActionButton
                label="Archive"
                busy={loading === "archived"}
                disabled={isBusy}
                color="gray"
                onClick={() => patch({ status: "archived" }, "archived")}
              />
            )}
            {(status === "archived" || status === "completed") && (
              <ActionButton
                label="Reopen"
                busy={loading === "new"}
                disabled={isBusy}
                color="amber"
                onClick={() => patch({ status: "new" }, "new")}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  busy: boolean;
  disabled: boolean;
  color: "sky" | "emerald" | "gray" | "amber";
  onClick: () => void;
}

const COLOR_MAP: Record<string, string> = {
  sky: "bg-sky-600 hover:bg-sky-700 text-white",
  emerald: "bg-emerald-600 hover:bg-emerald-700 text-white",
  gray: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  amber: "bg-amber-500 hover:bg-amber-600 text-white",
};

function ActionButton({ label, busy, disabled, color, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${COLOR_MAP[color]}`}
    >
      {busy ? "…" : label}
    </button>
  );
}

interface TicketDashboardProps {
  initialTickets: Ticket[];
}

export default function TicketDashboard({ initialTickets }: TicketDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleUpdate = useCallback((updated: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) setTickets(await res.json());
    } finally {
      setRefreshing(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const counts: Record<FilterTab, number> = {
    all: tickets.length,
    new: tickets.filter((t) => t.status === "new").length,
    contacted: tickets.filter((t) => t.status === "contacted").length,
    completed: tickets.filter((t) => t.status === "completed").length,
    archived: tickets.filter((t) => t.status === "archived").length,
  };

  const visible =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "completed", label: "Completed" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-[#1B4332] text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight">
              Meridian Academics
            </span>
            <span className="text-white/40 text-xs hidden sm:inline">— Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-xs text-white/70 hover:text-white transition-colors disabled:opacity-50"
            >
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
            <button
              onClick={logout}
              className="text-xs bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? "bg-[#1B4332] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Ticket list */}
        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {filter === "all"
              ? "No submissions yet."
              : `No ${STATUS_LABEL[filter as TicketStatus]?.toLowerCase()} tickets.`}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
