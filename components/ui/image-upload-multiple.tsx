"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  ImagePlus,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  Plus,
  Star,
  X,
  Move,
  ExternalLink
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface GameImage {
  id?: string
  url: string
  caption?: string | null
  is_primary?: boolean
  display_order?: number
}

interface ImageUploadMultipleProps {
  images: GameImage[]
  onChange: (images: GameImage[]) => void
  maxImages?: number
}

export function ImageUploadMultiple({
  images,
  onChange,
  maxImages = 10
}: ImageUploadMultipleProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const [urlInput, setUrlInput] = useState("")
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  // Check if we already have a primary image
  const hasPrimaryImage = images.some(img => img.is_primary)

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return

      if (images.length + files.length > maxImages) {
        toast({
          title: "Giới hạn số lượng ảnh",
          description: `Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh`,
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      setIsUploading(true)

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload/image", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to upload image")
          }

          const data = await response.json()

          // Add the new image to the list
          const newImage: GameImage = {
            url: data.url,
            caption: "",
            is_primary: !hasPrimaryImage && images.length === 0 && i === 0, // Make first image primary if no primary yet
            display_order: images.length + i
          }

          onChange([...images, newImage])
        }

        toast({
          title: "Tải ảnh thành công",
          description: `Đã tải ${files.length} ảnh lên thành công`,
          duration: 3000,
        })
      } catch (error) {
        console.error("Error uploading images:", error)
        toast({
          title: "Lỗi khi tải ảnh",
          description: error instanceof Error ? error.message : "Không thể tải ảnh lên",
          variant: "destructive",
          duration: 5000,
        })
      } finally {
        setIsUploading(false)
        e.target.value = ""
      }
    },
    [images, onChange, hasPrimaryImage, maxImages]
  )

  const handleAddUrlImage = useCallback(() => {
    if (!urlInput.trim()) return

    if (images.length + 1 > maxImages) {
      toast({
        title: "Giới hạn số lượng ảnh",
        description: `Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh`,
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Add the new URL image to the list
    const newImage: GameImage = {
      url: urlInput.trim(),
      caption: "",
      is_primary: !hasPrimaryImage && images.length === 0,
      display_order: images.length
    }

    onChange([...images, newImage])
    setUrlInput("")
    setShowUrlDialog(false)

    toast({
      title: "Thêm ảnh thành công",
      description: "Đã thêm ảnh từ URL thành công",
      duration: 3000,
    })
  }, [urlInput, images, onChange, hasPrimaryImage, maxImages])

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = [...images]
      const removedImage = newImages.splice(index, 1)[0]
      
      // If we removed the primary image, make the first remaining image primary
      if (removedImage.is_primary && newImages.length > 0) {
        newImages[0].is_primary = true
      }
      
      // Update display order
      newImages.forEach((img, idx) => {
        img.display_order = idx
      })
      
      onChange(newImages)
    },
    [images, onChange]
  )

  const handleMakePrimary = useCallback(
    (index: number) => {
      const newImages = [...images]
      
      // Remove primary flag from all images
      newImages.forEach(img => {
        img.is_primary = false
      })
      
      // Set new primary image
      newImages[index].is_primary = true
      
      onChange(newImages)
    },
    [images, onChange]
  )

  const handleMoveImage = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= images.length) return

      const newImages = [...images]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)

      // Update display order
      newImages.forEach((img, idx) => {
        img.display_order = idx
      })

      onChange(newImages)
    },
    [images, onChange]
  )

  const handleCaptionChange = useCallback(
    (index: number, caption: string) => {
      const newImages = [...images]
      newImages[index].caption = caption
      onChange(newImages)
    },
    [images, onChange]
  )

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDropIndex(index)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    
    if (draggedIndex !== null && draggedIndex !== index) {
      handleMoveImage(draggedIndex, index)
    }
    
    setDraggedIndex(null)
    setDropIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDropIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "relative group w-[180px] transition-all border-2 overflow-hidden",
              image.is_primary ? "border-primary" : "border-border",
              draggedIndex === index && "opacity-50",
              dropIndex === index && "border-dashed border-blue-500"
            )}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="aspect-square w-full overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={image.url}
                alt={image.caption || `Game image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {image.is_primary && (
                <Badge className="bg-primary text-xs">
                  <Star className="h-3 w-3 mr-1" /> Chính
                </Badge>
              )}
              <Badge className="bg-secondary text-secondary-foreground text-xs">
                {index + 1}/{images.length}
              </Badge>
            </div>
            
            {/* Action buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="p-2 flex flex-col gap-1">
              {image.caption && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {image.caption}
                </p>
              )}
              
              <div className="flex justify-between gap-1 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setActiveImageIndex(index)}
                >
                  Chi tiết
                </Button>
                
                {!image.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleMakePrimary(index)}
                  >
                    <Star className="h-3 w-3 mr-1" /> Đặt chính
                  </Button>
                )}
              </div>
              
              <div className="flex justify-between gap-1 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleMoveImage(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 flex-1 px-2"
                >
                  <Move className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleMoveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Add image buttons */}
        {images.length < maxImages && (
          <div className="w-[180px] h-[250px] border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 p-4">
            <Label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2 p-4 hover:bg-muted rounded-md transition-colors w-full text-center"
            >
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Tải ảnh lên</span>
              <span className="text-xs text-muted-foreground">
                {images.length}/{maxImages} ảnh
              </span>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </Label>
            
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => setShowUrlDialog(true)}
              disabled={isUploading}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Thêm từ URL
            </Button>
          </div>
        )}
      </div>
      
      {/* Loading indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang tải ảnh lên...</span>
        </div>
      )}
      
      {/* Image details dialog */}
      {activeImageIndex !== null && (
        <Dialog open={activeImageIndex !== null} onOpenChange={(open) => !open && setActiveImageIndex(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Chi tiết ảnh</DialogTitle>
              <DialogDescription>
                Chỉnh sửa thông tin chi tiết của ảnh
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                <img
                  src={images[activeImageIndex]?.url}
                  alt={images[activeImageIndex]?.caption || `Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-caption">Mô tả ảnh</Label>
                <Textarea
                  id="image-caption"
                  placeholder="Nhập mô tả cho ảnh này..."
                  value={images[activeImageIndex]?.caption || ""}
                  onChange={(e) => handleCaptionChange(activeImageIndex, e.target.value)}
                  className="resize-none h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-url">URL ảnh</Label>
                <Input
                  id="image-url"
                  value={images[activeImageIndex]?.url}
                  readOnly
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <Button
                variant="destructive"
                onClick={() => {
                  handleRemoveImage(activeImageIndex)
                  setActiveImageIndex(null)
                }}
                className="gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Xóa ảnh
              </Button>
              
              {!images[activeImageIndex]?.is_primary && (
                <Button
                  onClick={() => {
                    handleMakePrimary(activeImageIndex)
                    setActiveImageIndex(null)
                  }}
                  className="gap-1"
                >
                  <Star className="h-4 w-4" />
                  Đặt làm ảnh chính
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* URL Image Dialog */}
      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm ảnh từ URL</DialogTitle>
            <DialogDescription>
              Nhập URL của ảnh bạn muốn thêm vào
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url-input">URL ảnh</Label>
              <Input
                id="image-url-input"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            
            {urlInput && (
              <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                <img
                  src={urlInput}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUrlDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddUrlImage} disabled={!urlInput.trim()}>
              Thêm ảnh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 