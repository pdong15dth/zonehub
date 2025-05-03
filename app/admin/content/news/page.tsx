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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Plus,
  Search,
  Filter,
  FileEdit,
  Calendar,
  FileText,
  Image
} from "lucide-react"
import Link from "next/link"

// Sample data
const newsArticles = [
  {
    id: "1",
    title: "PlayStation 6 sẽ ra mắt vào năm 2026",
    author: "Nguyễn Văn A",
    category: "console",
    status: "published",
    publishDate: "15/04/2023",
    views: 14500,
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Review: God of War Ragnarök - Tuyệt phẩm không thể bỏ lỡ",
    author: "Trần Thị B",
    category: "review",
    status: "published",
    publishDate: "28/05/2023",
    views: 8200,
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Call of Duty: Modern Warfare 3 sắp ra mắt",
    author: "Lê Văn C",
    category: "game",
    status: "draft",
    publishDate: "",
    views: 0,
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    title: "Xbox Game Pass thêm mới 5 tựa game indie trong tháng 6",
    author: "Phạm Thị D",
    category: "service",
    status: "published",
    publishDate: "03/06/2023",
    views: 4300,
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "5",
    title: "Nintendo Switch 2 - Những thông tin rò rỉ mới nhất",
    author: "Hoàng Văn E",
    category: "console",
    status: "scheduled",
    publishDate: "18/07/2023",
    views: 0,
    featured: false,
    image: "/placeholder.svg"
  },
]

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter articles based on search and filters
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    const matchesStatus = statusFilter === "all" || article.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Đã đăng</Badge>
      case "draft":
        return <Badge variant="outline" className="text-muted-foreground">Bản nháp</Badge>
      case "scheduled":
        return <Badge variant="secondary">Đã lên lịch</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render category badge with appropriate color
  const renderCategoryBadge = (category: string) => {
    switch (category) {
      case "console":
        return <Badge className="bg-blue-500">Console</Badge>
      case "game":
        return <Badge className="bg-purple-500">Game</Badge>
      case "review":
        return <Badge className="bg-amber-500">Review</Badge>
      case "service":
        return <Badge className="bg-emerald-500">Dịch vụ</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý tin tức</h2>
        <p className="text-muted-foreground">
          Tạo, chỉnh sửa và quản lý các bài viết tin tức
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-5 w-fit">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="published">Đã đăng</TabsTrigger>
            <TabsTrigger value="draft">Bản nháp</TabsTrigger>
            <TabsTrigger value="scheduled">Đã lên lịch</TabsTrigger>
            <TabsTrigger value="trash">Thùng rác</TabsTrigger>
          </TabsList>
          <Button className="flex items-center gap-1" asChild>
            <Link href="/admin/content/news/create">
              <Plus className="h-4 w-4" />
              <span>Bài viết mới</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="console">Console</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="service">Dịch vụ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã đăng</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-1 md:w-auto">
              <Filter className="h-4 w-4" />
              <span>Lọc khác</span>
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày đăng</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        Không có bài viết nào phù hợp với tìm kiếm
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium line-clamp-1">{article.title}</div>
                              <div className="text-sm text-muted-foreground">{article.author}</div>
                            </div>
                            {article.featured && (
                              <Badge variant="secondary" className="ml-2">Nổi bật</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{renderCategoryBadge(article.category)}</TableCell>
                        <TableCell>{renderStatusBadge(article.status)}</TableCell>
                        <TableCell>{article.publishDate || "Chưa đăng"}</TableCell>
                        <TableCell>{article.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <Eye className="h-4 w-4" />
                                <span>Xem trước</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <Edit className="h-4 w-4" />
                                <span>Chỉnh sửa</span>
                              </DropdownMenuItem>
                              {article.status !== "published" && (
                                <DropdownMenuItem className="flex gap-2 items-center">
                                  <FileText className="h-4 w-4 text-green-500" />
                                  <span className="text-green-500">Đăng ngay</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex gap-2 items-center">
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="text-destructive">Xóa</span>
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
        <TabsContent value="published">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Ngày đăng</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles
                    .filter(article => article.status === "published")
                    .map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium line-clamp-1">{article.title}</div>
                              <div className="text-sm text-muted-foreground">{article.author}</div>
                            </div>
                            {article.featured && (
                              <Badge variant="secondary" className="ml-2">Nổi bật</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{renderCategoryBadge(article.category)}</TableCell>
                        <TableCell>{article.publishDate}</TableCell>
                        <TableCell>{article.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileEdit className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Các bản nháp</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Các bài viết đang ở trạng thái nháp sẽ được hiển thị tại đây
              </p>
              {filteredArticles.filter(article => article.status === "draft").length > 0 ? (
                <div className="mt-4 space-y-2">
                  {filteredArticles
                    .filter(article => article.status === "draft")
                    .map((article) => (
                      <div key={article.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="text-left">
                            <div className="font-medium">{article.title}</div>
                            <div className="text-xs text-muted-foreground">{article.author}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" /> Xem
                          </Button>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <Button className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Tạo bản nháp
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Các bài viết đã lên lịch</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Các bài viết đã lên lịch sẽ tự động đăng vào thời gian đã định
              </p>
              {filteredArticles.filter(article => article.status === "scheduled").length > 0 ? (
                <div className="mt-4 space-y-2">
                  {filteredArticles
                    .filter(article => article.status === "scheduled")
                    .map((article) => (
                      <div key={article.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="text-left">
                            <div className="font-medium">{article.title}</div>
                            <div className="text-xs text-muted-foreground">Đăng vào: {article.publishDate}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" /> Xem
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Calendar className="h-4 w-4 mr-1" /> Hủy lịch
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <Button className="mt-4" variant="outline">
                  <Calendar className="h-4 w-4 mr-1" /> Lên lịch đăng bài
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 