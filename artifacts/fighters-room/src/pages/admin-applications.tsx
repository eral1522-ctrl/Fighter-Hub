import { Layout } from "@/components/layout";
import {
  useAdminListFighterApplications,
  useAdminUpdateFighterApplication,
  getAdminListFighterApplicationsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Search, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";

type Status = "pending" | "approved" | "rejected";
type PaymentStatus = "not_paid" | "paid";

function statusBadge(status: string) {
  if (status === "approved") return <Badge className="uppercase text-[10px] bg-green-900 text-green-100 border-green-800">Approved</Badge>;
  if (status === "rejected") return <Badge variant="destructive" className="uppercase text-[10px]">Rejected</Badge>;
  return <Badge variant="secondary" className="uppercase text-[10px]">Pending</Badge>;
}

function paymentBadge(ps: string) {
  if (ps === "paid") return <Badge className="uppercase text-[10px] bg-emerald-900 text-emerald-100 border-emerald-700">Paid</Badge>;
  return <Badge variant="outline" className="uppercase text-[10px] border-yellow-700/50 text-yellow-500">Not Paid</Badge>;
}

export default function AdminApplicationsPage() {
  const { data: applications, isLoading } = useAdminListFighterApplications();
  const updateApplication = useAdminUpdateFighterApplication();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<number, boolean>>({});

  // Search & filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getAdminListFighterApplicationsQueryKey() });
  };

  const handleStatusChange = (id: number, status: Status) => {
    updateApplication.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `Application marked as ${status}` });
          invalidate();
        },
        onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
      }
    );
  };

  const handlePaymentStatusChange = (id: number, paymentStatus: PaymentStatus) => {
    updateApplication.mutate(
      { id, data: { paymentStatus } },
      {
        onSuccess: () => {
          toast({ title: paymentStatus === "paid" ? "Marked as Paid ✓" : "Marked as Not Paid" });
          invalidate();
        },
        onError: () => toast({ title: "Failed to update payment status", variant: "destructive" }),
      }
    );
  };

  const handleNotesChange = (id: number, value: string) => {
    setEditingNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleNotesSave = (id: number) => {
    const current = applications?.find(a => a.id === id)?.adminNotes ?? null;
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    updateApplication.mutate(
      { id, data: { adminNotes: editingNotes[id] !== undefined ? editingNotes[id] : current } },
      {
        onSuccess: () => {
          toast({ title: "Notes saved" });
          invalidate();
          setSavingNotes(prev => ({ ...prev, [id]: false }));
        },
        onError: () => {
          toast({ title: "Failed to save notes", variant: "destructive" });
          setSavingNotes(prev => ({ ...prev, [id]: false }));
        },
      }
    );
  };

  // Derive unique filter options from data
  const countries = useMemo(() => {
    if (!applications) return [];
    return Array.from(new Set(applications.map(a => a.country))).sort();
  }, [applications]);

  const disciplines = useMemo(() => {
    if (!applications) return [];
    return Array.from(new Set(applications.map(a => a.discipline))).sort();
  }, [applications]);

  // Client-side filtering
  const filtered = useMemo(() => {
    if (!applications) return [];
    const q = search.toLowerCase();
    return applications.filter(app => {
      const matchesSearch = !q || (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.country.toLowerCase().includes(q)
      );
      const matchesStatus = filterStatus === "all" || app.status === filterStatus;
      const matchesCountry = filterCountry === "all" || app.country === filterCountry;
      const matchesDiscipline = filterDiscipline === "all" || app.discipline === filterDiscipline;
      return matchesSearch && matchesStatus && matchesCountry && matchesDiscipline;
    });
  }, [applications, search, filterStatus, filterCountry, filterDiscipline]);

  const pending = applications?.filter(a => a.status === "pending").length ?? 0;
  const paid = applications?.filter(a => a.paymentStatus === "paid").length ?? 0;

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">Fighter Applications</h1>
            <p className="text-muted-foreground text-sm mt-1">Public /apply form submissions — review, update status, and manage payment.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading">{isLoading ? <Skeleton className="h-8 w-12" /> : applications?.length ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider text-yellow-500">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-yellow-500">{isLoading ? <Skeleton className="h-8 w-12" /> : pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider text-green-500">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-green-500">{isLoading ? <Skeleton className="h-8 w-12" /> : applications?.filter(a => a.status === "approved").length ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider text-emerald-400 flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-emerald-400">{isLoading ? <Skeleton className="h-8 w-12" /> : paid}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="bg-zinc-950 border border-border rounded-md p-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-background pl-9 font-medium"
              placeholder="Search by name, email or country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading">Status</p>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background text-xs font-heading uppercase tracking-wider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading">Country</p>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="bg-background text-xs font-heading uppercase tracking-wider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading">Discipline</p>
              <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
                <SelectTrigger className="bg-background text-xs font-heading uppercase tracking-wider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(search || filterStatus !== "all" || filterCountry !== "all" || filterDiscipline !== "all") && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? "s" : ""} shown</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-heading uppercase tracking-wider text-muted-foreground"
                onClick={() => { setSearch(""); setFilterStatus("all"); setFilterCountry("all"); setFilterDiscipline("all"); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-md border border-dashed border-border">
            <p className="text-muted-foreground">
              {applications?.length === 0
                ? "No applications yet. They will appear here when fighters submit the /apply form."
                : "No results match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => {
              const notesValue = editingNotes[app.id] !== undefined ? editingNotes[app.id] : (app.adminNotes ?? "");
              return (
                <div key={app.id} className="bg-zinc-950 border border-border rounded-md overflow-hidden">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-border/50">
                    <div className="flex flex-wrap items-center gap-3">
                      {statusBadge(app.status)}
                      {paymentBadge(app.paymentStatus)}
                      <h3 className="font-heading text-xl uppercase tracking-wide">{app.name}</h3>
                      <span className="text-xs text-muted-foreground">{format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    {/* Controls */}
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Status selector */}
                      <Select
                        value={app.status}
                        onValueChange={(v) => handleStatusChange(app.id, v as Status)}
                        disabled={updateApplication.isPending}
                      >
                        <SelectTrigger className="w-36 bg-background text-xs font-heading uppercase tracking-wider">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Payment toggle */}
                      <Button
                        size="sm"
                        variant={app.paymentStatus === "paid" ? "default" : "outline"}
                        className={`font-heading uppercase tracking-wider text-xs shrink-0 ${app.paymentStatus === "paid" ? "bg-emerald-700 hover:bg-emerald-600 text-white border-0" : "border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/20"}`}
                        onClick={() => handlePaymentStatusChange(app.id, app.paymentStatus === "paid" ? "not_paid" : "paid")}
                        disabled={updateApplication.isPending}
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        {app.paymentStatus === "paid" ? "Paid ✓" : "Mark Paid"}
                      </Button>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Email</div>
                        <div className="font-medium truncate">{app.email}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Country</div>
                        <div className="font-medium">{app.country}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Discipline</div>
                        <div className="font-medium">{app.discipline}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Weight Class</div>
                        <div className="font-medium">{app.weightClass}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Record</div>
                        <div className="font-mono font-bold text-primary">{app.record}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Submitted</div>
                        <div className="font-medium text-xs">{format(new Date(app.createdAt), "MMM d, yyyy HH:mm")}</div>
                      </div>
                    </div>

                    {app.bio && (
                      <div className="mb-4 text-sm text-muted-foreground italic bg-background border border-border rounded p-3">
                        "{app.bio}"
                      </div>
                    )}

                    {/* Admin notes */}
                    <div className="flex flex-col sm:flex-row gap-2 items-start">
                      <Textarea
                        placeholder="Internal admin notes..."
                        className="bg-background resize-none h-16 text-sm flex-1"
                        value={notesValue}
                        onChange={e => handleNotesChange(app.id, e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-heading uppercase tracking-wider text-xs shrink-0"
                        onClick={() => handleNotesSave(app.id)}
                        disabled={savingNotes[app.id]}
                      >
                        {savingNotes[app.id] ? "Saving..." : "Save Notes"}
                      </Button>
                    </div>
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
