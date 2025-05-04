"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  ChevronLeft,
  Save,
  Loader2,
  Star,
  Eye,
  Trash,
  ImagePlus,
} from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

interface Game {
  id: string
  title: string
  developer: string
  publisher: string
  release_date: string
  description: string | null
  content: string | null
  system_requirements: string | null
  trailer_url: string | null
  official_website: string | null
  platform: string[]
  genre: string[]
  rating: number
  downloads: number
  status: 'draft' | 'published'
  featured: boolean
  image: string | null
  created_by: string | null
  updated_by: string | null
  author_id: string | null
  created_at: string
  updated_at: string | null
}

interface MultiSelectProps {
  options: { value: string, label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder: string
}

// MultiSelect component for platforms and genres
const MultiSelect = ({ options, selected, onChange, placeholder }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="relative">
      <div 
        className="flex flex-wrap gap-1 p-2 border rounded-md cursor-pointer min-h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {selected.map(item => {
          const option = options.find(opt => opt.value === item)
          return (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {option?.label || item}
              <button 
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(item)
                }}
                aria-label={`Remove ${option?.label || item}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </Badge>
          )
        })}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-md p-1">
          {options.map(option => (
            <div
              key={option.value}
              className={`flex items-center gap-2 p-2 hover:bg-muted rounded-sm cursor-pointer ${
                selected.includes(option.value) ? 'bg-muted' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <Checkbox checked={selected.includes(option.value)} />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EditGamePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNewGame = id === 'create'

  const [isLoading, setIsLoading] = useState(!isNewGame)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  
  const [game, setGame] = useState<Partial<Game>>({
    title: '',
    developer: '',
    publisher: '',
    release_date: new Date().toLocaleDateString('en-GB'),
    description: '',
    content: '',
    system_requirements: '',
    trailer_url: '',
    official_website: '',
    platform: [],
    genre: [],
    rating: 0,
    downloads: 0,
    status: 'draft',
    featured: false,
    image: '/placeholder.svg',
  })

  const platformOptions = [
    { value: 'ps5', label: 'PlayStation 5' },
    { value: 'ps4', label: 'PlayStation 4' },
    { value: 'xboxsx', label: 'Xbox Series X/S' },
    { value: 'xboxone', label: 'Xbox One' },
    { value: 'pc', label: 'PC' },
    { value: 'switch', label: 'Nintendo Switch' },
    { value: 'mobile', label: 'Mobile' },
  ]

  const genreOptions = [
    { value: 'action', label: 'Hành động' },
    { value: 'adventure', label: 'Phiêu lưu' },
    { value: 'rpg', label: 'Nhập vai' },
    { value: 'shooter', label: 'Bắn súng' },
    { value: 'strategy', label: 'Chiến thuật' },
    { value: 'puzzle', label: 'Giải đố' },
    { value: 'simulation', label: 'Mô phỏng' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'racing', label: 'Đua xe' },
    { value: 'horror', label: 'Kinh dị' },
  ]

  // Fetch game data if editing an existing game
  useEffect(() => {
    if (!isNewGame) {
      const fetchGame = async () => {
        try {
          setIsLoading(true)
          const supabase = createBrowserSupabaseClient()
          
          const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', id)
            .single()
          
          if (error) throw error
          
          if (data) {
            setGame(data)
            toast({
              title: "Dữ liệu đã được tải",
              description: `Đã tải thông tin game "${data.title}" thành công`,
            })
          } else {
            toast({
              title: "Lỗi",
              description: "Không tìm thấy game",
              variant: "destructive",
            })
            router.push('/admin/content/games')
          }
        } catch (err: any) {
          console.error('Error fetching game:', err)
          toast({
            title: "Lỗi",
            description: err.message || "Đã xảy ra lỗi khi tải dữ liệu game",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchGame()
    }
  }, [id, isNewGame, router])

  const handleChange = (field: string, value: any) => {
    setGame(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredFields = ['title', 'developer', 'publisher', 'release_date']
    const missingFields = requiredFields.filter(field => !game[field as keyof typeof game])

    if (missingFields.length > 0) {
      toast({
        title: "Lỗi",
        description: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return false
    }

    if (!game.platform || game.platform.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một nền tảng",
        variant: "destructive",
      })
      return false
    }

    if (!game.genre || game.genre.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một thể loại",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSaving(true)
      const supabase = createBrowserSupabaseClient()

      // Get current user info for created_by/updated_by
      const { data: { user } } = await supabase.auth.getUser()
      
      if (isNewGame) {
        // Create new game
        const { data, error } = await supabase
          .from('games')
          .insert({
            ...game,
            created_by: user?.id,
            author_id: user?.id,
            created_at: new Date().toISOString(),
          })
          .select()
        
        if (error) throw error
        
        toast({
          title: "Thành công",
          description: `Game "${game.title}" đã được tạo thành công`,
        })
        
        // Redirect to the games list
        router.push('/admin/content/games')
      } else {
        // Update existing game
        const { error } = await supabase
          .from('games')
          .update({
            ...game,
            updated_by: user?.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
        
        if (error) throw error
        
        toast({
          title: "Thành công",
          description: `Game "${game.title}" đã được cập nhật thành công`,
        })
      }
    } catch (err: any) {
      console.error('Error saving game:', err)
      toast({
        title: "Lỗi",
        description: err.message || "Đã xảy ra lỗi khi lưu game",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa game này không?")) return
    
    try {
      setIsSaving(true)
      const supabase = createBrowserSupabaseClient()
      
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: "Thành công",
        description: `Game "${game.title}" đã được xóa thành công`,
      })
      
      router.push('/admin/content/games')
    } catch (err: any) {
      console.error('Error deleting game:', err)
      toast({
        title: "Lỗi",
        description: err.message || "Đã xảy ra lỗi khi xóa game",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/content/games')}
            className="mb-2"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{isNewGame ? "Thêm game mới" : "Chỉnh sửa game"}</h2>
          <p className="text-muted-foreground">
            {isNewGame 
              ? "Thêm game mới vào cơ sở dữ liệu" 
              : `Chỉnh sửa thông tin cho game "${game.title}"`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isNewGame && (
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="gap-1"
            >
              <Trash className="h-4 w-4" />
              Xóa
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="gap-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="technical">Thông tin kỹ thuật</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Thông tin chung về game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên game <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title"
                    value={game.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Nhập tên game..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="developer">Nhà phát triển <span className="text-destructive">*</span></Label>
                  <Input 
                    id="developer"
                    value={game.developer}
                    onChange={(e) => handleChange('developer', e.target.value)}
                    placeholder="Nhập tên nhà phát triển..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publisher">Nhà phát hành <span className="text-destructive">*</span></Label>
                  <Input 
                    id="publisher"
                    value={game.publisher}
                    onChange={(e) => handleChange('publisher', e.target.value)}
                    placeholder="Nhập tên nhà phát hành..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="release_date">Ngày phát hành <span className="text-destructive">*</span></Label>
                  <Input 
                    id="release_date"
                    value={game.release_date}
                    onChange={(e) => handleChange('release_date', e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description"
                  value={game.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Nhập mô tả ngắn gọn về game..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nền tảng <span className="text-destructive">*</span></Label>
                  <MultiSelect 
                    options={platformOptions}
                    selected={game.platform || []}
                    onChange={(selected) => handleChange('platform', selected)}
                    placeholder="Chọn nền tảng..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Thể loại <span className="text-destructive">*</span></Label>
                  <MultiSelect 
                    options={genreOptions}
                    selected={game.genre || []}
                    onChange={(selected) => handleChange('genre', selected)}
                    placeholder="Chọn thể loại..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Đánh giá</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={game.rating || 0}
                      onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                    />
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="downloads">Lượt tải</Label>
                  <Input 
                    id="downloads"
                    type="number"
                    min="0"
                    value={game.downloads || 0}
                    onChange={(e) => handleChange('downloads', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung chi tiết</CardTitle>
              <CardDescription>
                Thông tin chi tiết về game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung chi tiết</Label>
                <Textarea 
                  id="content"
                  value={game.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Nhập nội dung chi tiết về game..."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Ảnh bìa</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={game.image || '/placeholder.svg'}
                    alt={game.title}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <Input 
                      id="image"
                      value={game.image || ''}
                      onChange={(e) => handleChange('image', e.target.value)}
                      placeholder="Nhập URL ảnh..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Nhập URL ảnh hoặc sử dụng chức năng tải ảnh
                    </p>
                  </div>
                  <Button variant="outline" className="gap-1">
                    <ImagePlus className="h-4 w-4" />
                    Tải ảnh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin kỹ thuật</CardTitle>
              <CardDescription>
                Thông tin kỹ thuật và liên kết
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system_requirements">Yêu cầu hệ thống</Label>
                <Textarea 
                  id="system_requirements"
                  value={game.system_requirements || ''}
                  onChange={(e) => handleChange('system_requirements', e.target.value)}
                  placeholder="Nhập yêu cầu hệ thống của game..."
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trailer_url">Link trailer</Label>
                  <Input 
                    id="trailer_url"
                    value={game.trailer_url || ''}
                    onChange={(e) => handleChange('trailer_url', e.target.value)}
                    placeholder="Nhập URL trailer (YouTube)..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="official_website">Website chính thức</Label>
                  <Input 
                    id="official_website"
                    value={game.official_website || ''}
                    onChange={(e) => handleChange('official_website', e.target.value)}
                    placeholder="Nhập URL website chính thức..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
              <CardDescription>
                Cài đặt hiển thị và trạng thái
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={game.featured || false}
                    onCheckedChange={(checked) => handleChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Đánh dấu là game nổi bật</Label>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={game.status} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">
                Game với trạng thái "Đã xuất bản" sẽ hiển thị cho người dùng.
                <br />
                Game ở chế độ "Bản nháp" chỉ hiển thị cho quản trị viên.
              </p>
              {!isNewGame && (
                <div className="text-xs text-muted-foreground mt-4">
                  ID: {id}
                  <br />
                  Tạo lúc: {game.created_at && new Date(game.created_at).toLocaleString()}
                  <br />
                  {game.updated_at && `Cập nhật lúc: ${new Date(game.updated_at).toLocaleString()}`}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 