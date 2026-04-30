import { supabase } from "@/lib/supabase";
import TicketDashboard, { Ticket } from "@/components/admin/TicketDashboard";

export const dynamic = "force-dynamic"; // always fetch fresh data

type TicketResult =
  | { ok: true; tickets: Ticket[] }
  | { ok: false; message: string };

async function getTickets(): Promise<TicketResult> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[admin] failed to load tickets:", error.message);
    return { ok: false, message: "Could not load tickets from the database." };
  }
  return { ok: true, tickets: (data ?? []) as Ticket[] };
}

export default async function AdminPage() {
  const result = await getTickets();

  if (!result.ok) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <p className="font-semibold text-gray-900 mb-2">Failed to load tickets</p>
          <p className="text-sm text-gray-600">{result.message}</p>
        </div>
      </div>
    );
  }

  return <TicketDashboard initialTickets={result.tickets} />;
}
