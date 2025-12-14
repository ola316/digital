import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Singleton instance for database operations only
let dbClient: ReturnType<typeof createSupabaseClient> | null = null

export function getDbClient() {
  if (!dbClient) {
    dbClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )
  }
  return dbClient
}
