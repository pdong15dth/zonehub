"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

interface ReviewFormProps {
  gameId: string
  currentUserReview?: {
    id: string
    rating: number
    content: string
  } | null
  isSignedIn?: boolean
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({
  gameId,
  currentUserReview = null,
  isSignedIn = false,
  onSuccess,
  onCancel
}: ReviewFormProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [rating, setRating] = useState<number>(currentUserReview?.rating || 0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [content, setContent] = useState<string>(currentUserReview?.content || "")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when currentUserReview changes
  useEffect(() => {
    if (currentUserReview) {
      setRating(currentUserReview.rating)
      setContent(currentUserReview.content)
    } else {
      setRating(0)
      setContent("")
    }
  }, [currentUserReview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!isSignedIn) {
      toast({
        title: "Đăng nhập để tiếp tục",
        description: "Vui lòng đăng nhập để đánh giá game này.",
        variant: "destructive",
      })
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá")
      return
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung đánh giá")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          rating,
          content,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra khi gửi đánh giá")
      }

      toast({
        title: "Đánh giá đã được gửi",
        description: "Cảm ơn bạn đã chia sẻ ý kiến về game này.",
      })

      // Clear form and notify parent
      setRating(0)
      setContent("")
      
      if (onSuccess) {
        onSuccess()
      }
      
      // Force refresh the page data
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi đánh giá")
      
      toast({
        title: "Không thể gửi đánh giá",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi đánh giá",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      setRating(currentUserReview?.rating || 0)
      setContent(currentUserReview?.content || "")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating" className="text-base font-medium">
          Đánh giá của bạn
        </Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full p-1 transition-colors"
              aria-label={`Đánh giá ${star} sao`}
            >
              <Star
                className={`h-8 w-8 ${
                  (hoverRating || rating) >= star
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                } transition-colors cursor-pointer`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-base font-medium">
          Chia sẻ trải nghiệm của bạn
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hãy chia sẻ những điều bạn thích hoặc chưa thích về game này..."
          className="min-h-[120px] resize-y"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="relative"
        >
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-md">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          )}
          Gửi đánh giá
        </Button>
      </div>
    </form>
  )
} 