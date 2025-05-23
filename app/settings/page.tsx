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
  User,
  Bell,
  Shield,
  Lock,
  CreditCard,
  Save,
  LogOut,
  Settings,
  Smartphone,
  Mail,
  Upload,
  Trash,
  Eye,
  EyeOff
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserSettingsPage() {
  const [selectedTab, setSelectedTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cài đặt tài khoản</h2>
          <p className="text-muted-foreground">
            Quản lý cài đặt tài khoản, bảo mật và tùy chọn cá nhân
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4 mt-2">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback>NN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-medium text-lg">Nguyễn Văn A</h3>
                    <p className="text-sm text-muted-foreground">nguyenvana@example.com</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Chỉnh sửa ảnh
                  </Button>
                  <Separator />
                  <nav className="space-y-1">
                    <Button 
                      variant={selectedTab === "profile" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedTab("profile")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Hồ sơ cá nhân
                    </Button>
                    <Button 
                      variant={selectedTab === "account" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedTab("account")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Tài khoản
                    </Button>
                    <Button 
                      variant={selectedTab === "security" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedTab("security")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Bảo mật
                    </Button>
                    <Button 
                      variant={selectedTab === "notifications" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedTab("notifications")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Thông báo
                    </Button>
                    <Button 
                      variant={selectedTab === "billing" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedTab("billing")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Thanh toán
                    </Button>
                  </nav>
                  <Separator />
                  <Button variant="ghost" className="w-full justify-start text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-3/4">
            {selectedTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Hồ sơ cá nhân</CardTitle>
                  <CardDescription>
                    Thay đổi thông tin cá nhân và hồ sơ của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input id="firstName" defaultValue="Nguyễn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input id="lastName" defaultValue="Văn A" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="nguyenvana@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" defaultValue="0912345678" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu bản thân</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Viết vài dòng về bản thân bạn" 
                      rows={4}
                      defaultValue="Tôi là một game thủ đam mê với hơn 10 năm kinh nghiệm. Thích chơi các tựa game thể loại RPG và FPS."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Giới tính</Label>
                    <Select defaultValue="male">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                        <SelectItem value="prefer-not-to-say">Không muốn tiết lộ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật</CardTitle>
                  <CardDescription>
                    Quản lý mật khẩu và cài đặt bảo mật tài khoản
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <div className="relative">
                          <Input 
                            id="current-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <div className="relative">
                          <Input 
                            id="new-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                        <div className="relative">
                          <Input 
                            id="confirm-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Xác thực hai yếu tố</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Kích hoạt xác thực hai yếu tố</Label>
                        <p className="text-sm text-muted-foreground">
                          Thêm một lớp bảo mật bổ sung cho tài khoản của bạn
                        </p>
                      </div>
                      <Switch 
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    
                    {twoFactorEnabled && (
                      <div className="mt-4 p-4 border rounded-md">
                        <h4 className="font-medium">Phương thức xác thực</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="sms" name="2fa-method" className="text-primary" defaultChecked />
                            <label htmlFor="sms" className="text-sm font-medium">SMS</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="app" name="2fa-method" className="text-primary" />
                            <label htmlFor="app" className="text-sm font-medium">Ứng dụng xác thực</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="email" name="2fa-method" className="text-primary" />
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Thiết bị đã đăng nhập</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start p-3 border rounded-md">
                        <div className="flex gap-3">
                          <Smartphone className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">iPhone 13 Pro</p>
                            <p className="text-sm text-muted-foreground">Hà Nội, Việt Nam • Hoạt động gần đây</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Đăng xuất
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-start p-3 border rounded-md">
                        <div className="flex gap-3">
                          <Settings className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Windows PC</p>
                            <p className="text-sm text-muted-foreground">Hà Nội, Việt Nam • Đang hoạt động</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Thiết bị hiện tại
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông báo</CardTitle>
                  <CardDescription>
                    Quản lý cài đặt thông báo và email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Thông báo ứng dụng</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Bình luận và phản hồi</Label>
                          <p className="text-sm text-muted-foreground">
                            Thông báo khi có ai đó bình luận hoặc phản hồi nội dung của bạn
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Lời mời kết bạn</Label>
                          <p className="text-sm text-muted-foreground">
                            Thông báo khi có người gửi lời mời kết bạn
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Tin nhắn trực tiếp</Label>
                          <p className="text-sm text-muted-foreground">
                            Thông báo khi nhận được tin nhắn trực tiếp
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Cập nhật hệ thống</Label>
                          <p className="text-sm text-muted-foreground">
                            Thông báo về các cập nhật và thay đổi hệ thống
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Thông báo qua email</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo qua email
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
                            Nhận thông báo đẩy từ ứng dụng
                          </p>
                        </div>
                        <Switch 
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email marketing</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông tin về chương trình khuyến mãi và cập nhật
                          </p>
                        </div>
                        <Switch 
                          checked={marketingEmails}
                          onCheckedChange={setMarketingEmails}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle>Tài khoản</CardTitle>
                  <CardDescription>
                    Quản lý cài đặt tài khoản và tùy chọn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Ngôn ngữ và khu vực</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Ngôn ngữ</Label>
                        <Select defaultValue="vi">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">Tiếng Việt</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ja">日本語</SelectItem>
                            <SelectItem value="kr">한국어</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Múi giờ</Label>
                        <Select defaultValue="gmt7">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Chọn múi giờ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gmt7">GMT+7 (Hà Nội, Bangkok)</SelectItem>
                            <SelectItem value="gmt8">GMT+8 (Singapore, Hong Kong)</SelectItem>
                            <SelectItem value="gmt9">GMT+9 (Tokyo, Seoul)</SelectItem>
                            <SelectItem value="utc">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Dữ liệu tài khoản</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Xuất dữ liệu
                        </Button>
                        <Button variant="outline">
                          <Trash className="h-4 w-4 mr-2" />
                          Xóa tài khoản
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tải về một bản sao dữ liệu của bạn hoặc xóa vĩnh viễn tài khoản cùng tất cả dữ liệu của bạn.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thanh toán</CardTitle>
                  <CardDescription>
                    Quản lý thông tin thanh toán và gói đăng ký
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Gói hiện tại</h3>
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Gói Miễn phí</p>
                          <p className="text-sm text-muted-foreground">Gói cơ bản với các tính năng hạn chế</p>
                        </div>
                        <Button>Nâng cấp</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Không có phương thức thanh toán nào được thêm.
                      </p>
                      <Button variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thêm phương thức thanh toán
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Lịch sử thanh toán</h3>
                    <p className="text-sm text-muted-foreground">
                      Chưa có giao dịch nào.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 