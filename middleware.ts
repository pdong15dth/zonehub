import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ensureUserInDatabase } from "@/lib/auth-utils"

// Define public paths that don't need authentication checks
const PUBLIC_PATHS = [
  '/news',
  '/games',
  '/source-code',
  '/',
  '/debug'
]

// Define paths that should skip middleware entirely
const SKIP_MIDDLEWARE_PATHS = [
  '/debug',
  '/admin/', // Admin paths are handled separately
  '/api/', // API routes should be fast
  '/news/',
  '/news',
  '/_next/',
  '/static/',
  '/favicon.ico',
  '/manifest.json'
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Quick check for paths that should skip middleware entirely
  for (const skipPath of SKIP_MIDDLEWARE_PATHS) {
    if (path === skipPath || (skipPath.endsWith('/') && path.startsWith(skipPath))) {
      return NextResponse.next()
    }
  }
  
  // Handle admin redirect without checking session
  if (path === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }
  
  // Quick check for public paths
  const isPublicPath = PUBLIC_PATHS.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  )
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  try {
    // Only create Supabase client when needed (not for public paths)
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
  
    // Handle auth redirects
    if (path === "/auth/signin" && session?.user) {
      try {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()
        
        if (userData?.role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        }
        
        return NextResponse.redirect(new URL("/", request.url))
      } catch (error) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  
    if (path === "/auth/signup" && session?.user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  
    // Only update user database record when necessary
    if (session?.user) {
      await ensureUserInDatabase(supabase, session.user)
    }
  } catch (error) {
    console.error("Error in middleware:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only run middleware on paths that might need it
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)"
  ],
}
