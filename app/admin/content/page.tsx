import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Newspaper, GamepadIcon as GameController, Code } from "lucide-react"

export default function ContentManagement() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage all content across the ZoneHub platform.</p>
      </div>

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="source-code">Source Code</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">News Articles</h2>
            <Button>
              <Newspaper className="mr-2 h-4 w-4" />
              Add New Article
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>News Management</CardTitle>
              <CardDescription>Create, edit, and manage news articles across different categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Gaming News</CardTitle>
                    <CardDescription>Latest updates from the gaming industry</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">42 articles</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Hardware News</CardTitle>
                    <CardDescription>Updates on gaming hardware and technology</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">28 articles</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Developer News</CardTitle>
                    <CardDescription>News for game developers and creators</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">35 articles</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="games" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Games</h2>
            <Button>
              <GameController className="mr-2 h-4 w-4" />
              Add New Game
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Games Management</CardTitle>
              <CardDescription>Manage games, downloads, and related content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">PC Games</CardTitle>
                    <CardDescription>Games for Windows, Mac, and Linux</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">1,245 games</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Console Games</CardTitle>
                    <CardDescription>Games for PlayStation, Xbox, and Nintendo</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">876 games</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Mobile Games</CardTitle>
                    <CardDescription>Games for iOS and Android devices</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">713 games</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="source-code" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Source Code</h2>
            <Button>
              <Code className="mr-2 h-4 w-4" />
              Add New Repository
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Source Code Management</CardTitle>
              <CardDescription>Manage source code repositories, mods, and plugins.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Game Mods</CardTitle>
                    <CardDescription>Modifications for popular games</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">2,134 repositories</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Plugins</CardTitle>
                    <CardDescription>Extensions for game engines and tools</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">1,567 repositories</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Mini-Games</CardTitle>
                    <CardDescription>Small, self-contained game projects</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">1,020 repositories</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
