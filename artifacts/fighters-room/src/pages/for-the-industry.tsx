import { PublicPageLayout } from "@/components/public-page-layout";
import { useLanguage } from "@/lib/i18n";
import { usePageMeta } from "@/lib/use-page-meta";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Dumbbell, Handshake, Megaphone, Building2, ArrowRight } from "lucide-react";

const SEGMENT_ICONS = [Dumbbell, Handshake, Megaphone, Building2];
const SEGMENT_SUBJECTS = [
  "Partnership Inquiry — Gym",
  "Partnership Inquiry — Promoter",
  "Partnership Inquiry — Sponsor",
  "Partnership Inquiry — Strategic Partner",
];

export default function ForIndustryPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: "For the Industry",
    description: "Partner with IFA — for gyms, promoters, brands, sponsors and strategic partners in combat sports.",
    path: "/for-the-industry",
  });

  return (
    <PublicPageLayout>
      <section className="relative py-20 md:py-28 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-3xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.forIndustry.badge}</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{t.forIndustry.title}</h1>
          <div className="h-1 w-20 bg-primary mx-auto mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">{t.forIndustry.heroText}</p>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {t.forIndustry.segments.map((seg, i) => {
              const Icon = SEGMENT_ICONS[i];
              return (
                <div key={seg.title} className="bg-zinc-950 border border-border rounded-md p-8 flex flex-col">
                  <Icon className="h-8 w-8 text-primary mb-5" strokeWidth={1.75} />
                  <h3 className="font-heading text-lg uppercase tracking-wide mb-3">{seg.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{seg.desc}</p>
                  <a href={`mailto:info@fightersassociation.com?subject=${encodeURIComponent(SEGMENT_SUBJECTS[i])}`}>
                    <Button variant="outline" className="w-full font-heading uppercase tracking-wider font-bold border-white/20">
                      {seg.cta}
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border bg-zinc-950">
        <div className="container max-w-2xl text-center">
          <p className="text-muted-foreground text-sm mb-4">{t.forIndustry.gbsNote}</p>
          <Link href="/global-boxing-summit">
            <Button size="lg" className="font-heading uppercase tracking-wider font-bold">
              {t.forIndustry.gbsLink}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
}
