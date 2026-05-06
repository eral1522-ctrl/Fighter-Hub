import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Shield, FileText, Globe, Heart, Tv, Users, Mail, Instagram, MessageCircle, Lock } from "lucide-react";
import { useLanguage, LangSwitcher } from "@/lib/i18n";
import ifaLogo from "@assets/LOGO_IFA_v2_1778057642238.png";

const BENEFIT_ICONS = [Shield, FileText, Globe, Heart, Tv, Users];

const FEATURED_OPPS = [
  {
    title: "Dubai International Showcase",
    country: "UAE",
    sport: "Boxing",
    weightClass: "Welterweight",
    statusKey: "Open",
    statusClass: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    accentClass: "bg-emerald-500",
    purseBlur: "€35,000",
  },
  {
    title: "Riyadh Heavyweight Opportunity",
    country: "Saudi Arabia",
    sport: "Boxing",
    weightClass: "Heavyweight",
    statusKey: "Recruiting",
    statusClass: "bg-violet-900/60 text-violet-300 border-violet-700/50",
    accentClass: "bg-violet-500",
    purseBlur: "€75,000",
  },
  {
    title: "London International Fight Card",
    country: "United Kingdom",
    sport: "Boxing",
    weightClass: "Middleweight",
    statusKey: "Scouting",
    statusClass: "bg-blue-900/60 text-blue-300 border-blue-700/50",
    accentClass: "bg-blue-500",
    purseBlur: "€18,000",
  },
  {
    title: "Bangkok Muay Thai Opportunity",
    country: "Thailand",
    sport: "Muay Thai",
    weightClass: "Lightweight",
    statusKey: "Open",
    statusClass: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    accentClass: "bg-emerald-500",
    purseBlur: "€5,000",
  },
  {
    title: "Abu Dhabi Fight Opportunity",
    country: "UAE",
    sport: "Boxing",
    weightClass: "Light Heavyweight",
    statusKey: "Open",
    statusClass: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    accentClass: "bg-emerald-500",
    purseBlur: "€40,000",
  },
  {
    title: "Berlin Kickboxing Card",
    country: "Germany",
    sport: "Kickboxing",
    weightClass: "Middleweight",
    statusKey: "Recruiting",
    statusClass: "bg-violet-900/60 text-violet-300 border-violet-700/50",
    accentClass: "bg-violet-500",
    purseBlur: "€7,500",
  },
];

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-3xl text-primary tracking-widest uppercase">IFA</span>
            <span className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-border pl-3">International Fighters Association</span>
          </div>
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
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border min-h-[90vh] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container relative z-10 flex flex-col items-center text-center">
            <div className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 font-heading">
              {t.hero.badge}
            </div>
            <h1 className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter max-w-4xl leading-[0.85] text-foreground mb-6">
              {t.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-medium">
              {t.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/apply" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 font-heading text-xl uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                  {t.hero.joinBtn}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/apply" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 font-heading text-xl uppercase tracking-wider font-bold border-white/20 text-white hover:bg-white/5">
                  {t.hero.applyBtn}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Fighters */}
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
                  <div className="p-6">
                    <div className="text-4xl mb-4">{f.flag}</div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide mb-2">{f.name}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promoters */}
        <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1600&q=80')" }}
          />
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.promoters.label}</p>
                <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.promoters.heading}</h2>
                <div className="h-1 w-20 bg-primary mb-6" />
                <p className="text-muted-foreground text-lg mb-6">{t.promoters.description}</p>
                <ul className="space-y-3">
                  {t.promoters.bullets.map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-950 border border-border rounded-md p-8">
                <h3 className="font-heading text-2xl uppercase tracking-wide mb-6">{t.promoters.cardTitle}</h3>
                <p className="text-muted-foreground mb-6">{t.promoters.cardDesc}</p>
                <Link href="/apply">
                  <Button className="font-heading uppercase tracking-wider font-bold w-full">{t.promoters.cardBtn}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.sponsors.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.sponsors.heading}</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.sponsors.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {t.sponsors.tiers.map(s => (
                <div key={s.tier} className={`rounded-md border p-6 ${s.color}`}>
                  <h3 className={`font-heading text-3xl uppercase tracking-wide mb-3 ${s.color.split(" ")[0]}`}>{s.tier}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Benefits */}
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container">
            <div className="mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.benefits.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.benefits.heading}</h2>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.benefits.items.map(({ label, desc }, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
                  <Card key={label} className="bg-zinc-950 border-border/50 hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <Icon className="h-10 w-10 text-primary mb-3" />
                      <CardTitle className="font-heading text-xl uppercase tracking-wide">{label}</CardTitle>
                      <p className="text-muted-foreground text-sm">{desc}</p>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517438476312-10d79c077509?w=1600&q=80')" }}
          />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.opportunities.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.opportunities.heading}</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.opportunities.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.opportunities.items.map(o => (
                <div key={o.label} className="bg-background border border-border rounded-md p-6 hover:border-primary/40 transition-colors">
                  <div className="text-3xl mb-4">{o.icon}</div>
                  <h3 className="font-heading text-xl uppercase tracking-wide mb-2">{o.label}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{o.desc}</p>
                  <Link href="/apply">
                    <Button variant="outline" size="sm" className="font-heading uppercase tracking-wider text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                      {t.opportunities.applyBtn}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Opportunities Preview */}
        <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.liveOpps.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.liveOpps.heading}</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.liveOpps.subheading}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {FEATURED_OPPS.map((opp) => {
                const statusLabel = (t.liveOpps as Record<string, string>)[`status${opp.statusKey}`] ?? opp.statusKey;
                return (
                  <div
                    key={opp.title}
                    className="relative group bg-zinc-950 border border-border rounded-md overflow-hidden hover:border-primary/40 transition-colors"
                  >
                    {/* Top accent bar */}
                    <div className={`h-0.5 w-full ${opp.accentClass}`} />
                    <div className="p-5">
                      {/* Status + Sport */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider border ${opp.statusClass}`}>
                          {statusLabel}
                        </span>
                        <span className="text-[11px] font-heading uppercase tracking-wider text-muted-foreground">{opp.sport}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg uppercase tracking-tight leading-tight mb-3">{opp.title}</h3>

                      {/* Meta grid */}
                      <div className="space-y-2 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center justify-between">
                          <span className="uppercase tracking-wider">{t.liveOpps.country}</span>
                          <span className="font-medium text-foreground/80">{opp.country}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="uppercase tracking-wider">{t.liveOpps.weightClass}</span>
                          <span className="font-medium text-foreground/80">{opp.weightClass}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-2">
                          <span className="uppercase tracking-wider">Purse</span>
                          <span className="font-heading font-bold text-primary/40 text-xs blur-[4px] select-none">{opp.purseBlur}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lock overlay hint */}
                    <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 px-5 py-3 flex items-center gap-2 text-[11px] text-muted-foreground/60 bg-zinc-950/80">
                      <Lock className="w-3 h-3" />
                      <span className="font-heading uppercase tracking-wider">{t.liveOpps.purseHidden}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/apply">
                <Button size="lg" className="h-14 px-10 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                  {t.liveOpps.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section className="py-20 md:py-32 relative overflow-hidden border-b border-border">
          <div className="container">
            <div className="text-center mb-16">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.membership.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.membership.heading}</h2>
              <p className="text-muted-foreground text-lg">{t.membership.subheading}</p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="bg-background border-primary relative shadow-[0_0_60px_-15px_hsl(var(--primary))]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full font-heading">
                  {t.membership.badge}
                </div>
                <CardHeader className="pt-10 text-center">
                  <CardTitle className="font-heading text-3xl uppercase tracking-wide">{t.membership.cardTitle}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4 justify-center">
                    <span className="text-6xl font-bold font-heading text-primary">€20</span>
                    <span className="text-muted-foreground text-lg">{t.membership.perMonth}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-6 text-center">{t.membership.desc}</p>
                  </div>
                  {t.membership.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
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

            {/* How it works */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h3 className="font-heading text-2xl uppercase tracking-wide text-center mb-10">{t.membership.howTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.membership.steps.map(({ step, text }) => (
                  <div key={step} className="bg-zinc-950 border border-border rounded-md p-6 text-center">
                    <div className="font-heading text-5xl font-black text-primary/30 mb-3">{step}</div>
                    <p className="text-sm text-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.testimonials.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.testimonials.heading}</h2>
              <div className="h-1 w-20 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.testimonials.items.map(testimonial => (
                <div key={testimonial.name} className="bg-background border border-border rounded-md p-6">
                  <p className="text-muted-foreground text-sm italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <div className="font-heading text-lg uppercase tracking-wide">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="font-mono text-primary">{testimonial.record}</span>
                      <span>·</span>
                      <span>{testimonial.country}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">{t.contact.label}</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">{t.contact.heading}</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t.contact.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
              <a href="mailto:info@fightersroom.com" className="flex items-center gap-3 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Email</div>
                  <div className="font-heading tracking-wide text-sm">info@fightersroom.com</div>
                </div>
              </a>
              <a href="https://instagram.com/fighters_room" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Instagram</div>
                  <div className="font-heading tracking-wide text-sm">@fighters_room</div>
                </div>
              </a>
              <a href="https://wa.me/34603304636" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
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
            className="w-full max-w-[220px] md:max-w-[300px] opacity-90"
          />
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <nav className="flex gap-6 text-xs text-muted-foreground uppercase tracking-widest font-heading">
              <Link href="/apply" className="hover:text-primary transition-colors">{t.footer.apply}</Link>
              <Link href="/sign-in" className="hover:text-primary transition-colors">{t.footer.login}</Link>
            </nav>
            <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
