import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Target, Users, Star, Heart } from "lucide-react";
import { PublicPageLayout } from "@/components/public-page-layout";
import { usePageMeta } from "@/lib/use-page-meta";
import { useQuery } from "@tanstack/react-query";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  category: string;
  photoUrl: string | null;
  bio: string | null;
  country: string | null;
  disciplineOrArea: string | null;
  externalUrl: string | null;
};

const TEAM_CATEGORY_ORDER = ["board", "founding_fighter", "advisory", "legal", "medical", "partner"];
const TEAM_CATEGORY_LABELS: Record<string, string> = {
  board: "Board Members",
  founding_fighter: "Founding Fighters",
  advisory: "Advisory Board",
  legal: "Legal Team & Legal Partners",
  medical: "Medical & Athlete Welfare Partners",
  partner: "Gyms, Promoters & Strategic Partners",
};

async function fetchPublicTeam(): Promise<TeamMember[]> {
  const res = await fetch("/api/team");
  if (!res.ok) return [];
  return res.json();
}

const VALUES = [
  { icon: Shield, title: "Fighter First", desc: "Every decision IFA makes is guided by what is best for the athletes we represent. Fighters are the heart of combat sports and must be treated as such." },
  { icon: Globe, title: "Global Access", desc: "We believe geography should not limit a fighter's career. IFA opens international doors regardless of where a fighter trains or competes." },
  { icon: Target, title: "Integrity", desc: "IFA operates with full transparency. We are an independent association with no conflicts of interest — our only loyalty is to our members." },
  { icon: Users, title: "Community", desc: "Combat sports is a brotherhood and sisterhood. IFA builds a network where fighters support, connect with, and elevate each other." },
  { icon: Star, title: "Excellence", desc: "We hold ourselves and our members to the highest professional standards — in the ring, in negotiations, and in every interaction." },
  { icon: Heart, title: "Protection", desc: "No fighter should face the business side of combat sports alone. IFA exists to ensure every member has support when they need it most." },
];

// IFA was established in 2026 — no history to fabricate before that.

const BOARD = [
  { name: "Erik Alonso", role: "President" },
];

export default function AboutPage() {
  usePageMeta({
    title: "About IFA",
    description: "IFA's mission, vision, values, and timeline as the independent global association representing combat sports athletes.",
    path: "/about",
  });
  const { data: teamMembers } = useQuery({ queryKey: ["public-team"], queryFn: fetchPublicTeam });
  const membersByCategory = (cat: string) => (teamMembers ?? []).filter((m) => m.category === cat);
  const hasAnyTeamMembers = (teamMembers ?? []).length > 0;

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
        <div className="container max-w-3xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Our Origin</p>
          <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Built for the Next Generation of Fighters</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            IFA was established in 2026 to build the professional structure combat sports athletes have historically lacked: verified opportunities, career support, contract awareness, global visibility and a collective voice within the industry.
          </p>
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
          <div className="grid grid-cols-1 max-w-xs mx-auto">
            {BOARD.map((member, i) => (
              <Link key={i} href="/president-message" className="bg-background border border-border rounded-md p-6 text-center group hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-border mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-base uppercase tracking-wide mb-1">{member.name}</h3>
                <p className="text-muted-foreground text-xs leading-snug mb-2">{member.role}</p>
                <p className="text-primary text-[11px] font-heading uppercase tracking-wider">Read his message →</p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* The People Behind IFA — infrastructure-driven, hidden entirely
          if nothing is active yet. No placeholder/ficticious cards. */}
      {hasAnyTeamMembers && (
        <section className="py-20 md:py-28 border-b border-border bg-zinc-950">
          <div className="container">
            <div className="text-center mb-16">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Built With the Combat Sports Industry</p>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">The People Behind IFA</h2>
              <div className="h-1 w-20 bg-primary mx-auto" />
            </div>
            <div className="space-y-14">
              {TEAM_CATEGORY_ORDER.map((cat) => {
                const items = membersByCategory(cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <h3 className="font-heading text-sm uppercase tracking-widest text-muted-foreground mb-6">{TEAM_CATEGORY_LABELS[cat]}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {items.map((m) => {
                        const Card = m.externalUrl ? "a" : "div";
                        return (
                          <Card
                            key={m.id}
                            {...(m.externalUrl ? { href: m.externalUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="bg-background border border-border rounded-md p-6 hover:border-primary/30 transition-colors"
                          >
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt={m.name} className="w-16 h-16 rounded-full object-cover mb-4 border border-border" />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-zinc-800 border border-border mb-4 flex items-center justify-center">
                                <Users className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <h4 className="font-heading text-base uppercase tracking-wide mb-1">{m.name}</h4>
                            <p className="text-primary text-xs font-heading uppercase tracking-wider mb-2">{m.role}</p>
                            {(m.country || m.disciplineOrArea) && (
                              <p className="text-muted-foreground text-xs mb-2">{[m.disciplineOrArea, m.country].filter(Boolean).join(" · ")}</p>
                            )}
                            {m.bio && <p className="text-muted-foreground text-sm leading-relaxed">{m.bio}</p>}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
