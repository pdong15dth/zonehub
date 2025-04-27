"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminOverview } from "@/components/admin/admin-overview"
import { RecentActivity } from "@/components/admin/recent-activity"
import { AdminStats } from "@/components/admin/admin-stats"
import { UserManagement } from "@/components/admin/user-management"
import { ZoneManagement } from "@/components/admin/zone-management"
import { ReportsDashboard } from "@/components/admin/reports-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { getCurrentUserProfile } from "@/lib/auth-utils"

export default function AdminDashboard() {
  const { supabase, user, loading } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  // Kiểm tra xem người dùng có phải là admin không
  useEffect(() => {
    console.log("Dashboard mounted - Supabase loading:", loading, "User:", user?.id)
    
    // Nếu đang loading hoặc đã kiểm tra nhiều lần, bỏ qua
    if (loading || retryCount > 3) return;
    
    // Kiểm tra phiên trực tiếp từ Supabase
    const checkAuth = async () => {
      try {
        setRetryCount(prev => prev + 1);
        console.log(`Kiểm tra phiên lần ${retryCount + 1}`)
        
        // Lấy session từ API
        const { data: sessionData } = await supabase.auth.getSession()
        console.log("Session data:", sessionData?.session?.user?.id)
        
        if (!sessionData?.session?.user) {
          // Nếu đã thử nhiều lần mà không có session
          if (retryCount >= 2) {
            console.log("Không tìm thấy phiên đăng nhập sau nhiều lần thử, chuyển hướng đến signin")
            window.location.href = '/auth/signin?callbackUrl=/admin/dashboard'
          }
          return
        }

        // Kiểm tra quyền admin bằng cách truy vấn trực tiếp
        console.log("Kiểm tra quyền admin cho:", sessionData.session.user.id)
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', sessionData.session.user.id)
          .single()
          
        if (roleError || !userData) {
          console.error("Lỗi khi kiểm tra quyền:", roleError)
          setError("Không thể xác thực quyền truy cập")
          setIsLoading(false)
          return
        }
        
        console.log("Vai trò người dùng:", userData.role)
        
        if (userData.role !== 'admin') {
          console.log("Không phải admin, chuyển hướng về trang chủ")
          setError("Bạn không có quyền truy cập trang này")
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
          return
        }
        
        // Nếu là admin, hiển thị dashboard
        console.log("Xác nhận quyền admin, hiển thị dashboard")
        setIsLoading(false)
      } catch (err) {
        console.error("Lỗi không mong đợi khi kiểm tra quyền:", err)
        setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
        setIsLoading(false)
      }
    }
    
    checkAuth()
    
    // Nếu không có session sau 2 giây, thử lại
    const checkAgainTimeout = setTimeout(() => {
      if (retryCount < 3 && isLoading) {
        console.log("Thử kiểm tra lại phiên...")
        checkAuth();
      }
    }, 2000);
    
    return () => clearTimeout(checkAgainTimeout);
    
  }, [supabase, loading, user, retryCount, isLoading])
  
  // Hiển thị trạng thái tải
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h3 className="mt-4 text-xl font-medium">Đang tải dữ liệu...</h3>
        <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
      </div>
    )
  }
  
  // Hiển thị lỗi
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="mt-4 text-muted-foreground">Bạn sẽ được chuyển hướng đến trang chủ...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Quản lý hệ thống ZoneHub</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="zones">Vùng</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AdminStats />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tổng quan hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <AdminOverview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động mới nhất trên nền tảng</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý người dùng</CardTitle>
              <CardDescription>Xem và quản lý tài khoản người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý vùng</CardTitle>
              <CardDescription>Xem và quản lý các vùng trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <ZoneManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <ReportsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
} 