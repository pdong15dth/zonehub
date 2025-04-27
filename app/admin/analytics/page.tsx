"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  EyeIcon,
  MousePointerClick,
  Clock,
  Download,
  Share2,
  FileText,
  TrendingUp,
  List,
  Grid,
  RefreshCcw
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [chartView, setChartView] = useState("line")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Phân tích dữ liệu</h2>
        <p className="text-muted-foreground">
          Theo dõi số liệu thống kê và báo cáo hiệu suất của trang web
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khung thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="yesterday">Hôm qua</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="thisMonth">Tháng này</SelectItem>
              <SelectItem value="lastMonth">Tháng trước</SelectItem>
              <SelectItem value="custom">Tùy chỉnh...</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,546</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lượt truy cập</CardTitle>
            <EyeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78,290</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +18.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              so với tuần trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tỉ lệ chuyển đổi</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                -2.3% <ArrowDownRight className="h-3 w-3 ml-1" />
              </span>{" "}
              so với tuần trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.3% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="audience">Người dùng</TabsTrigger>
          <TabsTrigger value="acquisition">Nguồn truy cập</TabsTrigger>
          <TabsTrigger value="behavior">Hành vi</TabsTrigger>
          <TabsTrigger value="conversions">Chuyển đổi</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Số liệu theo thời gian</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={chartView === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartView("line")}
                  >
                    <LineChart className="h-4 w-4 mr-1" />
                    Line
                  </Button>
                  <Button
                    variant={chartView === "area" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartView("area")}
                  >
                    <AreaChart className="h-4 w-4 mr-1" />
                    Area
                  </Button>
                  <Button
                    variant={chartView === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartView("bar")}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                </div>
              </div>
              <CardDescription>Lượt truy cập và người dùng theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {chartView === "line" && <LineChart className="h-20 w-20 text-muted-foreground" />}
              {chartView === "area" && <AreaChart className="h-20 w-20 text-muted-foreground" />}
              {chartView === "bar" && <BarChart className="h-20 w-20 text-muted-foreground" />}
              <p className="text-sm text-muted-foreground ml-4">Biểu đồ dữ liệu sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trang phổ biến</CardTitle>
                <CardDescription>
                  Top 5 trang được truy cập nhiều nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Trang chủ", views: 23400, path: "/" },
                    { name: "Giới thiệu", views: 12508, path: "/about" },
                    { name: "Tin tức", views: 9087, path: "/news" },
                    { name: "Liên hệ", views: 4326, path: "/contact" },
                    { name: "Game", views: 3250, path: "/games" },
                  ].map((page, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-[35px] text-center font-medium text-sm text-muted-foreground">
                        {i + 1}
                      </div>
                      <div className="ml-2 flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{page.name}</p>
                        <p className="text-xs text-muted-foreground">{page.path}</p>
                      </div>
                      <div className="ml-auto font-medium">{page.views.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Nguồn truy cập</CardTitle>
                <CardDescription>
                  Phân bổ nguồn truy cập
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center pb-4">
                  <PieChart className="h-24 w-24 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Trực tiếp", percent: 42.5, color: "bg-blue-500" },
                    { name: "Organic Search", percent: 28.7, color: "bg-green-500" },
                    { name: "Social Media", percent: 15.8, color: "bg-yellow-500" },
                    { name: "Referral", percent: 10.2, color: "bg-purple-500" },
                    { name: "Khác", percent: 2.8, color: "bg-gray-500" },
                  ].map((source, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${source.color}`} />
                      <div className="ml-2 flex-1">
                        <p className="text-sm font-medium">{source.name}</p>
                      </div>
                      <div className="ml-auto font-medium">{source.percent}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích người dùng</CardTitle>
              <CardDescription>Thông tin chi tiết về người dùng truy cập trang web</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <Users className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground ml-4">Biểu đồ phân tích người dùng sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acquisition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích nguồn truy cập</CardTitle>
              <CardDescription>Thông tin về các kênh dẫn người dùng đến trang web</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <Share2 className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground ml-4">Biểu đồ phân tích nguồn truy cập sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích hành vi</CardTitle>
              <CardDescription>Thông tin về cách người dùng tương tác với trang web</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <MousePointerClick className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground ml-4">Biểu đồ phân tích hành vi sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích chuyển đổi</CardTitle>
              <CardDescription>Thông tin về tỷ lệ chuyển đổi và mục tiêu đạt được</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground ml-4">Biểu đồ phân tích chuyển đổi sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Thiết bị truy cập</CardTitle>
            <CardDescription>
              Phân bổ theo loại thiết bị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center pb-4">
              <PieChart className="h-20 w-20 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div className="ml-2 flex-1">
                  <p className="text-sm font-medium">Điện thoại</p>
                </div>
                <div className="ml-auto font-medium">58.9%</div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-2 flex-1">
                  <p className="text-sm font-medium">Máy tính</p>
                </div>
                <div className="ml-auto font-medium">32.4%</div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="ml-2 flex-1">
                  <p className="text-sm font-medium">Tablet</p>
                </div>
                <div className="ml-auto font-medium">8.7%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quốc gia</CardTitle>
            <CardDescription>
              Top quốc gia truy cập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 text-center">🇻🇳</div>
                <div className="ml-2 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Việt Nam</p>
                </div>
                <div className="ml-auto font-medium">72.5%</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 text-center">🇺🇸</div>
                <div className="ml-2 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Hoa Kỳ</p>
                </div>
                <div className="ml-auto font-medium">8.2%</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 text-center">🇯🇵</div>
                <div className="ml-2 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Nhật Bản</p>
                </div>
                <div className="ml-auto font-medium">4.3%</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 text-center">🇰🇷</div>
                <div className="ml-2 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Hàn Quốc</p>
                </div>
                <div className="ml-auto font-medium">3.8%</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 text-center">🌍</div>
                <div className="ml-2 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Khác</p>
                </div>
                <div className="ml-auto font-medium">11.2%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Hoạt động mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <FileText className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm">Có <strong>12 bài viết mới</strong> được đăng trong tuần này</p>
                  <p className="text-xs text-muted-foreground">12 phút trước</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm"><strong>254 người dùng mới</strong> đã đăng ký trong 24 giờ qua</p>
                  <p className="text-xs text-muted-foreground">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start">
                <EyeIcon className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm">Lượt xem trang tăng <strong>18.5%</strong> so với tuần trước</p>
                  <p className="text-xs text-muted-foreground">5 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start">
                <Download className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm"><strong>1,240 lượt tải xuống</strong> trong 7 ngày qua</p>
                  <p className="text-xs text-muted-foreground">1 ngày trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 