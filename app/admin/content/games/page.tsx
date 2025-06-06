"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  DialogClose,
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
  Image,
  Star,
  BarChart,
  Link as LinkIcon,
  Download,
  Loader2,
  Globe,
  Youtube,
  FileText,
  PlusCircle,
  MoreVertical,
} from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { GameDetailModal } from "./_components/game-detail-modal"

// Game interface
interface Game {
  id: string
  title: string
  developer: string
  publisher: string
  release_date: string
  description: string | null
  content: string | null
  system_requirements: string | null
  trailer_url: string | null
  official_website: string | null
  platform: string[]
  genre: string[]
  rating: number
  downloads: number
  status: 'draft' | 'published'
  featured: boolean
  image: string | null
  images: string[] | null
  created_by: string | null
  updated_by: string | null
  author_id: string | null
  created_at: string
  updated_at: string | null
}

export default function GamesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalGames, setTotalGames] = useState(0)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const gamesPerPage = 10

  // Fetch games from Supabase
  useEffect(() => {
    console.log('Fetching games for page:', currentPage)
    fetchGames()
  }, [currentPage])

  const fetchGames = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabase = createBrowserSupabaseClient()

      // Get count of games for pagination
      const { count, error: countError } = await supabase
        .from('games')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      setTotalGames(count || 0)

      // Fetch games with pagination
      const from = (currentPage - 1) * gamesPerPage
      const to = from + gamesPerPage - 1

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      if (data) {
        setGames(data as Game[])
        toast({
          title: "Dữ liệu đã được tải",
          description: `Đã tải ${data.length} game thành công`,
          duration: 3000,
        })
      }
    } catch (err: any) {
      console.error('Error fetching games:', err)
      setError(err.message || 'Failed to load games')
      toast({
        title: "Lỗi",
        description: `Không thể tải danh sách games: ${err.message}`,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }
  // Filter games based on search and filters
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === "all" || game.genre.includes(genreFilter)
    const matchesPlatform = platformFilter === "all" || game.platform.includes(platformFilter)

    return matchesSearch && matchesGenre && matchesPlatform
  })

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalGames / gamesPerPage)

  // Render platform badges
  const renderPlatformBadges = (platforms: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {platforms.map(platform => {
          let badgeClass = ""
          let label = ""

          switch (platform) {
            case "ps5":
              badgeClass = "bg-blue-900"
              label = "PS5"
              break
            case "ps4":
              badgeClass = "bg-blue-600"
              label = "PS4"
              break
            case "xboxsx":
              badgeClass = "bg-green-700"
              label = "Xbox Series"
              break
            case "xboxone":
              badgeClass = "bg-green-500"
              label = "Xbox One"
              break
            case "pc":
              badgeClass = "bg-gray-700"
              label = "PC"
              break
            case "switch":
              badgeClass = "bg-red-500"
              label = "Switch"
              break
            default:
              badgeClass = "bg-gray-500"
              label = platform
          }

          return (
            <Badge key={platform} className={badgeClass}>{label}</Badge>
          )
        })}
      </div>
    )
  }

  // Render genre badges
  const renderGenreBadges = (genres: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {genres.map(genre => {
          let badgeClass = ""
          let label = ""

          switch (genre) {
            case "action":
              badgeClass = "bg-red-600"
              label = "Hành động"
              break
            case "adventure":
              badgeClass = "bg-amber-600"
              label = "Phiêu lưu"
              break
            case "rpg":
              badgeClass = "bg-purple-600"
              label = "Nhập vai"
              break
            case "shooter":
              badgeClass = "bg-zinc-700"
              label = "Bắn súng"
              break
            case "strategy":
              badgeClass = "bg-blue-600"
              label = "Chiến thuật"
              break
            default:
              badgeClass = "bg-gray-500"
              label = genre
          }

          return (
            <Badge key={genre} className={badgeClass}>{label}</Badge>
          )
        })}
      </div>
    )
  }

  // Delete game function
  const handleDeleteGame = async (id: string, title: string) => {
    try {
      const supabase = createBrowserSupabaseClient()

      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state after successful delete
      setGames(games.filter(game => game.id !== id))
      toast({
        title: "Xóa thành công",
        description: `Game "${title}" đã được xóa khỏi hệ thống`,
        duration: 3000,
      })
    } catch (err: any) {
      console.error('Error deleting game:', err)
      toast({
        title: "Lỗi khi xóa",
        description: `Không thể xóa game: ${err.message}`,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Toggle featured status
  const toggleFeaturedStatus = async (game: Game) => {
    try {
      const supabase = createBrowserSupabaseClient()

      const { error } = await supabase
        .from('games')
        .update({ featured: !game.featured })
        .eq('id', game.id)

      if (error) throw error

      // Update local state after successful update
      setGames(games.map(g => g.id === game.id ? { ...g, featured: !game.featured } : g))

      toast({
        title: game.featured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật",
        description: `Game "${game.title}" ${game.featured ? "đã bỏ đánh dấu nổi bật" : "đã được đánh dấu nổi bật"}`,
        duration: 3000,
      })
    } catch (err: any) {
      console.error('Error toggling featured status:', err)
      toast({
        title: "Lỗi cập nhật",
        description: `Không thể cập nhật trạng thái nổi bật: ${err.message}`,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // View game details
  const handleViewGame = (game: Game) => {
    setSelectedGame(game)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Games</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin game và thông kê số liệu
          </p>
        </div>
        <Button onClick={() => router.push('/admin/content/games/create')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm game
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm game theo tên hoặc nhà phát triển..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thể loại</SelectItem>
              <SelectItem value="action">Hành động</SelectItem>
              <SelectItem value="adventure">Phiêu lưu</SelectItem>
              <SelectItem value="rpg">Nhập vai</SelectItem>
              <SelectItem value="shooter">Bắn súng</SelectItem>
              <SelectItem value="strategy">Chiến thuật</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Nền tảng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nền tảng</SelectItem>
              <SelectItem value="ps5">PlayStation 5</SelectItem>
              <SelectItem value="ps4">PlayStation 4</SelectItem>
              <SelectItem value="xboxsx">Xbox Series X/S</SelectItem>
              <SelectItem value="xboxone">Xbox One</SelectItem>
              <SelectItem value="pc">PC</SelectItem>
              <SelectItem value="switch">Nintendo Switch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-destructive">
              <p>Lỗi: {error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">Tên game</TableHead>
                  <TableHead>Nền tảng</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Nhà phát hành</TableHead>
                  <TableHead>Ngày phát hành</TableHead>
                  <TableHead className="text-right">Đánh giá</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      {games.length === 0 ? "Chưa có game nào trong cơ sở dữ liệu" : "Không có game nào phù hợp với tìm kiếm"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <img
                            src={game.image || "/placeholder.svg"}
                            alt={game.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium line-clamp-1">{game.title}</div>
                            <div className="text-sm text-muted-foreground">{game.developer}</div>
                          </div>
                          {game.featured && (
                            <Badge variant="secondary" className="ml-2">Nổi bật</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{renderPlatformBadges(game.platform)}</TableCell>
                      <TableCell>{renderGenreBadges(game.genre)}</TableCell>
                      <TableCell>{game.publisher}</TableCell>
                      <TableCell>{game.release_date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{game.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex gap-2 items-center"
                              onClick={() => handleViewGame(game)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2 items-center"
                              onClick={() => router.push(`/admin/content/games/${game.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-2 items-center"
                              onClick={() => toggleFeaturedStatus(game)}
                            >
                              <Star className="h-4 w-4" />
                              <span>{game.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <BarChart className="h-4 w-4" />
                              <span>Thống kê</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {game.official_website && (
                              <DropdownMenuItem
                                className="flex gap-2 items-center"
                                onClick={() => window.open(game.official_website as string, '_blank')}
                              >
                                <Globe className="h-4 w-4 text-blue-500" />
                                <span className="text-blue-500">Website chính thức</span>
                              </DropdownMenuItem>
                            )}
                            {game.trailer_url && (
                              <DropdownMenuItem
                                className="flex gap-2 items-center"
                                onClick={() => window.open(game.trailer_url as string, '_blank')}
                              >
                                <Youtube className="h-4 w-4 text-red-500" />
                                <span className="text-red-500">Xem trailer</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="flex gap-2 items-center">
                              <Download className="h-4 w-4 text-green-500" />
                              <span className="text-green-500">Tải về ({game.downloads.toLocaleString()})</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex gap-2 items-center"
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa game "${game.title}"?`)) {
                                  handleDeleteGame(game.id, game.title)
                                }
                              }}
                            >
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
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <strong>{filteredGames.length}</strong> trên tổng số <strong>{totalGames}</strong> game
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1))
              toast({
                title: "Đang chuyển trang",
                description: `Đang tải trang ${currentPage - 1}`,
                duration: 3000,
              })
            }}
          >
            Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
              toast({
                title: "Đang chuyển trang",
                description: `Đang tải trang ${currentPage + 1}`,
                duration: 3000,
              })
            }}
          >
            Trang sau
          </Button>
        </div>
      </div>

      {/* Game Detail Dialog */}
      <GameDetailModal
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        game={selectedGame}
      />
    </div>
  )
} 