import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Target, Users, Star, Heart } from "lucide-react";
import { PublicPageLayout } from "@/components/public-page-layout";

const VALUES = [
  { icon: Shield, title: "Fighter First", desc: "Every decision IFA makes is guided by what is best for the athletes we represent. Fighters are the heart of combat sports and must be treated as such." },
  { icon: Globe, title: "Global Access", desc: "We believe geography should not limit a fighter's career. IFA opens international doors regardless of where a fighter trains or competes." },
  { icon: Target, title: "Integrity", desc: "IFA operates with full transparency. We are an independent association with no conflicts of interest — our only loyalty is to our members." },
  { icon: Users, title: "Community", desc: "Combat sports is a brotherhood and sisterhood. IFA builds a network where fighters support, connect with, and elevate each other." },
  { icon: Star, title: "Excellence", desc: "We hold ourselves and our members to the highest professional standards — in the ring, in negotiations, and in every interaction." },
  { icon: Heart, title: "Protection", desc: "No fighter should face the business side of combat sports alone. IFA exists to ensure every member has support when they need it most." },
];

const TIMELINE = [
  { year: "2020", title: "IFA Founded", desc: "The International Fighters Association was established with a mission to represent and protect combat sports athletes globally." },
  { year: "2021", title: "First 50 Members", desc: "IFA reached its first milestone with fighters from 12 countries across boxing, MMA, and kickboxing disciplines." },
  { year: "2022", title: "Expanded to 20 Countries", desc: "IFA opened regional partnerships across Europe, Latin America, and North Africa, building a truly international network." },
  { year: "2023", title: "Digital Member Portal Launched", desc: "IFA launched its digital platform allowing fighters to manage profiles, apply for opportunities, and track their career directly online." },
  { year: "2024", title: "1,000+ Members", desc: "Membership surpassed 1,000 registered fighters across 40+ countries, with opportunities spanning all major combat sports disciplines." },
  { year: "2025", title: "International Events Program", desc: "IFA launched its own sanctioned event program, hosting IFA-branded shows across Europe and expanding to the Americas." },
];

const BOARD = [
  { name: "Erik Alonso", role: "President", placeholder: true },
  { name: "Board Member", role: "Vice President – Operations", placeholder: true },
  { name: "Board Member", role: "Director – Fighter Relations", placeholder: true },
  { name: "Board Member", role: "Director – Events & Partnerships", placeholder: true },
];

export default function AboutPage() {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="py-20 md:py-32 border-b border-border relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.stockcake.com/public/c/3/4/c346eb8f-60fa-47fb-a84b-3d1f7e5a98b2_large/boxing-ring-spotlight-stockcake.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="container relative z-10 max-w-4xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Our Story</p>
          <h1 className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.85]">About IFA</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
            The International Fighters Association was built to solve a real problem: fighters have always been the most important people in combat sports, and also the most underrepresented. IFA exists to change that.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Our Mission</p>
              <h2 className="font-heading text-4xl font-black uppercase tracking-tighter mb-6">What We Do</h2>
              <div className="h-0.5 w-16 bg-primary mb-6" />
              <p className="text-muted-foreground leading-relaxed">
                IFA's mission is to provide combat sports athletes with the structure, visibility, and resources they need to build sustainable and protected professional careers. We believe every fighter deserves access to legitimate opportunities, fair contracts, career guidance, and an international network that works in their interest — not against it.
              </p>
            </div>
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Our Vision</p>
              <h2 className="font-heading text-4xl font-black uppercase tracking-tighter mb-6">Where We're Going</h2>
              <div className="h-0.5 w-16 bg-primary mb-6" />
              <p className="text-muted-foreground leading-relaxed">
                A world where no professional fighter faces the business of combat sports alone. A global standard for fighter representation where membership in IFA opens doors across every major promotion, every country, and every discipline — from boxing to MMA to kickboxing, Muay Thai, and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">What We Stand For</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Our Values</h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="group bg-background border border-border rounded-md p-7 hover:border-primary/40 transition-all duration-300">
                  <div className="w-11 h-11 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg uppercase tracking-wide mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">History</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Milestones</h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          <div className="relative">
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className="shrink-0 text-right w-[60px] hidden md:block">
                    <span className="font-heading font-black text-primary text-lg">{item.year}</span>
                  </div>
                  <div className="relative hidden md:flex items-center justify-center shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  </div>
                  <div className="flex-1 bg-zinc-950 border border-border rounded-md p-6 group-hover:border-primary/30 transition-colors">
                    <div className="md:hidden">
                      <span className="font-heading font-black text-primary text-sm mb-2 block">{item.year}</span>
                    </div>
                    <h3 className="font-heading text-lg uppercase tracking-wide mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Leadership</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Board of Directors</h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BOARD.map((member, i) => (
              <div key={i} className="bg-background border border-border rounded-md p-6 text-center group hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-border mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-base uppercase tracking-wide mb-1">{member.name}</h3>
                <p className="text-muted-foreground text-xs leading-snug">{member.role}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">Full board profiles coming soon.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-2xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Join Us</p>
          <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Become Part of IFA</h2>
          <p className="text-muted-foreground text-lg mb-10">
            IFA is growing every day. Join the global home of combat sports and take your career to the next level.
          </p>
          <Link href="/apply">
            <Button size="lg" className="h-14 px-12 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
              Apply to Join IFA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
}
