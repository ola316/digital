"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GraduationCap, Menu, LogIn } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAdminAuth } from "@/components/admin/auth"

const NAV_HEIGHT = "h-20"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { isAuthed } = useAdminAuth()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/70 dark:supports-[backdrop-filter]:bg-gray-900/50",
        NAV_HEIGHT,
      )}
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        <Link href="/" className="flex items-center gap-3" aria-label="Oakwood Academy Home">
          <span className="inline-flex items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 p-2">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg tracking-tight">Nowzer School</span>
            <span className="text-xs text-muted-foreground">Inspiring Excellence, Nurturing Character</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-700 dark:hover:text-emerald-300",
                pathname === item.href ? "text-emerald-600 dark:text-emerald-300" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-900/30 bg-transparent"
            onClick={() => router.push(isAuthed ? "/admin" : "/admin/login")}
            aria-label={isAuthed ? "Go to admin dashboard" : "Admin login"}
          >
            <LogIn className="h-4 w-4 mr-2" />
            {isAuthed ? "Dashboard" : "Admin"}
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation Menu</SheetTitle>
                <SheetDescription className="text-left">Access all pages and admin functions</SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-2 py-2 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="outline"
                  className="mt-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-900/30 bg-transparent"
                  onClick={() => {
                    router.push(isAuthed ? "/admin" : "/admin/login")
                    setOpen(false)
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isAuthed ? "Dashboard" : "Admin"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
