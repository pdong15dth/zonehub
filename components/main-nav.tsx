"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GamepadIcon as GameController, Code, Newspaper, Home } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/news",
      label: "News",
      icon: Newspaper,
      active: pathname === "/news",
    },
    {
      href: "/games",
      label: "Games",
      icon: GameController,
      active: pathname === "/games",
    },
    {
      href: "/source-code",
      label: "Source Code",
      icon: Code,
      active: pathname === "/source-code",
    },
  ]

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <GameController className="h-6 w-6" />
        <span className="font-bold inline-block">ZoneHub</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" size="icon" className="md:hidden">
        <GameController className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  )
}
