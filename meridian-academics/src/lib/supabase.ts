import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Add them to .env.local — see .env.example for instructions."
  );
}

// Service-role client — server-side only, never import in client components.
// This key bypasses Row Level Security and must never reach the browser.
export const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});
