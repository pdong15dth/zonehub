"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Bookmark,
  ThumbsUp,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"

interface ArticleActionsProps {
  articleId: string
  initialLikes: number
}

export function ArticleActions({ articleId, initialLikes }: ArticleActionsProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const { toast } = useToast()

  const handleLike = async () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    
    // In a real app, you would call an API to update likes
    try {
      // Example API call (commented out)
      // await fetch(`/api/articles/${articleId}/like`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ liked: !liked })
      // })
    } catch (error) {
      // Revert on error
      setLiked(liked)
      setLikeCount(likeCount)
      toast({
        title: "Đã xảy ra lỗi",
        description: "Không thể cập nhật lượt thích, vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = async () => {
    setBookmarked(!bookmarked)
    
    // In a real app, you would call an API to save bookmark
    toast({
      title: bookmarked ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết",
      description: bookmarked 
        ? "Bài viết đã được xóa khỏi danh sách đã lưu." 
        : "Bài viết đã được thêm vào danh sách đã lưu.",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
    
    toast({
      title: "Đã sao chép",
      description: "Đường dẫn đã được sao chép vào clipboard.",
    })
  }

  return (
    <div className="flex justify-between items-center border-t border-b py-4">
      <div className="flex items-center gap-4">
        <Button 
          variant={liked ? "default" : "outline"}
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{likeCount} thích</span>
        </Button>
        <Button 
          variant={bookmarked ? "default" : "outline"}
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleBookmark}
        >
          <Bookmark className="h-4 w-4" />
          <span>{bookmarked ? "Đã lưu" : "Lưu bài viết"}</span>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={copyToClipboard}>
          {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
} 