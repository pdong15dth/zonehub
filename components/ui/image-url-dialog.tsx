"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from 'lucide-react';

interface ImageUrlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

export function ImageUrlDialog({ isOpen, onClose, onInsert }: ImageUrlDialogProps) {
  const [url, setUrl] = useState("");
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const [isPreviewError, setIsPreviewError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isPreviewError) {
      onInsert(url);
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl("");
    setIsPreviewLoaded(false);
    setIsPreviewError(false);
    onClose();
  };

  const handleImageLoad = () => {
    setIsPreviewLoaded(true);
    setIsPreviewError(false);
  };

  const handleImageError = () => {
    setIsPreviewLoaded(false);
    setIsPreviewError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chèn hình ảnh từ URL</DialogTitle>
            <DialogDescription>
              Nhập URL của hình ảnh bạn muốn chèn vào bài viết
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="image-url" className="text-left">
                URL hình ảnh
              </Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
            
            {url && (
              <div className="mt-2">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Xem trước:
                </Label>
                <div className="relative border rounded-md aspect-video flex items-center justify-center bg-muted/30 overflow-hidden">
                  {!isPreviewLoaded && !isPreviewError && (
                    <div className="animate-pulse flex items-center justify-center h-full w-full">
                      <Image className="h-8 w-8 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  
                  {isPreviewError && (
                    <div className="text-destructive flex flex-col items-center justify-center">
                      <Image className="h-8 w-8 mb-2 text-destructive" />
                      <p className="text-sm">Không thể tải hình ảnh. Vui lòng kiểm tra URL.</p>
                    </div>
                  )}
                  
                  <img
                    src={url}
                    alt="Preview"
                    className={`w-full h-full object-contain ${isPreviewLoaded ? 'block' : 'hidden'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={!url || isPreviewError}
            >
              Chèn hình ảnh
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 