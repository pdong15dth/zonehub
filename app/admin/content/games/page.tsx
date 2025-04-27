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
  Image,
  Star,
  BarChart,
  Link as LinkIcon,
  Download
} from "lucide-react"

// Sample data
const games = [
  {
    id: "1",
    title: "God of War Ragnarök",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    platform: ["ps5", "ps4"],
    releaseDate: "09/11/2022",
    genre: ["action", "adventure"],
    rating: 4.9,
    downloads: 12500000,
    status: "published",
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Elden Ring",
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    platform: ["ps5", "ps4", "xboxsx", "xboxone", "pc"],
    releaseDate: "25/02/2022",
    genre: ["rpg", "action"],
    rating: 4.8,
    downloads: 16500000,
    status: "published",
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Starfield",
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    platform: ["xboxsx", "pc"],
    releaseDate: "06/09/2023",
    genre: ["rpg", "adventure"],
    rating: 4.2,
    downloads: 9800000,
    status: "published",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    title: "Hogwarts Legacy",
    developer: "Avalanche Software",
    publisher: "Warner Bros. Interactive Entertainment",
    platform: ["ps5", "ps4", "xboxsx", "xboxone", "pc", "switch"],
    releaseDate: "10/02/2023",
    genre: ["rpg", "adventure"],
    rating: 4.5,
    downloads: 15000000,
    status: "published",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "5",
    title: "Final Fantasy VII Rebirth",
    developer: "Square Enix",
    publisher: "Square Enix",
    platform: ["ps5"],
    releaseDate: "29/02/2024",
    genre: ["rpg", "action"],
    rating: 4.7,
    downloads: 8500000,
    status: "published",
    featured: true,
    image: "/placeholder.svg"
  },
]

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")

  // Filter games based on search and filters
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.developer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = genreFilter === "all" || game.genre.includes(genreFilter)
    const matchesPlatform = platformFilter === "all" || game.platform.includes(platformFilter)
    
    return matchesSearch && matchesGenre && matchesPlatform
  })

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Games</h2>
        <p className="text-muted-foreground">
          Quản lý thông tin game và thống kê số liệu
        </p>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Thêm game</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Thêm game mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin để thêm game mới vào hệ thống.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Tên game
                  </label>
                  <Input id="title" placeholder="Nhập tên game" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="developer" className="text-sm font-medium">
                      Nhà phát triển
                    </label>
                    <Input id="developer" placeholder="Tên nhà phát triển" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="publisher" className="text-sm font-medium">
                      Nhà phát hành
                    </label>
                    <Input id="publisher" placeholder="Tên nhà phát hành" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="releaseDate" className="text-sm font-medium">
                    Ngày phát hành
                  </label>
                  <Input id="releaseDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Nền tảng
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ps5" />
                      <label htmlFor="ps5" className="text-sm font-medium">PlayStation 5</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ps4" />
                      <label htmlFor="ps4" className="text-sm font-medium">PlayStation 4</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="xboxsx" />
                      <label htmlFor="xboxsx" className="text-sm font-medium">Xbox Series X/S</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="xboxone" />
                      <label htmlFor="xboxone" className="text-sm font-medium">Xbox One</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pc" />
                      <label htmlFor="pc" className="text-sm font-medium">PC</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="switch" />
                      <label htmlFor="switch" className="text-sm font-medium">Nintendo Switch</label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Thể loại
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="action" />
                      <label htmlFor="action" className="text-sm font-medium">Hành động</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="adventure" />
                      <label htmlFor="adventure" className="text-sm font-medium">Phiêu lưu</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rpg" />
                      <label htmlFor="rpg" className="text-sm font-medium">Nhập vai</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="shooter" />
                      <label htmlFor="shooter" className="text-sm font-medium">Bắn súng</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="strategy" />
                      <label htmlFor="strategy" className="text-sm font-medium">Chiến thuật</label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Ảnh bìa
                  </label>
                  <div className="flex gap-2">
                    <Input id="image" placeholder="Chọn ảnh bìa" disabled />
                    <Button variant="outline" type="button" className="flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      <span>Chọn ảnh</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Đánh dấu là game nổi bật
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Hủy</Button>
                <Button>Thêm game</Button>
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
                    Không có game nào phù hợp với tìm kiếm
                  </TableCell>
                </TableRow>
              ) : (
                filteredGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={game.image} 
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
                    <TableCell>{game.releaseDate}</TableCell>
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
                            <BarChart className="h-4 w-4" />
                            <span>Thống kê</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex gap-2 items-center">
                            <LinkIcon className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-500">Xem link</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2 items-center">
                            <Download className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Tải về ({game.downloads.toLocaleString()})</span>
                          </DropdownMenuItem>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <strong>{filteredGames.length}</strong> trên tổng số <strong>{games.length}</strong> game
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