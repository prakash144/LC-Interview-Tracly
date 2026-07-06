"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useState } from "react";
import type { User } from "firebase/auth";
import {
  BarChart3,
  Bookmark,
  CalendarDays,
  Crosshair,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import UserMenu from "./UserMenu";

interface TopNavProps {
  user?: User | null;
  authLoading?: boolean;
  isAuthConfigured?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Problems", href: "/problems", icon: ListChecks },
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Activity", href: "/activity", icon: CalendarDays },
  { label: "Readiness", href: "/readiness", icon: Crosshair },
  { label: "Favorites", href: "/favorites", icon: Bookmark },
  { label: "My Lists", href: "/my-lists", icon: FolderKanban },
] as const;

const NavLink = memo(function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <span className="absolute inset-0 rounded-md bg-accent/50" />
      )}
      <Icon className="relative z-10 size-4" />
      <span className="relative z-10 whitespace-nowrap">{label}</span>
    </Link>
  );
});

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-8 text-muted-foreground hover:text-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function SearchInput() {
  return (
    <div className="relative hidden sm:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search"
        className="h-8 w-40 rounded-md border-border bg-secondary/50 pl-8 text-xs placeholder:text-muted-foreground/60 focus-visible:w-56 transition-all duration-200 lg:w-48 lg:focus-visible:w-64"
        aria-label="Search problems, companies, topics"
      />
    </div>
  );
}

function MobileNavItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent/50 text-foreground"
            : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="size-4" />
        {label}
      </Link>
    </SheetClose>
  );
}

const TopNav = ({
  user,
  authLoading = false,
  isAuthConfigured = false,
  onLogin,
  onLogout,
}: TopNavProps) => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-[50px] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <Logo showTagline={false} />

        {/* Center: Desktop Nav */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-0.5"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Right: Utilities */}
        <div className="flex items-center gap-1">
          <SearchInput />

          <ThemeToggle />

          {/* Notifications placeholder */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex size-8 text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
            title="Notifications — coming soon"
            disabled
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>

          <UserMenu
            user={user}
            loading={authLoading}
            isConfigured={isAuthConfigured}
            onLogin={onLogin}
            onLogout={onLogout}
          />

          {/* Mobile: Hamburger + Sheet drawer */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden size-8 text-muted-foreground hover:text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <div className="flex flex-col gap-6 pt-8">
                <Logo showTagline={false} />
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <MobileNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      isActive={pathname === item.href}
                    />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
