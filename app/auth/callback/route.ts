import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { ensureUserInDatabase } from "@/lib/auth-utils"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/"

  if (code) {
    const supabase = createServerSupabaseClient()
    
    try {
      // Trao đổi code lấy session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      } 
      
      if (data?.user) {
        // Đăng nhập thành công, kiểm tra và tạo user profile nếu cần
        try {
          const userProfile = await ensureUserInDatabase(supabase, data.user)
          
          // Nếu là admin, điều hướng đến trang admin bất kể callback URL là gì
          if (userProfile?.role === "admin") {
            return NextResponse.redirect(new URL("/admin", requestUrl.origin))
          }
        } catch (err) {
          console.error("Error creating user profile in callback:", err)
          // Tiếp tục chuyển hướng mặc dù có lỗi, vì phiên đăng nhập vẫn tồn tại
        }
      }
    } catch (err) {
      console.error("Unexpected error in auth callback:", err)
      return NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent("Lỗi không mong đợi trong quá trình đăng nhập")}`, requestUrl.origin))
    }
  }

  // Nếu không phải admin hoặc không có code, điều hướng đến next URL
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
