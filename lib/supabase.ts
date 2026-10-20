import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient(url: string, key: string) {
  if (!url || !key) return null;
  return createClient(url, key, {
  global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(20000) }) },
  });
}
