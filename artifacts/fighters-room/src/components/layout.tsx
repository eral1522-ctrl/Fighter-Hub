import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage, LangSwitcher } from "@/lib/i18n";
import ifaLogo from "@assets/LOGO_IFA_v2_1778057642238.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();
  const { t } = useLanguage();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center gap-2">
            <span className="font-heading font-black text-2xl text-primary tracking-widest">IFA</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-foreground/80 uppercase font-heading tracking-wider text-xs ${location === "/dashboard" ? "text-foreground" : "text-foreground/60"}`}
            >
              {t.layout.dashboard}
            </Link>
            <Link
              href="/profile"
              className={`transition-colors hover:text-foreground/80 uppercase font-heading tracking-wider text-xs ${location === "/profile" ? "text-foreground" : "text-foreground/60"}`}
            >
              {t.layout.profile}
            </Link>
            <Link
              href="/admin"
              className={`transition-colors hover:text-foreground/80 uppercase font-heading tracking-wider text-xs ${location === "/admin" ? "text-foreground" : "text-foreground/60"}`}
            >
              {t.layout.admin}
            </Link>
            <Link
              href="/admin/applications"
              className={`transition-colors hover:text-foreground/80 uppercase font-heading tracking-wider text-xs ${location === "/admin/applications" ? "text-foreground" : "text-foreground/60"}`}
            >
              {t.layout.applications}
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <LangSwitcher />
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-heading tracking-wide text-xs uppercase">{user?.firstName || user?.username || "Fighter"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => signOut({ redirectUrl: basePath || "/" })} data-testid="button-signout">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">{t.layout.signOut}</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t py-8 bg-zinc-950">
        <div className="container flex flex-col items-center gap-4">
          <img
            src={ifaLogo}
            alt="IFA – The International Fighters Association"
            className="w-full max-w-[180px] md:max-w-[240px] opacity-90"
          />
          <p className="text-center text-xs leading-loose text-muted-foreground uppercase tracking-widest font-heading">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
