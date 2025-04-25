"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUserProfile } from "@/lib/auth-utils"
import Link from "next/link"

export default function DebugPage() {
  const { supabase, user, loading } = useSupabase()
  const [sessionData, setSessionData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkData = async () => {
      try {
        console.log("Debug page - checking session")
        const { data } = await supabase.auth.getSession()
        setSessionData(data)
        
        if (data.session?.user) {
          console.log("Debug page - getting profile")
          const profile = await getCurrentUserProfile()
          setProfileData(profile)
        }
      } catch (err) {
        console.error("Error fetching debug data:", err)
        setError(String(err))
      }
    }
    
    if (!loading) {
      checkData()
    }
  }, [supabase, loading, user])
  
  const handleForceRedirect = () => {
    console.log("Force redirecting to admin dashboard...");
    // Cố định đường dẫn đầy đủ để tránh việc resolver path
    const fullUrl = `${window.location.origin}/admin/dashboard`;
    console.log("Redirecting to:", fullUrl);
    window.location.href = fullUrl;
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Debug Session Information</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Provider State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? user.id : "Not logged in"}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Session Data</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionData ? (
              <div className="space-y-2">
                <p><strong>Session exists:</strong> {sessionData.session ? "Yes" : "No"}</p>
                {sessionData.session && (
                  <>
                    <p><strong>User ID:</strong> {sessionData.session.user.id}</p>
                    <p><strong>Email:</strong> {sessionData.session.user.email}</p>
                    <p><strong>Expires:</strong> {new Date(sessionData.session.expires_at * 1000).toLocaleString()}</p>
                  </>
                )}
              </div>
            ) : (
              <p>Loading session data...</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Data</CardTitle>
          </CardHeader>
          <CardContent>
            {profileData ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {profileData.id}</p>
                <p><strong>Name:</strong> {profileData.full_name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Role:</strong> {profileData.role}</p>
                <p><strong>Created:</strong> {new Date(profileData.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p>No profile data or loading...</p>
            )}
          </CardContent>
        </Card>
        
        {error && (
          <Card className="bg-destructive/10">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-4 mt-4">
          <Button onClick={handleForceRedirect} size="lg">
            Force Redirect to Admin Dashboard
          </Button>
          
          <Link href="/auth/signin">
            <Button variant="outline" size="lg">
              Go to Login
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="secondary" size="lg">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 