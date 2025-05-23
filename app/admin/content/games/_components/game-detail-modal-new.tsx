"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageGallery } from "@/components/games/image-gallery"

interface GameDetailModalProps {
  isOpen: boolean
  onClose: () => void
  game: any
}

export function GameDetailModal({ isOpen, onClose, game }: GameDetailModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("chi-tiet")
  
  const getPlatformLabels = (platforms: string[]) => {
    const platformMap: Record<string, string> = {
      'ps5': 'PlayStation 5',
      'ps4': 'PlayStation 4',
      'xboxsx': 'Xbox Series X/S',
      'xboxone': 'Xbox One',
      'pc': 'PC',
      'switch': 'Nintendo Switch',
      'mobile': 'Mobile',
    }
    
    return platforms.map(p => platformMap[p] || p)
  }
  
  const getGenreLabels = (genres: string[]) => {
    const genreMap: Record<string, string> = {
      'action': 'Hành động',
      'adventure': 'Phiêu lưu',
      'rpg': 'Nhập vai',
      'strategy': 'Chiến thuật',
      'simulation': 'Mô phỏng',
      'sports': 'Thể thao',
      'racing': 'Đua xe',
      'puzzle': 'Giải đố',
      'shooter': 'Bắn súng',
    }
    
    return genres.map(g => genreMap[g] || g)
  }
  
  // Kiểm tra nếu có gameImages hoặc images trong game
  const hasMultipleImages = game?.gameImages?.length > 0 || (game?.images && game?.images.length > 0)
  
  // Chuẩn bị dữ liệu hình ảnh cho gallery
  const prepareImages = () => {
    if (game?.gameImages?.length > 0) {
      return game.gameImages
    } else if (game?.images?.length > 0) {
      return game.images.map((url: string) => ({ url }))
    } else if (game?.image) {
      return [{ url: game.image }]
    }
    return [{ url: '/placeholder.svg' }]
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <img 
              src={game?.image || '/placeholder.svg'} 
              alt={game?.title} 
              className="w-10 h-10 rounded object-cover" 
            />
            <span>{game?.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2 w-full sm:w-[400px]">
            <TabsTrigger value="chi-tiet">Chi tiết</TabsTrigger>
            <TabsTrigger value="yeu-cau-he-thong">Yêu cầu hệ thống</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chi-tiet" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info - Left Column */}
              <div className="md:col-span-2 space-y-4">
                {/* Game Images Gallery */}
                {hasMultipleImages && (
                  <div className="mb-4">
                    <ImageGallery 
                      images={prepareImages()}
                      aspectRatio="video"
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Mô tả</h3>
                  <p className="text-sm">{game?.description || 'Không có mô tả'}</p>
                </div>
                
                {game?.content && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Nội dung chi tiết</h3>
                    <div className="text-sm whitespace-pre-wrap">{game?.content}</div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 pt-1">
                  {game?.platform && Array.isArray(game.platform) && game.platform.map((platform: string) => (
                    <Badge key={platform} variant="outline">
                      {getPlatformLabels([platform])[0]}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 pt-1">
                  {game?.genre && Array.isArray(game.genre) && game.genre.map((genre: string) => (
                    <Badge key={genre} variant="secondary">
                      {getGenreLabels([genre])[0]}
                    </Badge>
                  ))}
                </div>
                
                {/* Links panel */}
                {(game?.trailer_url || game?.official_website) && (
                  <div className="space-y-2 mt-4 border-t pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Liên kết</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.trailer_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(game.trailer_url, '_blank')}>
                          Xem trailer
                        </Button>
                      )}
                      {game.official_website && (
                        <Button size="sm" variant="outline" onClick={() => window.open(game.official_website, '_blank')}>
                          Website chính thức
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Side Info - Right Column */}
              <div className="space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nhà phát triển</span>
                    <span className="font-medium">{game?.developer || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nhà phát hành</span>
                    <span className="font-medium">{game?.publisher || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ngày phát hành</span>
                    <span className="font-medium">{game?.release_date || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Đánh giá</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{game?.rating || '0'}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lượt tải</span>
                    <span className="font-medium">{game?.downloads || '0'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trạng thái</span>
                    <Badge variant={game?.status === 'published' ? 'default' : 'outline'}>
                      {game?.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </Badge>
                  </div>
                  
                  {game?.featured && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nổi bật</span>
                      <Badge variant="secondary">Có</Badge>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => router.push(`/admin/content/games/${game?.id}/edit`)}
                    className="w-full"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa game
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yeu-cau-he-thong" className="mt-4">
            {game?.system_requirements ? (
              <div className="whitespace-pre-wrap text-sm">
                {game.system_requirements}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Không có thông tin về yêu cầu hệ thống
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 