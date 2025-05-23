import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Download,
  GamepadIcon,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <GamepadIcon className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">ZoneHub</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <Link
                className="text-foreground/60 transition-colors hover:text-foreground/80"
                href="/news"
              >
                Tin tức
              </Link>
              <Link
                className="ml-6 text-foreground/60 transition-colors hover:text-foreground/80"
                href="/games"
              >
                Game
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Chào mừng đến với ZoneHub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Nền tảng gaming hiện đại với tin tức, đánh giá và thư viện game phong phú
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/games">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Khám phá Game
                  </Button>
                </Link>
                <Link href="/news">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    Đọc tin tức
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Tin tức Game mới nhất
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Cập nhật những tin tức hot nhất từ thế giới gaming
                </p>
                <Link href="/news">
                  <Button>Xem tất cả tin tức</Button>
                </Link>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Thư viện Game
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Khám phá hàng ngàn game hay từ mọi thể loại
                </p>
                <Link href="/games">
                  <Button>Khám phá ngay</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500">
            © 2024 ZoneHub. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Điều khoản dịch vụ
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Chính sách bảo mật
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
