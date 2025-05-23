import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Bookmark,
  Calendar,
  ChevronRight,
  EyeIcon,
  MessageSquare,
  Plus,
} from "lucide-react"
import { articlesDb, Article } from "@/lib/json-db"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

export const metadata = {
  title: 'Tin tức & Bài viết',
  description: 'Cập nhật tin tức mới nhất về game, công nghệ và esports',
}

// Using revalidate to ensure fresh data without rebuilding
export const revalidate = 30; // revalidate every 30 seconds

export default async function NewsPage() {
  // Fetch articles from JSON database
  const { data: allArticles, error } = await articlesDb.select({
    filter: (article) => article.status === 'published',
    order: { field: 'publish_date', ascending: false }
  });
  
  const articles = allArticles as Article[];
  
  // Check if we have articles
  const hasNews = articles && articles.length > 0;
  
  // Separate featured articles
  const featuredArticles = (articles || [])
    .filter(article => article.is_featured === true)
    .slice(0, 3);

  console.log("Featured articles:", articles);
  
  // Get regular articles (non-featured)
  const regularArticles = (articles || [])
    .filter(article => !article.is_featured);
  
  // Log error if any
  if (error) {
    console.error('Error fetching articles:', error);
  }

  // Function to format date with Vietnamese locale
  function formatDate(dateString: string) {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: vi
      });
    } catch (e) {
      return dateString;
    }
  }

  // Popular tags (could be fetched from database)
  const popularTags = [
    "PS5", "PC Gaming", "Esports", "Mobile Game", "Nintendo", "Xbox", "Steam", "Epic Games",
    "VR", "Game Indie", "MMORPG", "FPS", "Moba", "RPG", "Streamer"
  ]

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
        {featuredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main featured article */}
            {featuredArticles[0] && (
              <div className="md:col-span-2">
                <Link href={`/news/${featuredArticles[0].slug}/${featuredArticles[0].id}`}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative h-[300px]">
                      <img 
                        src={featuredArticles[0].cover_image || "/placeholder.svg"} 
                        alt={featuredArticles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <Badge className="mb-2 bg-indigo-600">{featuredArticles[0].category}</Badge>
                        <h2 className="text-2xl font-bold mb-2">{featuredArticles[0].title}</h2>
                        <div className="flex items-center mt-4">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={undefined} />
                            <AvatarFallback>
                              {featuredArticles[0].title?.[0] || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm mr-3">
                            Anonymous
                          </span>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {featuredArticles[0].publish_date 
                              ? formatDate(featuredArticles[0].publish_date) 
                              : formatDate(featuredArticles[0].created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )}
            
            {/* Secondary featured articles */}
            <div className="space-y-6">
              {featuredArticles.slice(1, 3).map(article => (
                <Link href={`/news/${article.slug}/${article.id}`} key={article.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative h-[150px]">
                      <img 
                        src={article.cover_image || "/placeholder.svg"} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <Badge className="mb-2 bg-indigo-600 text-xs">{article.category}</Badge>
                        <h3 className="text-sm font-bold line-clamp-1">{article.title}</h3>
                        <div className="flex items-center mt-2 text-xs">
                          <span className="mr-3">
                            Anonymous
                          </span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {article.publish_date 
                              ? formatDate(article.publish_date) 
                              : formatDate(article.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <Separator />
        
        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-6">
          
              {hasNews ? (
                <>
                  {regularArticles.map(article => (
                    <Link 
                      href={`/news/${article.slug}/${article.id}`} 
                      key={article.id}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="sm:flex">
                          <div className="sm:w-1/3 h-[200px] sm:h-auto">
                            <img 
                              src={article.cover_image || "/placeholder.svg"} 
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
                                  <span className="mr-3">{article.views || 0}</span>
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  <span>{article.comments_count || 0}</span>
                                </div>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                              <p className="text-muted-foreground text-sm mb-4">
                                {article.summary || ''}
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={undefined} />
                                  <AvatarFallback>
                                    {article.title?.[0] || 'A'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    Anonymous
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {article.publish_date 
                                      ? formatDate(article.publish_date) 
                                      : formatDate(article.created_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                  
                  <div className="flex justify-center mt-8">
                    <Button>Xem thêm bài viết</Button>
                  </div>
                </>
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Không tìm thấy bài viết nào phù hợp.</p>
                </Card>
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
                {articles && articles.slice(0, 5).map((article, index) => (
                  <Link href={`/news/${article.slug}/${article.id}`} key={article.id}>
                    <div className="flex gap-3 group">
                      <div className="flex-shrink-0 font-bold text-muted-foreground text-xl">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground mr-3">
                            {article.publish_date 
                              ? formatDate(article.publish_date) 
                              : formatDate(article.created_at)}
                          </span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            <span>{article.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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