import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Code, Download, Eye, GitFork, Star } from "lucide-react"

// Mock data - in a real app, fetch this from an API or database
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
    readme: "# Enhanced UI Framework\n\nA modern UI framework for game development with support for multiple platforms and customizable themes.\n\n## Features\n\n- Responsive design for multiple screen sizes\n- Customizable themes and styling\n- Built-in animations and transitions\n- Cross-platform compatibility\n- Optimized for performance\n\n## Installation\n\n```bash\nnpm install enhanced-ui-framework\n```\n\n## Quick Start\n\n```typescript\nimport { UIFramework } from 'enhanced-ui-framework';\n\nconst ui = new UIFramework();\nui.initialize();\n```\n\n## Documentation\n\nFor complete documentation, visit our [documentation site](https://docs.example.com).",
    code: "// Example component from the Enhanced UI Framework\n\nexport class UIButton {\n  private element: HTMLElement;\n  private text: string;\n  private onClick: () => void;\n\n  constructor(text: string, onClick: () => void) {\n    this.text = text;\n    this.onClick = onClick;\n    this.element = document.createElement('button');\n    this.element.textContent = text;\n    this.element.addEventListener('click', this.onClick);\n  }\n\n  public render(container: HTMLElement): void {\n    container.appendChild(this.element);\n  }\n\n  public setTheme(theme: 'light' | 'dark'): void {\n    this.element.classList.remove('light', 'dark');\n    this.element.classList.add(theme);\n  }\n\n  public disable(): void {\n    this.element.setAttribute('disabled', 'true');\n  }\n\n  public enable(): void {\n    this.element.removeAttribute('disabled');\n  }\n}",
    createdAt: "2023-08-15",
    updatedAt: "2024-01-20",
    license: "MIT",
    dependencies: ["react", "three.js", "gsap"],
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
    readme: "# Minecraft Shaders Plus\n\nAdvanced shader pack for Minecraft with RTX support, volumetric lighting, and realistic water effects.\n\n## Features\n\n- RTX support for compatible GPUs\n- Volumetric lighting and fog\n- Realistic water simulation\n- Dynamic shadows\n- Ambient occlusion\n- Screen space reflections\n\n## Installation\n\n1. Install OptiFine or Iris Shaders\n2. Download the shader pack\n3. Place in your Minecraft shaders folder\n4. Select the shader in-game\n\n## Requirements\n\n- Minecraft 1.16+\n- Compatible GPU (RTX features require NVIDIA RTX series)\n- 4GB+ VRAM recommended\n\n## Screenshots\n\n[View Screenshots](https://screenshots.example.com)",
    code: "// Fragment shader example for water rendering\n\n#version 120\n\nuniform sampler2D texture;\nuniform sampler2D lightmap;\nuniform vec3 sunPosition;\nuniform float rainStrength;\n\nvarying vec2 texcoord;\nvarying vec2 lmcoord;\nvarying vec3 normal;\n\nvoid main() {\n  // Basic texture sampling\n  vec4 color = texture2D(texture, texcoord);\n  \n  // Apply lightmap\n  vec3 lightmapColor = texture2D(lightmap, lmcoord).rgb;\n  \n  // Calculate sun reflection\n  vec3 sunDir = normalize(sunPosition);\n  float sunReflection = max(0.0, dot(reflect(normalize(normal), vec3(0.0, 1.0, 0.0)), sunDir));\n  \n  // Apply water effects\n  if (sunReflection > 0.95) {\n    // Add specular highlight\n    color.rgb += vec3(0.5, 0.5, 0.7) * pow(sunReflection, 128.0) * (1.0 - rainStrength);\n  }\n  \n  // Apply lighting\n  gl_FragColor = vec4(color.rgb * lightmapColor, color.a);\n}",
    createdAt: "2023-10-05",
    updatedAt: "2024-02-10",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["OptiFine/Iris Shaders", "Minecraft 1.16+"],
  },
]

// This allows Next.js to prerender pages at build time
export function generateStaticParams() {
  return repositories.map(repo => ({
    id: repo.id.toString()
  }))
}

// Generate metadata for each page
export function generateMetadata({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const repository = repositories.find(repo => repo.id === id)
  
  if (!repository) {
    return {
      title: 'Repository Not Found',
      description: 'The requested source code repository could not be found.'
    }
  }

  return {
    title: `${repository.title} - ZoneHub Source Code`,
    description: repository.description,
  }
}

// Separate component for repository details
function RepositoryDetailsHeader({ repository }: { repository: typeof repositories[0] }) {
  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href="/source-code">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to source code
        </Link>
      </Button>
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{repository.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              by{" "}
              <Link href={`/profile/${repository.author}`} className="hover:underline">
                {repository.author}
              </Link>
            </p>
            <Badge>{repository.language}</Badge>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-1">
            <Star className="h-4 w-4" />
            Star
          </Button>
          <Button variant="outline" className="gap-1">
            <GitFork className="h-4 w-4" />
            Fork
          </Button>
          <Button className="gap-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </>
  )
}

// Separate component for code content
function CodeContent({ repository }: { repository: typeof repositories[0] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{repository.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {repository.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Lazy-loaded tabs content
function CodeTabs({ repository }: { repository: typeof repositories[0] }) {
  return (
    <Tabs defaultValue="readme">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="readme">README</TabsTrigger>
        <TabsTrigger value="code">Code Sample</TabsTrigger>
      </TabsList>
      <TabsContent value="readme" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm">{repository.readme}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="code" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">{repository.code}</code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Repository sidebar info
function RepositorySidebar({ repository }: { repository: typeof repositories[0] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Repository Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Stars</span>
              <span className="font-medium flex items-center gap-1">
                <Star className="h-4 w-4" />
                {repository.stars}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Forks</span>
              <span className="font-medium flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                {repository.forks}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Views</span>
              <span className="font-medium flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {repository.views}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Downloads</span>
              <span className="font-medium flex items-center gap-1">
                <Download className="h-4 w-4" />
                {repository.downloads}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
            <p>{repository.createdAt}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
            <p>{repository.updatedAt}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">License</h4>
            <p>{repository.license}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Dependencies</h4>
            <ul className="list-disc list-inside">
              {repository.dependencies.map((dep) => (
                <li key={dep}>{dep}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SourceCodePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const repository = repositories.find(repo => repo.id === id)
  
  if (!repository) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <RepositoryDetailsHeader repository={repository} />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <CodeContent repository={repository} />
                
                <Suspense fallback={<div className="h-48 rounded-md bg-muted animate-pulse"></div>}>
                  <CodeTabs repository={repository} />
                </Suspense>
              </div>

              <div>
                <Suspense fallback={<div className="h-96 rounded-md bg-muted animate-pulse"></div>}>
                  <RepositorySidebar repository={repository} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZoneHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 