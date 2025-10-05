import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase client with service role privileges.
 * This bypasses Row Level Security (RLS) and should only be used in secure server-side contexts.
 *
 * Use cases:
 * - Admin operations that need to bypass RLS
 * - Public forms (like waitlist) where RLS would block legitimate inserts
 * - Background jobs and scheduled tasks
 *
 * WARNING: Never expose this client to the browser or client-side code.
 */
export function createServiceRoleClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
