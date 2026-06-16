"use client"

import { Globe, Moon, Sun, Bookmark, ListChecks, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
  user?: User | null
}

export default function Header({ user }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const isActive = (path: string) => pathname === path

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "ユーザー"
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href={user ? "/home" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">Food Atlas</h1>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Button variant={isActive("/home") ? "secondary" : "ghost"} size="sm" asChild data-testid="button-explore">
                <Link href="/home">
                  <Globe className="h-4 w-4 mr-2" />
                  探索
                </Link>
              </Button>
              <Button variant={isActive("/logs") ? "secondary" : "ghost"} size="sm" asChild data-testid="button-logs">
                <Link href="/logs">
                  <ListChecks className="h-4 w-4 mr-2" />
                  マイログ
                </Link>
              </Button>
              <Button variant={isActive("/meal-plans") ? "secondary" : "ghost"} size="sm" asChild data-testid="button-meal-plans">
                <Link href="/meal-plans">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  献立プラン
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild data-testid="button-map">
                <Link href="/map">
                  <Bookmark className="h-4 w-4 mr-2" />
                  世界地図
                </Link>
              </Button>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{displayName}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/home" data-testid="menu-item-home">ホーム</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logs" data-testid="menu-item-logs">マイログ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} data-testid="menu-item-signout" className="text-destructive">
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild data-testid="button-login">
                <Link href="/login">ログイン</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
