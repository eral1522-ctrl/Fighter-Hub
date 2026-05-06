import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage, LangSwitcher } from "@/lib/i18n";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import ifaLogo from "@assets/LOGO_IFA_v2_1778057642238.png";

export function PublicPageLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-3xl text-primary tracking-widest uppercase">IFA</span>
            <span className="hidden md:block text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-border pl-3">International Fighters Association</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs font-heading uppercase tracking-widest text-muted-foreground">
            <Link href="/association" className="hover:text-primary transition-colors">{t.header.association}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider text-xs">{t.header.login}</Button>
            </Link>
            <Link href="/apply">
              <Button className="font-heading uppercase tracking-wider font-bold text-xs">{t.header.join}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="py-12 border-t border-border bg-zinc-950">
        <div className="container flex flex-col items-center gap-8">
          <Link href="/">
            <img
              src={ifaLogo}
              alt="IFA – The International Fighters Association"
              className="w-full max-w-[200px] md:max-w-[260px] opacity-90 cursor-pointer"
            />
          </Link>
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground uppercase tracking-widest font-heading">
              <Link href="/apply" className="hover:text-primary transition-colors">{t.footer.apply}</Link>
              <Link href="/association" className="hover:text-primary transition-colors">{t.footer.association}</Link>
              <Link href="/statutes" className="hover:text-primary transition-colors">{t.footer.statutes}</Link>
              <Link href="/president-message" className="hover:text-primary transition-colors">{t.footer.presidentMessage}</Link>
              <Link href="/sign-in" className="hover:text-primary transition-colors">{t.footer.login}</Link>
            </nav>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="mailto:info@fightersroom.com" className="hover:text-primary transition-colors flex items-center gap-1">
                <Mail className="h-3 w-3" /> info@fightersroom.com
              </a>
              <a href="https://instagram.com/fighters_room" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-3 w-3" />
              </a>
              <a href="https://wa.me/34603304636" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <MessageCircle className="h-3 w-3" />
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
