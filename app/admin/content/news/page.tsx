"use client"

import { useState, useEffect } from "react"
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
  Image,
  PlusCircle,
  FileCheck,
  Clock,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSupabase } from '@/components/providers/supabase-provider'
import { toast } from "@/components/ui/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export default function NewsListPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { supabase } = useSupabase()
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bài viết. Vui lòng thử lại sau.',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteArticle = async () => {
    if (!deleteArticleId) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', deleteArticleId)

      if (error) {
        throw error
      }

      setArticles(articles.filter(article => article.id !== deleteArticleId))
      toast({
        title: 'Thành công',
        description: 'Bài viết đã được xóa thành công!',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error deleting article:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bài viết. Vui lòng thử lại sau.',
        duration: 3000,
      })
    } finally {
      setDeleteArticleId(null)
      setShowDeleteDialog(false)
    }
  }

  const handlePublishArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          status: 'published',
          publish_date: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      // Update the local state
      setArticles(
        articles.map(article =>
          article.id === id
            ? { ...article, status: 'published', publish_date: new Date().toISOString() }
            : article
        )
      )

      toast({
        title: 'Thành công',
        description: 'Bài viết đã được đăng thành công!',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error publishing article:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể đăng bài viết. Vui lòng thử lại sau.',
        duration: 3000,
      })
    }
  }

    const filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const renderStatusBadge = (status: string) => {
      if (status === 'published') {
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <FileCheck className="w-3 h-3 mr-1" />
            Đã đăng
          </Badge>
        )
      }
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Bản nháp
        </Badge>
      )
    }

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý tin tức</h1>
            <p className="text-muted-foreground mt-2">
              Danh sách tất cả các bài viết tin tức, bao gồm cả bản nháp và đã xuất bản.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/content/news/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo bài viết mới
            </Link>
          </Button>
        </div>

        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Tiêu đề</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">Không có bài viết nào</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-medium">{article.title}</span>
                          {article.summary && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {article.summary}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(article.status)}</TableCell>
                      <TableCell>
                        {article.category ? (
                          <Badge variant="outline">{article.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Không có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {article.created_at ? (
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(article.created_at), {
                              addSuffix: true,
                              locale: vi
                            })}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/content/news/edit/${article.id}`}>
                                <FileEdit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/news/${article.slug}/${article.id}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                Xem
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {article.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handlePublishArticle(article.id)}>
                                <FileCheck className="h-4 w-4 mr-2" />
                                Đăng bài
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setDeleteArticleId(article.id);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-600 focus:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
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
          </div>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteArticleId(null)}>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteArticle} className="bg-red-600 hover:bg-red-700">
                Xác nhận xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  } 