"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useSupabase } from "@/components/providers/supabase-provider"

export default function AuthDebug() {
  const { supabase, user } = useSupabase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [checkUserResult, setCheckUserResult] = useState<any>(null)
  const [directAuth, setDirectAuth] = useState<any>(null)

  const handleTestLogin = async () => {
    if (!email || !password) {
      setResult({ error: "Email và mật khẩu là bắt buộc" })
      return
    }
    
    setIsLoading(true)
    setResult(null)
    
    try {
      // Gọi API test login
      const response = await fetch("/api/auth/test-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Lỗi không mong muốn khi gọi API" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectLogin = async () => {
    if (!email || !password) {
      setDirectAuth({ error: "Email và mật khẩu là bắt buộc" })
      return
    }
    
    setIsLoading(true)
    setDirectAuth(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      setDirectAuth({
        success: !error,
        data: data,
        error: error ? {
          message: error.message,
          status: error.status,
          code: error.code
        } : null
      })
    } catch (error) {
      setDirectAuth({ error: "Lỗi không mong muốn: " + (error instanceof Error ? error.message : String(error)) })
    } finally {
      setIsLoading(false)
    }
  }

  const checkCurrentSession = async () => {
    setIsLoading(true)
    setCheckUserResult(null)
    
    try {
      // Gọi API debug
      const response = await fetch("/api/auth/debug")
      const data = await response.json()
      setCheckUserResult(data)
    } catch (error) {
      setCheckUserResult({ error: "Lỗi không mong muốn khi kiểm tra session" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setResult(null)
    setCheckUserResult(null)
    setDirectAuth(null)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 font-semibold">
        <span>← Quay lại trang chủ</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Debug Auth</h1>
          <p className="text-sm text-muted-foreground">
            Công cụ kiểm tra lỗi đăng nhập
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Kiểm tra đăng nhập</CardTitle>
            <CardDescription>
              Kiểm tra thông tin đăng nhập và trạng thái hiện tại
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
          <CardFooter className="flex flex-col space-y-3">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button onClick={handleTestLogin} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  "Test API Login"
                )}
              </Button>
              <Button onClick={handleDirectLogin} disabled={isLoading} variant="secondary">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  "Client Direct Login"
                )}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button onClick={checkCurrentSession} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  "Kiểm tra session hiện tại"
                )}
              </Button>
              <Button onClick={handleClear} disabled={isLoading} variant="destructive">
                Xóa kết quả
              </Button>
            </div>
          </CardFooter>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Kết quả API Test Login</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {directAuth && (
          <Card>
            <CardHeader>
              <CardTitle>Kết quả Client Direct Login</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                {JSON.stringify(directAuth, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {checkUserResult && (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin session hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                {JSON.stringify(checkUserResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin user hiện tại (Context)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 