"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Maximize, X } from "lucide-react"

interface ImageGalleryProps {
  images: string[] | { url: string; caption?: string | null }[]
  className?: string
  aspectRatio?: "square" | "video" | "wide" | "auto"
}

export function ImageGallery({
  images,
  className,
  aspectRatio = "video"
}: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Chuyển đổi mảng images để có cùng cấu trúc
  const normalizedImages = images.map(img => {
    if (typeof img === 'string') {
      return { url: img, caption: null }
    }
    return img
  })
  
  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    )
  }
  
  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === normalizedImages.length - 1 ? 0 : prev + 1
    )
  }
  
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') {
          handlePrevImage()
        } else if (e.key === 'ArrowRight') {
          handleNextImage()
        } else if (e.key === 'Escape') {
          setIsFullscreen(false)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])
  
  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    auto: "aspect-auto"
  }
  
  if (normalizedImages.length === 0) {
    return (
      <div className={cn(
        "relative bg-muted rounded-md overflow-hidden",
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className={cn("space-y-3", className)}>
        {/* Main image */}
        <div className="relative">
          <div 
            className={cn(
              "relative rounded-lg overflow-hidden bg-muted",
              aspectRatioClasses[aspectRatio]
            )}
          >
            <Image
              src={normalizedImages[currentImageIndex].url}
              alt={normalizedImages[currentImageIndex].caption || "Game image"}
              fill
              priority
              className="object-cover transition-all hover:scale-105 duration-300"
            />
            
            {/* Navigation arrows */}
            {normalizedImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {/* Fullscreen button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4" />
            </Button>
            
            {/* Caption */}
            {normalizedImages[currentImageIndex].caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white p-2 text-sm">
                {normalizedImages[currentImageIndex].caption}
              </div>
            )}
            
            {/* Current image indicator */}
            {normalizedImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                {currentImageIndex + 1} / {normalizedImages.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Thumbnails */}
        {normalizedImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {normalizedImages.map((image, idx) => (
              <Card 
                key={idx}
                className={cn(
                  "relative cursor-pointer flex-shrink-0 w-20 h-20 overflow-hidden transition-all",
                  idx === currentImageIndex 
                    ? "ring-2 ring-primary" 
                    : "opacity-70 hover:opacity-100"
                )}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.url}
                    alt={image.caption || `Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 h-10 w-10"
            onClick={toggleFullscreen}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative max-h-[90vh] max-w-[90vw] mx-auto">
            <Image
              src={normalizedImages[currentImageIndex].url}
              alt={normalizedImages[currentImageIndex].caption || "Game image"}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh]"
            />
            
            {normalizedImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
            
            {/* Caption */}
            {normalizedImages[currentImageIndex].caption && (
              <div className="absolute bottom-4 inset-x-0 mx-auto text-center bg-black/60 text-white p-2 rounded-md max-w-2xl">
                {normalizedImages[currentImageIndex].caption}
              </div>
            )}
          </div>
          
          {/* Mini thumbnails in fullscreen */}
          <div className="flex justify-center mt-4 gap-2 px-4 overflow-x-auto">
            {normalizedImages.map((image, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "cursor-pointer w-16 h-16 rounded-md overflow-hidden transition-all",
                  idx === currentImageIndex 
                    ? "ring-2 ring-primary" 
                    : "opacity-60 hover:opacity-100"
                )}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
} 