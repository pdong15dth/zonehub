"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { GameForm } from '../../create/_components/game-form'
import { toast } from '@/components/ui/use-toast'

interface GameParams {
  id: string;
}

export default function EditGamePage({ params }: { params: any }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params) as GameParams
  const gameId = unwrappedParams.id
  
  const router = useRouter()
  const [gameData, setGameData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setIsLoading(true)
        const supabase = createBrowserSupabaseClient()
        
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single()
        
        if (error) throw error
        
        if (!data) {
          throw new Error("Game không tồn tại")
        }
        
        setGameData(data)
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
        Chỉnh sửa thông tin game.
      </p>
      
      <GameForm initialData={gameData} />
    </div>
  )
} 