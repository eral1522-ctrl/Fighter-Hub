import { useState } from "react";
import { PublicPageLayout } from "@/components/public-page-layout";
import { useLanguage } from "@/lib/i18n";
import { usePageMeta } from "@/lib/use-page-meta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Briefcase, Shield, Globe2, TrendingUp, Radio, Cpu,
  Users, ArrowRight, CheckCircle2,
} from "lucide-react";

const AREA_ICONS = [Briefcase, Shield, Globe2, TrendingUp, Radio, Cpu];

type InterestKind = "attendee" | "partner" | "speaker";

// These three forms are intentionally NOT wired to a backend endpoint yet.
// Submitting the contact form (/api/contact) fires an immediate automated
// email - reusing it here would count as "connecting to automated
// communications," which was explicitly ruled out until the intended flow
// (storage, notifications, or otherwise) is confirmed. For now this is a
// client-side-only confirmation state; the copy says so honestly rather
// than implying the submission went anywhere.
function InterestForm({ kind, title }: { kind: InterestKind; title: string }) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (submitted) {
    return (
      <div className="bg-zinc-950 border border-primary/30 rounded-md p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-4" />
        <p className="text-sm text-foreground/90 leading-relaxed">{t.gbs.formSubmitted}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="bg-zinc-950 border border-border rounded-md p-8 space-y-4"
    >
      <h3 className="font-heading text-lg uppercase tracking-wide mb-2">{title}</h3>
      <div>
        <Label htmlFor={`${kind}-name`} className="text-xs text-muted-foreground mb-1.5 block">{t.gbs.formName}</Label>
        <Input id={`${kind}-name`} required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${kind}-email`} className="text-xs text-muted-foreground mb-1.5 block">{t.gbs.formEmail}</Label>
        <Input id={`${kind}-email`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {kind !== "attendee" && (
        <div>
          <Label htmlFor={`${kind}-org`} className="text-xs text-muted-foreground mb-1.5 block">{t.gbs.formOrganization}</Label>
          <Input id={`${kind}-org`} />
        </div>
      )}
      <div>
        <Label htmlFor={`${kind}-message`} className="text-xs text-muted-foreground mb-1.5 block">{t.gbs.formMessage}</Label>
        <Textarea id={`${kind}-message`} rows={3} />
      </div>
      <Button type="submit" className="w-full font-heading uppercase tracking-wider font-bold">
        {t.gbs.formSubmit}
      </Button>
      <p className="text-[11px] text-muted-foreground/70 text-center pt-1">{t.gbs.formNote}</p>
    </form>
  );
}

export default function GlobalBoxingSummitPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: "Global Boxing Summit",
    description: "GBS — Global Boxing Summit is IFA's industry event for the business, protection and future of professional boxing.",
    path: "/global-boxing-summit",
  });

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="relative py-24 md:py-36 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-4xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4 font-heading">{t.gbs.badge}</p>
          <h1 className="font-heading text-5xl md:text-8xl font-black uppercase mb-6 leading-[0.9]">{t.gbs.title}</h1>
          <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed mb-6 max-w-2xl mx-auto">{t.gbs.heroText}</p>
          <div className="inline-block bg-zinc-900 border border-border rounded-full px-5 py-2 text-xs font-heading uppercase tracking-widest text-muted-foreground mb-10">
            {t.gbs.dateVenue}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#attend">
              <Button size="lg" className="h-13 px-8 font-heading uppercase tracking-wider font-bold w-full sm:w-auto">
                {t.gbs.ctaAttendee}
              </Button>
            </a>
            <a href="#partner">
              <Button size="lg" variant="outline" className="h-13 px-8 font-heading uppercase tracking-wider font-bold border-white/20 w-full sm:w-auto">
                {t.gbs.ctaPartner}
              </Button>
            </a>
            <a href="#member">
              <Button size="lg" variant="outline" className="h-13 px-8 font-heading uppercase tracking-wider font-bold border-white/20 w-full sm:w-auto">
                {t.gbs.ctaMember}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* What is GBS */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-3xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.gbs.whatIsLabel}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">{t.gbs.whatIsHeading}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t.gbs.whatIsText}</p>
        </div>
      </section>

      {/* Thesis */}
      <section className="py-20 md:py-28 border-b border-border bg-zinc-950">
        <div className="container max-w-3xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.gbs.thesisLabel}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">{t.gbs.thesisHeading}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t.gbs.thesisText}</p>
        </div>
      </section>

      {/* Who participates */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-3xl text-center">
          <Users className="h-10 w-10 text-primary mx-auto mb-5" />
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.gbs.whoLabel}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">{t.gbs.whoHeading}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t.gbs.whoText}</p>
        </div>
      </section>

      {/* Focus areas */}
      <section className="py-20 md:py-28 border-b border-border bg-zinc-950">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.gbs.areasLabel}</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">{t.gbs.areasHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {t.gbs.areas.map((area, i) => {
              const Icon = AREA_ICONS[i];
              return (
                <div key={area.title} className="bg-background border border-border rounded-md p-6">
                  <Icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-heading text-sm uppercase tracking-wide mb-2">{area.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{area.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GBS & IFA relationship */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-3xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.gbs.relationLabel}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">{t.gbs.relationHeading}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t.gbs.relationText}</p>
        </div>
      </section>

      {/* Member benefits */}
      <section id="member" className="py-20 md:py-28 border-b border-border bg-zinc-950">
        <div className="container max-w-3xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.gbs.memberBenefitsLabel}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">{t.gbs.memberBenefitsHeading}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">{t.gbs.memberBenefitsText}</p>
          <a href="/apply">
            <Button size="lg" className="h-14 px-10 font-heading uppercase tracking-wider font-bold">
              {t.gbs.ctaMember}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Interest forms */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div id="attend" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto scroll-mt-24">
            <InterestForm kind="attendee" title={t.gbs.formAttendeeTitle} />
            <div id="partner" className="scroll-mt-24">
              <InterestForm kind="partner" title={t.gbs.formPartnerTitle} />
            </div>
            <InterestForm kind="speaker" title={t.gbs.formSpeakerTitle} />
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
