"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Wrench } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>("")
  const [errorDescription, setErrorDescription] = useState<string>("")
  const [showDiagnosticLink, setShowDiagnosticLink] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    
    if (errorParam) {
      let errorMessage = ""
      let errorDesc = ""
      let isDatabaseError = false
      
      switch (errorParam) {
        case "OAuthSignin":
          errorMessage = "Lỗi khi bắt đầu đăng nhập OAuth"
          errorDesc = "Có lỗi xảy ra khi bắt đầu tiến trình đăng nhập. Vui lòng thử lại."
          break
        case "OAuthCallback":
          errorMessage = "Lỗi khi xác thực OAuth"
          errorDesc = "Có lỗi xảy ra trong quá trình xác thực với nhà cung cấp OAuth."
          break
        case "OAuthCreateAccount":
          errorMessage = "Lỗi khi tạo tài khoản OAuth"
          errorDesc = "Không thể tạo tài khoản sử dụng nhà cung cấp OAuth."
          break
        case "EmailCreateAccount":
          errorMessage = "Lỗi khi tạo tài khoản Email"
          errorDesc = "Không thể tạo tài khoản với email đã cung cấp."
          break
        case "Callback":
          errorMessage = "Lỗi trong quá trình callback"
          errorDesc = "Có lỗi xảy ra trong quá trình xử lý callback."
          break
        case "AccessDenied":
          errorMessage = "Truy cập bị từ chối"
          errorDesc = "Bạn không có quyền truy cập vào tài nguyên này."
          break
        case "CredentialsSignin":
          errorMessage = "Thông tin đăng nhập không hợp lệ"
          errorDesc = "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại."
          break
        case "DatabaseError":
          errorMessage = "Lỗi cơ sở dữ liệu"
          errorDesc = "Có lỗi xảy ra với cơ sở dữ liệu khi xử lý yêu cầu của bạn."
          isDatabaseError = true
          break
        case "DatabaseUserError":
          errorMessage = "Lỗi dữ liệu người dùng"
          errorDesc = "Có xung đột giữa dữ liệu xác thực và dữ liệu người dùng. Hãy sử dụng công cụ chẩn đoán để khắc phục."
          isDatabaseError = true
          break
        default:
          errorMessage = "Lỗi xác thực"
          errorDesc = `Đã xảy ra lỗi xác thực: ${errorParam}`
          // Check if it might be a database error based on the message
          if (errorParam.includes("database") || errorParam.includes("duplicate") || errorParam.includes("granting user")) {
            isDatabaseError = true
          }
      }
      
      setError(errorMessage)
      setErrorDescription(errorDesc)
      setShowDiagnosticLink(isDatabaseError)
    } else {
      setError("Lỗi xác thực không xác định")
      setErrorDescription("Đã xảy ra lỗi không xác định trong quá trình xác thực.")
    }
  }, [searchParams])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Lỗi xác thực</h1>
          <p className="text-sm text-muted-foreground">
            Đã xảy ra lỗi trong quá trình xác thực
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{error}</CardTitle>
            <CardDescription>
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi vẫn tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {errorDescription}
              </AlertDescription>
            </Alert>
            
            {showDiagnosticLink && (
              <div className="mt-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-700 text-lg">Công cụ chẩn đoán & sửa chữa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 text-sm">
                      Chúng tôi đã phát hiện lỗi liên quan đến dữ liệu tài khoản. Sử dụng công cụ chẩn đoán để phát hiện và sửa chữa vấn đề.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/auth/account-diagnostic" className="flex items-center">
                        <Wrench className="mr-2 h-4 w-4" />
                        Mở công cụ chẩn đoán
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/auth/signin" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/">
                Trang chủ
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
