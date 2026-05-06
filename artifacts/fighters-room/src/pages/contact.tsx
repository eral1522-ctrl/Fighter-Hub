import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Instagram, CheckCircle2, Megaphone, Handshake } from "lucide-react";
import { PublicPageLayout } from "@/components/public-page-layout";

const SUBJECTS = [
  "General Inquiry",
  "Membership Question",
  "Fighter Application",
  "Media Inquiry",
  "Partnership / Sponsorship",
  "Event Booking",
  "Technical Support",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-3xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Get in Touch</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">Contact IFA</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our team is available to help fighters, promoters, sponsors, and media worldwide. We typically respond within 24–48 hours.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl uppercase tracking-wide mb-8">Send a Message</h2>
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-6 py-16 bg-zinc-950 border border-border rounded-md px-8">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <div>
                    <h3 className="font-heading text-2xl uppercase tracking-wide mb-3">Message Received</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Thank you for reaching out to IFA. Our team will review your message and respond within 24–48 hours.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSubmitted(false)} className="font-heading uppercase tracking-wider text-xs mt-2">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="uppercase text-xs tracking-wider text-muted-foreground">Full Name</Label>
                      <Input id="name" required placeholder="Your name" className="bg-zinc-950" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="uppercase text-xs tracking-wider text-muted-foreground">Email Address</Label>
                      <Input id="email" type="email" required placeholder="you@example.com" className="bg-zinc-950" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-xs tracking-wider text-muted-foreground">Subject</Label>
                    <Select onValueChange={setSubject} required>
                      <SelectTrigger className="bg-zinc-950">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="uppercase text-xs tracking-wider text-muted-foreground">Message</Label>
                    <Textarea
                      id="message"
                      required
                      placeholder="How can IFA help you?"
                      className="resize-none h-36 bg-zinc-950"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 font-heading uppercase tracking-wider font-bold">
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="font-heading text-2xl uppercase tracking-wide mb-6">Direct Contact</h2>
                <div className="space-y-4">
                  <a
                    href="mailto:info@fightersassociation.com"
                    className="flex items-center gap-4 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Email</div>
                      <div className="font-heading tracking-wide text-sm">info@fightersassociation.com</div>
                    </div>
                  </a>
                  <a
                    href="https://instagram.com/fighters_room"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-zinc-950 border border-border rounded-md px-6 py-4 hover:border-primary/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Instagram className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Instagram</div>
                      <div className="font-heading tracking-wide text-sm">@fighters_room</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Media Inquiries */}
              <div className="bg-zinc-950 border border-border rounded-md p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Megaphone className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-heading text-base uppercase tracking-wide">Media Inquiries</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Press releases, interviews, fighter profiles for editorial use, event accreditation, and official statements. Reference "Media Inquiry" in your subject line.
                </p>
                <a href="mailto:info@fightersassociation.com?subject=Media Inquiry" className="text-primary text-xs font-heading uppercase tracking-wider hover:underline">
                  media@fightersassociation.com →
                </a>
              </div>

              {/* Partnership Inquiries */}
              <div className="bg-zinc-950 border border-border rounded-md p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Handshake className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-heading text-base uppercase tracking-wide">Partnership &amp; Sponsorship</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Brand partnerships, event co-sponsorship, gym affiliation, regional federation agreements, and commercial inquiries. Reference "Partnership" in your subject line.
                </p>
                <a href="mailto:info@fightersassociation.com?subject=Partnership Inquiry" className="text-primary text-xs font-heading uppercase tracking-wider hover:underline">
                  partners@fightersassociation.com →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
