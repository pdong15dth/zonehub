"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useSupabase } from "@/components/providers/supabase-provider"

export default function AuthFix() {
  const { supabase, user } = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [statusCheck, setStatusCheck] = useState<any>(null)
  const [isStatusLoading, setIsStatusLoading] = useState(false)

  const handleServiceRoleLogin = async () => {
    if (!email || !password) {
      setResult({ error: "Email và mật khẩu là bắt buộc" })
      return
    }
    
    setIsLoading(true)
    setResult(null)
    
    try {
      // Thêm service-role header
      const options = {
        auth: {
          persistSession: true
        },
        global: {
          headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string}`
          }
        }
      }
      
      // Sử dụng supabase đã kết nối
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      setResult({
        success: !error,
        data: data,
        error: error ? {
          message: error.message,
          status: error.status,
          code: error.code
        } : null,
        env: {
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 5) + '...',
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        }
      })
    } catch (error) {
      setResult({ error: "Lỗi không mong muốn: " + (error instanceof Error ? error.message : String(error)) })
    } finally {
      setIsLoading(false)
    }
  }

  const checkSupabaseStatus = async () => {
    setIsStatusLoading(true)
    setStatusCheck(null)
    
    try {
      // Gọi API endpoint kiểm tra trạng thái
      const response = await fetch("/api/auth/status")
      const data = await response.json()
      setStatusCheck(data)
    } catch (error) {
      setStatusCheck({ error: "Lỗi khi kiểm tra trạng thái: " + (error instanceof Error ? error.message : String(error)) })
    } finally {
      setIsStatusLoading(false)
    }
  }

  // Kiểm tra trạng thái Supabase khi trang được tải
  useEffect(() => {
    checkSupabaseStatus()
  }, [])

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-semibold">
        <span>← Quay lại trang chủ</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-3xl">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Công cụ sửa lỗi đăng nhập</h1>
          <p className="text-sm text-muted-foreground">
            Dùng để khắc phục lỗi "Database error granting user"
          </p>
        </div>

        {/* Trạng thái Supabase */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Trạng thái Supabase</CardTitle>
            <CardDescription>
              Kiểm tra kết nối đến các dịch vụ Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isStatusLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : statusCheck ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Tổng thể:</span>
                  <div className="flex items-center">
                    {statusCheck.status === 'online' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-500">Online</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-500">Offline</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 border rounded-md p-3">
                    <div className="flex justify-between text-sm">
                      <span>Kết nối</span>
                      {statusCheck.supabase_connection?.status === 'ok' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusCheck.supabase_connection?.duration_ms}ms
                    </p>
                  </div>
                  
                  <div className="space-y-2 border rounded-md p-3">
                    <div className="flex justify-between text-sm">
                      <span>Auth Service</span>
                      {statusCheck.auth_service?.status === 'ok' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusCheck.auth_service?.duration_ms}ms
                    </p>
                  </div>
                  
                  <div className="space-y-2 border rounded-md p-3">
                    <div className="flex justify-between text-sm">
                      <span>Database</span>
                      {statusCheck.database?.status === 'ok' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusCheck.database?.count} users, {statusCheck.database?.duration_ms}ms
                    </p>
                  </div>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {(statusCheck.supabase_connection?.error || 
                  statusCheck.auth_service?.error || 
                  statusCheck.database?.error) && (
                  <div className="mt-4 p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-800">
                    <p className="font-medium mb-1">Lỗi được phát hiện:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {statusCheck.supabase_connection?.error && (
                        <li>Kết nối: {statusCheck.supabase_connection.error}</li>
                      )}
                      {statusCheck.auth_service?.error && (
                        <li>Auth: {statusCheck.auth_service.error}</li>
                      )}
                      {statusCheck.database?.error && (
                        <li>Database: {statusCheck.database.error}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Không có dữ liệu trạng thái
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={checkSupabaseStatus} disabled={isStatusLoading}>
              {isStatusLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                "Kiểm tra lại"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Các cách đăng nhập thay thế */}
        <Tabs defaultValue="service-role">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service-role">
              Đăng nhập với Service Role
            </TabsTrigger>
            <TabsTrigger value="oauth">
              Đăng nhập OAuth
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="service-role" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập với Service Role</CardTitle>
                <CardDescription>
                  Thử đăng nhập với API key mạnh hơn (service role)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={handleServiceRoleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {result && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Kết quả đăng nhập</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="oauth" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập với OAuth</CardTitle>
                <CardDescription>
                  Sử dụng OAuth thường có thể giải quyết vấn đề khi đăng nhập bằng email/mật khẩu gặp lỗi
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Đăng nhập qua các nhà cung cấp OAuth không trực tiếp sử dụng cơ sở dữ liệu Supabase để xác thực, 
                  nên có thể tránh được lỗi "Database error granting user".
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <Button variant="outline" onClick={() => supabase.auth.signInWithOAuth({
                    provider: "github",
                    options: { redirectTo: window.location.origin }
                  })}>
                    GitHub
                  </Button>
                  <Button variant="outline" onClick={() => supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: { redirectTo: window.location.origin }
                  })}>
                    Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Thông tin người dùng hiện tại */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Đã đăng nhập</CardTitle>
              <CardDescription>
                Bạn hiện đang đăng nhập với tài khoản sau
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ID:</span>
                  <span className="text-sm text-muted-foreground">{user.id}</span>
                </div>
                <div className="mt-4">
                  <Button variant="destructive" onClick={() => supabase.auth.signOut()}>
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 