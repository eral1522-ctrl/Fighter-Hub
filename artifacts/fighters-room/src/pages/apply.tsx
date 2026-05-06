import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSubmitFighterApplication } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const WEIGHT_CLASSES = [
  "Strawweight", "Light Flyweight", "Flyweight", "Super Flyweight", "Bantamweight",
  "Super Bantamweight", "Featherweight", "Super Featherweight", "Lightweight",
  "Super Lightweight", "Welterweight", "Super Welterweight", "Middleweight",
  "Super Middleweight", "Light Heavyweight", "Cruiserweight", "Heavyweight", "Super Heavyweight",
];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", country: "", weightClass: "", record: "", discipline: "", bio: "", boxrecLink: "",
  });
  const [boxrecError, setBoxrecError] = useState("");

  const submitApplication = useSubmitFighterApplication();
  const { toast } = useToast();

  const isBoxing = form.discipline === "Boxing";

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "boxrecLink") setBoxrecError("");
    if (field === "discipline" && value !== "Boxing") setBoxrecError("");
  };

  const validateBoxrec = (): boolean => {
    if (!isBoxing) return true;
    if (!form.boxrecLink.trim()) {
      setBoxrecError("Please enter a valid BoxRec profile link. / Por favor introduce un enlace válido de BoxRec.");
      return false;
    }
    if (!form.boxrecLink.includes("boxrec.com")) {
      setBoxrecError("Please enter a valid BoxRec profile link. / Por favor introduce un enlace válido de BoxRec.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    if (!validateBoxrec()) return;

    submitApplication.mutate(
      { data: { ...form, bio: form.bio || null, boxrecLink: form.boxrecLink.trim() || null } },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
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
          <Link href="/sign-in">
            <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider text-xs">
              Already a member? Log In
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {submitted ? (
          /* Confirmation State */
          <div className="container py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto min-h-[70vh]">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Application Received</h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-6" />
            {/* English */}
            <p className="text-foreground text-base mb-3">
              Your application has been received. IFA will review your profile and contact you if selected.
            </p>
            {/* Spanish */}
            <p className="text-muted-foreground text-sm italic mb-8">
              Hemos recibido tu solicitud. IFA revisará tu perfil y te contactará si eres seleccionado.
            </p>
            <p className="text-muted-foreground text-xs mb-8">In the meantime, follow us on Instagram <span className="text-primary">@ifafighters</span> for the latest news and opportunities.</p>
            <Link href="/">
              <Button variant="outline" className="font-heading uppercase tracking-wider">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to IFA
              </Button>
            </Link>
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
                  Apply as Fighter
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Join the International Fighters Association. Tell us about yourself and we'll be in touch within 48 hours.
                </p>
              </div>
            </section>

            {/* Form Section */}
            <section className="py-16 md:py-24">
              <div className="container max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Info */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                    <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="uppercase text-xs tracking-wider text-muted-foreground">Full Name / Ring Name <span className="text-primary">*</span></Label>
                        <Input
                          id="name"
                          className="bg-background"
                          placeholder="Your name or fight name"
                          value={form.name}
                          onChange={e => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="uppercase text-xs tracking-wider text-muted-foreground">Email Address <span className="text-primary">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-background"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={e => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="country" className="uppercase text-xs tracking-wider text-muted-foreground">Country <span className="text-primary">*</span></Label>
                        <Input
                          id="country"
                          className="bg-background"
                          placeholder="Country of residence"
                          value={form.country}
                          onChange={e => handleChange("country", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Athletic Profile */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                    <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">Athletic Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="uppercase text-xs tracking-wider text-muted-foreground">Discipline <span className="text-primary">*</span></Label>
                        <Select value={form.discipline} onValueChange={v => handleChange("discipline", v)} required>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select discipline" />
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
                        <Label className="uppercase text-xs tracking-wider text-muted-foreground">Weight Class <span className="text-primary">*</span></Label>
                        <Select value={form.weightClass} onValueChange={v => handleChange("weightClass", v)} required>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select weight class" />
                          </SelectTrigger>
                          <SelectContent>
                            {WEIGHT_CLASSES.map(wc => (
                              <SelectItem key={wc} value={wc}>{wc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="record" className="uppercase text-xs tracking-wider text-muted-foreground">Professional Record <span className="text-primary">*</span></Label>
                        <Input
                          id="record"
                          className="bg-background font-mono text-center"
                          placeholder="W-L-D (e.g. 12-2-0)"
                          value={form.record}
                          onChange={e => handleChange("record", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="boxrecLink" className="uppercase text-xs tracking-wider text-muted-foreground">
                          BoxRec Profile Link {isBoxing ? <span className="text-primary">*</span> : <span className="text-muted-foreground/60">(optional)</span>}
                        </Label>
                        <Input
                          id="boxrecLink"
                          type="url"
                          className={`bg-background ${boxrecError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          placeholder="https://boxrec.com/en/proboxer/..."
                          value={form.boxrecLink}
                          onChange={e => handleChange("boxrecLink", e.target.value)}
                        />
                        {boxrecError && (
                          <p className="text-xs text-destructive mt-1">{boxrecError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="bg-zinc-950 border border-border rounded-md p-6 md:p-8 space-y-6">
                    <h2 className="font-heading text-xl uppercase tracking-wider border-b border-border/50 pb-3">About You</h2>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="uppercase text-xs tracking-wider text-muted-foreground">Short Bio</Label>
                      <Textarea
                        id="bio"
                        className="bg-background resize-none h-32"
                        placeholder="Tell us about your career, goals, and why you want to join the IFA..."
                        value={form.bio}
                        onChange={e => handleChange("bio", e.target.value)}
                      />
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
                      I agree to the IFA terms and conditions. I confirm that the information provided is accurate and that I am a licensed professional or amateur combat sports athlete.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 font-heading text-xl uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]"
                    disabled={!agreed || submitApplication.isPending}
                  >
                    {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="py-8 border-t border-border bg-zinc-950">
        <div className="container text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-heading">IFA – International Fighters Association © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
