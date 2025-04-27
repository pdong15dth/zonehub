"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
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

  useEffect(() => {
    console.log("SupabaseProvider mounted - initializing session")
    
    // Immediately check for an existing session
    const initSession = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log("SupabaseProvider found existing session:", session.user.id)
          setUser(session.user)
          
          // Also refresh the session if it's about to expire
          if (session.expires_at) {
            const expiresAt = session.expires_at
            const timeNow = Math.floor(Date.now() / 1000)
            const timeUntilExpiry = expiresAt - timeNow
            
            // If the token expires in less than 1 hour, refresh it
            if (timeUntilExpiry < 3600) {
              console.log("Session about to expire, refreshing token")
              const { data } = await supabase.auth.refreshSession()
              if (data.session) {
                console.log("Session refreshed successfully")
                setUser(data.session.user)
              }
            }
          }
        } else {
          console.log("SupabaseProvider no existing session found")
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
        console.log("Auth state changed:", event, session?.user?.id)
        
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
