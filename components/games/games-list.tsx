import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const games = [
  {
    id: 1,
    title: "Stellar Odyssey",
    description:
      "An epic space adventure with stunning visuals and an immersive storyline that will keep you engaged for hours.",
    image: "/placeholder.svg",
    category: "Action RPG",
    platform: "PC, PlayStation 5",
    rating: 4.8,
    downloads: "250K+",
    developer: "Cosmic Studios",
  },
  {
    id: 2,
    title: "Forest Guardians",
    description: "Protect the mystical forest from corruption in this beautiful adventure game with puzzle elements.",
    image: "/placeholder.svg",
    category: "Adventure",
    platform: "All Platforms",
    rating: 4.5,
    downloads: "120K+",
    developer: "Green Leaf Games",
  },
  {
    id: 3,
    title: "Pixel Warriors",
    description:
      "Retro-style battle royale with modern mechanics. Compete against 100 players in this fast-paced action game.",
    image: "/placeholder.svg",
    category: "Battle Royale",
    platform: "Mobile, PC",
    rating: 4.2,
    downloads: "500K+",
    developer: "Retro Pixel Studios",
  },
  {
    id: 4,
    title: "Neon Racer",
    description: "High-speed racing in a cyberpunk world with customizable vehicles and challenging tracks.",
    image: "/placeholder.svg",
    category: "Racing",
    platform: "PC, Xbox Series X",
    rating: 4.6,
    downloads: "180K+",
    developer: "Velocity Games",
  },
  {
    id: 5,
    title: "Dungeon Delvers",
    description: "Cooperative dungeon crawler with procedurally generated levels and unique character classes.",
    image: "/placeholder.svg",
    category: "Roguelike",
    platform: "PC, Nintendo Switch",
    rating: 4.7,
    downloads: "210K+",
    developer: "Crypt Keepers",
  },
  {
    id: 6,
    title: "Strategy Empire",
    description: "Build your civilization from the ground up in this complex strategy game with diplomacy and warfare.",
    image: "/placeholder.svg",
    category: "Strategy",
    platform: "PC",
    rating: 4.4,
    downloads: "150K+",
    developer: "Tactical Minds",
  },
]

export function GamesList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <Card key={game.id} className="overflow-hidden flex flex-col">
          <div className="aspect-video relative">
            <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">
                <Link href={`/games/${game.id}`} className="hover:underline">
                  {game.title}
                </Link>
              </CardTitle>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm ml-1">{game.rating}</span>
              </div>
            </div>
            <CardDescription className="text-sm mt-1">{game.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{game.category}</Badge>
              <Badge variant="secondary">{game.platform}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Developer: {game.developer}</p>
            <p className="text-sm text-muted-foreground">{game.downloads} downloads</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
