import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Shield, FileText, Globe, Heart, Tv, Users, Mail, Instagram, MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-3xl text-primary tracking-widest uppercase">IFA</span>
            <span className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-border pl-3">International Fighters Association</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider">Log In</Button>
            </Link>
            <Link href="/apply">
              <Button className="font-heading uppercase tracking-wider font-bold">Join IFA / Unirme</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section — Bilingual */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border min-h-[90vh] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container relative z-10 flex flex-col items-center text-center">
            <div className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 font-heading">
              International Fighters Association
            </div>

            {/* English headline */}
            <h1 className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter max-w-4xl leading-[0.85] text-foreground mb-2">
              Fighters are not alone anymore.
            </h1>
            {/* Spanish headline */}
            <p className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tight text-primary/80 mb-6">
              Los fighters ya no están solos.
            </p>

            {/* English subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-2 font-medium">
              Join the International Fighters Association and access protection, career support, fight opportunities and sponsor connections.
            </p>
            {/* Spanish subheadline */}
            <p className="text-base md:text-lg text-muted-foreground/70 max-w-2xl mb-10 italic">
              Únete a la International Fighters Association y accede a protección, apoyo profesional, oportunidades de pelea y sponsors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/apply" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 font-heading text-xl uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                  Join IFA / Unirme a IFA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/apply" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 font-heading text-xl uppercase tracking-wider font-bold border-white/20 text-white hover:bg-white/5">
                  Apply Now / Aplicar ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Fighters Section */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Who We Represent / A Quién Representamos</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">The Fighters</h2>
              <div className="h-1 w-20 bg-primary mb-4" />
              <p className="text-muted-foreground text-lg max-w-2xl">The IFA represents professional boxers, MMA fighters, and kickboxers at every level — from rising prospects to world champions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Boxers", flag: "🥊", record: "Pro boxing athletes seeking global bouts, sanctioned fights, and career management support.", country: "Boxing" },
                { name: "MMA Fighters", flag: "🥋", record: "Mixed martial artists competing across promotions worldwide with full IFA protection.", country: "MMA" },
                { name: "Kickboxers", flag: "🦵", record: "K-1, Glory, and Muay Thai competitors backed by IFA's international promoter network.", country: "Kickboxing" },
              ].map((f) => (
                <div key={f.name} className="relative group overflow-hidden rounded-md border border-border bg-background hover:border-primary/40 transition-colors">
                  <div className="p-6">
                    <div className="text-4xl mb-4">{f.flag}</div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide mb-2">{f.name}</h3>
                    <p className="text-muted-foreground text-sm">{f.record}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promoters Section */}
        <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=1600&q=80')" }}
          />
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">For Event Organizers</p>
                <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Promoters</h2>
                <div className="h-1 w-20 bg-primary mb-6" />
                <p className="text-muted-foreground text-lg mb-6">Access a verified roster of professional fighters from around the world. IFA vets every athlete — you get fighters who show up, perform, and elevate your event.</p>
                <ul className="space-y-3">
                  {["Verified fighter records and credentials", "Direct contact with fighter management", "Fast turnaround on bout agreements", "IFA-backed contracts and dispute resolution"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-950 border border-border rounded-md p-8">
                <h3 className="font-heading text-2xl uppercase tracking-wide mb-6">Partner with IFA</h3>
                <p className="text-muted-foreground mb-6">Whether you're running a local card or an international event, IFA connects you with the right fighters at the right time.</p>
                <Link href="/apply">
                  <Button className="font-heading uppercase tracking-wider font-bold w-full">Apply as Fighter / Aplicar ahora</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Brand Visibility</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Sponsors</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Align your brand with the world's most passionate sports fanbase. IFA sponsorship puts you ringside with fighters and fans across the globe.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { tier: "Gold", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", desc: "Exclusive title sponsorship with full broadcast placement, ring placement, and fighter branding rights." },
                { tier: "Silver", color: "text-zinc-300 border-zinc-300/30 bg-zinc-300/5", desc: "Co-sponsor packages with banner placement, social media features, and event program listing." },
                { tier: "Bronze", color: "text-amber-700 border-amber-700/30 bg-amber-700/5", desc: "Entry-level brand exposure through fighter kit branding, digital promotions, and newsletter placement." },
              ].map(s => (
                <div key={s.tier} className={`rounded-md border p-6 ${s.color}`}>
                  <h3 className={`font-heading text-3xl uppercase tracking-wide mb-3 ${s.color.split(' ')[0]}`}>{s.tier}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Benefits Section */}
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container">
            <div className="mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">What You Get / Lo Que Obtienes</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Member Benefits</h2>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, label: "Legal Protection", desc: "IFA-backed legal support for contract disputes, promoter issues, and fighter rights violations." },
                { icon: FileText, label: "Contract Review", desc: "Every fight contract reviewed by IFA's legal team before you sign. No more bad deals." },
                { icon: Globe, label: "Global Network", desc: "Access to promoters, gyms, and opportunities in over 40 countries through the IFA network." },
                { icon: Heart, label: "Fighter Insurance", desc: "Comprehensive health and event insurance for every sanctioned fight under the IFA banner." },
                { icon: Tv, label: "Media Exposure", desc: "Fighter profiles distributed to media partners, streaming platforms, and boxing journalists worldwide." },
                { icon: Users, label: "Community", desc: "Join a brotherhood and sisterhood of professional fighters who have your back inside and outside the ring." },
              ].map(({ icon: Icon, label, desc }) => (
                <Card key={label} className="bg-zinc-950 border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-3" />
                    <CardTitle className="font-heading text-xl uppercase tracking-wide">{label}</CardTitle>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517438476312-10d79c077509?w=1600&q=80')" }}
          />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Members Get First Access</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Opportunities</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">Fight bookings, brand sponsorships, and international events posted exclusively to IFA members before going public.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Fight Bookings", icon: "🥊", desc: "International bouts matched to your weight class and record. Apply with one click." },
                { label: "Sponsorship Deals", icon: "💼", desc: "Brands looking to back fighters — gear deals, appearance fees, social content partnerships." },
                { label: "Live Events", icon: "🎤", desc: "Feature on major cards and IFA-sanctioned shows across Europe, the Americas, and beyond." },
              ].map(o => (
                <div key={o.label} className="bg-background border border-border rounded-md p-6 hover:border-primary/40 transition-colors">
                  <div className="text-3xl mb-4">{o.icon}</div>
                  <h3 className="font-heading text-xl uppercase tracking-wide mb-2">{o.label}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{o.desc}</p>
                  <Link href="/apply">
                    <Button variant="outline" size="sm" className="font-heading uppercase tracking-wider text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">Apply Now / Aplicar</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Plan — Single Plan */}
        <section className="py-20 md:py-32 relative overflow-hidden border-b border-border">
          <div className="container">
            <div className="text-center mb-16">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Invest in Your Career / Invierte en Tu Carrera</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">IFA Membership</h2>
              <p className="text-muted-foreground text-lg">No hidden fees. Cancel anytime. / Sin costes ocultos. Cancela cuando quieras.</p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="bg-background border-primary relative shadow-[0_0_60px_-15px_hsl(var(--primary))]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full font-heading">
                  Full Access — Acceso Completo
                </div>
                <CardHeader className="pt-10 text-center">
                  <CardTitle className="font-heading text-3xl uppercase tracking-wide">IFA Membership</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4 justify-center">
                    <span className="text-6xl font-bold font-heading text-primary">€20</span>
                    <span className="text-muted-foreground text-lg">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Full access to IFA membership including fighter profile, fight opportunities, sponsor opportunities and career support.
                    </p>
                    <p className="text-sm text-muted-foreground/70 mb-6 text-center italic">
                      Acceso completo a la membresía IFA incluyendo perfil de fighter, oportunidades de pelea, oportunidades con sponsors y apoyo profesional.
                    </p>
                  </div>
                  {[
                    "Fighter profile & IFA member card",
                    "Access to fight opportunities",
                    "Sponsor opportunity listings",
                    "Career support & legal guidance",
                    "International event access",
                    "Priority support",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Link href="/apply" className="w-full">
                    <Button className="w-full h-12 font-heading text-lg uppercase tracking-wider font-bold shadow-[0_0_30px_-10px_hsl(var(--primary))]">
                      Apply Now / Aplicar ahora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center">
                    Apply first — payment is activated after IFA approval.<br/>
                    <span className="italic">Aplica primero — el pago se activa tras la aprobación de IFA.</span>
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* How it works */}
            <div className="mt-20 max-w-3xl mx-auto">
              <h3 className="font-heading text-2xl uppercase tracking-wide text-center mb-10">How It Works / Cómo Funciona</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "01", en: "Submit your application at /apply", es: "Envía tu solicitud en /apply" },
                  { step: "02", en: "IFA reviews your profile (within 48h)", es: "IFA revisa tu perfil (máx. 48h)" },
                  { step: "03", en: "If approved, you receive your payment link to activate membership", es: "Si eres seleccionado, recibes tu enlace de pago para activar la membresía" },
                ].map(({ step, en, es }) => (
                  <div key={step} className="bg-zinc-950 border border-border rounded-md p-6 text-center">
                    <div className="font-heading text-5xl font-black text-primary/30 mb-3">{step}</div>
                    <p className="text-sm text-foreground mb-1">{en}</p>
                    <p className="text-xs text-muted-foreground italic">{es}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Fighter Voices</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">What Members Say</h2>
              <div className="h-1 w-20 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "Before IFA, I was signing contracts I didn't understand. Now I have people in my corner who actually fight for me outside the ring.", name: "Marco R.", record: "18-3-0", country: "Italy 🇮🇹" },
                { quote: "IFA got me three international bouts in one year. My record went from local to world-ranked. This is the real deal.", name: "Aisha K.", record: "12-1-0", country: "Nigeria 🇳🇬" },
                { quote: "The sponsorship connections alone paid for my membership ten times over. Every serious fighter should be IFA registered.", name: "Tomás V.", record: "22-4-1", country: "Mexico 🇲🇽" },
              ].map(t => (
                <div key={t.name} className="bg-background border border-border rounded-md p-6">
                  <p className="text-muted-foreground text-sm italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <div className="font-heading text-lg uppercase tracking-wide">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="font-mono text-primary">{t.record}</span>
                      <span>·</span>
                      <span>{t.country}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 md:py-28 border-b border-border">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Get in Touch / Contáctanos</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Contact IFA</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Our team is available to help fighters, promoters, and sponsors worldwide.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
              <a href="mailto:contact@ifa-fighters.org" className="flex items-center gap-3 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Email</div>
                  <div className="font-heading tracking-wide text-sm">contact@ifa-fighters.org</div>
                </div>
              </a>
              <a href="https://instagram.com/ifafighters" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Instagram</div>
                  <div className="font-heading tracking-wide text-sm">@ifafighters</div>
                </div>
              </a>
              <a href="https://wa.me/15550001234" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">WhatsApp</div>
                  <div className="font-heading tracking-wide text-sm">+1 555 000 1234</div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-zinc-950">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="font-heading font-black text-2xl text-primary tracking-widest uppercase mb-1">IFA</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">International Fighters Association</p>
            </div>
            <nav className="flex gap-6 text-xs text-muted-foreground uppercase tracking-widest font-heading">
              <Link href="/apply" className="hover:text-primary transition-colors">Apply / Aplicar</Link>
              <Link href="/sign-in" className="hover:text-primary transition-colors">Log In</Link>
            </nav>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} IFA – International Fighters Association</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
