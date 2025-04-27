"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getCurrentUserProfile } from "@/lib/auth-utils"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { supabase, user, loading } = useSupabase()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Wait until the Supabase context is loaded
      if (loading) return

      try {
        if (!user) {
          console.log("AdminAuthCheck: No user found, redirecting to login")
          router.push("/auth/signin?callbackUrl=/admin/dashboard")
          return
        }

        // Check if user is admin
        const profile = await getCurrentUserProfile()
        
        if (!profile || profile.role !== "admin") {
          console.log("AdminAuthCheck: User is not admin, redirecting to home")
          router.push("/")
          return
        }

        console.log("AdminAuthCheck: User is authorized admin")
        setIsAuthorized(true)
      } catch (error) {
        console.error("AdminAuthCheck error:", error)
        router.push("/auth/signin?callbackUrl=/admin/dashboard")
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [user, loading, router, supabase])

  // Show nothing while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null
} 