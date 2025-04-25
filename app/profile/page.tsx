"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export default function ProfilePage() {
  const { user, supabase, loading } = useSupabase()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin?callbackUrl=/profile")
    }

    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (data) {
          setProfile(data)
        }
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [user, loading, router, supabase])

  if (loading || isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user || !profile) {
    return <div className="flex min-h-screen items-center justify-center">User not found</div>
  }

  // Get initials from email if no user name
  const userEmail = user.email || ""
  const userInitials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : userEmail.substring(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your account and view your activity.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || "User"} />
                      <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <CardTitle>{profile.full_name || "User"}</CardTitle>
                      <CardDescription>{profile.email}</CardDescription>
                      <div className="mt-2">
                        <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                          {profile.role === "admin" ? "Admin" : "Member"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since</span>
                      <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Games uploaded</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repositories</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comments</span>
                      <span>0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="md:col-span-2">
                <Tabs defaultValue="activity">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="games">Games</TabsTrigger>
                    <TabsTrigger value="repositories">Repositories</TabsTrigger>
                  </TabsList>
                  <TabsContent value="activity" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your recent activity on ZoneHub.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center p-6 text-muted-foreground">
                          No recent activity to display.
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="games" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Games</CardTitle>
                        <CardDescription>Games you've uploaded to ZoneHub.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">You haven't uploaded any games yet.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="repositories" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Repositories</CardTitle>
                        <CardDescription>Source code repositories you've shared on ZoneHub.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">You haven't shared any repositories yet.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZoneHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
