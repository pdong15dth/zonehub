import { notFound } from "next/navigation"
import Link from "next/link"
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
import {
  Bookmark,
  Calendar,
  ChevronLeft,
  EyeIcon,
  Facebook,
  Heart,
  Linkedin,
  MessageSquare,
  Share2,
  ThumbsUp,
  Twitter,
  User,
  Copy,
  Check
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { articlesDb, Article as ArticleType } from "@/lib/json-db"
import { ArticleActions } from "@/components/news/article-actions"
import { CommentSection } from "@/components/news/comment-section"

interface PageProps {
  params: Promise<{
    slug: string
    id: string
  }>
}

export async function generateStaticParams() {
  // Fetch all published articles to generate static paths
  const { data: articles } = await articlesDb.select({
    filter: (article: ArticleType) => article.status === 'published'
  });
  
  if (!articles || !Array.isArray(articles)) {
    return []
  }
  
  return articles.map((article: any) => ({
    slug: article.slug,
    id: article.id
  }))
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug, id } = await params;
  
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
  
  // Fetch article from JSON database
  const { data: articleData, error: articleError } = await articlesDb.select({
    eq: { field: 'id', value: id },
    single: true
  });
    
  // If article not found or error occurred, show not found
  if (articleError || !articleData) {
    console.error('Error fetching article:', articleError);
    return notFound();
  }
  
  const article = articleData as ArticleType;
  
  // Fetch related articles
  const { data: relatedData } = await articlesDb.select({
    filter: (relatedArticle: ArticleType) => 
      relatedArticle.category === (articleData as ArticleType).category && 
      relatedArticle.status === 'published' && 
      relatedArticle.id !== id,
    limit: 3
  });
  
  const relatedArticles = (relatedData as ArticleType[]) || [];
  
  // Increment view count
  await articlesDb.incrementViews(id);
  
  const displayDate = article.publish_date 
    ? formatDate(article.publish_date)
    : formatDate(article.created_at);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/news" className="text-muted-foreground hover:text-primary flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại tin tức
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{article.title}</span>
          </div>

          {/* Article header */}
          <div>
            <Badge className="mb-4 bg-indigo-600">{article.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={undefined} alt="Anonymous" />
                  <AvatarFallback>
                    {article.title?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Anonymous</p>
                  <p className="text-xs text-muted-foreground">{displayDate}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-1 text-muted-foreground">
                <EyeIcon className="h-4 w-4" />
                <span className="text-xs">{article.views || 0} lượt xem</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{article.comments_count || 0} bình luận</span>
              </div>
            </div>
          </div>

          {/* Featured image */}
          <div className="relative h-[400px]">
            <img 
              src={article.cover_image || "/placeholder.svg"} 
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            {article.summary && (
              <div className="bg-muted p-4 rounded-lg mb-6 italic">
                {article.summary}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-muted/40">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <ArticleActions articleId={article.id} initialLikes={article.likes || 0} />

          {/* Author bio */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} alt="Anonymous" />
                  <AvatarFallback>
                    {article.title?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg mb-1">Về tác giả Anonymous</h3>
                  <p className="text-muted-foreground">Tác giả của bài viết này.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments section */}
          <CommentSection articleId={article.id} />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bài viết liên quan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {relatedArticles && relatedArticles.length > 0 ? (
                  relatedArticles.map((relatedArticle) => (
                    <Link 
                      key={relatedArticle.id} 
                      href={`/news/${relatedArticle.slug}/${relatedArticle.id}`}
                      className="block p-4 hover:bg-muted transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-16 flex-shrink-0">
                          <img 
                            src={relatedArticle.cover_image || "/placeholder.svg"} 
                            alt={relatedArticle.title}
                            className="h-full w-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium line-clamp-2 text-sm">
                            {relatedArticle.title}
                          </h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              Anonymous
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Không có bài viết liên quan
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Newsletter signup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Đăng ký nhận tin</CardTitle>
              <CardDescription>Nhận thông báo khi có bài viết mới</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <input
                  placeholder="Email của bạn"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="w-full">Đăng ký</Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thẻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 