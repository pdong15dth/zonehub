"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GamepadIcon as GameController, Code, Newspaper, Home } from "lucide-react"
import { useCallback, memo } from "react"

const NavigationLink = memo(({ href, label, active }: { href: string, label: string, active: boolean }) => {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "flex items-center text-sm font-medium transition-colors hover:text-primary",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  )
})
NavigationLink.displayName = "NavigationLink"

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
      active: pathname === "/news" || pathname.startsWith("/news/"),
    },
    {
      href: "/games",
      label: "Games",
      icon: GameController,
      active: pathname === "/games" || pathname.startsWith("/games/"),
    },
    {
      href: "/source-code",
      label: "Source Code",
      icon: Code,
      active: pathname === "/source-code" || pathname.startsWith("/source-code/"),
    },
  ]

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" prefetch={true} className="flex items-center space-x-2">
        <GameController className="h-6 w-6" />
        <span className="font-bold inline-block">ZoneHub</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        {routes.map((route) => (
          <NavigationLink
            key={route.href}
            href={route.href}
            label={route.label}
            active={route.active}
          />
        ))}
      </nav>
      <Button variant="outline" size="icon" className="md:hidden">
        <GameController className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  )
}
