import { PublicPageLayout } from "@/components/public-page-layout";
import { useLanguage } from "@/lib/i18n";

export default function StatutesPage() {
  const { t } = useLanguage();
  const s = t.statutes;

  return (
    <PublicPageLayout>
      {/* Page Hero */}
      <section className="py-20 md:py-32 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-4xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{s.label}</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{s.title}</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <div className="bg-primary/10 border border-primary/20 rounded-md px-6 py-4 inline-block">
            <p className="text-sm text-primary/80 italic leading-relaxed">{s.note}</p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="space-y-12">
            {s.sections.map((section, i) => (
              <div key={i} className="border-b border-border/40 pb-12 last:border-0 last:pb-0">
                <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wide text-primary mb-4">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom note */}
      <section className="py-16 border-t border-border bg-zinc-950">
        <div className="container max-w-4xl text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading">
            {t.footer.copyright}
          </p>
        </div>
      </section>
    </PublicPageLayout>
  );
}
