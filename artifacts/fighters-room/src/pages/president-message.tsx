import { PublicPageLayout } from "@/components/public-page-layout";
import { useLanguage } from "@/lib/i18n";
import { User } from "lucide-react";

export default function PresidentMessagePage() {
  const { t } = useLanguage();
  const p = t.presidentMessage;

  return (
    <PublicPageLayout>
      {/* Page Hero */}
      <section className="py-20 md:py-32 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-4xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{p.label}</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{p.title}</h1>
          <div className="h-1 w-20 bg-primary" />
        </div>
      </section>

      {/* President profile + message */}
      <section className="py-16 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

            {/* Photo + ID */}
            <div className="flex flex-col items-center md:items-start gap-6">
              {/* Photo placeholder */}
              <div className="w-48 h-48 md:w-full md:h-64 bg-zinc-950 border border-border rounded-md flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                <User className="h-16 w-16 text-primary/20" />
                <span className="text-xs text-muted-foreground/50 uppercase tracking-widest font-heading">{p.photoPlaceholder}</span>
              </div>

              {/* Name + Role */}
              <div className="text-center md:text-left">
                <div className="font-heading text-2xl uppercase tracking-wide text-foreground mb-1">{p.name}</div>
                <div className="text-xs text-primary uppercase tracking-widest font-heading">{p.role}</div>
              </div>

              {/* Signature placeholder */}
              <div className="w-full bg-zinc-950 border border-border/50 rounded-md px-5 py-4 min-h-[60px] flex items-center justify-center">
                <span className="text-xs text-muted-foreground/40 uppercase tracking-widest font-heading">{p.signaturePlaceholder}</span>
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <div className="relative bg-zinc-950 border border-border rounded-md p-8 md:p-10 min-h-[320px] flex flex-col justify-between">
                <div className="absolute top-6 left-8">
                  <div className="font-heading text-7xl text-primary/10 leading-none select-none">"</div>
                </div>
                <div className="pt-8">
                  <p className="text-muted-foreground text-lg leading-relaxed italic">
                    {p.placeholder}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <div className="font-heading text-base uppercase tracking-wide">{p.name}</div>
                    <div className="text-xs text-primary uppercase tracking-widest font-heading mt-1">{p.role}</div>
                  </div>
                  <div className="text-xs text-muted-foreground/40 uppercase tracking-widest font-heading">IFA</div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-6 bg-primary/5 border border-primary/10 rounded-md px-5 py-3">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-heading">
                  International Fighters Association — {new Date().getFullYear()}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
