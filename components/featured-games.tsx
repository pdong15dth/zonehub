import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredGames = [
  {
    id: 1,
    title: "Stellar Odyssey",
    description: "An epic space adventure with stunning visuals",
    image: "/placeholder.svg",
    category: "Action RPG",
    platform: "PC, PlayStation 5",
    rating: 4.8,
    downloads: "250K+",
  },
  {
    id: 2,
    title: "Forest Guardians",
    description: "Protect the mystical forest from corruption",
    image: "/placeholder.svg",
    category: "Adventure",
    platform: "All Platforms",
    rating: 4.5,
    downloads: "120K+",
  },
  {
    id: 3,
    title: "Pixel Warriors",
    description: "Retro-style battle royale with modern mechanics",
    image: "/placeholder.svg",
    category: "Battle Royale",
    platform: "Mobile, PC",
    rating: 4.2,
    downloads: "500K+",
  },
]

export function FeaturedGames() {
  return (
    <div className="space-y-4">
      {featuredGames.map((game) => (
        <Card key={game.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">
                <Link href={`/games/${game.id}`} className="hover:underline">
                  {game.title}
                </Link>
              </CardTitle>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm ml-1">{game.rating}</span>
              </div>
            </div>
            <CardDescription className="text-xs mt-1">{game.description}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-xs">
                {game.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{game.platform}</span>
            </div>
            <Button size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:inline-block">Download</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
