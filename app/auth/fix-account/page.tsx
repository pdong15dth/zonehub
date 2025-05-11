"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export default function FixAccount() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()
  const supabase = createBrowserSupabaseClient()

  const handleFixAccount = async () => {
    if (!email) {
      toast({
        title: "Email là bắt buộc",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setResult(null)
    setStatus("idle")

    try {
      // 1. Lấy thông tin người dùng từ auth.users (cần phải đăng nhập)
      const { data: session } = await supabase.auth.getSession()
      
      // Nếu đăng nhập, sử dụng ID hiện tại
      if (session?.session?.user) {
        // Cách 1: Trực tiếp trong database
        try {
          // Xóa người dùng hiện tại từ bảng users (để tránh xung đột)
          await supabase
            .from('users')
            .delete()
            .eq('id', session.session.user.id)
          
          // Tạo lại người dùng với dữ liệu chính xác
          const { data, error } = await supabase
            .from('users')
            .insert({
              id: session.session.user.id,
              email: session.session.user.email,
              full_name: session.session.user.user_metadata?.full_name || 
                        session.session.user.user_metadata?.name || 
                        session.session.user.email?.split('@')[0] || 'User',
              avatar_url: session.session.user.user_metadata?.avatar_url || 
                        session.session.user.user_metadata?.picture || 
                        null,
              role: "member"
            })
            .select()
            .single()
          
          if (error) {
            throw new Error(`Lỗi khi tạo lại người dùng: ${error.message}`)
          }
          
          setResult({
            message: "Đã sửa chữa tài khoản thành công!",
            details: "Bạn có thể quay lại ứng dụng và sử dụng bình thường.",
            user: data
          })
          setStatus("success")
          
          // Hiển thị thông báo thành công
          toast({
            title: "Đã sửa chữa tài khoản",
            description: "Tài khoản của bạn đã được sửa chữa thành công!",
          })
        } catch (err) {
          console.error("Lỗi sửa chữa tài khoản:", err)
          setStatus("error")
          setResult({
            error: err instanceof Error ? err.message : "Lỗi không xác định",
            suggestion: "Vui lòng thử đăng nhập bằng OAuth (Google/GitHub) thay vì email/mật khẩu."
          })
          
          toast({
            title: "Lỗi khi sửa chữa tài khoản",
            description: err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định",
            variant: "destructive"
          })
        }
      } else {
        // Chưa đăng nhập, yêu cầu đăng nhập trước
        setStatus("error")
        setResult({
          error: "Bạn chưa đăng nhập",
          suggestion: "Vui lòng đăng nhập trước khi sửa chữa tài khoản."
        })
        
        toast({
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập trước để sửa chữa tài khoản.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Lỗi:", error)
      setStatus("error")
      setResult({
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      })
      
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/fix-account'
      }
    })
  }

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/auth/fix-account'
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-semibold">
        <span>← Quay lại trang chủ</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sửa chữa tài khoản</h1>
          <p className="text-sm text-muted-foreground">
            Công cụ khắc phục lỗi "Database error granting user"
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Khắc phục lỗi đăng nhập</CardTitle>
            <CardDescription>
              Sửa chữa lỗi xung đột ID người dùng giữa các bảng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-yellow-50 text-yellow-800 border border-yellow-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Công cụ này sẽ giúp sửa chữa tài khoản bị lỗi "Database error granting user" khi đăng nhập.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email của bạn</Label>
              <Input
                id="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={signInWithGoogle} variant="outline" disabled={loading}>
                Đăng nhập với Google
              </Button>
              <Button onClick={signInWithGithub} variant="outline" disabled={loading}>
                Đăng nhập với GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={handleFixAccount}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Sửa chữa tài khoản"
              )}
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full"
            >
              Đăng xuất
            </Button>
          </CardFooter>
        </Card>
        
        {result && status === "success" && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <CardTitle className="text-green-800">Thành công!</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 mb-2">{result.message}</p>
              <p className="text-sm text-green-700">{result.details}</p>
              
              <div className="mt-4">
                <Button asChild className="w-full">
                  <Link href="/auth/signin">
                    Đi đến trang đăng nhập
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {result && status === "error" && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <CardTitle className="text-red-800">Lỗi</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 mb-2">{result.error}</p>
              {result.suggestion && (
                <p className="text-sm text-red-700">{result.suggestion}</p>
              )}
              
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/signin">
                    Quay lại trang đăng nhập
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 