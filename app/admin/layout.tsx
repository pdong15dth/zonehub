import type React from "react"
import { SidebarNav } from "@/components/admin/sidebar-nav"
import { AdminHeader } from "@/components/admin/admin-header"
import AdminAuthCheck from "./auth-check"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthCheck>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex-1 flex">
          <SidebarNav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
