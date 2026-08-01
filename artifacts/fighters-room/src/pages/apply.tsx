import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
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

const TOTAL_STEPS = 3;

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
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [form, setForm] = useState({
    name: "", ringName: "", dateOfBirth: "", email: "", country: "", city: "",
    discipline: "", weightClass: "", record: "", sportingProfileUrl: "",
    gym: "", coach: "", manager: "", whatsapp: "", instagram: "",
    bio: "", careerObjective: "", competitionExperience: "",
  });
  const [boxrecError, setBoxrecError] = useState("");

  const submitApplication = useSubmitFighterApplication();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setStepError("");
    if (field === "sportingProfileUrl") setBoxrecError("");
    if (field === "discipline" && value !== "Boxing") setBoxrecError("");
  };

  // Validation is per-step, and never clears anything the user has
  // already typed — it just blocks Continue until the step's required
  // fields are filled.
  const step1Valid = Boolean(form.name.trim() && form.email.trim() && form.whatsapp.trim() && form.country.trim() && form.discipline.trim());
  const step2Valid = Boolean(form.dateOfBirth && form.city.trim() && form.weightClass && form.record.trim() && form.gym.trim() && form.coach.trim());

  const goToStep = (target: number) => {
    if (target > step) {
      if (step === 1 && !step1Valid) {
        setStepError(t.apply.stepIncomplete);
        return;
      }
      if (step === 2 && !step2Valid) {
        setStepError(t.apply.stepIncomplete);
        return;
      }
    }
    setStepError("");
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !step1Valid || !step2Valid) return;

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

  const stepTitle = step === 1 ? t.apply.step1Title : step === 2 ? t.apply.step2Title : t.apply.step3Title;
  const stepOfText = t.apply.stepOf.replace("{current}", String(step)).replace("{total}", String(TOTAL_STEPS));

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
            <section className="relative py-16 md:py-20 border-b border-border overflow-hidden">
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

            {/* Step Progress */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
              <div className="container max-w-2xl mx-auto py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-heading">{stepOfText}</span>
                  <span className="text-xs text-primary uppercase tracking-widest font-heading font-bold">{stepTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <section className="py-10 md:py-16">
              <div className="container max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* STEP 1: BASIC DETAILS */}
                  {step === 1 && (
                    <>
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

                      <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                        <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{t.apply.sectionPersonal}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.nameLabel} <span className="text-primary">*</span></Label>
                            <Input
                              id="name" autoFocus
                              className="bg-background"
                              placeholder={t.apply.namePlaceholder}
                              value={form.name}
                              onChange={e => handleChange("name", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="uppercase text-xs tracking-wider text-muted-foreground">{t.apply.emailLabel} <span className="text-primary">*</span></Label>
                            <Input
                              id="email"
                              type="email"
                              inputMode="email"
                              className="bg-background"
                              placeholder={t.apply.emailPlaceholder}
                              value={form.email}
                              onChange={e => handleChange("email", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="uppercase text-xs tracking-wider text-muted-foreground">
                              {t.apply.whatsappLabel} <span className="text-primary">*</span>
                            </Label>
                            <Input
                              id="whatsapp"
                              type="tel"
                              inputMode="tel"
                              className="bg-background"
                              placeholder={t.apply.whatsappPlaceholder}
                              value={form.whatsapp}
                              onChange={e => handleChange("whatsapp", e.target.value)}
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
                        </div>
                      </div>
                    </>
                  )}

                  {/* STEP 2: ATHLETIC PROFILE */}
                  {step === 2 && (
                    <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                      <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{t.apply.sectionAthletic}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="ringName" className="uppercase text-xs tracking-wider text-muted-foreground">
                            {t.apply.ringNameLabel} <span className="text-muted-foreground/60">{t.apply.boxrecOptional}</span>
                          </Label>
                          <Input
                            id="ringName" autoFocus
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
                  )}

                  {/* STEP 3: CAREER */}
                  {step === 3 && (
                    <>
                      <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                        <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">{t.apply.sectionBio}</h2>
                        <div className="space-y-2">
                          <Label htmlFor="instagram" className="uppercase text-xs tracking-wider text-muted-foreground">
                            {t.apply.instagramLabel} <span className="text-muted-foreground/60">{t.apply.instagramOptional}</span>
                          </Label>
                          <Input
                            id="instagram" autoFocus
                            className="bg-background"
                            placeholder={t.apply.instagramPlaceholder}
                            value={form.instagram}
                            onChange={e => handleChange("instagram", e.target.value)}
                          />
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

                      {/* Review */}
                      <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8">
                        <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3 mb-4">{t.apply.reviewHeading}</h2>
                        <p className="text-xs text-muted-foreground mb-5">{t.apply.reviewNote}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div><span className="text-muted-foreground">{t.apply.nameLabel}: </span><span className="text-foreground/90">{form.name || "—"}</span></div>
                          <div><span className="text-muted-foreground">{t.apply.emailLabel}: </span><span className="text-foreground/90">{form.email || "—"}</span></div>
                          <div><span className="text-muted-foreground">{t.apply.countryLabel}: </span><span className="text-foreground/90">{form.country || "—"}</span></div>
                          <div><span className="text-muted-foreground">{t.apply.disciplineLabel}: </span><span className="text-foreground/90">{form.discipline || "—"}</span></div>
                          <div><span className="text-muted-foreground">{t.apply.weightClassLabel}: </span><span className="text-foreground/90">{form.weightClass || "—"}</span></div>
                          <div><span className="text-muted-foreground">{t.apply.recordLabel}: </span><span className="text-foreground/90">{form.record || "—"}</span></div>
                        </div>
                      </div>

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

                      <p className="text-xs text-muted-foreground text-center">{t.apply.noPaymentNote}</p>
                    </>
                  )}

                  {stepError && (
                    <p className="text-sm text-destructive text-center" role="alert">{stepError}</p>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center gap-3">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1 h-14 font-heading text-base uppercase tracking-wider font-bold border-white/20"
                        onClick={() => goToStep(step - 1)}
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        {t.apply.backButton}
                      </Button>
                    )}
                    {step < TOTAL_STEPS ? (
                      <Button
                        type="button"
                        size="lg"
                        className="flex-1 h-14 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]"
                        onClick={() => goToStep(step + 1)}
                      >
                        {t.apply.continueButton}
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1 h-14 font-heading text-base uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]"
                        disabled={!agreed || submitApplication.isPending}
                      >
                        {submitApplication.isPending ? t.apply.submittingBtn : t.apply.submitBtn}
                      </Button>
                    )}
                  </div>
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
