import React from "react"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Đây là layout riêng cho admin/dashboard để đảm bảo việc truy cập trực tiếp
  return (
    <div className="admin-dashboard-layout">
      {children}
    </div>
  )
} 