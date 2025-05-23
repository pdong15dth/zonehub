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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Filter,
  UserX,
  Trash,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Ban
} from "lucide-react"

// Sample data for reported content
const reportedContent = [
  {
    id: "1",
    content: "Bình luận chứa từ ngữ không phù hợp và xúc phạm...",
    contentType: "comment",
    reportedBy: "user123",
    reason: "inappropriate",
    status: "pending",
    createdAt: "15/07/2024 09:45",
    reportCount: 3
  },
  {
    id: "2",
    content: "Bài viết quảng cáo sản phẩm vi phạm chính sách...",
    contentType: "post",
    reportedBy: "user456",
    reason: "spam",
    status: "pending",
    createdAt: "14/07/2024 18:22",
    reportCount: 5
  },
  {
    id: "3",
    content: "Hình ảnh chứa nội dung không phù hợp với quy tắc cộng đồng...",
    contentType: "image",
    reportedBy: "user789",
    reason: "inappropriate",
    status: "reviewed",
    createdAt: "13/07/2024 14:10",
    reportCount: 8
  },
  {
    id: "4",
    content: "Tên người dùng vi phạm quy định về tên...",
    contentType: "username",
    reportedBy: "moderator1",
    reason: "other",
    status: "approved",
    createdAt: "12/07/2024 10:35",
    reportCount: 2
  },
  {
    id: "5",
    content: "Bài viết chứa link đến website lừa đảo...",
    contentType: "post",
    reportedBy: "user321",
    reason: "spam",
    status: "rejected",
    createdAt: "11/07/2024 16:45",
    reportCount: 12
  }
]

// Sample data for flagged users
const flaggedUsers = [
  {
    id: "1",
    username: "spammer123",
    email: "spam***@example.com",
    violationType: "spam",
    violations: 8,
    status: "warning",
    lastViolation: "15/07/2024"
  },
  {
    id: "2",
    username: "toxic_user",
    email: "toxic***@example.com",
    violationType: "harassment",
    violations: 5,
    status: "suspended",
    lastViolation: "12/07/2024"
  },
  {
    id: "3",
    username: "fake_account",
    email: "fake***@example.com",
    violationType: "impersonation",
    violations: 3,
    status: "warning",
    lastViolation: "10/07/2024"
  },
  {
    id: "4",
    username: "scammer456",
    email: "scam***@example.com",
    violationType: "scam",
    violations: 12,
    status: "banned",
    lastViolation: "05/07/2024"
  }
]

export default function ModerationPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter reported content
  const filteredContent = reportedContent.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.contentType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "reviewed":
        return <Badge className="bg-blue-500">Đã xem xét</Badge>
      case "approved":
        return <Badge className="bg-green-500">Đã xử lý</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Đã từ chối</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render reason badge
  const renderReasonBadge = (reason: string) => {
    switch (reason) {
      case "inappropriate":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Không phù hợp</Badge>
      case "spam":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Spam</Badge>
      case "harassment":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Quấy rối</Badge>
      case "other":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Khác</Badge>
      default:
        return <Badge variant="outline">{reason}</Badge>
    }
  }

  // Render user status badge
  const renderUserStatusBadge = (status: string) => {
    switch (status) {
      case "warning":
        return <Badge className="bg-yellow-500">Cảnh báo</Badge>
      case "suspended":
        return <Badge className="bg-orange-500">Tạm khóa</Badge>
      case "banned":
        return <Badge className="bg-red-500">Cấm vĩnh viễn</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kiểm duyệt nội dung</h2>
        <p className="text-muted-foreground">
          Quản lý báo cáo, kiểm duyệt nội dung và xử lý người dùng vi phạm
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportedContent.filter(item => item.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Báo cáo chưa được xử lý</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã xử lý hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Báo cáo đã được xử lý</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cảnh báo người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Người dùng bị cảnh báo</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Người dùng bị cấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Trong 30 ngày qua</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Báo cáo nội dung</TabsTrigger>
          <TabsTrigger value="users">Người dùng vi phạm</TabsTrigger>
          <TabsTrigger value="automod">Kiểm duyệt tự động</TabsTrigger>
          <TabsTrigger value="logs">Nhật ký hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nội dung..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="reviewed">Đã xem xét</SelectItem>
                  <SelectItem value="approved">Đã xử lý</SelectItem>
                  <SelectItem value="rejected">Đã từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Loại nội dung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="comment">Bình luận</SelectItem>
                  <SelectItem value="post">Bài viết</SelectItem>
                  <SelectItem value="image">Hình ảnh</SelectItem>
                  <SelectItem value="username">Tên người dùng</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Lọc khác</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Báo cáo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        Không có báo cáo nội dung nào phù hợp với tìm kiếm
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContent.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="max-w-[300px]">
                          <div className="truncate">{report.content}</div>
                          <div className="text-xs text-muted-foreground">
                            Người báo cáo: {report.reportedBy}
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.contentType === "comment" && "Bình luận"}
                          {report.contentType === "post" && "Bài viết"}
                          {report.contentType === "image" && "Hình ảnh"}
                          {report.contentType === "username" && "Tên người dùng"}
                        </TableCell>
                        <TableCell>
                          {renderReasonBadge(report.reason)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            {report.reportCount} lần
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(report.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{report.createdAt}</div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <Eye className="h-4 w-4" />
                                <span>Xem chi tiết</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">Chấp nhận & Xóa</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">Từ chối báo cáo</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <MessageSquare className="h-4 w-4" />
                                <span>Gửi cảnh báo</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <UserX className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">Xử lý người dùng</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Loại vi phạm</TableHead>
                    <TableHead>Số lần vi phạm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Vi phạm gần nhất</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        {user.violationType === "spam" && "Spam"}
                        {user.violationType === "harassment" && "Quấy rối"}
                        {user.violationType === "impersonation" && "Mạo danh"}
                        {user.violationType === "scam" && "Lừa đảo"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          {user.violations} lần
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {renderUserStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>{user.lastViolation}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <Eye className="h-4 w-4" />
                              <span>Xem hồ sơ</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <MessageSquare className="h-4 w-4 text-yellow-600" />
                              <span className="text-yellow-600">Gửi cảnh báo</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-600">Tạm khóa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <Ban className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Cấm vĩnh viễn</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt kiểm duyệt tự động</CardTitle>
              <CardDescription>
                Cấu hình các quy tắc kiểm duyệt tự động cho nội dung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="text-base font-medium">Từ ngữ không phù hợp</h3>
                      <p className="text-sm text-muted-foreground">Phát hiện và lọc từ ngữ không phù hợp</p>
                    </div>
                  </div>
                  <Button>Cấu hình</Button>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-orange-500" />
                    <div>
                      <h3 className="text-base font-medium">Phát hiện spam</h3>
                      <p className="text-sm text-muted-foreground">Tự động phát hiện và ngăn chặn spam</p>
                    </div>
                  </div>
                  <Button>Cấu hình</Button>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="text-base font-medium">Phát hiện nội dung nhạy cảm</h3>
                      <p className="text-sm text-muted-foreground">Phát hiện và kiểm duyệt nội dung nhạy cảm</p>
                    </div>
                  </div>
                  <Button>Cấu hình</Button>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="text-base font-medium">Phát hiện hành vi đáng ngờ</h3>
                      <p className="text-sm text-muted-foreground">Theo dõi và phát hiện hành vi bất thường</p>
                    </div>
                  </div>
                  <Button>Cấu hình</Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-base font-medium mb-2">Báo cáo hiệu suất</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 border rounded-md p-4">
                    <h4 className="text-sm font-medium">Nội dung bị chặn</h4>
                    <p className="text-2xl font-bold">237</p>
                    <p className="text-xs text-muted-foreground">Trong 30 ngày qua</p>
                  </div>
                  <div className="flex flex-col gap-2 border rounded-md p-4">
                    <h4 className="text-sm font-medium">Độ chính xác</h4>
                    <p className="text-2xl font-bold">92.4%</p>
                    <p className="text-xs text-muted-foreground">Dựa trên phản hồi người kiểm duyệt</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nhật ký hoạt động kiểm duyệt</CardTitle>
              <CardDescription>
                Lịch sử các hoạt động kiểm duyệt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Hôm nay</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">Xóa bài viết vi phạm từ <span className="font-medium">user123</span></p>
                        <p className="text-xs text-muted-foreground">15/07/2024 - 14:25</p>
                      </div>
                      <Badge>admin1</Badge>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">Gửi cảnh báo đến <span className="font-medium">toxic_user</span></p>
                        <p className="text-xs text-muted-foreground">15/07/2024 - 11:10</p>
                      </div>
                      <Badge>admin2</Badge>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">Từ chối báo cáo không hợp lệ về <span className="font-medium">user456</span></p>
                        <p className="text-xs text-muted-foreground">15/07/2024 - 09:45</p>
                      </div>
                      <Badge>admin1</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Hôm qua</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Ban className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">Khóa tài khoản <span className="font-medium">spammer123</span> trong 7 ngày</p>
                        <p className="text-xs text-muted-foreground">14/07/2024 - 16:30</p>
                      </div>
                      <Badge>admin2</Badge>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">Xóa 5 bình luận spam từ <span className="font-medium">fake_account</span></p>
                        <p className="text-xs text-muted-foreground">14/07/2024 - 14:15</p>
                      </div>
                      <Badge>admin1</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 