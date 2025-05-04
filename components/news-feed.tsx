import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const newsItems = [
  {
    id: 1,
    slug: "cyberpunk-2077-dlc-announced",
    title: "New Cyberpunk 2077 DLC Announced",
    description:
      "CD Projekt Red has announced a new expansion for Cyberpunk 2077, bringing new storylines and gameplay features.",
    category: "PC",
    genre: "RPG",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    date: "2 hours ago",
    likes: 245,
    comments: 57,
  },
  {
    id: 2,
    slug: "playstation-6-rumors-surface",
    title: "PlayStation 6 Rumors Surface",
    description:
      "Industry insiders have begun sharing details about Sony's next-generation console, expected to launch in 2026.",
    category: "PlayStation",
    genre: "Hardware",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    date: "5 hours ago",
    likes: 189,
    comments: 42,
  },
  {
    id: 3,
    slug: "hollow-knight-silksong-release-date",
    title: "Indie Game 'Hollow Knight: Silksong' Finally Gets Release Date",
    description:
      "Team Cherry has announced that the highly anticipated sequel to Hollow Knight will be released next month.",
    category: "Nintendo Switch",
    genre: "Metroidvania",
    author: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
      initials: "MJ",
    },
    date: "1 day ago",
    likes: 312,
    comments: 89,
  },
]

export function NewsFeed() {
  return (
    <div className="space-y-6">
      {newsItems.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={item.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{item.author.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.author.name}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant="secondary">{item.genre}</Badge>
              </div>
            </div>
            <CardTitle>
              <Link href={`/news/${item.slug}/${item.id}`} className="hover:underline">
                {item.title}
              </Link>
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">News Image</span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{item.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{item.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
