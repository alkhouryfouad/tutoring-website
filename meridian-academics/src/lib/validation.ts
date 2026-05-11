const VALID_GRADES = new Set(["9", "10", "11", "12"]);
const VALID_FORMATS = new Set(["In-Person", "Online", "Either"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,20}$/;
const VALID_STATUSES = new Set(["new", "contacted", "completed", "archived"]);
const VALID_MESSAGE_STATUSES = new Set(["new", "replied", "archived"]);

/** Strip HTML tags and trim whitespace. */
function sanitize(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim();
}

export interface TicketInput {
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

export type ValidationResult =
  | { ok: true; data: TicketInput }
  | { ok: false; errors: Record<string, string> };

export function validateTicketInput(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: { _form: "Invalid request body." } };
  }
  const r = raw as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const studentName = sanitize(r.studentName);
  if (!studentName) errors.studentName = "Student name is required.";
  else if (studentName.length > 100) errors.studentName = "Name is too long.";

  const grade = String(r.grade ?? "").trim();
  if (!VALID_GRADES.has(grade)) errors.grade = "Grade must be 9, 10, 11, or 12.";

  const subjects = sanitize(r.subjects);
  if (!subjects) errors.subjects = "Subjects are required.";
  else if (subjects.length > 300) errors.subjects = "Too long.";

  const sessionFormat = String(r.sessionFormat ?? "").trim();
  if (!VALID_FORMATS.has(sessionFormat))
    errors.sessionFormat = "Session format must be In-Person, Online, or Either.";

  const preferredTimes = sanitize(r.preferredTimes) || null;

  const parentName = sanitize(r.parentName);
  if (!parentName) errors.parentName = "Parent name is required.";
  else if (parentName.length > 100) errors.parentName = "Name is too long.";

  const parentEmail = sanitize(r.parentEmail).toLowerCase();
  if (!parentEmail || !EMAIL_RE.test(parentEmail))
    errors.parentEmail = "A valid email address is required.";

  const parentPhone = sanitize(r.parentPhone);
  if (!parentPhone || !PHONE_RE.test(parentPhone))
    errors.parentPhone = "A valid phone number is required.";

  const notes = sanitize(r.notes) || null;
  if (notes && notes.length > 2000) errors.notes = "Notes are too long.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      student_name: studentName,
      grade,
      subjects,
      session_format: sessionFormat,
      preferred_times:
        preferredTimes && preferredTimes.length <= 200 ? preferredTimes : null,
      parent_name: parentName,
      parent_email: parentEmail,
      parent_phone: parentPhone,
      notes: notes && notes.length <= 2000 ? notes : null,
    },
  };
}

export function validateStatusUpdate(raw: unknown): string | null {
  if (typeof raw !== "object" || raw === null) return null;
  const status = String((raw as Record<string, unknown>).status ?? "").trim();
  return VALID_STATUSES.has(status) ? status : null;
}

export function validateInternalNotes(raw: unknown): string | null {
  if (typeof raw !== "object" || raw === null) return null;
  const notes = sanitize((raw as Record<string, unknown>).internal_notes);
  if (notes.length > 2000) return null;
  return notes;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export type ContactMessageValidationResult =
  | { ok: true; data: ContactMessageInput }
  | { ok: false; errors: Record<string, string> };

export function validateContactMessageInput(raw: unknown): ContactMessageValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: { _form: "Invalid request body." } };
  }
  const r = raw as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = sanitize(r.name);
  if (!name) errors.name = "Your name is required.";
  else if (name.length > 100) errors.name = "Name is too long.";

  const email = sanitize(r.email).toLowerCase();
  if (!email || !EMAIL_RE.test(email))
    errors.email = "A valid email address is required.";

  const message = sanitize(r.message);
  if (!message) errors.message = "Please include a message.";
  else if (message.length > 2000) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, data: { name, email, message } };
}

export function validateMessageStatusUpdate(raw: unknown): string | null {
  if (typeof raw !== "object" || raw === null) return null;
  const status = String((raw as Record<string, unknown>).status ?? "").trim();
  return VALID_MESSAGE_STATUSES.has(status) ? status : null;
}
