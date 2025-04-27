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
  Filter,
  Star,
  Code,
  Github,
  GitBranch,
  Download,
  FileCode,
  Shield,
  Zap
} from "lucide-react"

// Sample data
const repositories = [
  {
    id: "1",
    name: "react-hooks-library",
    description: "A comprehensive collection of useful React hooks for common patterns",
    author: "nguyendev",
    language: "typescript",
    stars: 1245,
    forks: 378,
    licenseName: "MIT",
    licenseType: "open",
    verified: true,
    deployable: true,
    category: "frontend",
    createdAt: "15/03/2023",
    updatedAt: "22/07/2024",
    topics: ["react", "hooks", "typescript"],
    repoUrl: "https://github.com/nguyendev/react-hooks-library"
  },
  {
    id: "2",
    name: "nodejs-api-template",
    description: "Scalable API template for Node.js with TypeScript, Express, and MongoDB",
    author: "thu_trang",
    language: "typescript",
    stars: 852,
    forks: 213,
    licenseName: "Apache 2.0",
    licenseType: "open",
    verified: true,
    deployable: true,
    category: "backend",
    createdAt: "07/11/2022",
    updatedAt: "10/06/2024",
    topics: ["nodejs", "api", "express", "typescript"],
    repoUrl: "https://github.com/thu_trang/nodejs-api-template"
  },
  {
    id: "3",
    name: "vue-dashboard-boilerplate",
    description: "Modern dashboard template for Vue 3 with components and charts",
    author: "trungduc",
    language: "javascript",
    stars: 623,
    forks: 175,
    licenseName: "MIT",
    licenseType: "open",
    verified: true,
    deployable: true,
    category: "frontend",
    createdAt: "19/05/2023",
    updatedAt: "03/04/2024",
    topics: ["vue", "dashboard", "components"],
    repoUrl: "https://github.com/trungduc/vue-dashboard-boilerplate"
  },
  {
    id: "4",
    name: "django-ecommerce-api",
    description: "Full-featured e-commerce API built with Django and Django REST Framework",
    author: "minhanh",
    language: "python",
    stars: 421,
    forks: 98,
    licenseName: "GPLv3",
    licenseType: "open",
    verified: false,
    deployable: true,
    category: "backend",
    createdAt: "02/08/2022",
    updatedAt: "12/01/2024",
    topics: ["django", "ecommerce", "api"],
    repoUrl: "https://github.com/minhanh/django-ecommerce-api"
  },
  {
    id: "5",
    name: "flutter-state-management",
    description: "Comprehensive state management patterns for Flutter applications",
    author: "hoanglong",
    language: "dart",
    stars: 385,
    forks: 123,
    licenseName: "MIT",
    licenseType: "open",
    verified: true,
    deployable: false,
    category: "mobile",
    createdAt: "11/04/2023",
    updatedAt: "28/05/2024",
    topics: ["flutter", "state-management", "mobile"],
    repoUrl: "https://github.com/hoanglong/flutter-state-management"
  },
]

export default function SourceCodePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")

  // Filter repositories based on search and filters
  const filteredRepos = repositories.filter(repo => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || repo.category === categoryFilter
    const matchesLanguage = languageFilter === "all" || repo.language === languageFilter
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  // Render language badges
  const renderLanguageBadge = (language: string) => {
    let badgeClass = ""
    
    switch (language) {
      case "typescript":
        badgeClass = "bg-blue-600"
        break
      case "javascript":
        badgeClass = "bg-yellow-500"
        break
      case "python":
        badgeClass = "bg-green-600"
        break
      case "dart":
        badgeClass = "bg-blue-400"
        break
      default:
        badgeClass = "bg-gray-500"
    }
    
    return <Badge className={badgeClass}>{language}</Badge>
  }

  // Render topic badges
  const renderTopicBadges = (topics: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {topics.map(topic => (
          <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Source Code</h2>
        <p className="text-muted-foreground">
          Quản lý mã nguồn, kho lưu trữ và các dự án mã nguồn mở
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, mô tả hoặc tác giả..."
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
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
            </SelectContent>
          </Select>
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngôn ngữ</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="dart">Dart</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Thêm Repository</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Thêm Repository mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để thêm repository mã nguồn mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="repoUrl" className="text-sm font-medium col-span-1">
                    GitHub URL
                  </label>
                  <div className="col-span-3 flex gap-2">
                    <Input id="repoUrl" placeholder="https://github.com/username/repository" className="flex-1" />
                    <Button variant="outline" className="shrink-0">Kiểm tra</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label htmlFor="name" className="text-sm font-medium">
                    Tên Repository
                  </label>
                  <Input id="name" placeholder="Tên repository" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label htmlFor="description" className="text-sm font-medium">
                    Mô tả
                  </label>
                  <Textarea 
                    id="description" 
                    placeholder="Mô tả ngắn về repository"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="author" className="text-sm font-medium">
                      Tác giả
                    </label>
                    <Input id="author" placeholder="Tên tác giả" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="language" className="text-sm font-medium">
                      Ngôn ngữ chính
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="dart">Dart</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Danh mục
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="topics" className="text-sm font-medium">
                    Chủ đề (cách nhau bởi dấu phẩy)
                  </label>
                  <Input id="topics" placeholder="react, hooks, state-management" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" />
                    <label htmlFor="verified" className="text-sm font-medium">
                      Đã xác minh
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="deployable" />
                    <label htmlFor="deployable" className="text-sm font-medium">
                      Có thể triển khai
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Hủy</Button>
                <Button>Thêm Repository</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[250px]">Tên Repository</TableHead>
                <TableHead>Ngôn ngữ</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead className="text-right">Stars</TableHead>
                <TableHead className="text-right">Forks</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    Không có repository nào phù hợp với tìm kiếm
                  </TableCell>
                </TableRow>
              ) : (
                filteredRepos.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">{repo.name}</span>
                          {repo.verified && (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                          {repo.deployable && (
                            <Zap className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{renderLanguageBadge(repo.language)}</TableCell>
                    <TableCell>{renderTopicBadges(repo.topics)}</TableCell>
                    <TableCell>{repo.author}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{repo.stars.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <GitBranch className="h-4 w-4 text-slate-500 mr-1" />
                        <span>{repo.forks.toLocaleString()}</span>
                      </div>
                    </TableCell>
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
                            <span>Xem chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2 items-center">
                            <Edit className="h-4 w-4" />
                            <span>Chỉnh sửa</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2 items-center">
                            <Github className="h-4 w-4" />
                            <span>Mở GitHub</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex gap-2 items-center">
                            <FileCode className="h-4 w-4 text-indigo-500" />
                            <span className="text-indigo-500">Xem mã nguồn</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex gap-2 items-center">
                            <Download className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Tải về</span>
                          </DropdownMenuItem>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <strong>{filteredRepos.length}</strong> trên tổng số <strong>{repositories.length}</strong> repository
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Trang trước
          </Button>
          <Button variant="outline" size="sm">
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  )
} 