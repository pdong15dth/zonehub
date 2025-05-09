"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Download,
  Heart,
  MessageSquare,
  Star,
  Share2,
  Play,
  Info,
  Users,
  Trophy,
  Calendar,
  Gamepad2,
  Laptop,
  Server,
  Layers
} from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { ImageGallery } from "@/components/games/image-gallery"

// Mock game data
const games = [
  {
    id: 1,
    title: "Cyberpunk Legends",
    description: "Trò chơi nhập vai thế giới mở đặt trong bối cảnh tương lai đầy công nghệ cao và nguy hiểm.",
    thumbnailUrl: "/placeholder.svg",
    screenshots: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    developer: "Tech Games Studio",
    publisher: "Mega Entertainment",
    releaseDate: "15/06/2024",
    genre: ["RPG", "Thế giới mở", "Hành động"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
    rating: 4.7,
    reviews: 325,
    players: 12500,
    fileSize: "45 GB",
    tags: ["Cyberpunk", "Tương lai", "Nhập vai", "Hành động"],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1060 6GB / AMD Radeon RX 580 8GB",
        storage: "50 GB"
      },
      recommended: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 2070 / AMD Radeon RX 5700 XT",
        storage: "50 GB SSD"
      }
    }
  },
  {
    id: 2,
    title: "Fantasy Kingdom",
    description: "Game phiêu lưu giả tưởng với thế giới rộng lớn, nhiều nhiệm vụ và sinh vật huyền bí.",
    thumbnailUrl: "/placeholder.svg",
    screenshots: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    developer: "Dream Games",
    publisher: "Fantasy Interactive",
    releaseDate: "20/05/2024",
    genre: ["Phiêu lưu", "Giả tưởng", "Hành động"],
    platforms: ["PC", "PlayStation 5", "Nintendo Switch"],
    rating: 4.5,
    reviews: 210,
    players: 8900,
    fileSize: "35 GB",
    tags: ["Giả tưởng", "Phép thuật", "Rồng", "Phiêu lưu"],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-6600 / AMD Ryzen 3 1300X",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 960 / AMD Radeon R9 380",
        storage: "40 GB"
      },
      recommended: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i7-8700 / AMD Ryzen 5 3600",
        memory: "16 GB RAM",
        graphics: "NVIDIA GTX 1660 Super / AMD RX 5600 XT",
        storage: "40 GB SSD"
      }
    }
  }
]

// Mock review data
const reviews = [
  {
    id: 1,
    author: "Minh Tuấn",
    avatar: "/placeholder.svg",
    date: "01/07/2024",
    rating: 5,
    content: "Trò chơi tuyệt vời với đồ họa đẹp và cốt truyện hấp dẫn. Tôi dành nhiều giờ để khám phá thế giới game và vẫn còn nhiều điều thú vị.",
    likes: 24,
    gameId: 1
  },
  {
    id: 2,
    author: "Thu Hà",
    avatar: "/placeholder.svg",
    date: "28/06/2024",
    rating: 4,
    content: "Game hay, điều khiển nhân vật mượt mà. Một số nhiệm vụ hơi khó và đôi lúc gặp lỗi nhỏ, nhưng nhìn chung trải nghiệm rất tốt.",
    likes: 12,
    gameId: 1
  },
  {
    id: 3,
    author: "Thanh Tùng",
    avatar: "/placeholder.svg",
    date: "25/06/2024",
    rating: 5,
    content: "Một trong những trò chơi hay nhất năm nay! Cốt truyện sâu sắc, nhân vật phát triển tốt, và thế giới game rất sống động.",
    likes: 31,
    gameId: 1
  }
]

export default function GameDetailPage() {
  // Use the useParams hook to get URL parameters in a client component
  const params = useParams();
  
  // Debug logging
  console.log("Debug - Full params object:", params);
  console.log("Debug - Params type:", typeof params);
  
  // Nếu id không có, hiển thị lỗi not found
  if (!params || !params.id) {
    console.error("No params.id available");
    return notFound();
  }
  
  const id = params.id as string;
  console.log("Debug - Extracted id:", id);
  console.log("Debug - ID type:", typeof id);
  
  const [game, setGame] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const [gameReviews, setGameReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Log available games for debug
  useEffect(() => {
    console.log("Debug - Available games:", games);
    console.log("Debug - Available game IDs:", games.map(g => g.id));
  }, []);
  
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('====== DEBUG GAME FINDING =====');
      console.log('Getting game with id:', id);
      
      // Parse the ID from string to number
      const gameId = parseInt(id);
      console.log('Parsed gameId:', gameId, 'Type:', typeof gameId);
      
      // Show available IDs for debugging
      console.log('Available IDs:', games.map(g => ({ id: g.id, type: typeof g.id })));
      
      // Thử tìm kiếm theo kiểu dữ liệu string trước
      let foundGame = games.find(game => String(game.id) === id);
      
      // Nếu không tìm thấy, thử tìm kiếm theo kiểu dữ liệu number
      if (!foundGame) {
        foundGame = games.find(game => game.id === gameId);
      }
      
      console.log('Found game:', foundGame);
      
      if (foundGame) {
        setGame(foundGame);
        // Get reviews for this game
        const filteredReviews = reviews.filter(r => r.gameId === gameId);
        setGameReviews(filteredReviews);
      } else {
        setError(`Không tìm thấy game với ID: ${id}`);
        console.error('Game not found with id:', gameId);
        console.log('Raw data comparison:');
        games.forEach(g => {
          console.log(`Game ID: ${g.id} (${typeof g.id}) === Requested ID: ${gameId} (${typeof gameId}) => ${g.id === gameId}`);
          console.log(`String comparison: ${String(g.id) === String(gameId)}`);
        });
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
      setError('Đã xảy ra lỗi khi tải game');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  // Hiển thị loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <p className="mt-4">Đang tải thông tin game...</p>
      </div>
    );
  }
  
  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
          <h2 className="text-lg font-medium text-red-800 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-red-700">{error}</p>
          <Button className="mt-4" asChild>
            <Link href="/games">Quay lại danh sách game</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  if (!game) {
    return notFound()
  }
  
  // Calculate average rating from reviews
  const averageRating = gameReviews.length > 0 
    ? gameReviews.reduce((acc, review) => acc + review.rating, 0) / gameReviews.length 
    : game.rating || 0
  
  // Generate rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0] // 1-5 stars
  gameReviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++
    }
  })
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? "text-yellow-400 fill-yellow-400" 
                : i < rating 
                  ? "text-yellow-400 fill-yellow-400 opacity-50" 
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/games" className="text-muted-foreground hover:text-primary flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại danh sách game
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{game.genre[0]}</span>
          </div>
          
          {/* Game header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {game.genre.map((genre: string) => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold">{game.title}</h1>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {renderStars(game.rating)}
                    <span className="ml-2 font-medium">{game.rating.toFixed(1)}</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{game.reviews} đánh giá</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{game.players.toLocaleString()} người chơi</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{game.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="gap-2">
                    <Download className="h-5 w-5" />
                    Tải game ({game.fileSize})
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Xem gameplay
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Phát triển bởi</span>
                      </div>
                      <span>{game.developer}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Phát hành bởi</span>
                      </div>
                      <span>{game.publisher}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Ngày phát hành</span>
                      </div>
                      <span>{game.releaseDate}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Nền tảng</span>
                      </div>
                      <div>
                        {game.platforms.map((platform: string) => (
                          <Badge key={platform} variant="outline" className="mr-1">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-red-500" />
                        <span className="font-medium">Dung lượng</span>
                      </div>
                      <span>{game.fileSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Screenshots */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Screenshots</h2>
            {game.screenshots && game.screenshots.length > 0 ? (
              <ImageGallery
                images={game.screenshots.map((url: string) => ({ url }))}
                aspectRatio="video"
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img 
                  src={game.thumbnailUrl || '/placeholder.svg'} 
                  alt={`${game.title} screenshot`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="requirements">Cấu hình</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá ({gameReviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Giới thiệu game</h3>
                    <p className="text-muted-foreground">{game.description}</p>
                    <p className="text-muted-foreground mt-4">
                      {game.title} là một trò chơi {game.genre.join(", ")} đầy hấp dẫn được phát triển 
                      bởi {game.developer} và phát hành bởi {game.publisher}. Trò chơi đưa người chơi 
                      vào một thế giới đầy những thử thách và phiêu lưu mới.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-3">Tính năng nổi bật</h3>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                      <li>Đồ họa ấn tượng với chi tiết cao và hiệu ứng ánh sáng chân thực</li>
                      <li>Cốt truyện hấp dẫn với nhiều nhánh lựa chọn ảnh hưởng đến kết thúc game</li>
                      <li>Hệ thống chiến đấu đầy thử thách đòi hỏi kỹ năng và chiến thuật</li>
                      <li>Thế giới mở rộng lớn với nhiều khu vực khám phá và nhiệm vụ phụ</li>
                      <li>Hệ thống phát triển nhân vật sâu với nhiều kỹ năng và trang bị</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {game.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Thông tin phát hành</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phát triển:</span>
                        <span>{game.developer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phát hành:</span>
                        <span>{game.publisher}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày phát hành:</span>
                        <span>{game.releaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nền tảng:</span>
                        <span>{game.platforms.join(", ")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="requirements" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Laptop className="h-5 w-5 mr-2" />
                      Cấu hình tối thiểu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hệ điều hành:</span>
                        <span>{game.systemRequirements.minimum.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bộ xử lý:</span>
                        <span>{game.systemRequirements.minimum.processor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bộ nhớ:</span>
                        <span>{game.systemRequirements.minimum.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Card đồ họa:</span>
                        <span>{game.systemRequirements.minimum.graphics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lưu trữ:</span>
                        <span>{game.systemRequirements.minimum.storage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Laptop className="h-5 w-5 mr-2" />
                      Cấu hình đề nghị
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hệ điều hành:</span>
                        <span>{game.systemRequirements.recommended.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bộ xử lý:</span>
                        <span>{game.systemRequirements.recommended.processor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bộ nhớ:</span>
                        <span>{game.systemRequirements.recommended.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Card đồ họa:</span>
                        <span>{game.systemRequirements.recommended.graphics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lưu trữ:</span>
                        <span>{game.systemRequirements.recommended.storage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú thêm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Game yêu cầu kết nối internet để tải về và xác thực. Một số tính năng trong game như chế độ nhiều người chơi 
                    yêu cầu kết nối internet ổn định. Khuyến nghị sử dụng tai nghe để có trải nghiệm âm thanh tốt nhất.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold">Đánh giá từ người chơi</h3>
                  
                  {gameReviews.length > 0 ? (
                    <div className="space-y-4">
                      {gameReviews.map(review => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="mt-1">
                                <AvatarImage src={review.avatar} alt={review.author} />
                                <AvatarFallback>{review.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium">{review.author}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                                  </div>
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <p className="mt-2">{review.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Button variant="ghost" size="sm" className="h-8">
                                    <Heart className="h-3 w-3 mr-1" />
                                    <span className="text-xs">{review.likes}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    <span className="text-xs">Trả lời</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Chưa có đánh giá nào cho game này.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Đánh giá tổng quan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold">{game.rating.toFixed(1)}</div>
                        <div className="flex-1">
                          <div className="flex mb-1">
                            {renderStars(game.rating)}
                          </div>
                          <p className="text-sm text-muted-foreground">{game.reviews} đánh giá</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = ratingCounts[star - 1]
                          const percentage = gameReviews.length > 0 ? (count / gameReviews.length) * 100 : 0
                          
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <div className="flex items-center w-10">
                                <span className="text-sm">{star}</span>
                                <Star className="h-3 w-3 fill-current ml-1" />
                              </div>
                              <Progress value={percentage} className="h-2 flex-1" />
                              <span className="text-sm w-10 text-right">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                      
                      <Button className="w-full">Viết đánh giá</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Thống kê</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lượt tải:</span>
                        <span>{game.players.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Đánh giá:</span>
                        <span>{game.reviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Xếp hạng trung bình:</span>
                        <div className="flex items-center">
                          <span className="mr-1">{game.rating.toFixed(1)}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 