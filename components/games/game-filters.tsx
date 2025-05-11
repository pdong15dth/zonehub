"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function GameFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Get current filters from URL
  const currentGenre = searchParams.get('genre') || ''
  const currentPlatform = searchParams.get('platform') || ''
  const currentFeatured = searchParams.get('featured') === 'true'
  
  // Local state for filters
  const [platform, setPlatform] = useState(currentPlatform)
  const [genre, setGenre] = useState(currentGenre)
  const [featured, setFeatured] = useState(currentFeatured)
  
  // Update local state when URL params change
  useEffect(() => {
    setPlatform(currentPlatform)
    setGenre(currentGenre)
    setFeatured(currentFeatured)
  }, [currentPlatform, currentGenre, currentFeatured])
  
  // Handle filter application
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update or remove parameters based on filter values
    if (platform) {
      params.set('platform', platform)
    } else {
      params.delete('platform')
    }
    
    if (genre) {
      params.set('genre', genre)
    } else {
      params.delete('genre')
    }
    
    if (featured) {
      params.set('featured', 'true')
    } else {
      params.delete('featured')
    }
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`)
  }
  
  // Reset all filters
  const resetFilters = () => {
    setPlatform('')
    setGenre('')
    setFeatured(false)
    
    // Keep only search query if present
    const query = searchParams.get('q')
    const params = new URLSearchParams()
    if (query) {
      params.set('q', query)
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Bộ lọc</h3>
        <Accordion type="multiple" defaultValue={["platforms", "genres", "featured"]}>
          <AccordionItem value="platforms">
            <AccordionTrigger>Nền tảng</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pc" 
                    checked={platform === 'pc'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'pc' : '')}
                  />
                  <Label htmlFor="pc">PC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ps5" 
                    checked={platform === 'ps5'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'ps5' : '')}
                  />
                  <Label htmlFor="ps5">PlayStation 5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ps4" 
                    checked={platform === 'ps4'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'ps4' : '')}
                  />
                  <Label htmlFor="ps4">PlayStation 4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="xboxsx" 
                    checked={platform === 'xboxsx'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'xboxsx' : '')}
                  />
                  <Label htmlFor="xboxsx">Xbox Series X/S</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="xboxone" 
                    checked={platform === 'xboxone'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'xboxone' : '')}
                  />
                  <Label htmlFor="xboxone">Xbox One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="switch" 
                    checked={platform === 'switch'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'switch' : '')}
                  />
                  <Label htmlFor="switch">Nintendo Switch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="mobile" 
                    checked={platform === 'mobile'}
                    onCheckedChange={(checked) => setPlatform(checked ? 'mobile' : '')}
                  />
                  <Label htmlFor="mobile">Mobile</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="genres">
            <AccordionTrigger>Thể loại</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="action" 
                    checked={genre === 'action'}
                    onCheckedChange={(checked) => setGenre(checked ? 'action' : '')}
                  />
                  <Label htmlFor="action">Hành động</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="adventure" 
                    checked={genre === 'adventure'}
                    onCheckedChange={(checked) => setGenre(checked ? 'adventure' : '')}
                  />
                  <Label htmlFor="adventure">Phiêu lưu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rpg" 
                    checked={genre === 'rpg'}
                    onCheckedChange={(checked) => setGenre(checked ? 'rpg' : '')}
                  />
                  <Label htmlFor="rpg">Nhập vai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="shooter" 
                    checked={genre === 'shooter'}
                    onCheckedChange={(checked) => setGenre(checked ? 'shooter' : '')}
                  />
                  <Label htmlFor="shooter">Bắn súng</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="strategy" 
                    checked={genre === 'strategy'}
                    onCheckedChange={(checked) => setGenre(checked ? 'strategy' : '')}
                  />
                  <Label htmlFor="strategy">Chiến thuật</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="puzzle" 
                    checked={genre === 'puzzle'}
                    onCheckedChange={(checked) => setGenre(checked ? 'puzzle' : '')}
                  />
                  <Label htmlFor="puzzle">Giải đố</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="racing" 
                    checked={genre === 'racing'}
                    onCheckedChange={(checked) => setGenre(checked ? 'racing' : '')}
                  />
                  <Label htmlFor="racing">Đua xe</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="featured">
            <AccordionTrigger>Đặc biệt</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(!!checked)}
                />
                <Label htmlFor="featured">Game nổi bật</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">Áp dụng</Button>
        <Button onClick={resetFilters} variant="outline" className="flex-1">
          Đặt lại
        </Button>
      </div>
    </div>
  )
}
