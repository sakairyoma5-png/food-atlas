import { Globe, Moon, Sun, Bookmark, MapPin, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import UserMenu from "@/components/UserMenu";

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    username: string;
    email?: string;
    avatarUrl?: string;
  };
}

export default function Header({ isAuthenticated = false, user }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [location] = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">
              Food Atlas
            </h1>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                asChild
                data-testid="button-explore"
              >
                <Link href="/">
                  <Globe className="h-4 w-4 mr-2" />
                  探索
                </Link>
              </Button>
              <Button
                variant={isActive("/map") ? "secondary" : "ghost"}
                size="sm"
                asChild
                data-testid="button-map"
              >
                <Link href="/map">
                  <MapPin className="h-4 w-4 mr-2" />
                  世界地図
                </Link>
              </Button>
              <Button
                variant={isActive("/logs") ? "secondary" : "ghost"}
                size="sm"
                asChild
                data-testid="button-logs"
              >
                <Link href="/logs">
                  <ListChecks className="h-4 w-4 mr-2" />
                  マイログ
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                data-testid="button-saved"
              >
                <Link href="/logs">
                  <Bookmark className="h-4 w-4 mr-2" />
                  保存済み
                </Link>
              </Button>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated && user ? (
              <UserMenu
                username={user.username}
                email={user.email}
                avatarUrl={user.avatarUrl}
              />
            ) : (
              <Button variant="default" size="sm" asChild data-testid="button-login">
                <Link href="/login">
                  ログイン
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
