import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { NewsFeed } from "@/components/news-feed"
import { FeaturedGames } from "@/components/featured-games"
import { TrendingRepos } from "@/components/trending-repos"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthRedirect } from "@/components/providers/auth-redirect"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthRedirect />
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Welcome to ZoneHub</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The ultimate platform for gamers and developers to connect, share, and create together.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/games">
                  <Button>Explore Games</Button>
                </Link>
                <Link href="/source-code">
                  <Button variant="outline">Browse Source Code</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Latest News</h2>
              <NewsFeed />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Games</h2>
                <FeaturedGames />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">Trending Repositories</h2>
                <TrendingRepos />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZoneHub. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
