"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Star, GitFork, Download, Eye } from "lucide-react"
import Link from "next/link"

// Mock data repositories
const repositories = [
  {
    id: 1,
    title: "Enhanced UI Framework",
    description:
      "A modern UI framework for game development with support for multiple platforms and customizable themes.",
    language: "TypeScript",
    stars: 1245,
    forks: 324,
    views: 5678,
    downloads: 2345,
    author: "gamedev123",
    tags: ["UI", "Framework", "Cross-platform"],
  },
  {
    id: 2,
    title: "Minecraft Shaders Plus",
    description:
      "Advanced shader pack for Minecraft with RTX support, volumetric lighting, and realistic water effects.",
    language: "GLSL",
    stars: 876,
    forks: 152,
    views: 3421,
    downloads: 1876,
    author: "shadermaster",
    tags: ["Minecraft", "Shaders", "Graphics"],
  },
  {
    id: 3,
    title: "Unity Performance Tools",
    description:
      "Optimization tools for Unity game development including memory profiler, draw call reducer, and asset optimizer.",
    language: "C#",
    stars: 543,
    forks: 87,
    views: 2198,
    downloads: 987,
    author: "unitydev",
    tags: ["Unity", "Performance", "Optimization"],
  },
  {
    id: 4,
    title: "Procedural Terrain Generator",
    description: "Generate realistic terrains with biomes, rivers, and mountains using advanced noise algorithms.",
    language: "C++",
    stars: 789,
    forks: 134,
    views: 3245,
    downloads: 1432,
    author: "terrainmaster",
    tags: ["Procedural", "Terrain", "Generation"],
  },
  {
    id: 5,
    title: "Game Physics Engine",
    description:
      "Lightweight physics engine optimized for 2D and 3D games with collision detection and rigid body dynamics.",
    language: "C++",
    stars: 932,
    forks: 176,
    views: 4532,
    downloads: 2143,
    author: "physicsdev",
    tags: ["Physics", "Engine", "Collision"],
  },
  {
    id: 6,
    title: "AI Behavior Trees",
    description: "Implementation of behavior trees for game AI with visual editor and debugging tools.",
    language: "JavaScript",
    stars: 654,
    forks: 98,
    views: 2876,
    downloads: 1234,
    author: "aimaster",
    tags: ["AI", "Behavior Trees", "Game Logic"],
  },
]

// Memoized repository card for better performance
const RepositoryCard = memo(({ repo }: { repo: typeof repositories[0] }) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              <Link href={`/source-code/${repo.id}`} className="hover:underline">
                {repo.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              by{" "}
              <Link href={`/users/${repo.author}`} className="hover:underline">
                {repo.author}
              </Link>
            </CardDescription>
          </div>
          <Badge>{repo.language}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{repo.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{repo.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{repo.downloads}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" className="gap-1">
          <Code className="h-4 w-4" />
          View Code
        </Button>
        <Button className="gap-1">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
})
RepositoryCard.displayName = "RepositoryCard"

export function SourceCodeList() {
  const [visibleRepos, setVisibleRepos] = useState<typeof repositories>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleRepos(repositories)
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Early load indicator to reduce layout shift
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {visibleRepos.map((repo) => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
