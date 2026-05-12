"use client";

import { type Ticket } from "./TicketDashboard";

const WEEK_MS = 7 * 24 * 3600 * 1000;
const MONTH_MS = 30 * 24 * 3600 * 1000;

function formatDuration(ms: number): string {
  const hours = ms / 3_600_000;
  if (hours < 1) {
    const minutes = Math.round(ms / 60_000);
    return `${minutes}m`;
  }
  if (hours < 48) return `${hours.toFixed(1)}h`;
  const days = hours / 24;
  return `${days.toFixed(1)}d`;
}

interface StatsBarProps {
  tickets: Ticket[];
}

export default function StatsBar({ tickets }: StatsBarProps) {
  const now = Date.now();
  const weekAgo = now - WEEK_MS;
  const monthAgo = now - MONTH_MS;

  const newThisWeek = tickets.filter(
    (t) => t.status === "new" && Date.parse(t.submitted_at) > weekAgo
  ).length;

  const open = tickets.filter(
    (t) => t.status === "new" || t.status === "contacted"
  ).length;

  const respondedRecently = tickets.filter(
    (t) =>
      t.contacted_at !== null && Date.parse(t.submitted_at) > monthAgo
  );

  const avgResponse =
    respondedRecently.length === 0
      ? null
      : respondedRecently.reduce(
          (sum, t) => sum + (Date.parse(t.contacted_at!) - Date.parse(t.submitted_at)),
          0
        ) / respondedRecently.length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <Tile value={String(newThisWeek)} label="new this week" />
      <Tile value={String(open)} label="open inquiries" />
      <Tile
        value={avgResponse === null ? "—" : formatDuration(avgResponse)}
        label="avg response"
        hint={avgResponse === null ? undefined : "last 30 days"}
      />
    </div>
  );
}

function Tile({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="bg-cream-50 border border-cream-300 rounded-2xl p-4">
      <p className="font-serif font-semibold text-2xl sm:text-3xl text-forest-700 leading-none">
        {value}
      </p>
      <p className="mt-2 text-xs text-charcoal-700 leading-tight">
        {label}
      </p>
      {hint && (
        <p className="text-[10px] text-charcoal-700/60 mt-0.5">{hint}</p>
      )}
    </div>
  );
}
