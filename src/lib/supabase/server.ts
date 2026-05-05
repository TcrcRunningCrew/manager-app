import { createClient } from "@supabase/supabase-js";

// Fallback to placeholder so createClient doesn't throw during `next build`.
// Actual API calls will fail at runtime if env vars are not set in Vercel.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_KEY ??
  "placeholder";

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "tcrc" },
});
