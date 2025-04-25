import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Star, GitFork } from "lucide-react"
import Link from "next/link"

const trendingRepos = [
  {
    id: 1,
    title: "Enhanced UI Framework",
    description: "A modern UI framework for game development",
    language: "TypeScript",
    stars: 1245,
    forks: 324,
    author: "gamedev123",
  },
  {
    id: 2,
    title: "Minecraft Shaders Plus",
    description: "Advanced shader pack for Minecraft with RTX support",
    language: "GLSL",
    stars: 876,
    forks: 152,
    author: "shadermaster",
  },
  {
    id: 3,
    title: "Unity Performance Tools",
    description: "Optimization tools for Unity game development",
    language: "C#",
    stars: 543,
    forks: 87,
    author: "unitydev",
  },
]

export function TrendingRepos() {
  return (
    <div className="space-y-4">
      {trendingRepos.map((repo) => (
        <Card key={repo.id}>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">
                <Link href={`/source-code/${repo.id}`} className="hover:underline">
                  {repo.title}
                </Link>
              </CardTitle>
              <Badge>{repo.language}</Badge>
            </div>
            <CardDescription className="text-xs mt-1">{repo.description}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{repo.forks}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="gap-1">
              <Code className="h-4 w-4" />
              <span>View Code</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
