"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSupabase } from "@/components/providers/supabase-provider"
import { ensureUserInDatabase } from "@/lib/auth-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { supabase } = useSupabase()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [errorDetails, setErrorDetails] = useState("")

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setErrorDetails("")

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu")
      setIsLoading(false)
      return
    }

    try {
      console.log("Đang đăng nhập với email:", email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Lỗi đăng nhập:", error)
        
        // Xử lý các lỗi cụ thể
        if (error.message.includes("Invalid login credentials")) {
          setError("Email hoặc mật khẩu không chính xác")
          setErrorDetails(`Nếu bạn chưa có tài khoản, hãy đăng ký tài khoản mới.`)
        } else if (error.message.includes("Email not confirmed")) {
          setError("Email chưa được xác nhận")
          setErrorDetails("Vui lòng kiểm tra hộp thư để xác nhận email của bạn")
        } else {
          setError(error.message)
        }
        
        setIsLoading(false)
        return
      }

      // Đăng nhập thành công
      if (data.user) {
        console.log("Đăng nhập thành công, đang chuyển hướng đến: ", callbackUrl)
        
        // Đảm bảo phiên đăng nhập được thiết lập
        const { data: sessionCheck } = await supabase.auth.getSession()
        console.log("Phiên đăng nhập:", sessionCheck?.session?.user?.id)
        
        // Đảm bảo người dùng có trong database mà không chờ đợi kết quả
        try {
          console.log("Đang đảm bảo dữ liệu người dùng trong DB")
          const profile = await ensureUserInDatabase(supabase, data.user)
          console.log("Đã cập nhật/tạo dữ liệu người dùng, vai trò:", profile?.role)
          
          // Nếu người dùng là admin và đang cố vào trang admin, chuyển hướng đến dashboard
          if (profile?.role === "admin" && callbackUrl.includes("/admin")) {
            console.log("Người dùng là admin và đang vào trang admin, chuyển hướng đến /admin/dashboard")
            
            // Delay chuyển hướng để đảm bảo phiên đăng nhập được lưu
            setTimeout(() => {
              window.location.href = "/admin/dashboard"
            }, 500)
            return
          }
        } catch (err) {
          console.error("Lỗi khi đảm bảo dữ liệu người dùng:", err)
          // Không ngăn chặn chuyển hướng nếu có lỗi
        }
        
        // Đặt timeout để đảm bảo phiên đăng nhập được lưu trước khi chuyển hướng
        console.log("Sẽ chuyển hướng đến callback URL sau 500ms:", callbackUrl)
        setTimeout(() => {
          window.location.href = callbackUrl
        }, 500)
      }
    } catch (error) {
      console.error("Lỗi không mong đợi:", error)
      setError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.")
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${callbackUrl}`,
        },
      })
    } catch (error) {
      console.error("Lỗi đăng nhập GitHub:", error)
      setError("Lỗi khi đăng nhập bằng GitHub")
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${callbackUrl}`,
        },
      })
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error)
      setError("Lỗi khi đăng nhập bằng Google")
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-semibold">
        <span>← Quay lại trang chủ</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to ZoneHub</h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="mt-1">
                  {error}
                  {errorDetails && (
                    <p className="text-xs mt-1">{errorDetails}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleEmailSignIn}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link href="/auth/forgot-password" className="text-sm underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleGithubSignIn}>
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" onClick={handleGoogleSignIn}>
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/auth/signup" className="underline">
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
