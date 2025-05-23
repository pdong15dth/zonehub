"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"

// Trang này chỉ chuyển hướng đến trang dashboard admin
export default function AdminRedirectPage() {
  useEffect(() => {
    // Chuyển hướng về trang dashboard admin sử dụng window.location
    console.log("Admin page - redirecting to dashboard")
    // Dùng timeout để đảm bảo người dùng thấy thông báo chuyển hướng
    setTimeout(() => {
      window.location.href = '/admin/dashboard'
    }, 500)
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h3 className="mt-4 text-xl font-medium">Đang chuyển hướng đến Dashboard...</h3>
      <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
    </div>
  )
}
