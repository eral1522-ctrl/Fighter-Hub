import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Tag } from "lucide-react";
import { PublicPageLayout } from "@/components/public-page-layout";

const NEWS = [
  {
    category: "Expansion",
    date: "June 10, 2026",
    title: "IFA Opens Registration to Fighters Across the Middle East and North Africa",
    excerpt: "IFA has expanded its membership program to include fighters based in the MENA region, establishing new regional contacts in Morocco, UAE, and Egypt to support fighters seeking international exposure.",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
  },
  {
    category: "Fighter Protection",
    date: "May 22, 2026",
    title: "IFA Launches Standardised Contract Review Framework for Member Fighters",
    excerpt: "All IFA Athlete members now have access to a contract review framework designed to protect fighters from unfair terms. The service covers promotion contracts, sponsorship agreements, and bout contracts.",
    image: "https://images.pexels.com/photos/6295869/pexels-photo-6295869.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    category: "Community",
    date: "April 14, 2026",
    title: "IFA Member Network Reaches Fighters in 30+ Countries",
    excerpt: "IFA's growing membership now spans more than 30 countries across Europe, Asia, the Americas and Africa. The association continues to expand its network of regional contacts and partner promotions.",
    image: "https://images.pexels.com/photos/9968139/pexels-photo-9968139.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
];

const EVENTS = [
  {
    id: 1,
    title: "IFA European Boxing Summit",
    date: "September 20, 2026",
    location: "Madrid, Spain",
    sport: "Boxing",
    level: "International",
    desc: "IFA's flagship European boxing event featuring IFA member fighters across six weight categories. Open to all IFA Athlete members with an active professional record.",
  },
  {
    id: 2,
    title: "IFA MMA Showcase — Amsterdam",
    date: "October 11, 2026",
    location: "Amsterdam, Netherlands",
    sport: "MMA",
    level: "Regional",
    desc: "A high-profile MMA showcase event for IFA members competing in the European circuit. Applications open to IFA members at lightweight, welterweight, and middleweight.",
  },
  {
    id: 3,
    title: "IFA Kickboxing Grand Prix",
    date: "November 8, 2026",
    location: "Paris, France",
    sport: "Kickboxing",
    level: "International",
    desc: "IFA's standalone kickboxing event under the Grand Prix format. Full contact rules, 8-man tournament, multiple weight categories. Applications through the member dashboard.",
  },
  {
    id: 4,
    title: "IFA Latin America — Fight Night Bogotá",
    date: "December 5, 2026",
    location: "Bogotá, Colombia",
    sport: "Boxing / MMA",
    level: "Regional",
    desc: "IFA's inaugural Latin American event. Mixed card featuring boxing and MMA. Priority placement for IFA members based in South and Central America.",
  },
];

const SPORT_COLORS: Record<string, string> = {
  Boxing: "bg-yellow-900/50 text-yellow-300 border-yellow-700/40",
  MMA: "bg-blue-900/50 text-blue-300 border-blue-700/40",
  Kickboxing: "bg-violet-900/50 text-violet-300 border-violet-700/40",
  "Boxing / MMA": "bg-amber-900/50 text-amber-300 border-amber-700/40",
};

export default function NewsEventsPage() {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-3xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">IFA Updates</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">News &<br />Events</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Latest news from the International Fighters Association and upcoming events open to IFA members worldwide.
          </p>
        </div>
      </section>

      {/* News */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-5xl">
          <div className="mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Latest</p>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter">News</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS.map((item, i) => (
              <div key={i} className="group bg-zinc-950 border border-border rounded-md overflow-hidden hover:border-primary/40 transition-all duration-300">
                <div className="aspect-[16/9] overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      <Tag className="h-2.5 w-2.5" />
                      {item.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-heading uppercase tracking-wider">{item.date}</span>
                  </div>
                  <h3 className="font-heading text-base uppercase tracking-tight leading-tight mb-3 group-hover:text-primary/90 transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.excerpt}</p>
                  <div className="mt-4">
                    <span className="text-primary text-xs font-heading uppercase tracking-wider hover:underline cursor-pointer">Read more →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 md:py-28 bg-zinc-950">
        <div className="container max-w-5xl">
          <div className="mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-heading">Upcoming</p>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter">Events</h2>
          </div>
          <div className="space-y-5">
            {EVENTS.map((event) => (
              <div key={event.id} className="group bg-background border border-border rounded-md p-7 hover:border-primary/40 transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="shrink-0 text-center md:text-left w-full md:w-24">
                  <div className="font-heading font-black text-primary text-3xl leading-none">{event.date.split(" ")[1].replace(",", "")}</div>
                  <div className="font-heading text-muted-foreground text-xs uppercase tracking-widest mt-1">{event.date.split(" ")[0]}</div>
                  <div className="font-heading text-muted-foreground text-xs tracking-wider">{event.date.split(" ")[2]}</div>
                </div>
                <div className="hidden md:block w-px bg-border self-stretch" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider border ${SPORT_COLORS[event.sport] ?? "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
                      {event.sport}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-heading uppercase tracking-wider">{event.level}</span>
                  </div>
                  <h3 className="font-heading text-xl uppercase tracking-tight mb-2 group-hover:text-primary/90 transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{event.desc}</p>
                </div>
                <div className="shrink-0">
                  <Link href="/apply">
                    <Button size="sm" variant="outline" className="font-heading uppercase tracking-wider text-xs border-primary/30 hover:border-primary hover:bg-primary/10">
                      Register
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <p className="text-muted-foreground text-sm mb-6">IFA members get priority access to all events. Join IFA to apply.</p>
            <Link href="/apply">
              <Button size="lg" className="h-14 px-12 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                Apply to Join IFA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
