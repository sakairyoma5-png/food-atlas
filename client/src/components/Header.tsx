import { Globe, Moon, Sun, Bookmark, MapPin, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
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
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Globe className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-display font-bold text-foreground">
                Food Atlas
              </h1>
            </a>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <a>
                <Button
                  variant={isActive("/") ? "secondary" : "ghost"}
                  size="sm"
                  data-testid="button-explore"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  探索
                </Button>
              </a>
            </Link>
            <Link href="/map">
              <a>
                <Button
                  variant={isActive("/map") ? "secondary" : "ghost"}
                  size="sm"
                  data-testid="button-map"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  世界地図
                </Button>
              </a>
            </Link>
            <Link href="/logs">
              <a>
                <Button
                  variant={isActive("/logs") ? "secondary" : "ghost"}
                  size="sm"
                  data-testid="button-logs"
                >
                  <ListChecks className="h-4 w-4 mr-2" />
                  マイログ
                </Button>
              </a>
            </Link>
            <Link href="/logs">
              <a>
                <Button variant="ghost" size="sm" data-testid="button-saved">
                  <Bookmark className="h-4 w-4 mr-2" />
                  保存済み
                </Button>
              </a>
            </Link>
          </nav>

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
        </div>
      </div>
    </header>
  );
}
