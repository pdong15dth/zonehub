import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ensureUserInDatabase } from "@/lib/auth-utils"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  console.log(`Middleware running for path: ${path}`)
  
  // Bỏ qua middleware cho một số trang đặc biệt hoặc đường dẫn tin tức
  if (path === "/debug" || path.startsWith("/admin/") || path.startsWith("/news/") || path === '/news') {
    console.log(`Skipping middleware for special page: ${path}`)
    return NextResponse.next()
  }
  
  // Nếu truy cập đúng /admin, tự động chuyển hướng đến /admin/dashboard
  if (path === "/admin") {
    console.log("Redirecting from /admin to /admin/dashboard")
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }
  
  try {
    const supabase = createServerSupabaseClient()
    console.log("Checking session in middleware...")
    
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    console.log(`Session check result: ${session ? `User ${session.user.id}` : 'No session'}`)
  
    // Nếu là trang đăng nhập và đã đăng nhập, tự động điều hướng
    if (path === "/auth/signin" && session?.user) {
      console.log("User already logged in, redirecting from signin page")
      
      // Kiểm tra vai trò người dùng
      try {
        const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()
        console.log("User role:", userData?.role)
        
        // Nếu là admin, điều hướng đến trang admin
        if (userData?.role === "admin") {
          console.log("Redirecting admin to /admin/dashboard")
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        }
        
        // Nếu không phải admin, điều hướng đến trang chủ
        console.log("Redirecting non-admin to /")
        return NextResponse.redirect(new URL("/", request.url))
      } catch (error) {
        console.error("Error checking user role:", error)
        // Điều hướng đến trang chủ nếu có lỗi
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  
    // Nếu là trang đăng ký và đã đăng nhập, tự động điều hướng
    if (path === "/auth/signup" && session?.user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  
    // Nếu người dùng đã đăng nhập, đảm bảo họ có bản ghi trong bảng users
    if (session?.user) {
      try {
        console.log("Ensuring user exists in database:", session.user.id)
        await ensureUserInDatabase(supabase, session.user)
      } catch (error) {
        console.error("Error ensuring user in database:", error)
      }
    }
  } catch (error) {
    console.error("Unexpected error in middleware:", error)
  }

  console.log("Middleware completed, continuing to:", path)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
