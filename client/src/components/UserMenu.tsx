import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, Bookmark, ListChecks } from "lucide-react";
import { Link } from "wouter";

interface UserMenuProps {
  username?: string;
  email?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

export default function UserMenu({ username = "料理好きユーザー", email, avatarUrl, onLogout }: UserMenuProps) {
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
          <Avatar className="h-9 w-9">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            {email && (
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/logs">
          <a>
            <DropdownMenuItem data-testid="menu-my-logs">
              <ListChecks className="mr-2 h-4 w-4" />
              <span>マイログ</span>
            </DropdownMenuItem>
          </a>
        </Link>
        <Link href="/logs">
          <a>
            <DropdownMenuItem data-testid="menu-saved">
              <Bookmark className="mr-2 h-4 w-4" />
              <span>保存済み</span>
            </DropdownMenuItem>
          </a>
        </Link>
        <DropdownMenuItem data-testid="menu-settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>設定</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild data-testid="menu-logout">
          <a href="/api/logout">
            <LogOut className="mr-2 h-4 w-4" />
            <span>ログアウト</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
