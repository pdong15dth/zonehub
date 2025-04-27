import { GamesList } from "@/components/games/games-list"
import { GameFilters } from "@/components/games/game-filters"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Mock game data for creating links
const games = [
  { id: 1, title: "Cyberpunk Legends" },
  { id: 2, title: "Fantasy Kingdom" }
]

export default function GamesPage() {
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Games</h1>
                <p className="text-muted-foreground">Browse and download games from our community.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search games..." className="w-full pl-8 md:w-[300px]" />
                </div>
                <Button>Upload Game</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-1">
                <GameFilters />
              </div>
              <div className="md:col-span-3">
                <GamesList />
                
                {/* Temporary links to game detail pages */}
                <div className="mt-8 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Game chi tiết (Liên kết tạm thời)</h3>
                  <ul className="space-y-2">
                    {games.map(game => (
                      <li key={game.id}>
                        <Link 
                          href={`/games/${game.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {game.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
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
