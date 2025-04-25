import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is for the admin dashboard
  const isAdminPath = path.startsWith("/admin")

  if (isAdminPath) {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to sign in
    if (!session) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }

    // Check if user has admin role
    const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    // If not admin, redirect to home
    if (!userData || userData.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
