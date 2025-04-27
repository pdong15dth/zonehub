"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  authorBio: string
  authorAvatar: string
  date: string
  category: string
  tags: string[]
  image: string
  views: number
  comments: number
  likes: number
  isFeatured: boolean
}

// Mock news data - in real app, this would be fetched from an API
const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Sony công bố PS5 Pro, nâng cấp đồ họa và hiệu suất",
    excerpt: "Phiên bản PS5 Pro mới nhất của Sony hứa hẹn mang đến hiệu suất chơi game vượt trội với GPU mạnh hơn 45% và khả năng ray tracing tiên tiến.",
    content: `<p>Sony vừa chính thức giới thiệu phiên bản PlayStation 5 Pro tại sự kiện State of Play, hứa hẹn mang đến hiệu suất chơi game vượt trội cho người dùng.</p>
      <p>Theo thông tin từ Sony, PS5 Pro được trang bị GPU mạnh hơn 45% so với phiên bản tiêu chuẩn, cho phép trải nghiệm game ở độ phân giải cao hơn hoặc tốc độ khung hình ổn định hơn. Đặc biệt, khả năng ray tracing đã được cải thiện đáng kể, giúp đồ họa trở nên chân thực hơn với hiệu ứng ánh sáng, bóng và phản chiếu tinh tế.</p>
      <h2>Cấu hình mạnh mẽ hơn</h2>
      <p>PS5 Pro được trang bị bộ xử lý AMD RDNA 3 nâng cấp, RAM nhanh hơn và ổ cứng SSD với dung lượng lớn hơn. Sony cũng chia sẻ rằng máy sẽ hỗ trợ công nghệ "PlayStation Spectral Super Resolution" - một giải pháp upscaling thông minh tương tự như DLSS của NVIDIA hoặc FSR của AMD.</p>
      <blockquote>
        "PS5 Pro là bước nhảy vọt trong công nghệ console, mang đến trải nghiệm chơi game thế hệ mới mà không cần phải đợi đến thế hệ PS6", Mark Cerny, kiến trúc sư trưởng của PlayStation cho biết.
      </blockquote>
      <h2>Khi nào PS5 Pro ra mắt?</h2>
      <p>Theo thông báo từ Sony, PS5 Pro sẽ bắt đầu được bán ra vào tháng 11 năm 2024, đúng dịp mùa mua sắm cuối năm. Mức giá dự kiến sẽ cao hơn khoảng 150-200 USD so với phiên bản PS5 tiêu chuẩn hiện tại.</p>
      <p>Các nhà phát triển game lớn nhất như Ubisoft, EA, và Square Enix đã xác nhận rằng họ đang tối ưu hóa các tựa game sắp ra mắt của mình để tận dụng tối đa sức mạnh của PS5 Pro.</p>
      <p>Người chơi cũng sẽ vui mừng khi biết rằng PS5 Pro hoàn toàn tương thích ngược với thư viện game PS5 hiện tại, và nhiều tựa game phổ biến sẽ được cập nhật miễn phí để tận dụng sức mạnh phần cứng mới.</p>`,
    author: "Minh Tuấn",
    authorBio: "Chuyên gia công nghệ với hơn 10 năm kinh nghiệm, chuyên viết về console và PC gaming",
    authorAvatar: "/placeholder.svg",
    date: "15/07/2024",
    category: "Công nghệ",
    tags: ["PlayStation", "PS5", "Console", "Gaming", "Sony"],
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
    content: "Nội dung chi tiết về game indie",
    author: "Hà Linh",
    authorBio: "Game reviewer chuyên về các game indie và AA",
    authorAvatar: "/placeholder.svg",
    date: "14/07/2024",
    category: "Game",
    tags: ["Indie Games", "Game Development", "Graphics"],
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
    content: "Nội dung chi tiết về giải đấu esports",
    author: "Anh Tuấn",
    authorBio: "Commentator esports chuyên nghiệp",
    authorAvatar: "/placeholder.svg",
    date: "13/07/2024",
    category: "Esports",
    tags: ["Esports", "Tournaments", "Vietnam"],
    image: "/placeholder.svg",
    views: 1523,
    comments: 67,
    likes: 231,
    isFeatured: false
  }
]

// Sample comments
const comments = [
  {
    id: 1,
    author: "Nguyễn Văn A",
    avatar: "/placeholder.svg",
    date: "16/07/2024",
    content: "Thông tin rất hữu ích! Tôi đang chờ đợi PS5 Pro từ rất lâu rồi.",
    likes: 5,
    replies: [
      {
        id: 101,
        author: "Trần Thị B",
        avatar: "/placeholder.svg",
        date: "16/07/2024",
        content: "Tôi cũng vậy, hy vọng giá cả sẽ hợp lý.",
        likes: 2,
      }
    ]
  },
  {
    id: 2,
    author: "Lê Văn C",
    avatar: "/placeholder.svg",
    date: "15/07/2024",
    content: "Cấu hình khá ấn tượng, nhưng tôi vẫn thích PC hơn.",
    likes: 3,
    replies: []
  }
]

export default function ArticlePage() {
  console.log("Rendering ArticlePage component");
  
  // Đảm bảo useParams được gọi trong component
  const params = useParams();
  
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
  
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Log available articles for debug
  useEffect(() => {
    console.log("Debug - Available articles:", newsArticles);
    console.log("Debug - Available article IDs:", newsArticles.map(a => a.id));
  }, []);

  // In a real app, fetch article from API based on ID
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('====== DEBUG ARTICLE FINDING =====');
      console.log('Getting news article with id:', id);
      
      // Parse the ID from string to number
      const articleId = parseInt(id);
      console.log('Parsed articleId:', articleId, 'Type:', typeof articleId);
      
      // Show available IDs for debugging
      console.log('Available IDs:', newsArticles.map(a => ({ id: a.id, type: typeof a.id })));
      
      // Thử tìm kiếm theo kiểu dữ liệu string trước
      let foundArticle = newsArticles.find(article => String(article.id) === id);
      
      // Nếu không tìm thấy, thử tìm kiếm theo kiểu dữ liệu number
      if (!foundArticle) {
        foundArticle = newsArticles.find(article => article.id === articleId);
      }
      
      console.log('Found article:', foundArticle);
      
      if (foundArticle) {
        setArticle(foundArticle);
        // Find related articles with same category
        const related = newsArticles
          .filter(a => String(a.id) !== String(articleId) && a.category === foundArticle.category)
          .slice(0, 3);
        setRelatedArticles(related);
      } else {
        setError(`Không tìm thấy bài viết với ID: ${id}`);
        console.error('Article not found with id:', articleId);
        console.log('Raw data comparison:');
        newsArticles.forEach(a => {
          console.log(`Article ID: ${a.id} (${typeof a.id}) === Requested ID: ${articleId} (${typeof articleId}) => ${a.id === articleId}`);
          console.log(`String comparison: ${String(a.id) === String(articleId)}`);
        });
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
      setError('Đã xảy ra lỗi khi tải bài viết');
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
        <p className="mt-4">Đang tải bài viết...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold">Không thể tải bài viết</h2>
            <p>{error}</p>
          </div>
          <Link href="/news" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách tin tức
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return notFound()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, send comment to API
    setCommentContent("")
    alert("Bình luận của bạn đã được gửi đi!")
  }

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
            <span className="text-muted-foreground">{article.category}</span>
          </div>

          {/* Article header */}
          <div>
            <Badge className="mb-4 bg-indigo-600">{article.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={article.authorAvatar} alt={article.author} />
                  <AvatarFallback>{article.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{article.author}</p>
                  <p className="text-xs text-muted-foreground">{article.date}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-1 text-muted-foreground">
                <EyeIcon className="h-4 w-4" />
                <span className="text-xs">{article.views} lượt xem</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{article.comments} bình luận</span>
              </div>
            </div>
          </div>

          {/* Featured image */}
          <div className="relative h-[400px]">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Article content */}
          <div className="prose max-w-none prose-img:rounded-lg prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Tags */}
          <div className="pt-4">
            <h3 className="font-medium mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Button key={tag} variant="outline" size="sm" className="text-xs">
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Interaction bar */}
          <div className="flex justify-between items-center border-t border-b py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant={liked ? "default" : "outline"} 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{liked ? article.likes + 1 : article.likes} thích</span>
              </Button>
              <Button 
                variant={bookmarked ? "default" : "outline"} 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark className="h-4 w-4" />
                <span>{bookmarked ? "Đã lưu" : "Lưu bài viết"}</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Author bio */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={article.authorAvatar} alt={article.author} />
                  <AvatarFallback>{article.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg mb-1">Về tác giả {article.author}</h3>
                  <p className="text-muted-foreground">{article.authorBio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h2>
            
            {/* Comment form */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleComment}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Viết bình luận của bạn</span>
                    </div>
                    <Textarea 
                      placeholder="Viết bình luận..." 
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!commentContent.trim()}>
                        Đăng bình luận
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Comments list */}
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-1">
                          <AvatarImage src={comment.avatar} alt={comment.author} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground ml-2">{comment.date}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mt-2">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Button variant="ghost" size="sm" className="h-8">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">{comment.likes}</span>
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
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {comment.replies.map(reply => (
                        <Card key={reply.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="mt-1">
                                <AvatarImage src={reply.avatar} alt={reply.author} />
                                <AvatarFallback>{reply.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium">{reply.author}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{reply.date}</span>
                                  </div>
                                </div>
                                <p className="mt-2">{reply.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Button variant="ghost" size="sm" className="h-8">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    <span className="text-xs">{reply.likes}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related articles */}
          <Card>
            <CardHeader>
              <CardTitle>Bài viết liên quan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedArticles.map(article => (
                <Link href={`/news/${article.id}`} key={article.id}>
                  <div className="flex gap-3 group">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          
          {/* Popular tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
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
              <CardTitle>Đăng ký nhận tin</CardTitle>
              <CardDescription>Nhận tin tức mới nhất về gaming và công nghệ</CardDescription>
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
  )
} 
