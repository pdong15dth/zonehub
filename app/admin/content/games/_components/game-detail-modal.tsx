"use client"

import { useState, useEffect } from "react"
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
import { Star, ChevronRight, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

interface GameDetailModalProps {
  isOpen: boolean
  onClose: () => void
  game: any
}

// Helper function to format dates
const formatDate = (date?: string | Date | null) => {
  if (!date) return null
  
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return null
  
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

// Helper function to display system requirements in a readable format
const parseSystemRequirements = (requirementsString: string | null) => {
  if (!requirementsString) return {}
  
  try {
    // Kiểm tra xem đã là JSON chưa
    if (requirementsString.startsWith('{') && requirementsString.endsWith('}')) {
      return JSON.parse(requirementsString)
    }
    
    // Nếu không phải JSON, xem như additional text
    return { additional: requirementsString }
  } catch {
    return { additional: requirementsString }
  }
}

// Helper function to get platform label
const getPlatformLabel = (platform: string) => {
  const platformMap: Record<string, string> = {
    pc: "PC",
    mac: "Mac",
    linux: "Linux",
    android: "Android",
    ios: "iOS",
    windows: "Windows"
  }
  return platformMap[platform] || platform
}

// Helper function to get requirement spec label
const getSpecLabel = (spec: string, platform: string) => {
  // PC spec labels
  if (platform === 'pc' || platform === 'windows' || platform === 'mac' || platform === 'linux') {
    const specMap: Record<string, string> = {
      os: "Hệ điều hành",
      processor: "Bộ xử lý",
      memory: "Bộ nhớ",
      graphics: "Card đồ họa",
      storage: "Dung lượng lưu trữ",
      directx: "DirectX",
      network: "Kết nối mạng"
    }
    return specMap[spec] || spec
  }
  
  // Mobile spec labels
  if (platform === 'android' || platform === 'ios') {
    const specMap: Record<string, string> = {
      os: "Phiên bản OS",
      processor: "Bộ xử lý",
      memory: "Bộ nhớ RAM",
      storage: "Dung lượng lưu trữ",
      screen: "Màn hình",
      network: "Kết nối mạng",
      device: "Thiết bị"
    }
    return specMap[spec] || spec
  }
  
  return spec
}

// Component to display a single system requirement section
const SystemRequirement = ({ 
  platform, 
  requirementData, 
  type 
}: { 
  platform: string, 
  requirementData: any, 
  type: 'min' | 'rec' 
}) => {
  if (!requirementData) return null;
  
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2">
        {type === 'min' ? 'Yêu cầu tối thiểu' : 'Yêu cầu đề xuất'}
      </h4>
      <div className="bg-muted/50 rounded-md p-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(requirementData).map(([key, value]) => {
            if (key === 'custom') return null;
            return (
              <div key={key} className="py-1 flex">
                <span className="font-medium min-w-[140px]">
                  {getSpecLabel(key, platform)}:
                </span>
                <span className="text-muted-foreground">
                  {value as string}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Custom fields */}
        {requirementData.custom && (
          <div className="border-t border-border/30 mt-2 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(requirementData.custom).map(([key, value]) => (
              <div key={key} className="py-1 flex">
                <span className="font-medium min-w-[140px]">
                  {key}:
                </span>
                <span className="text-muted-foreground">
                  {value as string}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component to display system requirements by platform
const SystemRequirements = ({ requirementsString }: { requirementsString: string | null }) => {
  const requirements = parseSystemRequirements(requirementsString);
  
  // Check if it's a plain text or old format
  if (typeof requirements === 'string' || !requirements || Object.keys(requirements).length === 0) {
    return (
      <div className="text-sm whitespace-pre-wrap text-muted-foreground">
        {requirementsString || 'Không có thông tin yêu cầu hệ thống'}
      </div>
    );
  }
  
  // Get platforms (excluding additional field)
  const platforms = Object.keys(requirements).filter(key => 
    key !== 'additional' && typeof requirements[key] === 'object'
  );
  
  return (
    <div className="space-y-6">
      {platforms.length > 0 ? (
        platforms.map(platform => (
          <div key={platform} className="border border-border/50 rounded-md p-4">
            <h3 className="font-semibold text-base mb-3 flex items-center">
              <div className="bg-primary/10 rounded-md w-6 h-6 flex items-center justify-center mr-2">
                {platform === 'windows' ? 
                  <i className="fab fa-windows"></i> :
                  platform === 'mac' ? 
                  <i className="fab fa-apple"></i> :
                  platform === 'linux' ? 
                  <i className="fab fa-linux"></i> :
                  platform === 'android' ? 
                  <i className="fab fa-android"></i> :
                  platform === 'ios' ? 
                  <i className="fab fa-apple"></i> :
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                }
              </div>
              {getPlatformLabel(platform)}
            </h3>
            
            {/* Min requirements */}
            {requirements[platform].min && (
              <SystemRequirement 
                platform={platform} 
                requirementData={requirements[platform].min} 
                type="min" 
              />
            )}
            
            {/* Recommended requirements */}
            {requirements[platform].rec && (
              <SystemRequirement 
                platform={platform} 
                requirementData={requirements[platform].rec} 
                type="rec" 
              />
            )}
          </div>
        ))
      ) : (
        <div className="text-sm text-muted-foreground">
          Không có thông tin chi tiết về yêu cầu hệ thống cho từng nền tảng.
        </div>
      )}
      
      {/* Additional requirements */}
      {requirements.additional && (
        <div className="mt-4">
          <h3 className="font-semibold text-base mb-2">Thông tin bổ sung</h3>
          <div className="text-sm whitespace-pre-wrap bg-muted/50 rounded-md p-3 text-muted-foreground">
            {requirements.additional}
          </div>
        </div>
      )}
    </div>
  );
};

export function GameDetailModal({ isOpen, onClose, game }: GameDetailModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("chi-tiet")
  
  const handleEdit = () => {
    router.push(`/admin/content/games/edit/${game?.id}`)
    onClose()
  }
  
  // Platform display
  const getPlatformLabels = (platforms: string[]) => {
    if (!platforms || !Array.isArray(platforms)) return [];
    
    const platformMap: Record<string, string> = {
      'ps5': 'PlayStation 5',
      'ps4': 'PlayStation 4',
      'xboxsx': 'Xbox Series X/S',
      'xboxone': 'Xbox One',
      'pc': 'PC',
      'switch': 'Nintendo Switch',
      'mobile': 'Mobile'
    }
    
    return platforms.map(p => platformMap[p] || p)
  }
  
  // Genre display
  const getGenreLabels = (genres: string[]) => {
    if (!genres || !Array.isArray(genres)) return [];
    
    const genreMap: Record<string, string> = {
      'action': 'Hành động',
      'adventure': 'Phiêu lưu',
      'rpg': 'Nhập vai',
      'shooter': 'Bắn súng',
      'strategy': 'Chiến thuật',
      'puzzle': 'Giải đố',
      'simulation': 'Mô phỏng',
      'sports': 'Thể thao',
      'racing': 'Đua xe',
      'horror': 'Kinh dị'
    }
    
    return genres.map(g => genreMap[g] || g)
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
          
          <TabsContent value="chi-tiet" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info - Left Column */}
              <div className="md:col-span-2 space-y-4">
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
                
                {(game?.trailer_url || game?.official_website) && (
                  <div className="space-y-2 border-t pt-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Liên kết</h3>
                    {game?.trailer_url && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Trailer:</span>
                        <a 
                          href={game.trailer_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          Xem trailer <ChevronRight size={14} />
                        </a>
                      </div>
                    )}
                    {game?.official_website && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Website chính thức:</span>
                        <a 
                          href={game.official_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          Truy cập website <ChevronRight size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Additional Info - Right Column */}
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
                    <Badge variant={game?.status === 'published' ? 'default' : 'secondary'}>
                      {game?.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </Badge>
                  </div>
                  
                  {game?.featured && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nổi bật</span>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/20">
                        Có
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 border-t pt-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Thời gian</h3>
                  <div className="text-sm">
                    <div className="flex justify-between items-center">
                      <span>Tạo lúc:</span>
                      <span>{formatDate(game?.created_at) || 'N/A'}</span>
                    </div>
                    {game?.updated_at && (
                      <div className="flex justify-between items-center">
                        <span>Cập nhật lúc:</span>
                        <span>{formatDate(game?.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {game?.image && (
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Ảnh bìa</h3>
                    <div className="aspect-video w-full rounded-md overflow-hidden bg-muted">
                      <img 
                        src={game.image} 
                        alt={game.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yeu-cau-he-thong" className="pt-4">
            <SystemRequirements requirementsString={game?.system_requirements} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button onClick={handleEdit} className="gap-1">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 