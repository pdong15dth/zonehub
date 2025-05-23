import { Suspense } from "react"
import { SourceCodeList } from "@/components/source-code/source-code-list"
import { SourceCodeFilters } from "@/components/source-code/source-code-filters"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Loading component for source code list
function SourceCodeListSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3).fill(0).map((_, i) => (
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

export const metadata = {
  title: 'Source Code - ZoneHub',
  description: 'Browse and download source code, mods, plugins, and mini-games on ZoneHub.'
}

export default function SourceCodePage() {
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
                <h1 className="text-3xl font-bold tracking-tight">Source Code</h1>
                <p className="text-muted-foreground">Browse and download source code, mods, plugins, and mini-games.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search repositories..." className="w-full pl-8 md:w-[300px]" />
                </div>
                <Button>Upload Code</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="md:col-span-1">
                <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-md"></div>}>
                  <SourceCodeFilters />
                </Suspense>
              </div>
              <div className="md:col-span-3">
                <Suspense fallback={<SourceCodeListSkeleton />}>
                  <SourceCodeList />
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
