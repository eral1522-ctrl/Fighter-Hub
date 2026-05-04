import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Trophy, DollarSign, Globe, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-3xl text-primary tracking-widest uppercase">FightersRoom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-heading tracking-wider">Log In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="font-heading uppercase tracking-wider font-bold">Join the Roster</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="container relative z-10 flex flex-col items-center text-center">
            <h1 className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter max-w-4xl leading-[0.85] text-foreground mb-6">
              Access fights, sponsors and global boxing opportunities.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-medium">
              This isn't a gym app. It's a serious business tool for working-class champions. Manage your career, apply for fights, and get paid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 font-heading text-xl uppercase tracking-wider font-bold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                  Create Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-32 bg-zinc-950 border-b border-border">
          <div className="container">
            <div className="mb-16">
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Why Roster With Us</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background border-border/50">
                <CardHeader>
                  <Trophy className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="font-heading text-2xl uppercase tracking-wide">Premium Bouts</CardTitle>
                  <CardDescription className="text-base">Access fight opportunities across the globe that match your weight class and record.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-border/50">
                <CardHeader>
                  <DollarSign className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="font-heading text-2xl uppercase tracking-wide">Sponsorships</CardTitle>
                  <CardDescription className="text-base">Connect with brands looking to sponsor serious fighters. Secure your financial backing.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background border-border/50">
                <CardHeader>
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="font-heading text-2xl uppercase tracking-wide">Global Reach</CardTitle>
                  <CardDescription className="text-base">Put your record in front of international promoters. Stop fighting locally, start fighting globally.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Membership Plans</h2>
              <p className="text-muted-foreground text-lg">Invest in your career. No hidden fees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic */}
              <Card className="bg-zinc-950 border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl uppercase">Basic</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold font-heading">€19</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Fighter profile listing", "Access to local fights", "Standard support"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button variant="outline" className="w-full font-heading uppercase tracking-wider">Select Basic</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Pro */}
              <Card className="bg-background border-primary relative transform md:-translate-y-4 shadow-[0_0_40px_-15px_hsl(var(--primary))]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl uppercase">Pro</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold font-heading">€49</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Premium profile listing", "International fight access", "Sponsorship applications", "Priority support"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full font-heading uppercase tracking-wider font-bold">Select Pro</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Annual */}
              <Card className="bg-zinc-950 border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl uppercase">Annual</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold font-heading">€299</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["All Pro features", "2 months free", "Dedicated manager", "Featured listing"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button variant="outline" className="w-full font-heading uppercase tracking-wider">Select Annual</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-zinc-950 text-center">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">FightersRoom © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}