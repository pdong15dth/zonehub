"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import type { SupabaseClient, User } from "@supabase/supabase-js"

type SupabaseContext = {
  supabase: SupabaseClient
  user: User | null
  loading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const refreshingRef = useRef(false)  // Biến để theo dõi trạng thái refresh
  const lastRefreshRef = useRef(0)     // Thời điểm refresh lần cuối

  useEffect(() => {
    const MIN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 phút giữa các lần refresh
    
    // Immediately check for an existing session
    const initSession = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setUser(session.user)
          
          // Also refresh the session if it's about to expire
          if (session.expires_at) {
            const expiresAt = session.expires_at
            const timeNow = Math.floor(Date.now() / 1000)
            const timeUntilExpiry = expiresAt - timeNow
            
            // Nếu token sắp hết hạn trong vòng 1 giờ VÀ chưa refresh gần đây
            if (timeUntilExpiry < 3600 && !refreshingRef.current && 
                Date.now() - lastRefreshRef.current > MIN_REFRESH_INTERVAL) {
              console.log("Session about to expire, refreshing token")
              
              refreshingRef.current = true;
              try {
                const { data } = await supabase.auth.refreshSession()
                if (data.session) {
                  console.log("Session refreshed successfully")
                  setUser(data.session.user)
                  lastRefreshRef.current = Date.now();
                }
              } finally {
                refreshingRef.current = false;
              }
            }
          }
        } else {
          setUser(null)
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error initializing session:", error)
        setLoading(false)
      }
    }
    
    initSession()
    
    // Set up the auth state listener for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event)
        
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return <Context.Provider value={{ supabase, user, loading }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
