import { supabase } from "@/lib/supabase";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { Ticket } from "@/components/admin/TicketDashboard";
import type { ContactMessage } from "@/components/admin/MessagesPanel";

export const dynamic = "force-dynamic"; // always fetch fresh data

type LoadResult =
  | { ok: true; tickets: Ticket[]; messages: ContactMessage[] }
  | { ok: false; message: string };

async function load(): Promise<LoadResult> {
  const [ticketsRes, messagesRes] = await Promise.all([
    supabase.from("tickets").select("*").order("submitted_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("submitted_at", { ascending: false }),
  ]);

  if (ticketsRes.error) {
    console.error("[admin] failed to load tickets:", ticketsRes.error.message);
    return { ok: false, message: "Could not load tickets from the database." };
  }
  if (messagesRes.error) {
    console.error("[admin] failed to load messages:", messagesRes.error.message);
    return { ok: false, message: "Could not load messages from the database." };
  }

  return {
    ok: true,
    tickets: (ticketsRes.data ?? []) as Ticket[],
    messages: (messagesRes.data ?? []) as ContactMessage[],
  };
}

export default async function AdminPage() {
  const result = await load();

  if (!result.ok) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <p className="font-semibold text-gray-900 mb-2">Failed to load admin data</p>
          <p className="text-sm text-gray-600">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard initialTickets={result.tickets} initialMessages={result.messages} />
  );
}
