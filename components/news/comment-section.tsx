"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp } from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"

interface Comment {
  id: number
  author: string
  avatar?: string
  date: string
  content: string
  likes: number
  replies?: Comment[]
}

// Demo comments for development
const DEMO_COMMENTS: Comment[] = [
  {
    id: 1,
    author: "Nguyễn Văn A",
    avatar: "/placeholder.svg",
    date: "16/07/2024",
    content: "Thông tin rất hữu ích! Cảm ơn tác giả đã chia sẻ.",
    likes: 5,
    replies: [
      {
        id: 101,
        author: "Trần Thị B",
        avatar: "/placeholder.svg",
        date: "16/07/2024",
        content: "Tôi cũng thấy vậy, bài viết rất chi tiết.",
        likes: 2,
      }
    ]
  },
  {
    id: 2,
    author: "Lê Văn C",
    avatar: "/placeholder.svg",
    date: "15/07/2024",
    content: "Bài viết hay, nhưng tôi muốn biết thêm về các tính năng khác nữa.",
    likes: 3,
    replies: []
  }
]

interface CommentSectionProps {
  articleId: string
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(DEMO_COMMENTS)
  const [commentContent, setCommentContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  
  // In a real implementation, we would fetch comments from the database
  // useEffect(() => {
  //   async function fetchComments() {
  //     setIsLoading(true)
  //     try {
  //       const { data, error } = await supabase
  //         .from('comments')
  //         .select('*')
  //         .eq('article_id', articleId)
  //         .order('created_at', { ascending: false })
  //       
  //       if (error) throw error
  //       setComments(data || [])
  //     } catch (error) {
  //       console.error('Error fetching comments:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   
  //   fetchComments()
  // }, [articleId, supabase])

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentContent.trim()) return
    
    if (!user) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để bình luận",
        variant: "destructive"
      })
      return
    }
    
    // In a real implementation, we would submit the comment to the database
    // For now, just add it to the local state
    const newComment: Comment = {
      id: Date.now(),
      author: user.email || "Anonymous User",
      avatar: "/placeholder.svg",
      date: new Date().toLocaleDateString("vi-VN"),
      content: commentContent,
      likes: 0
    }
    
    setComments([newComment, ...comments])
    setCommentContent("")
    
    toast({
      title: "Bình luận đã được gửi",
      description: "Cảm ơn bạn đã chia sẻ ý kiến!"
    })
  }
  
  const handleLike = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        
        // Check in replies too
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, likes: reply.likes + 1 } 
                : reply
            )
          }
        }
        
        return comment
      })
    )
  }

  return (
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
                <Button type="submit" disabled={!commentContent.trim() || isLoading}>
                  {isLoading ? "Đang gửi..." : "Đăng bình luận"}
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
            <div className="flex gap-4 items-start">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.date}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => handleLike(comment.id)}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {comment.likes} thích
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                    Trả lời
                  </Button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-12 space-y-4">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="flex gap-4 items-start">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.avatar} alt={reply.author} />
                      <AvatarFallback>{reply.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{reply.author}</span>
                        <span className="text-xs text-muted-foreground">{reply.date}</span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                          onClick={() => handleLike(reply.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {reply.likes} thích
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 