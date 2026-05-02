"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "tcrc" },
});
