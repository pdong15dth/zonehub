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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Save,
  User,
  Mail,
  Bell,
  Shield,
  Globe,
  Database,
  Lock,
  Upload,
  AlertTriangle,
  Trash,
  CloudUpload,
  RefreshCcw
} from "lucide-react"

export default function SettingsPage() {
  // State for various settings
  const [siteTitle, setSiteTitle] = useState("ZoneHub")
  const [siteDescription, setSiteDescription] = useState("Game community platform")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [defaultTheme, setDefaultTheme] = useState("system")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationsEnabled, setRegistrationsEnabled] = useState(true)
  const [fileLimit, setFileLimit] = useState("10")
  const [language, setLanguage] = useState("vi")
  const [dataRetention, setDataRetention] = useState("90")

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would save the settings to a database
    console.log("Settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground">
          Quản lý các thiết lập và cấu hình cho trang web
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Chung</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Giao diện</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Thông báo</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Nâng cao</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>
                Thay đổi các thiết lập chung của website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="site-title">Tên trang web</Label>
                    <Input 
                      id="site-title" 
                      value={siteTitle} 
                      onChange={(e) => setSiteTitle(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Tên hiển thị trên tiêu đề và thông tin chung
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="site-description">Mô tả</Label>
                    <Textarea 
                      id="site-description" 
                      value={siteDescription} 
                      onChange={(e) => setSiteDescription(e.target.value)}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      Mô tả ngắn gọn về trang web
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Chọn ngôn ngữ mặc định" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="jp">日本語</SelectItem>
                        <SelectItem value="kr">한국어</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Ngôn ngữ mặc định cho trang web
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact-email">Email liên hệ</Label>
                    <Input 
                      id="contact-email" 
                      type="email"
                      placeholder="admin@example.com"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email hiển thị trong trang liên hệ
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt giao diện</CardTitle>
              <CardDescription>
                Tùy chỉnh giao diện và hiển thị
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="default-theme">Giao diện mặc định</Label>
                  <Select value={defaultTheme} onValueChange={setDefaultTheme}>
                    <SelectTrigger id="default-theme">
                      <SelectValue placeholder="Chọn giao diện mặc định" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Sáng</SelectItem>
                      <SelectItem value="dark">Tối</SelectItem>
                      <SelectItem value="system">Theo hệ thống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="logo-upload">Logo trang web</Label>
                  <div className="flex gap-2">
                    <Input id="logo-upload" type="file" className="flex-1" />
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Tải lên</span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="favicon-upload">Favicon</Label>
                  <div className="flex gap-2">
                    <Input id="favicon-upload" type="file" className="flex-1" />
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span>Tải lên</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="footer-text">Hiển thị footer</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị phần footer ở cuối trang
                    </p>
                  </div>
                  <Switch id="footer-text" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý các tùy chọn thông báo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông báo người dùng</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo qua email</Label>
                        <p className="text-sm text-muted-foreground">
                          Gửi thông báo qua email đến người dùng
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo đẩy</Label>
                        <p className="text-sm text-muted-foreground">
                          Gửi thông báo đẩy đến trình duyệt và thiết bị di động
                        </p>
                      </div>
                      <Switch 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông báo quản trị</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo về người dùng mới</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo khi có người dùng mới đăng ký
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo báo cáo nội dung</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo khi có báo cáo nội dung mới
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cảnh báo bảo mật</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo về các sự kiện bảo mật quan trọng
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>
                Cấu hình các thiết lập bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Xác thực hai yếu tố</Label>
                      <p className="text-sm text-muted-foreground">
                        Yêu cầu xác thực hai yếu tố với tài khoản quản trị
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Kích hoạt CAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">
                        Sử dụng CAPTCHA để ngăn chặn bot trong biểu mẫu
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cho phép đăng ký mới</Label>
                      <p className="text-sm text-muted-foreground">
                        Cho phép người dùng tạo tài khoản mới
                      </p>
                    </div>
                    <Switch 
                      checked={registrationsEnabled}
                      onCheckedChange={setRegistrationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chế độ bảo trì</Label>
                      <p className="text-sm text-muted-foreground">
                        Kích hoạt chế độ bảo trì, chỉ admin có thể truy cập
                      </p>
                    </div>
                    <Switch 
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Chính sách mật khẩu</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="password-expiry">Thời gian hết hạn mật khẩu (ngày)</Label>
                    <Input id="password-expiry" type="number" defaultValue={90} />
                    <p className="text-sm text-muted-foreground">
                      Số ngày trước khi người dùng phải đổi mật khẩu (0 = không hết hạn)
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt nâng cao</CardTitle>
              <CardDescription>
                Cấu hình nâng cao và công cụ hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="file-size-limit">Giới hạn kích thước tệp (MB)</Label>
                    <Input 
                      id="file-size-limit" 
                      type="number"
                      value={fileLimit}
                      onChange={(e) => setFileLimit(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Kích thước tối đa cho các tệp tải lên
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="data-retention">Thời gian lưu trữ dữ liệu (ngày)</Label>
                    <Input 
                      id="data-retention" 
                      type="number"
                      value={dataRetention}
                      onChange={(e) => setDataRetention(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Số ngày lưu trữ dữ liệu nhật ký và thống kê (0 = vĩnh viễn)
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Công cụ hệ thống</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-sm font-medium">Sao lưu dữ liệu</h4>
                        <p className="text-xs text-muted-foreground">
                          Tạo bản sao lưu đầy đủ cho tất cả dữ liệu
                        </p>
                        <Button variant="outline" className="mt-2 w-full flex items-center justify-center gap-2">
                          <CloudUpload className="h-4 w-4" />
                          <span>Tạo bản sao lưu</span>
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-sm font-medium">Xóa bộ nhớ đệm</h4>
                        <p className="text-xs text-muted-foreground">
                          Xóa tất cả bộ nhớ đệm của hệ thống
                        </p>
                        <Button variant="outline" className="mt-2 w-full flex items-center justify-center gap-2">
                          <RefreshCcw className="h-4 w-4" />
                          <span>Xóa cache</span>
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-sm font-medium">Nhật ký hệ thống</h4>
                        <p className="text-xs text-muted-foreground">
                          Tải xuống tệp nhật ký hệ thống
                        </p>
                        <Button variant="outline" className="mt-2 w-full flex items-center justify-center gap-2">
                          <Save className="h-4 w-4" />
                          <span>Tải xuống logs</span>
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-destructive">
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-sm font-medium text-destructive">Xóa dữ liệu</h4>
                        <p className="text-xs text-muted-foreground">
                          Xóa tất cả dữ liệu tạm thời
                        </p>
                        <Button variant="destructive" className="mt-2 w-full flex items-center justify-center gap-2">
                          <Trash className="h-4 w-4" />
                          <span>Xóa dữ liệu tạm</span>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Cẩn thận khi thay đổi các cài đặt nâng cao. Một số thay đổi có thể ảnh hưởng đến hiệu suất và hoạt động của hệ thống.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 