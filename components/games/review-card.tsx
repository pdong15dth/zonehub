"use client"

import { useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Clock } from "lucide-react"
import { Star } from "lucide-react"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    content: string
    author: string
    date: string
    avatar?: string | null
    likes: number
    userId?: string
  }
  onReply?: (reviewId: string) => void
}

export function ReviewCard({ review, onReply }: ReviewCardProps) {
  const { user } = useSupabase()
  const { toast } = useToast()
  const [likes, setLikes] = useState<number>(review.likes || 0)
  const [isLiking, setIsLiking] = useState<boolean>(false)

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

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Đăng nhập để tiếp tục",
        description: "Vui lòng đăng nhập để thích đánh giá này.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLiking(true)

      const response = await fetch("/api/reviews/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: review.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra khi thích đánh giá")
      }

      setLikes(result.likes)
    } catch (error) {
      console.error("Error liking review:", error)
      toast({
        title: "Không thể thích đánh giá",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const isOwnReview = user?.id === review.userId

  return (
    <Card className="border-0 border-b rounded-none last:border-0 bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={review.avatar || undefined} alt={review.author} />
              <AvatarFallback className="bg-primary/10">{review.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-base font-medium">{review.author}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{review.date}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            {renderStars(review.rating)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-line">{review.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          disabled={isLiking}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${likes > 0 ? "fill-current" : ""}`} />
          <span>{likes}</span>
        </Button>
        {onReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(review.id)}
            disabled={isOwnReview}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Trả lời
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 