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
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      console.log("SupabaseProvider session initialized:", session?.user?.id)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.id)
        setUser(session?.user ?? null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    getUser()
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
