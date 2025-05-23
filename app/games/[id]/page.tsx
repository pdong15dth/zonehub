"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter, useParams } from "next/navigation"
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
  Layers,
  Loader2,
  Globe,
  ImageIcon,
  ShieldCheck,
  ExternalLink,
  Clock
} from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { GameReviews } from "@/components/games/game-reviews"
import { AuthRedirect } from "@/components/providers/auth-redirect"

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const id = params?.id as string;

  const [game, setGame] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [gameReviews, setGameReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        setLoading(true);
        setError(null);

        // Fetch game data from API
        const response = await fetch(`/api/games/${id}`);

        console.log("Game details response:", response);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Game not found');
          }
          throw new Error(`Error: ${response.status}`);
        }

        const gameData = await response.json();
        console.log("Game details response:", gameData);

        if (!gameData || !gameData.id) {
          throw new Error('Invalid game data received');
        }

        setGame(gameData);

        // TODO: Fetch reviews for this game when available
        // const reviewsResponse = await fetch(`/api/games/${id}/reviews`);
        // const reviewsData = await reviewsResponse.json();
        // setGameReviews(reviewsData);

      } catch (error) {
        console.error('Error fetching game details:', error);
        setError(error instanceof Error ? error.message : 'Failed to load game details');

        toast({
          title: "Error",
          description: "Failed to load game details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchGameDetails();
    }
  }, [id, toast]);

  // Parse system requirements JSON
  const parseSystemRequirements = (requirementsString: string | null) => {
    if (!requirementsString) return {};

    try {
      if (requirementsString.startsWith('{') && requirementsString.endsWith('}')) {
        const parsed = JSON.parse(requirementsString);
        console.log("Parsed system requirements:", parsed);
        return parsed;
      }
      return { additional: requirementsString };
    } catch (error) {
      console.error("Error parsing system requirements:", error);
      return { additional: requirementsString };
    }
  };

  // Helper function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="absolute top-0 left-0 h-5 w-5 overflow-hidden fill-yellow-500 text-yellow-500"
            style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
        </span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  // Helper to get platform display name
  const getPlatformDisplayName = (platformKey: string) => {
    const platformMap: Record<string, string> = {
      'ps5': 'PlayStation 5',
      'ps4': 'PlayStation 4',
      'xboxsx': 'Xbox Series X/S',
      'xboxone': 'Xbox One',
      'pc': 'PC',
      'switch': 'Nintendo Switch',
      'mobile': 'Mobile',
    };

    return platformMap[platformKey] || platformKey;
  };

  // Helper to get genre display name
  const getGenreDisplayName = (genreKey: string) => {
    const genreMap: Record<string, string> = {
      'action': 'Hành động',
      'adventure': 'Phiêu lưu',
      'rpg': 'Nhập vai',
      'shooter': 'Bắn súng',
      'strategy': 'Chiến thuật',
      'puzzle': 'Giải đố',
      'simulation': 'Mô phỏng',
      'sports': 'Thể thao',
      'racing': 'Đua xe',
      'horror': 'Kinh dị',
    };

    return genreMap[genreKey] || genreKey;
  };

  // Format release date
  const formatReleaseDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";

      // Try to parse various formats
      if (dateString.includes('/')) {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`;
      }

      // ISO format
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }

      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AuthRedirect />
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <MainNav />
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="container mx-auto py-12 text-center">
            <div className="flex justify-center items-center h-64 flex-col gap-4">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-l-transparent border-r-transparent border-b-transparent animate-spin"></div>
                <div className="absolute top-1 left-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full border-4 border-t-transparent border-l-transparent border-r-primary border-b-transparent animate-spin"></div>
                <Gamepad2 className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xl font-medium">Đang tải thông tin game...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error || !game) {
    return (
      <div className="flex min-h-screen flex-col">
        <AuthRedirect />
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <MainNav />
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="container mx-auto py-12 text-center">
            <div className="p-8 border rounded-lg max-w-md mx-auto shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Không tìm thấy game</h2>
              <p className="text-muted-foreground mb-6">{error || "Game không tồn tại hoặc đã bị xóa."}</p>
              <Button onClick={() => router.push('/games')}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách games
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Extract system requirements
  const systemRequirements = parseSystemRequirements(game.system_requirements);

  // Get game cover image
  const getCoverImage = () => {
    if (game.gameImages && Array.isArray(game.gameImages) && game.gameImages.length > 0 && game.gameImages[0]?.url) {
      return game.gameImages[0].url;
    } else if (game.image) {
      return game.image;
    }
    return "/placeholder.svg";
  };

  // Get header background image
  const getHeaderBgImage = () => {
    if (game.gameImages && Array.isArray(game.gameImages) && game.gameImages.length > 1 && game.gameImages[1]?.url) {
      return game.gameImages[1].url;
    } else if (game.gameImages && Array.isArray(game.gameImages) && game.gameImages.length > 0 && game.gameImages[0]?.url) {
      return game.gameImages[0].url;
    } else if (game.image) {
      return game.image;
    }
    return "/placeholder.svg";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AuthRedirect />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] bg-gradient-to-b from-black to-background overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ height: "100%" }}>
          <Image
            src={getHeaderBgImage()}
            alt={game.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        {/* Back button - floating */}
        <div className={`fixed top-24 left-4 z-50 transition-all duration-300 ${
          scrolled ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
        }`}>
          <Button 
            variant="outline" 
            size="sm" 
            className={`rounded-full shadow-lg backdrop-blur-md hover:bg-background/90 px-4 transition-all duration-300 ${
              scrolled 
                ? 'bg-primary/90 hover:bg-primary text-primary-foreground' 
                : 'bg-background/70'
            }`}
            asChild
          >
            <Link href="/games">
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>{scrolled ? 'Quay lại danh sách' : 'Quay lại'}</span>
            </Link>
          </Button>
        </div>
  
        <div className="container relative z-10 h-full flex flex-col justify-end pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-background/50 relative transform transition-transform hover:scale-[1.02]" style={{ height: "380px" }}>
                <Image
                  src={getCoverImage()}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  priority
                />
                
                {game.trailer_url && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="default" 
                      className="shadow-xl gap-2 rounded-full px-5 bg-primary/90 hover:bg-primary/100"
                      asChild
                    >
                      <a href={game.trailer_url} target="_blank" rel="noopener noreferrer" aria-label="Xem trailer">
                        <Play className="h-5 w-5" />
                        <span>Xem trailer</span>
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.isArray(game.platform) && game.platform.map((p: string) => (
                  <Badge key={p} variant="secondary" className="shadow-sm">{getPlatformDisplayName(p)}</Badge>
                ))}
                {game.featured && (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 shadow-sm">
                    Game nổi bật
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{game.title}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex">{renderStars(game.rating || 0)}</div>
                <span className="font-medium">({game.rating ? game.rating.toFixed(1) : "0.0"})</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {Array.isArray(game.genre) && game.genre.map((g: string) => (
                  <Badge key={g} variant="outline" className="bg-background/30 backdrop-blur-sm shadow-sm">
                    {getGenreDisplayName(g)}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary/90 shadow-md">
                  <Download className="mr-2 h-4 w-4" />
                  Tải Game
                </Button>

                <Button variant="outline" className="bg-background/30 backdrop-blur-sm hover:bg-background/50">
                  <Heart className="mr-2 h-4 w-4" />
                  Yêu thích
                </Button>

                <Button variant="outline" className="bg-background/30 backdrop-blur-sm hover:bg-background/50">
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia sẻ
                </Button>

                {game.official_website && (
                  <Button variant="outline" className="bg-background/30 backdrop-blur-sm hover:bg-background/50" asChild>
                    <a href={game.official_website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-background">
        <div className="container py-8">

          {/* Mobile cover - visible only on mobile */}
          <div className="block md:hidden mb-6">
            <div className="rounded-lg overflow-hidden shadow-xl relative bg-muted" style={{ height: "220px" }}>
              <Image
                src={getCoverImage()}
                alt={game.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />

              {game.trailer_url && (
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="default" 
                    className="shadow-xl gap-2 rounded-full px-5 bg-primary/90 hover:bg-primary/100"
                    asChild
                  >
                    <a href={game.trailer_url} target="_blank" rel="noopener noreferrer" aria-label="Xem trailer">
                      <Play className="h-5 w-5" />
                      <span>Xem trailer</span>
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Game info cards */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 py-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Nhà phát triển</p>
                    <p className="text-sm text-muted-foreground">{game.developer || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 py-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Nhà phát hành</p>
                    <p className="text-sm text-muted-foreground">{game.publisher || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 py-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ngày phát hành</p>
                    <p className="text-sm text-muted-foreground">{formatReleaseDate(game.release_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 py-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Lượt tải</p>
                    <p className="text-sm text-muted-foreground">{(game.downloads || 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Mô tả</h2>
            <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">{game.description || 'Không có mô tả.'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Game details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 h-auto p-1 mb-8 bg-muted/50 backdrop-blur-sm shadow-md rounded-lg">
              <TabsTrigger value="overview" className="py-3 data-[state=active]:shadow-md">
                <Info className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">Chi tiết</span>
              </TabsTrigger>
              <TabsTrigger value="screenshots" className="py-3 data-[state=active]:shadow-md">
                <ImageIcon className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">Hình ảnh</span>
              </TabsTrigger>
              <TabsTrigger value="requirements" className="py-3 data-[state=active]:shadow-md">
                <Laptop className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">Cấu hình</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="py-3 data-[state=active]:shadow-md">
                <MessageSquare className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">Đánh giá</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
              <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
                <CardHeader>
                  <CardTitle>Chi tiết game</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: game.content || "Không có thông tin chi tiết" }}>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="screenshots" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
              <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
                <CardHeader>
                  <CardTitle>Thư viện hình ảnh</CardTitle>
                </CardHeader>
                <CardContent>
                  {game.gameImages && Array.isArray(game.gameImages) && game.gameImages.length > 0 ? (
                    <div>
                      {/* Main selected image */}
                      <div
                        className="mb-4 rounded-lg overflow-hidden shadow-xl relative bg-muted cursor-pointer"
                        onClick={() => setShowImageGallery(true)}
                        style={{ height: "400px" }}
                      >
                        <Image
                          src={game.gameImages[activeScreenshot]?.url || "/placeholder.svg"}
                          alt={game.gameImages[activeScreenshot]?.caption || `Screenshot ${activeScreenshot + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 1024px"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="bg-black/50 rounded-full p-2">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white">
                              <path d="M13.3536 7.35355C13.5488 7.15829 13.5488 6.84171 13.3536 6.64645L10.1716 3.46447C9.97631 3.2692 9.65973 3.2692 9.46447 3.46447C9.2692 3.65973 9.2692 3.97631 9.46447 4.17157L12.2929 7L9.46447 9.82843C9.2692 10.0237 9.2692 10.3403 9.46447 10.5355C9.65973 10.7308 9.97631 10.7308 10.1716 10.5355L13.3536 7.35355ZM1.64645 7.5H13V6.5H1.64645V7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail gallery */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {game.gameImages.map((image: any, index: number) => (
                          <div
                            key={image.id || index}
                            className={`rounded-md overflow-hidden bg-muted relative cursor-pointer transition-all ${index === activeScreenshot ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'
                              }`}
                            onClick={() => setActiveScreenshot(index)}
                            style={{ height: "70px" }}
                          >
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt={image.caption || `Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Không có hình ảnh game</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
              <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
                <CardHeader>
                  <CardTitle>Cấu hình yêu cầu</CardTitle>
                </CardHeader>
                <CardContent>
                  {game.system_requirements ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Minimum Requirements */}
                      <Card className="border border-muted shadow-sm">
                        <CardHeader className="bg-muted/30 pb-2">
                          <CardTitle className="text-lg">Cấu hình tối thiểu</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {systemRequirements.windows?.min ? (
                            <dl className="space-y-3">
                              {Object.entries(systemRequirements.windows.min).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
                                  <dt className="font-medium text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                                  <dd className="text-sm text-muted-foreground">{String(value)}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : systemRequirements.minimum ? (
                            <dl className="space-y-3">
                              {Object.entries(systemRequirements.minimum).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
                                  <dt className="font-medium text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                                  <dd className="text-sm text-muted-foreground">{String(value)}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <p className="text-muted-foreground">Không có thông tin</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommended Requirements */}
                      <Card className="border border-muted shadow-sm">
                        <CardHeader className="bg-muted/30 pb-2">
                          <CardTitle className="text-lg">Cấu hình đề nghị</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {systemRequirements.windows?.rec ? (
                            <dl className="space-y-3">
                              {Object.entries(systemRequirements.windows.rec).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
                                  <dt className="font-medium text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                                  <dd className="text-sm text-muted-foreground">{String(value)}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : systemRequirements.recommended ? (
                            <dl className="space-y-3">
                              {Object.entries(systemRequirements.recommended).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
                                  <dt className="font-medium text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                                  <dd className="text-sm text-muted-foreground">{String(value)}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <p className="text-muted-foreground">Không có thông tin</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Additional Requirements or General Requirements */}
                      {(systemRequirements.additional || systemRequirements.windows?.additional || (!systemRequirements.windows?.min && !systemRequirements.windows?.rec && !systemRequirements.minimum && !systemRequirements.recommended)) && (
                        <Card className="border border-muted shadow-sm md:col-span-2">
                          <CardHeader className="bg-muted/30 pb-2">
                            <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            {typeof systemRequirements.additional === 'string' ? (
                              <div className="prose max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: systemRequirements.additional }}>
                              </div>
                            ) : systemRequirements.windows?.additional ? (
                              <div className="prose max-w-none dark:prose-invert">
                                <p>{systemRequirements.windows.additional}</p>
                              </div>
                            ) : (
                              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                {JSON.stringify(systemRequirements, null, 2)}
                              </pre>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Laptop className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Không có thông tin cấu hình yêu cầu</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
              <GameReviews gameId={id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ZoneHub. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Image Gallery Modal */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-5xl w-[90vw] h-[85vh] max-h-[90vh] p-0 overflow-hidden bg-black/95">
          {/* Visually hidden title for screen readers */}
          <DialogTitle className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-0 whitespace-nowrap border-0">
            {game.gameImages && game.gameImages[activeScreenshot]?.caption || `Screenshot ${activeScreenshot + 1} for ${game.title}`}
          </DialogTitle>

          <div className="relative h-full w-full overflow-hidden">
            {game.gameImages && Array.isArray(game.gameImages) && game.gameImages.length > 0 && (
              <Image
                src={game.gameImages[activeScreenshot]?.url || "/placeholder.svg"}
                alt={game.gameImages[activeScreenshot]?.caption || `Screenshot ${activeScreenshot + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            )}

            <DialogClose className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 p-2 rounded-full">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </DialogClose>

            {activeScreenshot > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60"
                onClick={() => setActiveScreenshot(prev => prev - 1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            {game.gameImages && Array.isArray(game.gameImages) && activeScreenshot < game.gameImages.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/60"
                onClick={() => setActiveScreenshot(prev => prev + 1)}
              >
                <ChevronLeft className="h-5 w-5 transform rotate-180" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 