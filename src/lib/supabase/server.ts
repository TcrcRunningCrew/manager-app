import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env vars are not set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_API_KEY)");
  }

  _client = createClient(supabaseUrl, supabaseKey, {
    db: { schema: "tcrc" },
  });

  return _client;
}

export const supabaseServer = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof ReturnType<typeof createClient>];
  },
});
