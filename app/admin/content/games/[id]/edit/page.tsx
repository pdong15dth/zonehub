"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { GameForm } from '../../create/_components/game-form'
import { toast } from '@/components/ui/use-toast'

export default function EditGamePage() {
  const params = useParams();
  const gameId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
  console.log("Game ID to edit:", gameId);
  
  const router = useRouter()
  const [gameData, setGameData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) {
        setError("Không tìm thấy ID game");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true)
        setError(null)
        
        console.log(`Fetching game with ID: ${gameId}`);
        
        // Fetch from our API endpoint instead of directly from Supabase
        const response = await fetch(`/api/games/${gameId}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error("API error response:", errorData);
          throw new Error(errorData.error || "Không thể tải thông tin game")
        }
        
        const data = await response.json()
        
        if (!data) {
          throw new Error("Game không tồn tại")
        }
        
        // Ensure gameImages is formatted correctly
        if (!data.gameImages || !Array.isArray(data.gameImages)) {
          // Initialize empty array or create from image field if exists
          data.gameImages = data.image ? [{
            id: 'img_0',
            url: data.image,
            caption: null,
            is_primary: true,
            display_order: 0
          }] : []
        }
        
        console.log("Loaded game data:", data)
        setGameData(data)
        
        toast({
          title: "Đã tải thông tin",
          description: `Đã tải thông tin game "${data.title}" thành công`,
          duration: 3000,
        })
      } catch (err: any) {
        console.error('Error fetching game:', err)
        setError(err.message || "Đã xảy ra lỗi khi tải thông tin game")
        toast({
          title: "Lỗi",
          description: err.message || "Đã xảy ra lỗi khi tải thông tin game",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGame()
  }, [gameId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Đang tải thông tin game...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-destructive mb-4 text-center">
          <p className="font-semibold">Lỗi khi tải thông tin game</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button asChild>
          <Link href="/admin/content/games">
            Quay lại danh sách game
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex items-center space-x-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="h-8"
        >
          <Link href="/admin/content/games">
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span>Quay lại</span>
          </Link>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-3">Chỉnh sửa game</h1>
      <p className="text-muted-foreground mb-6">
        Chỉnh sửa thông tin game: {gameData?.title}
      </p>
      
      <GameForm initialData={gameData} />
    </div>
  )
} 