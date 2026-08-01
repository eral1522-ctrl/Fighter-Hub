import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ShieldAlert, Plus, Pencil } from "lucide-react";
import { useState } from "react";

type Opportunity = {
  id: number;
  type: string;
  title: string;
  description: string;
  location: string | null;
  date: string | null;
  weightClass: string | null;
  compensation: string | null;
  purse: string | null;
  status: string;
  country: string | null;
  city: string | null;
  sport: string | null;
  level: string | null;
  travelIncluded: boolean | null;
  accommodationIncluded: boolean | null;
  promoterOrganization: string | null;
  gender: string | null;
  requiredExperience: string | null;
  applicationDeadline: string | null;
  travelAccommodationDetails: string | null;
  memberOnlyDetails: string | null;
  applicationInstructions: string | null;
  adminVerificationNotes: string | null;
  expirationDate: string | null;
};

const STATUSES = ["draft", "under_review", "verified", "published", "closed", "archived"];

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-zinc-800 text-zinc-300 border-zinc-700",
  under_review: "bg-amber-950 text-amber-400 border-amber-900",
  verified: "bg-blue-950 text-blue-400 border-blue-900",
  published: "bg-green-950 text-green-400 border-green-900",
  closed: "bg-zinc-900 text-zinc-500 border-zinc-800",
  archived: "bg-zinc-900 text-zinc-600 border-zinc-800",
};

async function fetchOpportunities(): Promise<Opportunity[]> {
  const res = await fetch("/api/admin/opportunities");
  if (!res.ok) throw { status: res.status, ...(await res.json().catch(() => ({}))) };
  return res.json();
}

async function updateOpportunity(id: number, patch: Partial<Opportunity>): Promise<Opportunity> {
  const res = await fetch(`/api/admin/opportunities/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw await res.json().catch(() => ({ error: "Update failed" }));
  return res.json();
}

async function createOpportunity(body: Record<string, unknown>): Promise<Opportunity> {
  const res = await fetch("/api/admin/opportunities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json().catch(() => ({ error: "Create failed" }));
  return res.json();
}

function NewOpportunityForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("fight");
  const [description, setDescription] = useState("");
  const [promoterOrganization, setPromoterOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");
  const [weightClass, setWeightClass] = useState("");

  const create = useMutation({
    mutationFn: createOpportunity,
    onSuccess: () => {
      toast({ title: "Opportunity created as Draft" });
      setOpen(false);
      setTitle(""); setDescription(""); setPromoterOrganization("");
      setCountry(""); setCity(""); setSport(""); setWeightClass("");
      onCreated();
    },
    onError: (err: any) => toast({ title: "Failed to create", description: err?.error, variant: "destructive" }),
  });

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="font-heading uppercase tracking-wider">
        <Plus className="h-4 w-4 mr-2" /> New Opportunity
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader><CardTitle className="text-base">New Opportunity (created as Draft)</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fight">Fight</SelectItem>
                <SelectItem value="sponsor">Sponsor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Promoter / Organization</Label>
            <Input value={promoterOrganization} onChange={(e) => setPromoterOrganization(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Sport / Discipline</Label>
            <Input value={sport} onChange={(e) => setSport(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Country</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Weight Class</Label>
            <Input value={weightClass} onChange={(e) => setWeightClass(e.target.value)} />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Public Description</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!title || !description || create.isPending}
            onClick={() => create.mutate({ title, type, description, promoterOrganization, country, city, sport, weightClass })}
          >
            Create Draft
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OpportunityRow({ opp, onUpdated }: { opp: Opportunity; onUpdated: () => void }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(opp.adminVerificationNotes ?? "");
  const [expirationDate, setExpirationDate] = useState(opp.expirationDate ?? "");

  const update = useMutation({
    mutationFn: (patch: Partial<Opportunity>) => updateOpportunity(opp.id, patch),
    onSuccess: () => { toast({ title: "Updated" }); onUpdated(); },
    onError: (err: any) => toast({ title: "Update failed", description: err?.error, variant: "destructive" }),
  });

  const isExpired = opp.expirationDate ? opp.expirationDate < new Date().toISOString().slice(0, 10) : false;

  return (
    <div className="border border-border rounded-md p-4 bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <div className="font-heading text-sm uppercase tracking-wide">{opp.title}</div>
          <div className="text-xs text-muted-foreground">
            {opp.type} · {opp.promoterOrganization || "no promoter set"} · {[opp.city, opp.country].filter(Boolean).join(", ") || "no location"}
            {opp.expirationDate && <span className={isExpired ? "text-destructive" : ""}> · expires {opp.expirationDate}{isExpired ? " (expired, hidden from public)" : ""}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`border ${STATUS_STYLE[opp.status] ?? ""}`}>{opp.status}</Badge>
          <Select value={opp.status} onValueChange={(status) => update.mutate({ status })}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {editing && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          <div>
            <Label className="text-xs">Expiration date (auto-hides from public after this date)</Label>
            <Input type="date" className="mt-1 h-9 max-w-[200px]" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Admin verification notes (never shown to anyone but admins)</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
          </div>
          <Button size="sm" onClick={() => update.mutate({ adminVerificationNotes: notes, expirationDate: expirationDate || null })}>Save</Button>
        </div>
      )}
    </div>
  );
}

export default function AdminOpportunitiesPage() {
  const qc = useQueryClient();
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ["admin-opportunities"],
    queryFn: fetchOpportunities,
  });

  const isUnauthorized = (error as any)?.status === 401 || (error as any)?.status === 403;
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-opportunities"] });

  if (isUnauthorized) {
    return (
      <Layout>
        <div className="container py-24 flex flex-col items-center text-center gap-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            This area is restricted to IFA administrators.
          </p>
        </div>
      </Layout>
    );
  }

  const byStatus = (status: string) => (opportunities ?? []).filter((o) => o.status === status);

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Opportunities</h1>
          </div>
          <NewOpportunityForm onCreated={invalidate} />
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          New opportunities start as <strong>Draft</strong> and are never shown publicly until moved to{" "}
          <strong>Published</strong> (or Closing Soon / Matched / Closed). Draft and Verified stay admin-only.
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (opportunities ?? []).length === 0 ? (
          <p className="text-muted-foreground text-sm">No opportunities yet.</p>
        ) : (
          <div className="space-y-6">
            {STATUSES.map((status) => {
              const items = byStatus(status);
              if (items.length === 0) return null;
              return (
                <div key={status}>
                  <h2 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    {status} ({items.length})
                  </h2>
                  <div className="space-y-2">
                    {items.map((opp) => <OpportunityRow key={opp.id} opp={opp} onUpdated={invalidate} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
