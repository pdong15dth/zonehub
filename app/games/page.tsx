"use client"

import { useState } from "react"
import { GamesList } from "@/components/games/games-list"
import { GameFilters } from "@/components/games/game-filters"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function GamesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams)
    
    // Update or remove the 'q' parameter based on searchQuery
    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }
    
    // Update the URL with the new search parameters
    router.push(`${pathname}?${params.toString()}`)
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Games</h1>
                <p className="text-muted-foreground">Browse and download games from our community.</p>
              </div>
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearch} className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search games..." 
                    className="w-full pl-8 md:w-[300px]" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-full"
                  >
                    Search
                  </Button>
                </form>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-1">
                <GameFilters />
              </div>
              <div className="md:col-span-3">
                <GamesList />
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
