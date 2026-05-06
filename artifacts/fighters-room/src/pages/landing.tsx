import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  ArrowRight, CheckCircle2, Shield, FileText, Globe, Eye,
  Users, Star, UserCheck, BookOpen, Mail, Instagram,
  MessageCircle, Lock, Quote, ChevronDown,
} from "lucide-react";
import { useLanguage, LangSwitcher } from "@/lib/i18n";
import { useUser } from "@clerk/react";
import { useGetDashboardStats, useListOpportunities } from "@workspace/api-client-react";
import ifaLogo from "@assets/LOGO_IFA_v2_1778057642238.png";

const STRIPE_LINK = "https://buy.stripe.com/cNibJ39hjcX210cbh2gfu05";

const WHY_JOIN_ICONS = [Globe, Star, UserCheck, BookOpen, FileText, Eye, Users, Shield];

const LANDING_STATUSES = ["open", "scouting", "recruiting", "expected", "active"];

function getStatusStyle(status: string): { badgeClass: string; accentClass: string; label: string } {
  switch (status) {
    case "open":
    case "active":
      return { badgeClass: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50", accentClass: "bg-emerald-500", label: status };
    case "recruiting":
      return { badgeClass: "bg-violet-900/60 text-violet-300 border-violet-700/50", accentClass: "bg-violet-500", label: status };
    case "scouting":
      return { badgeClass: "bg-blue-900/60 text-blue-300 border-blue-700/50", accentClass: "bg-blue-500", label: status };
    case "expected":
      return { badgeClass: "bg-amber-900/60 text-amber-300 border-amber-700/50", accentClass: "bg-amber-500", label: status };
    default:
      return { badgeClass: "bg-zinc-800 text-zinc-300 border-zinc-700", accentClass: "bg-zinc-500", label: status };
  }
}

export default function LandingPage() {
  const { t } = useLanguage();
  const { isSignedIn } = useUser();
  const { data: stats } = useGetDashboardStats();
  const { data: allOpportunities } = useListOpportunities();
  const isPaid = !!isSignedIn && stats?.paymentStatus === "paid";

  const featuredOpps = (allOpportunities ?? [])
    .filter(o => LANDING_STATUSES.includes(o.status))
    .slice(0, 6);

  function getLiveOppsCta(): { href: string; external: boolean; label: string } {
    if (!isSignedIn) return { href: "/apply", external: false, label: t.liveOpps.ctaApply };
    if (isPaid) return { href: "/dashboard", external: false, label: t.liveOpps.ctaDashboard };
    return { href: STRIPE_LINK, external: true, label: t.liveOpps.ctaUnlock };
  }

  const liveOppsCta = getLiveOppsCta();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-3xl text-primary tracking-widest uppercase">IFA</span>
            <span className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-border pl-3">International Fighters Association</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs font-heading uppercase tracking-widest text-muted-foreground">
            <Link href="/association" className="hover:text-primary transition-colors">{t.header.association}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LangSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider">{t.header.login}</Button>
            </Link>
            <Link href="/apply">
              <Button className="font-heading uppercase tracking-wider font-bold">{t.header.join}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative pt-32 pb-24 md:pt-52 md:pb-40 overflow-hidden border-b border-border min-h-[95vh] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.stockcake.com/public/c/3/4/c346eb8f-60fa-47fb-a84b-3d1f7e5a98b2_large/boxing-ring-spotlight-stockcake.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
          <div className="container relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest px-5 py-1.5 rounded-full mb-8 font-heading">
              {t.hero.badge}
            </div>
            <h1 className="font-heading text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-foreground mb-8">
              {t.hero.headline}
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 font-medium leading-relaxed">
              {t.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link href="/apply" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 font-heading text-lg uppercase tracking-wider font-bold shadow-[0_0_50px_-10px_hsl(var(--primary))]">
                  {t.hero.joinBtn}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#why-join" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 font-heading text-lg uppercase tracking-wider font-bold border-white/20 text-white hover:bg-white/5">
                  {t.hero.viewBenefitsBtn}
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
            <div className="w-px h-12 bg-primary" />
          </div>
        </section>

        {/* ── WHY JOIN IFA? ── */}
        <section id="why-join" className="py-24 md:py-36 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="text-center mb-16">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.whyJoin.label}</p>
              <h2 className="font-heading text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">{t.whyJoin.heading}</h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.whyJoin.benefits.map((benefit, i) => {
                const Icon = WHY_JOIN_ICONS[i];
                return (
                  <div
                    key={i}
                    className="group relative bg-background border border-border rounded-md p-7 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground/90 leading-snug">{benefit}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-md" />
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-14">
              <Link href="/apply">
                <Button size="lg" className="h-14 px-10 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                  {t.hero.joinBtn}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── BUILT FOR THE MODERN FIGHTER ── */}
        <section className="py-24 md:py-36 border-b border-border relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/6295869/pexels-photo-6295869.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
          <div className="container relative z-10">
            <div className="max-w-2xl">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.builtFor.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight">{t.builtFor.heading}</h2>
              <div className="h-1 w-20 bg-primary mb-8" />
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10">{t.builtFor.text}</p>
              <Link href="/apply">
                <Button size="lg" className="h-14 px-10 font-heading text-base uppercase tracking-wider font-bold">
                  {t.hero.joinBtn}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FIGHTERS ── */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.fighters.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.fighters.heading}</h2>
              <div className="h-1 w-20 bg-primary mb-4" />
              <p className="text-muted-foreground text-lg max-w-2xl">{t.fighters.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.fighters.types.map((f) => (
                <div key={f.name} className="relative group overflow-hidden rounded-md border border-border bg-background hover:border-primary/40 transition-colors">
                  <div className="p-8">
                    <div className="text-5xl mb-5">{f.flag}</div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide mb-3">{f.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIVE OPPORTUNITIES PREVIEW ── */}
        <section className="py-24 md:py-36 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
          <div className="container relative z-10">
            <div className="text-center mb-14">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.liveOpps.label}</p>
              <h2 className="font-heading text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">{t.liveOpps.heading}</h2>
              <div className="h-1 w-24 bg-primary mx-auto mb-6" />
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.liveOpps.subheading}</p>
            </div>

            {featuredOpps.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">{t.liveOpps.noOpps}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {featuredOpps.map((opp) => {
                  const style = getStatusStyle(opp.status);
                  const statusLabel = (t.liveOpps as Record<string, string>)[`status${opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}`] ?? opp.status;
                  return (
                    <div
                      key={opp.id}
                      className="relative group bg-zinc-950 border border-border rounded-md overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsl(var(--primary))]"
                    >
                      <div className={`h-0.5 w-full ${style.accentClass}`} />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider border ${style.badgeClass}`}>
                            {statusLabel}
                          </span>
                          <span className="text-[11px] font-heading uppercase tracking-wider text-muted-foreground">{opp.sport ?? "—"}</span>
                        </div>
                        <h3 className="font-heading text-lg uppercase tracking-tight leading-tight mb-4">{opp.title}</h3>
                        <div className="space-y-2.5 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span className="uppercase tracking-wider">{t.liveOpps.country}</span>
                            <span className="font-medium text-foreground/80">{opp.country ?? "—"}</span>
                          </div>
                          {opp.city && (
                            <div className="flex items-center justify-between">
                              <span className="uppercase tracking-wider">{t.liveOpps.city}</span>
                              <span className="font-medium text-foreground/80">{opp.city}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="uppercase tracking-wider">{t.liveOpps.weightClass}</span>
                            <span className="font-medium text-foreground/80">{opp.weightClass ?? "—"}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-border/50 pt-2.5 mt-1">
                            <span className="uppercase tracking-wider">Purse</span>
                            <span className="font-heading font-bold text-primary/40 text-xs blur-[4px] select-none">€ ——</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border/50 px-6 py-3 flex items-center gap-2 text-[11px] text-muted-foreground/60 bg-zinc-950/80">
                        <Lock className="w-3 h-3" />
                        <span className="font-heading uppercase tracking-wider">{t.liveOpps.purseHidden}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="text-center">
              {liveOppsCta.external ? (
                <a href={liveOppsCta.href} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="h-14 px-12 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                    {liveOppsCta.label}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              ) : (
                <Link href={liveOppsCta.href}>
                  <Button size="lg" className="h-14 px-12 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                    {liveOppsCta.label}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── WHAT FIGHTERS NEED TODAY (anonymous testimonials) ── */}
        <section className="py-24 md:py-36 border-b border-border bg-zinc-950 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1600&q=80')" }}
          />
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.testimonials.label}</p>
              <h2 className="font-heading text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">{t.testimonials.heading}</h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {t.testimonials.items.map((item, i) => (
                <div key={i} className="bg-background border border-border rounded-md p-8 hover:border-primary/30 transition-colors relative">
                  <Quote className="h-8 w-8 text-primary/30 mb-6" />
                  <p className="text-foreground/90 text-lg font-medium leading-relaxed italic">"{item.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MEMBERSHIP ── */}
        <section className="py-24 md:py-36 relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.membership.label}</p>
              <h2 className="font-heading text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4">{t.membership.heading}</h2>
              <p className="text-muted-foreground text-lg">{t.membership.subheading}</p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="bg-background border-primary relative shadow-[0_0_80px_-20px_hsl(var(--primary))]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full font-heading">
                  {t.membership.badge}
                </div>
                <CardHeader className="pt-10 text-center">
                  <CardTitle className="font-heading text-3xl uppercase tracking-wide">{t.membership.cardTitle}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4 justify-center">
                    <span className="text-7xl font-bold font-heading text-primary">€20</span>
                    <span className="text-muted-foreground text-xl">{t.membership.perMonth}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-6 text-center">{t.membership.desc}</p>
                  </div>
                  {t.membership.features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Link href="/apply" className="w-full">
                    <Button className="w-full h-12 font-heading text-lg uppercase tracking-wider font-bold shadow-[0_0_30px_-10px_hsl(var(--primary))]">
                      {t.membership.applyBtn}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center">{t.membership.applyNote}</p>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-20 max-w-3xl mx-auto">
              <h3 className="font-heading text-2xl uppercase tracking-wide text-center mb-10">{t.membership.howTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.membership.steps.map(({ step, text }) => (
                  <div key={step} className="bg-zinc-950 border border-border rounded-md p-6 text-center hover:border-primary/30 transition-colors">
                    <div className="font-heading text-5xl font-black text-primary/30 mb-3">{step}</div>
                    <p className="text-sm text-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="py-20 md:py-28 border-b border-border bg-zinc-950">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.contact.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.contact.heading}</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t.contact.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
              <a href="mailto:info@fightersroom.com" className="flex items-center gap-3 bg-background border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Email</div>
                  <div className="font-heading tracking-wide text-sm">info@fightersroom.com</div>
                </div>
              </a>
              <a href="https://instagram.com/fighters_room" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-background border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Instagram</div>
                  <div className="font-heading tracking-wide text-sm">@fighters_room</div>
                </div>
              </a>
              <a href="https://wa.me/34603304636" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-background border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">WhatsApp</div>
                  <div className="font-heading tracking-wide text-sm">+34 603 304 636</div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-zinc-950">
        <div className="container flex flex-col items-center gap-8">
          <img
            src={ifaLogo}
            alt="IFA – The International Fighters Association"
            className="w-full max-w-[220px] md:max-w-[280px] opacity-90"
          />
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground uppercase tracking-widest font-heading">
              <Link href="/apply" className="hover:text-primary transition-colors">{t.footer.apply}</Link>
              <Link href="/association" className="hover:text-primary transition-colors">{t.footer.association}</Link>
              <Link href="/statutes" className="hover:text-primary transition-colors">{t.footer.statutes}</Link>
              <Link href="/president-message" className="hover:text-primary transition-colors">{t.footer.presidentMessage}</Link>
              <Link href="/sign-in" className="hover:text-primary transition-colors">{t.footer.login}</Link>
            </nav>
            <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
