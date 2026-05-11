import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Meridian Academics <onboarding@resend.dev>";
const TO = process.env.ADMIN_NOTIFICATION_EMAIL;
const KEY = process.env.RESEND_API_KEY;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

let warned = false;
function disabled(): boolean {
  if (!KEY || !TO) {
    if (!warned) {
      console.warn(
        "[notify] RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not set — admin emails disabled."
      );
      warned = true;
    }
    return true;
  }
  return false;
}

let client: Resend | null = null;
function getClient(): Resend {
  if (!client) client = new Resend(KEY);
  return client;
}

interface NewTicket {
  student_name: string;
  grade: string;
  subjects: string;
  session_format: string;
  preferred_times: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  notes: string | null;
}

export async function notifyNewTicket(t: NewTicket): Promise<void> {
  if (disabled()) return;
  const subject = `New inquiry — ${t.parent_name} (Gr.${t.grade} ${t.subjects})`;
  const body = [
    `Parent: ${t.parent_name} <${t.parent_email}> · ${t.parent_phone}`,
    `Student: ${t.student_name}, Grade ${t.grade}`,
    `Subjects: ${t.subjects}`,
    `Format: ${t.session_format}`,
    t.preferred_times ? `Preferred times: ${t.preferred_times}` : null,
    t.notes ? `\nNotes:\n${t.notes}` : null,
    `\nOpen the dashboard: ${SITE}/admin`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await getClient().emails.send({ from: FROM, to: TO!, subject, text: body });
  } catch (err) {
    console.error("[notify] notifyNewTicket failed:", err);
  }
}

interface NewMessage {
  name: string;
  email: string;
  message: string;
}

export async function notifyNewMessage(m: NewMessage): Promise<void> {
  if (disabled()) return;
  const subject = `New message — ${m.name}`;
  const body = [
    `From: ${m.name} <${m.email}>`,
    `\n${m.message}`,
    `\nOpen the dashboard: ${SITE}/admin`,
  ].join("\n");

  try {
    await getClient().emails.send({ from: FROM, to: TO!, subject, text: body });
  } catch (err) {
    console.error("[notify] notifyNewMessage failed:", err);
  }
}
