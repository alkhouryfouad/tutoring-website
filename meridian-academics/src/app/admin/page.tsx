import { supabase } from "@/lib/supabase";
import TicketDashboard, { Ticket } from "@/components/admin/TicketDashboard";

export const dynamic = "force-dynamic"; // always fetch fresh data

async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[admin] failed to load tickets:", error.message);
    return [];
  }
  return (data ?? []) as Ticket[];
}

export default async function AdminPage() {
  const tickets = await getTickets();
  return <TicketDashboard initialTickets={tickets} />;
}
