"use client"

import { useState } from "react"
import { AccountDiagnostics } from "@/src/components/ui/account-diagnostics"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CornerDownLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccountDiagnosticPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()

  const handleSuccessfulRepair = () => {
    // Add success actions if needed
  }

  return (
    <div className="container flex min-h-screen flex-col py-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-5 w-5" />
          <span>Trang chủ</span>
        </Link>
        
        <Button variant="outline" onClick={() => router.push("/auth/signin")} className="flex items-center space-x-2">
          <CornerDownLeft className="h-4 w-4" />
          <span>Quay lại đăng nhập</span>
        </Button>
      </div>
      
      <div className="flex-1">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Công cụ chẩn đoán tài khoản</h1>
          <p className="text-muted-foreground">
            Công cụ này sẽ giúp phát hiện và sửa chữa các vấn đề với tài khoản Supabase của bạn, 
            đặc biệt là lỗi "Database error granting user" khi đăng nhập.
          </p>
        </div>
        
        <AccountDiagnostics 
          supabase={supabase}
          onSuccess={handleSuccessfulRepair}
        />
        
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Nếu vẫn gặp vấn đề sau khi sửa chữa, vui lòng liên hệ hỗ trợ hoặc thử đăng nhập với Google/GitHub.</p>
        </div>
      </div>
    </div>
  )
} 