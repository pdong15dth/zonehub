"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bookmark,
  Calendar,
  ChevronRight,
  EyeIcon,
  Heart,
  MessageSquare,
  Search,
  Share2,
  Tag,
  ThumbsUp,
  User
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Mock news data
const newsArticles = [
  {
    id: 1,
    title: "Sony công bố PS5 Pro, nâng cấp đồ họa và hiệu suất",
    excerpt: "Phiên bản PS5 Pro mới nhất của Sony hứa hẹn mang đến hiệu suất chơi game vượt trội với GPU mạnh hơn 45% và khả năng ray tracing tiên tiến.",
    author: "Minh Tuấn",
    date: "15/07/2024",
    category: "Công nghệ",
    image: "/placeholder.svg",
    views: 1254,
    comments: 45,
    likes: 187,
    isFeatured: true
  },
  {
    id: 2,
    title: "Game AAA mới nhất từ studio độc lập gây bất ngờ với đồ họa tuyệt đẹp",
    excerpt: "Studio indie với chỉ 15 nhân viên đã tạo ra một tựa game có chất lượng đồ họa cạnh tranh với các studio lớn, sử dụng các kỹ thuật độc đáo.",
    author: "Hà Linh",
    date: "14/07/2024",
    category: "Game",
    image: "/placeholder.svg",
    views: 856,
    comments: 23,
    likes: 92,
    isFeatured: true
  },
  {
    id: 3,
    title: "Giải đấu esports lớn nhất Việt Nam công bố lịch trình mùa giải mới",
    excerpt: "Giải đấu sẽ có tổng giải thưởng lên đến 2 tỷ đồng với sự tham gia của các đội tuyển hàng đầu trong khu vực Đông Nam Á.",
    author: "Anh Tuấn",
    date: "13/07/2024",
    category: "Esports",
    image: "/placeholder.svg",
    views: 1523,
    comments: 67,
    likes: 231,
    isFeatured: false
  },
  {
    id: 4,
    title: "Hướng dẫn build PC gaming tối ưu dưới 15 triệu đồng năm 2024",
    excerpt: "Bài viết hướng dẫn chi tiết cách lựa chọn linh kiện để xây dựng một bộ PC chơi game hiệu quả với giá thành hợp lý trong năm 2024.",
    author: "Thanh Tùng",
    date: "12/07/2024",
    category: "Công nghệ",
    image: "/placeholder.svg",
    views: 2134,
    comments: 85,
    likes: 345,
    isFeatured: false
  },
  {
    id: 5,
    title: "Review chi tiết laptop gaming mới nhất từ ASUS",
    excerpt: "Đánh giá chi tiết về hiệu năng, thời lượng pin và khả năng tản nhiệt của dòng laptop gaming mới ra mắt từ ASUS.",
    author: "Minh Đức",
    date: "11/07/2024",
    category: "Review",
    image: "/placeholder.svg",
    views: 1452,
    comments: 42,
    likes: 198,
    isFeatured: false
  },
  {
    id: 6,
    title: "Top 10 game mobile đáng chơi nhất nửa đầu năm 2024",
    excerpt: "Tổng hợp những tựa game mobile hay nhất đã ra mắt trong 6 tháng đầu năm 2024, từ những game casual đến hardcore.",
    author: "Thu Hà",
    date: "10/07/2024",
    category: "Game",
    image: "/placeholder.svg",
    views: 1876,
    comments: 63,
    likes: 254,
    isFeatured: false
  }
]

// Popular tags
const popularTags = [
  "PS5", "PC Gaming", "Esports", "Mobile Game", "Nintendo", "Xbox", "Steam", "Epic Games",
  "VR", "Game Indie", "MMORPG", "FPS", "Moba", "RPG", "Streamer"
]

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  
  // Filter articles based on search and category
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || article.category.toLowerCase() === activeCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })
  
  // Get featured articles
  const featuredArticles = newsArticles.filter(article => article.isFeatured)
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Tin tức & Bài viết</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật tin tức mới nhất về game, công nghệ và esports
          </p>
        </div>
        
        {/* Featured articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {featuredArticles[0] && (
              <Link href={`/news/${featuredArticles[0].id}`} passHref legacyBehavior prefetch={false}>
                <a className="block">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-[300px]">
                      <img 
                        src={featuredArticles[0].image} 
                        alt={featuredArticles[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <Badge className="mb-2 bg-indigo-600">{featuredArticles[0].category}</Badge>
                        <h2 className="text-2xl font-bold mb-2">{featuredArticles[0].title}</h2>
                        <div className="flex items-center mt-4">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{featuredArticles[0].author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm mr-3">{featuredArticles[0].author}</span>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">{featuredArticles[0].date}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              </Link>
            )}
          </div>
          
          <div className="space-y-6">
            {featuredArticles.slice(1, 3).map(article => (
              <Link href={`/news/${article.id}`} key={article.id} passHref legacyBehavior prefetch={false}>
                <a className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-[150px]">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <Badge className="mb-2 bg-indigo-600 text-xs">{article.category}</Badge>
                        <h3 className="text-sm font-bold">{article.title}</h3>
                        <div className="flex items-center mt-2 text-xs">
                          <span className="mr-3">{article.author}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Search and tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            className="w-full"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm">Tất cả</TabsTrigger>
              <TabsTrigger value="Công nghệ" className="text-xs sm:text-sm">Công nghệ</TabsTrigger>
              <TabsTrigger value="Game" className="text-xs sm:text-sm">Game</TabsTrigger>
              <TabsTrigger value="Esports" className="text-xs sm:text-sm">Esports</TabsTrigger>
              <TabsTrigger value="Review" className="text-xs sm:text-sm">Review</TabsTrigger>
              <TabsTrigger value="Hướng dẫn" className="text-xs sm:text-sm">Hướng dẫn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-6">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <Link href={`/news/${article.id}`} key={article.id} passHref legacyBehavior prefetch={false}>
                    <a className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="sm:flex">
                          <div className="sm:w-1/3 h-[200px] sm:h-auto">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <Badge className="mb-2 bg-indigo-600">{article.category}</Badge>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <EyeIcon className="h-3 w-3 mr-1" />
                                  <span className="mr-3">{article.views}</span>
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  <span>{article.comments}</span>
                                </div>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                              <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{article.author[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{article.author}</p>
                                  <p className="text-xs text-muted-foreground">{article.date}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </a>
                  </Link>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Không tìm thấy bài viết nào phù hợp.</p>
                </Card>
              )}
              
              {filteredArticles.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button>Xem thêm bài viết</Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular articles */}
            <Card>
              <CardHeader>
                <CardTitle>Bài viết phổ biến</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsArticles.slice(0, 5).map((article, index) => (
                  <Link href={`/news/${article.id}`} key={article.id} passHref legacyBehavior prefetch={false}>
                    <a className="block">
                      <div className="flex gap-3 group">
                        <div className="flex-shrink-0 font-bold text-muted-foreground text-xl">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground mr-3">{article.date}</span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <EyeIcon className="h-3 w-3 mr-1" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </CardContent>
            </Card>
            
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Danh mục phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Button key={tag} variant="outline" size="sm" className="text-xs">
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle>Nhận thông báo tin tức</CardTitle>
                <CardDescription>Đăng ký để nhận tin tức mới nhất qua email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Email của bạn" type="email" />
                  <Button className="w-full">Đăng ký</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 