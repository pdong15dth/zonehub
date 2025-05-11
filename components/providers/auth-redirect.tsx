"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "./supabase-provider"

/**
 * Component để xử lý chuyển hướng sau khi đăng nhập
 * Sử dụng AuthRedirect trong trang chủ hoặc các trang khác
 */
export function AuthRedirect() {
  const { user } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Nếu người dùng đăng nhập và có đường dẫn redirect trong localStorage
      try {
        const redirectPath = localStorage.getItem('authRedirectPath')
        console.log("AuthRedirect: User logged in, redirect path:", redirectPath)
        
        if (redirectPath) {
          // Xóa đường dẫn khỏi localStorage
          localStorage.removeItem('authRedirectPath')
          // Chuyển hướng người dùng
          console.log("AuthRedirect: Redirecting to", redirectPath)
          router.push(redirectPath)
        }
      } catch (error) {
        console.error("AuthRedirect: Error handling redirect:", error)
      }
    }
  }, [user, router])

  // Component này không render bất kỳ thứ gì
  return null
} 