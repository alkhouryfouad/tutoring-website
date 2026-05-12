"use client";

import { useState } from "react";
import { TicketsPanel, type Ticket } from "./TicketDashboard";
import { MessagesPanel, type ContactMessage } from "./MessagesPanel";
import StatsBar from "./StatsBar";

type Tab = "tickets" | "messages";

interface AdminDashboardProps {
  initialTickets: Ticket[];
  initialMessages: ContactMessage[];
}

export default function AdminDashboard({
  initialTickets,
  initialMessages,
}: AdminDashboardProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [messages, setMessages] = useState(initialMessages);
  const [tab, setTab] = useState<Tab>("tickets");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  const refresh = async () => {
    setRefreshing(true);
    setRefreshError("");
    try {
      const [ticketsRes, messagesRes] = await Promise.all([
        fetch("/api/admin/tickets"),
        fetch("/api/admin/messages"),
      ]);
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (!ticketsRes.ok || !messagesRes.ok) {
        setRefreshError("Some data failed to refresh.");
      }
    } catch {
      setRefreshError("Network error.");
    } finally {
      setRefreshing(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const newTicketCount = tickets.filter((t) => t.status === "new").length;
  const newMessageCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-forest-600 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-base tracking-tight">
              Meridian Academics
            </span>
            <span className="text-white/50 text-xs hidden sm:inline">— Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-xs text-white/80 hover:text-white transition-colors disabled:opacity-50"
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
        {refreshError && (
          <div className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {refreshError}
          </div>
        )}

        <StatsBar tickets={tickets} />

        {/* Tab switcher */}
        <div className="flex gap-1 bg-cream-50 border border-cream-300 rounded-xl p-1 mb-4">
          <TabButton active={tab === "tickets"} count={newTicketCount} onClick={() => setTab("tickets")}>
            Lesson Inquiries
          </TabButton>
          <TabButton active={tab === "messages"} count={newMessageCount} onClick={() => setTab("messages")}>
            Messages
          </TabButton>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              tab === "tickets"
                ? "Search by name, email, phone, subject…"
                : "Search by name, email, message…"
            }
            className="w-full rounded-lg border border-cream-300 bg-cream-50 pl-9 pr-9 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-700/50 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-700/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-700/60 hover:text-charcoal-900 px-2 py-1 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {tab === "tickets" ? (
          <TicketsPanel tickets={tickets} search={search} onTicketsChange={setTickets} />
        ) : (
          <MessagesPanel messages={messages} search={search} onMessagesChange={setMessages} />
        )}
      </main>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, count, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-forest-600 text-white shadow-sm"
          : "text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100"
      }`}
    >
      {children}
      {count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active ? "bg-white/20 text-white" : "bg-amber-400/30 text-charcoal-900"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
