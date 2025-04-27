import { createClient } from "@supabase/supabase-js"
import { Database } from "../types/supabase"

// Giữ một instance duy nhất cho client
let browserSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

// Create a single supabase client for interacting with your database
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")
}

// Create a client-side supabase client (with anon key)
export const createBrowserSupabaseClient = () => {
  if (browserSupabaseClient) {
    return browserSupabaseClient
  }
  
  browserSupabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "", 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", 
    {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
  
  return browserSupabaseClient
}
