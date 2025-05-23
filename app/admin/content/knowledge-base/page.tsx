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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
  FileText,
  Book,
  Tag,
  MessageCircle,
  ThumbsUp,
  Calendar,
  User,
  Clock,
  Bookmark,
  ChevronUp,
  ChevronDown
} from "lucide-react"

// Define the article type
interface Article {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  viewCount: number
  likesCount: number
  commentCount: number
  isFeatured: boolean
  isPinned: boolean
  status: string
  createdAt: string
  updatedAt: string
}

// Sample data
const articles: Article[] = [
  {
    id: "1",
    title: "Hướng dẫn triển khai ứng dụng Next.js trên Vercel",
    content: "Tài liệu hướng dẫn chi tiết về cách triển khai ứng dụng Next.js trên nền tảng Vercel, bao gồm cấu hình, tối ưu và giám sát hiệu suất.",
    author: "Nguyễn Văn A",
    category: "deployment",
    tags: ["nextjs", "vercel", "deployment", "cloud"],
    viewCount: 1758,
    likesCount: 342,
    commentCount: 28,
    isFeatured: true,
    isPinned: true,
    status: "published",
    createdAt: "15/03/2023",
    updatedAt: "22/07/2024",
  },
  {
    id: "2",
    title: "Tối ưu hiệu suất cho ứng dụng React",
    content: "Các kỹ thuật và phương pháp để tối ưu hiệu suất cho ứng dụng React, bao gồm memoization, code splitting và lazy loading.",
    author: "Trần Thị B",
    category: "performance",
    tags: ["react", "performance", "optimization", "memoization"],
    viewCount: 985,
    likesCount: 187,
    commentCount: 14,
    isFeatured: true,
    isPinned: false,
    status: "published",
    createdAt: "07/11/2022",
    updatedAt: "10/06/2024",
  },
  {
    id: "3",
    title: "Giới thiệu về TypeScript trong React",
    content: "Hướng dẫn cơ bản về việc sử dụng TypeScript trong dự án React, bao gồm cách cấu hình, các best practices và các ví dụ cụ thể.",
    author: "Lê Văn C",
    category: "typescript",
    tags: ["typescript", "react", "frontend", "type-safety"],
    viewCount: 2450,
    likesCount: 513,
    commentCount: 45,
    isFeatured: false,
    isPinned: false,
    status: "published",
    createdAt: "19/05/2023",
    updatedAt: "03/04/2024",
  },
  {
    id: "4",
    title: "Xác thực người dùng với NextAuth.js",
    content: "Hướng dẫn đầy đủ về việc triển khai hệ thống xác thực trong Next.js bằng NextAuth.js, bao gồm OAuth, JWT và database adapters.",
    author: "Phạm Thị D",
    category: "authentication",
    tags: ["nextjs", "auth", "nextauth", "security"],
    viewCount: 1342,
    likesCount: 278,
    commentCount: 32,
    isFeatured: false,
    isPinned: true,
    status: "draft",
    createdAt: "02/08/2022",
    updatedAt: "12/01/2024",
  },
  {
    id: "5",
    title: "Sử dụng Framer Motion để tạo animation trong React",
    content: "Khám phá cách sử dụng thư viện Framer Motion để tạo các animation mượt mà và hiệu quả trong các ứng dụng React.",
    author: "Hoàng Văn E",
    category: "animation",
    tags: ["react", "framer-motion", "animation", "ui"],
    viewCount: 768,
    likesCount: 156,
    commentCount: 18,
    isFeatured: true,
    isPinned: false,
    status: "published",
    createdAt: "11/04/2023",
    updatedAt: "28/05/2024",
  },
]

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<keyof Article | string>("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    const matchesStatus = statusFilter === "all" || article.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    // Handle different field types appropriately
    let valueA: string | number | Date
    let valueB: string | number | Date
    
    if (sortField === 'viewCount' || sortField === 'likesCount' || sortField === 'commentCount') {
      valueA = a[sortField as keyof Article] as number
      valueB = b[sortField as keyof Article] as number
    } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
      // Convert date strings to timestamps for comparison
      const dateParts = (str: string): number => {
        const [day, month, year] = str.split('/').map(Number)
        return new Date(year, month - 1, day).getTime()
      }
      valueA = dateParts(a[sortField as keyof Article] as string)
      valueB = dateParts(b[sortField as keyof Article] as string)
    } else {
      valueA = String(a[sortField as keyof Article]).toLowerCase()
      valueB = String(b[sortField as keyof Article]).toLowerCase()
    }
    
    // Sort ascending or descending
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })

  // Category badge colors
  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case "deployment":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "performance":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "typescript":
        return "bg-sky-50 text-sky-700 border-sky-200"
      case "authentication":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "animation":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  // Handle sorting
  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Render sort icon
  const renderSortIcon = (field: string): React.ReactNode => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Knowledge Base</h2>
        <p className="text-muted-foreground">
          Tạo, chỉnh sửa và quản lý các bài viết hướng dẫn, tài liệu
        </p>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="w-full flex max-w-md">
          <TabsTrigger value="all" className="flex-1">Tất cả</TabsTrigger>
          <TabsTrigger value="published" className="flex-1">Đã xuất bản</TabsTrigger>
          <TabsTrigger value="draft" className="flex-1">Bản nháp</TabsTrigger>
          <TabsTrigger value="featured" className="flex-1">Nổi bật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {renderArticlesList("all")}
        </TabsContent>
        
        <TabsContent value="published" className="mt-6">
          {renderArticlesList("published")}
        </TabsContent>
        
        <TabsContent value="draft" className="mt-6">
          {renderArticlesList("draft")}
        </TabsContent>
        
        <TabsContent value="featured" className="mt-6">
          {renderArticlesList("featured")}
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderArticlesList(tabValue: string): React.ReactNode {
    // Filter the articles based on tab
    let tabArticles = sortedArticles
    if (tabValue === "published") {
      tabArticles = sortedArticles.filter(article => article.status === "published")
    } else if (tabValue === "draft") {
      tabArticles = sortedArticles.filter(article => article.status === "draft")
    } else if (tabValue === "featured") {
      tabArticles = sortedArticles.filter(article => article.isFeatured)
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bài viết</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bài viết mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo bài viết mới</DialogTitle>
                  <DialogDescription>
                    Thêm thông tin cho bài viết, hướng dẫn hoặc tài liệu mới
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right">Tiêu đề</label>
                    <Input id="title" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="content" className="text-right pt-2">Nội dung</label>
                    <Textarea id="content" className="col-span-3" rows={10} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">Danh mục</label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deployment">Triển khai</SelectItem>
                        <SelectItem value="performance">Hiệu suất</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="authentication">Xác thực</SelectItem>
                        <SelectItem value="animation">Hoạt ảnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="tags" className="text-right">Tags</label>
                    <Input id="tags" className="col-span-3" placeholder="Nhập tags, phân cách bằng dấu phẩy" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="status" className="text-right">Trạng thái</label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Đã xuất bản</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">Tùy chọn</div>
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="featured" />
                        <label htmlFor="featured">Đánh dấu là nổi bật</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pinned" />
                        <label htmlFor="pinned">Ghim lên đầu</label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Lưu bài viết</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Quản lý tất cả các bài viết, hướng dẫn và tài liệu
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="deployment">Triển khai</SelectItem>
                <SelectItem value="performance">Hiệu suất</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="authentication">Xác thực</SelectItem>
                <SelectItem value="animation">Hoạt ảnh</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">
                  <button 
                    className="flex items-center font-medium"
                    onClick={() => handleSort('title')}
                  >
                    Tiêu đề {renderSortIcon('title')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-medium"
                    onClick={() => handleSort('category')}
                  >
                    Danh mục {renderSortIcon('category')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-medium"
                    onClick={() => handleSort('viewCount')}
                  >
                    Lượt xem {renderSortIcon('viewCount')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-medium"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Cập nhật {renderSortIcon('updatedAt')}
                  </button>
                </TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy bài viết nào phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                tabArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <div className="rounded-lg bg-muted p-2 w-10 h-10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {article.content.substring(0, 100)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryBadgeColor(article.category)}`}>
                        {article.category === "deployment" && "Triển khai"}
                        {article.category === "performance" && "Hiệu suất"}
                        {article.category === "typescript" && "TypeScript"}
                        {article.category === "authentication" && "Xác thực"}
                        {article.category === "animation" && "Hoạt ảnh"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{article.viewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{article.updatedAt}</span>
                        <span className="text-muted-foreground">
                          bởi {article.author}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.status === "published" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Đã xuất bản
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Bản nháp
                        </Badge>
                      )}
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
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Xóa
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
    )
  }
} 