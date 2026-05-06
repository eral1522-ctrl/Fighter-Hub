import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { PublicPageLayout } from "@/components/public-page-layout";

const STRIPE_LINK = "https://buy.stripe.com/cNibJ39hjcX210cbh2gfu05";

const TIERS = [
  {
    id: "athlete",
    badge: "Most Popular",
    name: "Athlete",
    price: "€20",
    period: "/month",
    desc: "For individual professional and amateur combat sports athletes at any level.",
    features: [
      "IFA member profile & digital card",
      "Access to fight opportunities",
      "Sponsor & brand opportunity listings",
      "Career support & guidance",
      "International event access",
      "Legal contract review support",
      "Priority member support",
      "IFA fighter network access",
    ],
    cta: "Apply as Athlete",
    href: "/apply",
    external: false,
    highlight: true,
  },
  {
    id: "gym",
    badge: "For Teams",
    name: "Club / Gym",
    price: "€99",
    period: "/month",
    desc: "For gyms, training centers, and coaches managing multiple fighters under one membership.",
    features: [
      "Up to 10 fighter sub-profiles",
      "Gym / team listing in IFA directory",
      "Bulk opportunity access for all fighters",
      "Coach & manager portal",
      "Priority support for all team members",
      "IFA-branded event presence",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    href: "mailto:info@fightersassociation.com?subject=Club/Gym Membership",
    external: true,
    highlight: false,
  },
  {
    id: "partner",
    badge: "Organizations",
    name: "Partner / Sponsor",
    price: "Contact",
    period: "",
    desc: "For brands, promoters, and organizations wanting to partner with IFA and access our fighter network.",
    features: [
      "Access to the full IFA fighter roster",
      "Brand placement across IFA events",
      "Co-marketing and media opportunities",
      "Dedicated partnership manager",
      "Custom sponsorship packages",
      "IFA partner badge & certification",
    ],
    cta: "Get in Touch",
    href: "mailto:info@fightersassociation.com?subject=Partnership Inquiry",
    external: true,
    highlight: false,
  },
];

const STEPS = [
  { step: "01", title: "Submit Application", desc: "Complete the fighter application form at /apply. Tell us about your career, discipline, and goals." },
  { step: "02", title: "IFA Reviews", desc: "Our team reviews your profile within 48 hours. We verify your credentials and sport background." },
  { step: "03", title: "Activate Membership", desc: "Once approved, activate your membership plan and gain immediate access to the full IFA platform." },
];

const FAQ = [
  {
    q: "Who can join IFA?",
    a: "IFA is open to any active professional or amateur combat sports athlete — boxers, MMA fighters, kickboxers, Muay Thai practitioners, bare knuckle fighters, grapplers, and more. All levels are welcome, from regional competitors to world champions.",
  },
  {
    q: "How long does the approval process take?",
    a: "Most applications are reviewed within 48 hours. We verify your sport background and credentials before approving membership. You'll receive an email notification with the outcome.",
  },
  {
    q: "Can I cancel my membership at any time?",
    a: "Yes. Athlete memberships can be cancelled at any time with no exit fees. Your access remains active until the end of your current billing period.",
  },
  {
    q: "What happens after I apply?",
    a: "After submitting your application, IFA reviews your profile. If approved, you'll receive instructions to activate your membership and gain access to the member portal, fight opportunities, sponsor listings, and all IFA services.",
  },
  {
    q: "Does IFA work with amateur fighters?",
    a: "Yes. IFA welcomes both professional and amateur athletes. Your membership tier and profile content will reflect your current level and career stage.",
  },
  {
    q: "Does IFA take a percentage of my fight earnings?",
    a: "No. IFA is a membership association, not a management company or promoter. We charge only the flat monthly membership fee. We do not take commissions on fights, sponsors, or any other income.",
  },
];

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Invest in Your Career</p>
          <h1 className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.85]">IFA Membership</h1>
          <div className="h-1 w-20 bg-primary mx-auto mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Choose the right membership for your career stage. Apply first — membership is activated after IFA approval.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-md border flex flex-col ${tier.highlight ? "border-primary bg-background shadow-[0_0_60px_-20px_hsl(var(--primary))]" : "border-border bg-zinc-950"}`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full font-heading whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-heading text-2xl uppercase tracking-wide mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-heading font-black text-5xl text-primary">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{tier.desc}</p>
                  <div className="border-t border-border pt-6 space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8">
                    {tier.external ? (
                      <a href={tier.href}>
                        <Button
                          className={`w-full h-12 font-heading uppercase tracking-wider font-bold ${tier.highlight ? "shadow-[0_0_30px_-10px_hsl(var(--primary))]" : ""}`}
                          variant={tier.highlight ? "default" : "outline"}
                        >
                          {tier.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Link href={tier.href}>
                        <Button
                          className={`w-full h-12 font-heading uppercase tracking-wider font-bold ${tier.highlight ? "shadow-[0_0_30px_-10px_hsl(var(--primary))]" : ""}`}
                          variant={tier.highlight ? "default" : "outline"}
                        >
                          {tier.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-zinc-950 border-b border-border">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Process</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">How It Works</h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.step} className="bg-background border border-border rounded-md p-8 text-center hover:border-primary/30 transition-colors">
                <div className="font-heading text-6xl font-black text-primary/30 mb-4">{step.step}</div>
                <h3 className="font-heading text-lg uppercase tracking-wide mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Questions</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">FAQ</h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-border rounded-md bg-zinc-950 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="font-heading text-sm uppercase tracking-wide pr-4">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-2xl text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Ready?</p>
          <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Apply Today</h2>
          <p className="text-muted-foreground text-lg mb-10">Submit your application and join the global home of combat sports. Approval within 48 hours.</p>
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
