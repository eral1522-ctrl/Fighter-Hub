import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { LogOut, User, LayoutDashboard, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-heading font-bold text-2xl text-primary tracking-wider">FR</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-foreground/80 ${location === "/dashboard" ? "text-foreground" : "text-foreground/60"}`}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className={`transition-colors hover:text-foreground/80 ${location === "/profile" ? "text-foreground" : "text-foreground/60"}`}
            >
              Profile
            </Link>
            {/* If user is admin (could be checked via roles, but just showing for now) */}
            <Link
              href="/admin"
              className={`transition-colors hover:text-foreground/80 ${location === "/admin" ? "text-foreground" : "text-foreground/60"}`}
            >
              Admin
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-4">
              <User className="h-4 w-4" />
              <span>{user?.firstName || user?.username || "Fighter"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => signOut({ redirectUrl: basePath || "/" })} data-testid="button-signout">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} FightersRoom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}