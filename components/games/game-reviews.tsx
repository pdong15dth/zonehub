"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface GameReviewsProps {
  gameId: string
}

// Demo reviews data
const DEMO_REVIEWS = [
  {
    id: 1,
    gameId: "game-1",
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://placekitten.com/40/40"
    },
    rating: 5,
    content: "Game tuyệt vời! Đồ họa đẹp và gameplay hấp dẫn. Đáng để đầu tư thời gian chơi.",
    createdAt: "2024-01-15T12:00:00Z",
    likes: 12
  },
  {
    id: 2,
    gameId: "game-1", 
    user: {
      name: "Trần Thị B",
      avatar: "https://placekitten.com/40/41"
    },
    rating: 4,
    content: "Gameplay hay nhưng hơi khó ở một số đoạn. Nhìn chung vẫn rất thú vị!",
    createdAt: "2024-01-16T10:30:00Z",
    likes: 8
  },
  {
    id: 3,
    gameId: "game-2",
    user: {
      name: "Lê Văn C", 
      avatar: "https://placekitten.com/40/42"
    },
    rating: 5,
    content: "Masterpiece! Một trong những game hay nhất mà tôi từng chơi.",
    createdAt: "2024-01-17T15:20:00Z",
    likes: 15
  }
]

export function GameReviews({ gameId }: GameReviewsProps) {
  const { toast } = useToast()
  
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter reviews for this game
  useEffect(() => {
    setLoading(true)
    const gameReviews = DEMO_REVIEWS.filter(review => review.gameId === gameId)
    setReviews(gameReviews)
    setLoading(false)
  }, [gameId])

  const handleWriteReview = () => {
    toast({
      title: "Tính năng đang phát triển",
      description: "Chức năng viết đánh giá sẽ sớm được cập nhật trong phiên bản tiếp theo.",
      duration: 3000,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
          }`}
        />
      )
    }
    return stars
  }

  return (
    <div>
      <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đánh giá từ cộng đồng</CardTitle>
            <CardDescription>Chia sẻ trải nghiệm của bạn với game này</CardDescription>
          </div>
          <Button onClick={handleWriteReview}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Viết đánh giá
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.user.name}</span>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{review.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          👍 {review.likes} hữu ích
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          Trả lời
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có đánh giá nào</h3>
              <p className="text-muted-foreground mb-6">Hãy là người đầu tiên đánh giá game này</p>
              <Button className="shadow-md" onClick={handleWriteReview}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Viết đánh giá
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 