import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ShieldAlert, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  category: string;
  photoUrl: string | null;
  bio: string | null;
  country: string | null;
  disciplineOrArea: string | null;
  externalUrl: string | null;
  active: boolean;
  sortOrder: number;
};

const CATEGORIES = ["board", "founding_fighter", "advisory", "legal", "medical", "partner"];
const CATEGORY_LABELS: Record<string, string> = {
  board: "Board Member",
  founding_fighter: "Founding Fighter",
  advisory: "Advisory Board",
  legal: "Legal Team / Partner",
  medical: "Medical & Athlete Welfare",
  partner: "Gym / Promoter / Strategic Partner",
};

async function fetchTeam(): Promise<TeamMember[]> {
  const res = await fetch("/api/admin/team");
  if (!res.ok) throw { status: res.status, ...(await res.json().catch(() => ({}))) };
  return res.json();
}

async function updateMember(id: number, patch: Partial<TeamMember>): Promise<TeamMember> {
  const res = await fetch(`/api/admin/team/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw await res.json().catch(() => ({ error: "Update failed" }));
  return res.json();
}

async function createMember(body: Record<string, unknown>): Promise<TeamMember> {
  const res = await fetch("/api/admin/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json().catch(() => ({ error: "Create failed" }));
  return res.json();
}

async function deleteMember(id: number): Promise<void> {
  const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
  if (!res.ok) throw await res.json().catch(() => ({ error: "Delete failed" }));
}

function NewMemberForm({ onCreated }: { onCreated: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("board");
  const [country, setCountry] = useState("");
  const [disciplineOrArea, setDisciplineOrArea] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const create = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast({ title: "Profile created (inactive by default — activate when ready)" });
      setOpen(false);
      setName(""); setRole(""); setCountry(""); setDisciplineOrArea("");
      setBio(""); setPhotoUrl(""); setExternalUrl("");
      onCreated();
    },
    onError: (err: any) => toast({ title: "Failed to create", description: err?.error, variant: "destructive" }),
  });

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="font-heading uppercase tracking-wider">
        <Plus className="h-4 w-4 mr-2" /> New Profile
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader><CardTitle className="text-base">New Team / Partner Profile</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Role / Title</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. President, Board Member" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Country</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Discipline / Area</Label>
            <Input value={disciplineOrArea} onChange={(e) => setDisciplineOrArea(e.target.value)} placeholder="e.g. Boxing, Sports Law" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Photo/Logo URL (optional)</Label>
            <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs mb-1.5 block">External URL (optional)</Label>
            <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Short Bio</Label>
          <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!name || !role || create.isPending}
            onClick={() => create.mutate({ name, role, category, country, disciplineOrArea, bio, photoUrl, externalUrl, active: false })}
          >
            Create Profile (inactive)
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MemberRow({ member, onUpdated }: { member: TeamMember; onUpdated: () => void }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = useMutation({
    mutationFn: (patch: Partial<TeamMember>) => updateMember(member.id, patch),
    onSuccess: () => { toast({ title: "Updated" }); onUpdated(); },
    onError: (err: any) => toast({ title: "Update failed", description: err?.error, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: () => deleteMember(member.id),
    onSuccess: () => { toast({ title: "Deleted" }); onUpdated(); },
    onError: (err: any) => toast({ title: "Delete failed", description: err?.error, variant: "destructive" }),
  });

  return (
    <div className="border border-border rounded-md p-4 bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-heading text-sm uppercase tracking-wide">{member.name}</div>
          <div className="text-xs text-muted-foreground">{member.role} · {[member.country, member.disciplineOrArea].filter(Boolean).join(" · ") || "no details set"}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={member.active} onCheckedChange={(active) => update.mutate({ active })} />
            <span className="text-xs text-muted-foreground">{member.active ? "Active (public)" : "Inactive"}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)}><Pencil className="h-3.5 w-3.5" /></Button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <Button size="sm" variant="destructive" onClick={() => del.mutate()}>Confirm</Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          )}
        </div>
      </div>
      {editing && (
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Sort Order (lower shows first)</Label>
            <Input type="number" defaultValue={member.sortOrder} onBlur={(e) => update.mutate({ sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <Label className="text-xs">Category</Label>
            <Select value={member.category} onValueChange={(category) => update.mutate({ category })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTeamPage() {
  const qc = useQueryClient();
  const { data: members, isLoading, error } = useQuery({ queryKey: ["admin-team"], queryFn: fetchTeam });

  const isUnauthorized = (error as any)?.status === 401 || (error as any)?.status === 403;
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-team"] });

  if (isUnauthorized) {
    return (
      <Layout>
        <div className="container py-24 flex flex-col items-center text-center gap-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">This area is restricted to IFA administrators.</p>
        </div>
      </Layout>
    );
  }

  const byCategory = (cat: string) => (members ?? []).filter((m) => m.category === cat);

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">People Behind IFA</h1>
          </div>
          <NewMemberForm onCreated={invalidate} />
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          New profiles start <strong>inactive</strong> and never show publicly until you switch them on.
          Categories with zero active profiles are hidden entirely on the public site — never fill one in with a placeholder.
        </p>

        {isLoading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : (members ?? []).length === 0 ? (
          <p className="text-muted-foreground text-sm">No profiles yet.</p>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const items = byCategory(cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <h2 className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    {CATEGORY_LABELS[cat]} ({items.length})
                  </h2>
                  <div className="space-y-2">
                    {items.map((m) => <MemberRow key={m.id} member={m} onUpdated={invalidate} />)}
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
