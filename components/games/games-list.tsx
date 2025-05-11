"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

interface Game {
  id: string
  title: string
  description: string
  image: string
  genre: string[]
  platform: string[]
  rating: number
  downloads: number
  developer: string
  publisher: string
}

interface GamesListProps {
  initialData?: any
  className?: string
}

export function GamesList({ initialData, className }: GamesListProps) {
  const [games, setGames] = useState<Game[]>(initialData || [])
  const [isLoading, setIsLoading] = useState<boolean>(!initialData)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  
  // Get filter values from URL search params
  const query = searchParams.get("q") || ""
  const genre = searchParams.get("genre") || ""
  const platform = searchParams.get("platform") || ""
  const featured = searchParams.get("featured") === "true"
  
  useEffect(() => {
    async function fetchGames() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Build query string with filters
        const params = new URLSearchParams()
        if (query) params.append("query", query)
        if (genre) params.append("genre", genre)
        if (platform) params.append("platform", platform)
        if (featured) params.append("featured", "true")
        
        // Fetch games from API
        const response = await fetch(`/api/games?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("API response:", data);
        
        if (data.success && Array.isArray(data.games)) {
          setGames(data.games)
        } else {
          setError("Failed to load games")
          console.error("Invalid response format:", data)
        }
      } catch (err) {
        setError("An error occurred while fetching games")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGames()
  }, [query, genre, platform, featured])
  
  // Helper to get platform display name
  const getPlatformDisplayName = (platformKey: string) => {
    const platformMap: Record<string, string> = {
      'ps5': 'PlayStation 5',
      'ps4': 'PlayStation 4',
      'xboxsx': 'Xbox Series X/S',
      'xboxone': 'Xbox One',
      'pc': 'PC',
      'switch': 'Nintendo Switch',
      'mobile': 'Mobile',
    }
    
    return platformMap[platformKey] || platformKey
  }
  
  // Helper to get genre display name
  const getGenreDisplayName = (genreKey: string) => {
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
      'horror': 'Kinh dị',
    }
    
    return genreMap[genreKey] || genreKey
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải games...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    )
  }
  
  if (games.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p>Không tìm thấy game nào</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className || ""}`}>
      {games.map((game) => (
        <Card key={game.id} className="overflow-hidden flex flex-col">
          <div className="aspect-video relative">
            <Image 
              src={game.image || "/placeholder.svg"} 
              alt={game.title} 
              fill 
              className="object-cover" 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl line-clamp-1">
                <Link href={`/games/${game.id}`} className="hover:underline">
                  {game.title}
                </Link>
              </CardTitle>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm ml-1">{(game.rating || 0).toFixed(1)}</span>
              </div>
            </div>
            <CardDescription className="text-sm mt-1 line-clamp-2">{game.description || 'No description available'}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              {Array.isArray(game.genre) && game.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="outline">{getGenreDisplayName(g)}</Badge>
              ))}
              {Array.isArray(game.platform) && game.platform.slice(0, 2).map((p) => (
                <Badge key={p} variant="secondary">{getPlatformDisplayName(p)}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Developer: {game.developer || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">{(game.downloads || 0).toLocaleString()} downloads</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full gap-2">
              <Link href={`/games/${game.id}`}>
                <Download className="h-4 w-4" />
                Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
