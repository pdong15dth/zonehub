"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CheckSupabase() {
  const { supabase, user, loading } = useSupabase()
  const [checkingStatus, setCheckingStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [databaseStatus, setDatabaseStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [userCount, setUserCount] = useState<number | null>(null)
  const [testDone, setTestDone] = useState(false)

  // Khi component mount, kiểm tra Supabase nếu đã đăng nhập
  useEffect(() => {
    if (!loading && user) {
      handleCheckConnection()
    }
  }, [loading, user])

  const handleCheckConnection = async () => {
    setCheckingStatus('checking')
    setDatabaseStatus('checking')
    setAuthStatus('checking')
    setErrorMessage("")
    setTestDone(false)
    
    try {
      // Kiểm tra kết nối Auth
      const { data: authData, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        setAuthStatus('error')
        setErrorMessage(`Auth error: ${authError.message}`)
        setCheckingStatus('error')
      } else {
        setAuthStatus('success')
      }
      
      // Kiểm tra kết nối Database
      try {
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        if (countError) {
          setDatabaseStatus('error')
          setErrorMessage(`Database error: ${countError.message}`)
          setCheckingStatus('error')
        } else {
          setUserCount(count)
          setDatabaseStatus('success')
          
          // Nếu cả hai đều thành công
          if (authStatus !== 'error') {
            setCheckingStatus('success')
          }
        }
      } catch (dbError) {
        setDatabaseStatus('error')
        setErrorMessage(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`)
        setCheckingStatus('error')
      }
    } catch (error) {
      setCheckingStatus('error')
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setTestDone(true)
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Check</CardTitle>
            <CardDescription>Kiểm tra kết nối đến Supabase của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Auth Connection:</span>
                <StatusBadge status={authStatus} />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Database Connection:</span>
                <StatusBadge status={databaseStatus} />
              </div>
              
              {userCount !== null && databaseStatus === 'success' && (
                <div className="mt-4 text-sm">
                  <p>Found {userCount} users in database</p>
                </div>
              )}
              
              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {checkingStatus === 'success' && (
                <Alert className="mt-4 border-green-500 text-green-500">
                  <Check className="h-4 w-4" />
                  <AlertDescription>Kết nối Supabase hoạt động tốt!</AlertDescription>
                </Alert>
              )}
              
              {user ? (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="font-medium">Thông tin người dùng:</p>
                  <div className="text-sm mt-2 space-y-1">
                    <p>User ID: {user.id}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role || 'Loading...'}</p>
                  </div>
                </div>
              ) : loading ? (
                <p className="text-muted-foreground">Đang tải thông tin người dùng...</p>
              ) : (
                <p className="text-muted-foreground">Không có người dùng đăng nhập</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              onClick={handleCheckConnection} 
              disabled={checkingStatus === 'checking'}
              className="w-full"
            >
              {checkingStatus === 'checking' ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
            </Button>
            
            <div className="flex space-x-2 w-full">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/auth/signin">
                  Đăng nhập
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin/create-admin">
                  Tạo Admin
                </Link>
              </Button>
            </div>
            
            {testDone && checkingStatus === 'error' && (
              <div className="text-sm text-muted-foreground mt-4">
                <p>Gợi ý:</p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Kiểm tra biến môi trường NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>Đảm bảo dịch vụ Supabase đang hoạt động</li>
                  <li>Kiểm tra các quy tắc Supabase RLS có đúng không</li>
                  <li>Thử tạo tài khoản admin mới bằng trang "/admin/create-admin"</li>
                </ul>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: 'idle' | 'checking' | 'success' | 'error' }) {
  if (status === 'idle') {
    return <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded">Chưa kiểm tra</span>
  }
  
  if (status === 'checking') {
    return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">Đang kiểm tra...</span>
  }
  
  if (status === 'success') {
    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded">Hoạt động tốt</span>
  }
  
  return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded">Lỗi</span>
} 