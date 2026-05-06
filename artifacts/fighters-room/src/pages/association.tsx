import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, TrendingUp, BookOpen, FileText, Eye, Users, Star } from "lucide-react";
import { PublicPageLayout } from "@/components/public-page-layout";
import { useLanguage } from "@/lib/i18n";

const SECTION_ICONS = [Shield, TrendingUp, Star, BookOpen, FileText, Globe, Eye, Users];

export default function AssociationPage() {
  const { t } = useLanguage();
  const a = t.association;

  return (
    <PublicPageLayout>
      {/* Page Hero */}
      <section className="py-20 md:py-32 border-b border-border relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-8"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517438476312-10d79c077509?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        <div className="container relative z-10 max-w-3xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{a.label}</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{a.title}</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">{a.intro}</p>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-16 md:py-28 border-b border-border">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {a.sections.map((section, i) => {
              const Icon = SECTION_ICONS[i];
              return (
                <div key={i} className="group bg-zinc-950 border border-border rounded-md p-8 hover:border-primary/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl uppercase tracking-wide mb-3">{section.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{section.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="h-1 w-20 bg-primary mb-8" />
          <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 max-w-2xl">
            {a.title}
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl">{a.intro}</p>
          <Link href="/apply">
            <Button size="lg" className="h-14 px-10 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
              {a.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
}
