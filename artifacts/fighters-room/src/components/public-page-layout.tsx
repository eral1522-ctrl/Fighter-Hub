import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage, LangSwitcher } from "@/lib/i18n";
import { Mail, Instagram, MessageCircle, Menu, X } from "lucide-react";
import ifaLogo from "@assets/LOGO_IFA_v2_1778057642238.png";
import { useState } from "react";

export function PublicPageLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-heading font-black text-3xl text-primary tracking-widest uppercase">IFA</span>
            <span className="hidden md:block text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-border pl-3">International Fighters Association</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-heading uppercase tracking-widest text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">{t.footer.about}</Link>
            <Link href="/association" className="hover:text-primary transition-colors">{t.header.association}</Link>
            <Link href="/membership" className="hover:text-primary transition-colors">{t.footer.membership}</Link>
            <Link href="/news-events" className="hover:text-primary transition-colors">{t.footer.newsEvents}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t.footer.contact}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Link href="/sign-in" className="hidden sm:block">
              <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider text-xs">{t.header.login}</Button>
            </Link>
            <Link href="/apply">
              <Button className="font-heading uppercase tracking-wider font-bold text-xs">{t.header.join}</Button>
            </Link>
            <button
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 px-6 py-6 space-y-4">
            {[
              { href: "/about", label: t.footer.about },
              { href: "/association", label: t.header.association },
              { href: "/membership", label: t.footer.membership },
              { href: "/news-events", label: t.footer.newsEvents },
              { href: "/contact", label: t.footer.contact },
              { href: "/sign-in", label: t.header.login },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block text-sm font-heading uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-1">
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="pt-16 pb-8 border-t border-border bg-zinc-950">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/">
                <img
                  src={ifaLogo}
                  alt="IFA – The International Fighters Association"
                  className="w-full max-w-[160px] opacity-90 mb-5 cursor-pointer"
                />
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-[220px]">{t.footer.tagline}</p>
              <div className="flex items-center gap-3">
                <a href="mailto:info@fightersassociation.com" className="w-8 h-8 rounded-md bg-white/5 border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
                <a href="https://instagram.com/fighters_room" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-white/5 border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors">
                  <Instagram className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
                <a href="https://wa.me/34603304636" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-white/5 border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors">
                  <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </div>
            </div>

            {/* For Fighters */}
            <div>
              <h4 className="font-heading text-xs uppercase tracking-widest text-foreground/80 mb-5">For Fighters</h4>
              <nav className="space-y-3">
                <Link href="/apply" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.apply}</Link>
                <Link href="/membership" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.membership}</Link>
                <Link href="/sign-in" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.login}</Link>
                <Link href="/news-events" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.newsEvents}</Link>
              </nav>
            </div>

            {/* Association */}
            <div>
              <h4 className="font-heading text-xs uppercase tracking-widest text-foreground/80 mb-5">Association</h4>
              <nav className="space-y-3">
                <Link href="/about" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.about}</Link>
                <Link href="/association" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.association}</Link>
                <Link href="/statutes" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.statutes}</Link>
                <Link href="/president-message" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.presidentMessage}</Link>
                <Link href="/contact" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.contact}</Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading text-xs uppercase tracking-widest text-foreground/80 mb-5">Legal</h4>
              <nav className="space-y-3">
                <Link href="/privacy-policy" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.privacyPolicy}</Link>
                <Link href="/legal-notice" className="block text-xs text-muted-foreground hover:text-primary transition-colors">{t.footer.legalNotice}</Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">{t.footer.privacyPolicy}</Link>
              <span className="text-border">·</span>
              <Link href="/legal-notice" className="hover:text-primary transition-colors">{t.footer.legalNotice}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
