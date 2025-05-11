"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { ReviewForm } from "./review-form"
import { ReviewCard } from "./review-card"
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"

interface GameReviewsProps {
  gameId: string
}

export function GameReviews({ gameId }: GameReviewsProps) {
  const { user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/reviews?gameId=${gameId}`)
        
        if (!response.ok) {
          throw new Error("Không thể tải đánh giá")
        }
        
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setError("Không thể tải đánh giá. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchReviews()
  }, [gameId])

  const handleWriteReview = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    
    setShowReviewForm(true)
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    
    // Re-fetch reviews to update the list
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?gameId=${gameId}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch (error) {
        console.error("Error re-fetching reviews:", error)
      }
    }
    
    fetchReviews()
  }

  const handleLogin = () => {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
  }

  // Check if user has already submitted a review
  const userHasReviewed = reviews.some(
    review => review.userId === user?.id
  )

  return (
    <div>
      <Card className="bg-card/50 backdrop-blur-sm shadow-md border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đánh giá từ cộng đồng</CardTitle>
            <CardDescription>Chia sẻ trải nghiệm của bạn với game này</CardDescription>
          </div>
          {!userHasReviewed && (
            <Button onClick={handleWriteReview}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Viết đánh giá
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Review form */}
          {showReviewForm && (
            <div className="mb-8 p-4 bg-muted/30 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h3>
              <ReviewForm 
                gameId={gameId}
                isSignedIn={!!user}
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {/* Reviews list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.refresh()}>
                Thử lại
              </Button>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onReply={(reviewId) => {
                    toast({
                      title: "Tính năng đang phát triển",
                      description: "Chức năng trả lời đánh giá sẽ sớm được cập nhật.",
                    })
                  }} 
                />
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

      {/* Login prompt dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Đăng nhập để tiếp tục</DialogTitle>
          <div className="py-4">
            <p className="mb-4">Bạn cần đăng nhập để viết đánh giá.</p>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button onClick={handleLogin}>
                Đăng nhập ngay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 