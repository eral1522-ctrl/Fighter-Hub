import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { useSubmitFighterApplication } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, LangSwitcher } from "@/lib/i18n";
import { usePageMeta } from "@/lib/use-page-meta";

const WEIGHT_CLASSES = [
  "Strawweight", "Light Flyweight", "Flyweight", "Super Flyweight", "Bantamweight",
  "Super Bantamweight", "Featherweight", "Super Featherweight", "Lightweight",
  "Super Lightweight", "Welterweight", "Super Welterweight", "Middleweight",
  "Super Middleweight", "Light Heavyweight", "Cruiserweight", "Heavyweight", "Super Heavyweight",
];

export default function ApplyPage() {
  usePageMeta({
    title: "Apply as a Fighter",
    description: "Submit your application to join the International Fighters Association and access global opportunities.",
    path: "/apply",
  });
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [athleteType, setAthleteType] = useState<"professional" | "amateur">("professional");
  const [form, setForm] = useState({
    name: "", ringName: "", dateOfBirth: "", email: "", country: "", city: "",
    discipline: "", weightClass: "", record: "", sportingProfileUrl: "",
    gym: "", coach: "", manager: "", whatsapp: "", instagram: "",
    bio: "", careerObjective: "", competitionExperience: "",
  });
  const [boxrecError, setBoxrecError] = useState("");
  const [guardian, setGuardian] = useState({
    name: "", relationship: "", email: "", phone: "", country: "",
  });
  const [guardianChecks, setGuardianChecks] = useState({
    authorizes: false, terms: false, data: false, licenses: false,
  });

  // Age computed from the date-of-birth field; guardian section appears
  // automatically when the applicant is under 18.
  const age = (() => {
    if (!form.dateOfBirth) return null;
    const dob = new Date(`${form.dateOfBirth}T00:00:00`);
    if (isNaN(dob.getTime())) return null;
    const now = new Date();
    let a = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) a--;
    return a;
  })();
  const isMinor = age !== null && age >= 0 && age < 18;
  const guardianComplete =
    !isMinor ||
    (Object.values(guardian).every(v => v.trim().length > 0) &&
      Object.values(guardianChecks).every(Boolean));

  const submitApplication = useSubmitFighterApplication();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "sportingProfileUrl") setBoxrecError("");
    if (field === "discipline" && value !== "Boxing") setBoxrecError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !guardianComplete) return;

    submitApplication.mutate(
      {
        data: {
          name: form.name,
          ringName: form.ringName || null,
          dateOfBirth: form.dateOfBirth,
          email: form.email,
          country: form.country,
          city: form.city,
          discipline: form.discipline,
          weightClass: form.weightClass,
          record: form.record,
          athleteType,
          sportingProfileUrl: form.sportingProfileUrl.trim() || null,
          currentGym: form.gym.trim() || null,
          coach: form.coach.trim() || null,
          currentManager: athleteType === "professional" ? (form.manager.trim() || null) : null,
          whatsapp: form.whatsapp.trim() || null,
          instagram: form.instagram.trim() || null,
          bio: form.bio || null,
          careerObjective: form.careerObjective.trim() || null,
          competitionExperience: athleteType === "amateur" ? (form.competitionExperience.trim() || null) : null,
          consent: agreed,
          ...(isMinor ? {
            guardianName: guardian.name.trim(),
            guardianRelationship: guardian.relationship.trim(),
            guardianEmail: guardian.email.trim(),
            guardianPhone: guardian.phone.trim(),
            guardianCountry: guardian.country.trim(),
            guardianAuthorizesApplication: guardianChecks.authorizes,
            guardianAcceptsTerms: guardianChecks.terms,
            guardianAuthorizesDataProcessing: guardianChecks.data,
            guardianAcknowledgesLicenses: guardianChecks.licenses,
          } : {}),
        } as any,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => {
          toast({
            title: "Submission failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-2xl text-primary tracking-widest">IFA</span>
            <span className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest font-medium border-l border-border pl-3">International Fighters Association</span>
          </Link>
          <div className="flex items-center gap-4">
            <LangSwitcher />
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider text-xs">
                {t.apply.alreadyMember}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {submitted ? (
          /* Confirmation State */
          <div className="container py-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto min-h-[70vh]">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">{t.apply.successTitle}</h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8" />
            <p className="text-foreground/90 text-base leading-relaxed mb-4">{t.apply.successMsg}</p>
            <p className="font-bold text-primary text-lg mb-5">{(t.apply as any).successMsg2}</p>
            <p className="text-foreground/80 text-sm mb-8 border border-primary/30 bg-primary/5 rounded-md px-5 py-4 leading-relaxed">{(t.apply as any).successMsg3}</p>
            <p className="text-muted-foreground text-sm mb-2">{t.apply.successNote}</p>
            <p className="text-muted-foreground text-xs mb-10">{(t.apply as any).successInstagram}</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="w-full sm:w-auto font-heading uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                  {(t.apply as any).successBtn1}
                </Button>
              </Link>
              <a href="https://buy.stripe.com/cNibJ39hjcX210cbh2gfu05" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/5">
                  {(t.apply as any).successBtn2}
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <section className="relative py-20 md:py-28 border-b border-border overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1600&q=80')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/80 to-background" />
              <div className="container relative z-10 text-center">
                <div className="inline-block bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 font-heading">
                  Fighter Application
                </div>
                <h1 className="font-heading text-4xl md:text-7xl font-black uppercase tracking-tighter max-w-3xl mx-auto leading-[0.85] mb-4">
                  {t.apply.heroTitle}
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  {t.apply.heroDesc}
                </p>
              </div>
            </section>

            {/* Form Section */}
            <section className="py-16 md:py-24">
              <div className="container max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Athlete Type */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8">
                    <Label className="uppercase text-xs tracking-wider text-muted-foreground mb-3 block">{t.apply.athleteTypeLabel}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAthleteType("professional")}
                        className={`py-3 px-4 rounded-md border text-sm font-heading uppercase tracking-wide transition-colors ${athleteType === "professional" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                      >
                        {t.apply.athleteTypeProfessional}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAthleteType("amateur")}
                        className={`py-3 px-4 rounded-md border text-sm font-heading uppercase tracking-wide transition-colors ${athleteType === "amateur" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                      >
                        {t.apply.athleteTypeAmateur}
                      </button>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                    <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{t.apply.sectionPersonal}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.nameLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="name"
                          className="bg-background"
                          placeholder={t.apply.namePlaceholder}
                          value={form.name}
                          onChange={e => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ringName" className="uppercase text-xs tracking-wider text-muted-foreground">
                          {t.apply.ringNameLabel} <span className="text-muted-foreground/60">{t.apply.boxrecOptional}</span>
                        </Label>
                        <Input
                          id="ringName"
                          className="bg-background"
                          placeholder={t.apply.ringNamePlaceholder}
                          value={form.ringName}
                          onChange={e => handleChange("ringName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.dobLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          className="bg-background"
                          value={form.dateOfBirth}
                          onChange={e => handleChange("dateOfBirth", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.emailLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-background"
                          placeholder={t.apply.emailPlaceholder}
                          value={form.email}
                          onChange={e => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.countryLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="country"
                          className="bg-background"
                          placeholder={t.apply.countryPlaceholder}
                          value={form.country}
                          onChange={e => handleChange("country", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.cityLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="city"
                          className="bg-background"
                          placeholder={t.apply.cityPlaceholder}
                          value={form.city}
                          onChange={e => handleChange("city", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Athletic Profile */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                    <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{t.apply.sectionAthletic}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.disciplineLabel} <span className="text-primary">*</span></Label>
                        <Select value={form.discipline} onValueChange={v => handleChange("discipline", v)} required>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder={t.apply.disciplinePlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Boxing">Boxing</SelectItem>
                            <SelectItem value="MMA">MMA</SelectItem>
                            <SelectItem value="Kickboxing">Kickboxing / Muay Thai</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.weightClassLabel} <span className="text-primary">*</span></Label>
                        <Select value={form.weightClass} onValueChange={v => handleChange("weightClass", v)} required>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder={t.apply.weightClassPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {WEIGHT_CLASSES.map(wc => (
                              <SelectItem key={wc} value={wc}>{wc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="record" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.recordLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="record"
                          className="bg-background font-mono text-center"
                          placeholder={t.apply.recordPlaceholder}
                          value={form.record}
                          onChange={e => handleChange("record", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="sportingProfileUrl" className="uppercase text-xs tracking-wider text-muted-foreground">
                          {t.apply.boxrecLabel}{" "}
                          <span className="text-muted-foreground/60">{t.apply.boxrecOptional}</span>
                        </Label>
                        <Input
                          id="sportingProfileUrl"
                          type="url"
                          className={`bg-background ${boxrecError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          placeholder={t.apply.boxrecPlaceholder}
                          value={form.sportingProfileUrl}
                          onChange={e => handleChange("sportingProfileUrl", e.target.value)}
                        />
                        {boxrecError && (
                          <p className="text-xs text-destructive mt-1">{boxrecError}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gym" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.gymLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="gym"
                          className="bg-background"
                          placeholder={t.apply.gymPlaceholder}
                          value={form.gym}
                          onChange={e => handleChange("gym", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="coach" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.coachLabel} <span className="text-primary">*</span></Label>
                        <Input
                          id="coach"
                          className="bg-background"
                          placeholder={t.apply.coachPlaceholder}
                          value={form.coach}
                          onChange={e => handleChange("coach", e.target.value)}
                          required
                        />
                      </div>
                      {athleteType === "professional" ? (
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="manager" className="uppercase text-xs tracking-wider text-muted-foreground">
                            {t.apply.managerLabel} <span className="text-muted-foreground/60">{t.apply.managerOptional}</span>
                          </Label>
                          <Input
                            id="manager"
                            className="bg-background"
                            placeholder={t.apply.managerPlaceholder}
                            value={form.manager}
                            onChange={e => handleChange("manager", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="competitionExperience" className="uppercase text-xs tracking-wider text-muted-foreground">
                            {t.apply.competitionExperienceLabel} <span className="text-muted-foreground/60">{t.apply.boxrecOptional}</span>
                          </Label>
                          <Textarea
                            id="competitionExperience"
                            className="bg-background resize-none h-20"
                            placeholder={t.apply.competitionExperiencePlaceholder}
                            value={form.competitionExperience}
                            onChange={e => handleChange("competitionExperience", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio + Contact */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                    <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{t.apply.sectionBio}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="uppercase text-xs tracking-wider text-muted-foreground">
                          {t.apply.whatsappLabel} <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="whatsapp"
                          className="bg-background"
                          placeholder={t.apply.whatsappPlaceholder}
                          value={form.whatsapp}
                          onChange={e => handleChange("whatsapp", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="uppercase text-xs tracking-wider text-muted-foreground">
                          {t.apply.instagramLabel} <span className="text-muted-foreground/60">{t.apply.instagramOptional}</span>
                        </Label>
                        <Input
                          id="instagram"
                          className="bg-background"
                          placeholder={t.apply.instagramPlaceholder}
                          value={form.instagram}
                          onChange={e => handleChange("instagram", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.bioLabel}</Label>
                      <Textarea
                        id="bio"
                        className="bg-background resize-none h-28"
                        placeholder={t.apply.bioPlaceholder}
                        value={form.bio}
                        onChange={e => handleChange("bio", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careerObjective" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.careerObjectiveLabel}</Label>
                      <Textarea
                        id="careerObjective"
                        className="bg-background resize-none h-20"
                        placeholder={t.apply.careerObjectivePlaceholder}
                        value={form.careerObjective}
                        onChange={e => handleChange("careerObjective", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Guardian section — only when the applicant is under 18 */}
                  {isMinor && (
                    <div className="bg-zinc-950 border border-primary/40 rounded-md p-6 md:p-8 space-y-6">
                      <div>
                        <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{(t.apply as any).guardianSectionTitle}</h2>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{(t.apply as any).guardianSectionNote}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="guardianName" className="uppercase text-xs tracking-wider text-muted-foreground">{(t.apply as any).guardianNameLabel} <span className="text-primary">*</span></Label>
                          <Input
                            id="guardianName"
                            className="bg-background"
                            placeholder={(t.apply as any).guardianNamePlaceholder}
                            value={guardian.name}
                            onChange={e => setGuardian(p => ({ ...p, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianRelationship" className="uppercase text-xs tracking-wider text-muted-foreground">{(t.apply as any).guardianRelationshipLabel} <span className="text-primary">*</span></Label>
                          <Input
                            id="guardianRelationship"
                            className="bg-background"
                            placeholder={(t.apply as any).guardianRelationshipPlaceholder}
                            value={guardian.relationship}
                            onChange={e => setGuardian(p => ({ ...p, relationship: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianEmail" className="uppercase text-xs tracking-wider text-muted-foreground">{(t.apply as any).guardianEmailLabel} <span className="text-primary">*</span></Label>
                          <Input
                            id="guardianEmail"
                            type="email"
                            className="bg-background"
                            placeholder={(t.apply as any).guardianEmailPlaceholder}
                            value={guardian.email}
                            onChange={e => setGuardian(p => ({ ...p, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianPhone" className="uppercase text-xs tracking-wider text-muted-foreground">{(t.apply as any).guardianPhoneLabel} <span className="text-primary">*</span></Label>
                          <Input
                            id="guardianPhone"
                            className="bg-background"
                            placeholder={(t.apply as any).guardianPhonePlaceholder}
                            value={guardian.phone}
                            onChange={e => setGuardian(p => ({ ...p, phone: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="guardianCountry" className="uppercase text-xs tracking-wider text-muted-foreground">{(t.apply as any).guardianCountryLabel} <span className="text-primary">*</span></Label>
                          <Input
                            id="guardianCountry"
                            className="bg-background"
                            placeholder={(t.apply as any).guardianCountryPlaceholder}
                            value={guardian.country}
                            onChange={e => setGuardian(p => ({ ...p, country: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-4 pt-2">
                        {([
                          ["authorizes", (t.apply as any).guardianConsentAuthorize],
                          ["terms", (t.apply as any).guardianConsentTerms],
                          ["data", (t.apply as any).guardianConsentData],
                          ["licenses", (t.apply as any).guardianConsentLicenses],
                        ] as const).map(([key, label]) => (
                          <div key={key} className="flex items-start gap-3">
                            <Checkbox
                              id={`guardian-${key}`}
                              checked={guardianChecks[key]}
                              onCheckedChange={(v) => setGuardianChecks(p => ({ ...p, [key]: !!v }))}
                              className="mt-0.5"
                            />
                            <Label htmlFor={`guardian-${key}`} className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="flex items-start gap-3 bg-zinc-950 border border-border rounded-md p-4">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(v) => setAgreed(!!v)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {t.apply.termsAgree}{" "}
                      <Link href="/legal-notice" target="_blank" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                        {t.apply.termsLinkLabel}
                      </Link>{" "}
                      {t.apply.termsAnd}{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                        {t.apply.privacyLinkLabel}
                      </Link>. {t.apply.termsConfirm}
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 font-heading text-xl uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]"
                    disabled={!agreed || !guardianComplete || submitApplication.isPending}
                  >
                    {submitApplication.isPending ? t.apply.submittingBtn : t.apply.submitBtn}
                  </Button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="py-8 border-t border-border bg-zinc-950">
        <div className="container text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-heading">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
