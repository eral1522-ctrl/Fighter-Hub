import { Layout } from "@/components/layout";
import {
  useAdminListFighterApplications,
  useAdminUpdateFighterApplication,
  useAdminSendPaymentLink,
  useAdminGetFighterApplicationEmailLog,
  getAdminGetFighterApplicationEmailLogQueryKey,
  getAdminListFighterApplicationsQueryKey,
} from "@workspace/api-client-react";
import type { AdminListFighterApplicationsStatus, EmailLogEntry } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ShieldAlert, Search, CreditCard, Send, Link2, FlaskConical, CheckCircle2, AlertTriangle, Mail, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

// Inline fetcher for the test-email endpoint (not in generated hooks)
async function postAdminTestEmail(): Promise<{ success?: boolean; sentTo?: string; error?: string; errorType?: string; smtpConfig?: Record<string, unknown> }> {
  const res = await fetch("/api/admin/test-email", { method: "POST" });
  return res.json();
}

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

const EMAIL_TYPE_LABELS: Record<string, string> = {
  confirmation: "Application Confirmation",
  admin_notification: "Admin Notification",
  payment_link: "Payment Link",
  approval: "Approval",
  rejection: "Rejection",
};

function emailTypeLabel(type: string): string {
  return EMAIL_TYPE_LABELS[type] ?? type;
}

function EmailHistory({ applicationId }: { applicationId: number }) {
  const [open, setOpen] = useState(false);
  const { data: logs, isLoading } = useAdminGetFighterApplicationEmailLog(applicationId, {
    query: {
      queryKey: getAdminGetFighterApplicationEmailLogQueryKey(applicationId),
      enabled: open,
    },
  });

  return (
    <div className="border border-border/40 rounded-md overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 hover:bg-zinc-900 transition-colors text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">Email History</span>
          {logs && logs.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{logs.length}</Badge>
          )}
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 py-3 space-y-2 bg-zinc-950/50">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !logs || logs.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-1">No emails sent yet for this application.</p>
          ) : (
            <div className="space-y-1.5">
              {logs.map((entry: EmailLogEntry) => (
                <div
                  key={entry.id}
                  className={`flex items-start gap-3 rounded px-3 py-2 text-xs border ${
                    entry.success
                      ? "bg-green-950/20 border-green-900/30"
                      : "bg-red-950/20 border-red-900/30"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {entry.success
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                      : <XCircle className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={`font-semibold ${entry.success ? "text-green-300" : "text-red-300"}`}>
                        {emailTypeLabel(entry.emailType)}
                      </span>
                      <span className="text-muted-foreground">→ {entry.recipientEmail}</span>
                    </div>
                    {entry.errorMessage && (
                      <p className="text-red-400/80 mt-0.5 truncate" title={entry.errorMessage}>{entry.errorMessage}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-muted-foreground whitespace-nowrap">
                    {format(new Date(entry.sentAt), "MMM d, HH:mm")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminApplicationsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<number, boolean>>({});
  const [paymentLinks, setPaymentLinks] = useState<Record<number, string>>({});
  const [sendingLink, setSendingLink] = useState<Record<number, boolean>>({});
  const [testEmailResult, setTestEmailResult] = useState<{ ok: boolean; msg: string; config?: Record<string, unknown> } | null>(null);

  const testEmail = useMutation({
    mutationFn: postAdminTestEmail,
    onSuccess: (data) => {
      if (data.success) {
        setTestEmailResult({ ok: true, msg: `Test email sent to ${data.sentTo}`, config: data.smtpConfig });
        toast({ title: `Test email sent to ${data.sentTo} ✓` });
      } else {
        const errorType = data.errorType ?? "Unknown SMTP error";
        const detail = data.error ?? "Unknown error";
        setTestEmailResult({ ok: false, msg: `${errorType}: ${detail}`, config: data.smtpConfig });
        console.error("[IFA] Test email failed:", errorType, detail, data.smtpConfig);
        toast({ title: errorType, description: detail, variant: "destructive" });
      }
    },
    onError: (err: any) => {
      const msg = err?.message ?? "Request failed";
      setTestEmailResult({ ok: false, msg });
      toast({ title: "Unknown SMTP error", description: msg, variant: "destructive" });
    },
  });

  // Search & filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");

  // Debounce the search query so we don't fire an API request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Build API-level params — status, discipline, and text search are handled server-side
  const apiParams = useMemo(() => ({
    q: debouncedSearch.trim() || undefined,
    status: (filterStatus !== "all" ? filterStatus : undefined) as AdminListFighterApplicationsStatus | undefined,
    discipline: filterDiscipline !== "all" ? filterDiscipline : undefined,
  }), [debouncedSearch, filterStatus, filterDiscipline]);

  const { data: applications, isLoading } = useAdminListFighterApplications(apiParams);
  const updateApplication = useAdminUpdateFighterApplication();
  const sendPaymentLink = useAdminSendPaymentLink();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getAdminListFighterApplicationsQueryKey() });
  };

  const invalidateEmailLog = (id: number) => {
    // Approval/rejection emails are fire-and-forget on the server side,
    // so we delay slightly to give the server time to write the log entry.
    setTimeout(() => {
      qc.invalidateQueries({ queryKey: getAdminGetFighterApplicationEmailLogQueryKey(id) });
    }, 1500);
  };

  const handleStatusChange = (id: number, status: Status) => {
    updateApplication.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `Application marked as ${status}` });
          invalidate();
          if (status === "approved" || status === "rejected") {
            invalidateEmailLog(id);
          }
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

  const handleSendPaymentLink = (id: number, app: { name: string; email: string; paymentLink?: string | null }) => {
    const link = paymentLinks[id] ?? app.paymentLink ?? "";
    if (!link.trim()) {
      toast({ title: "Paste a payment link first", variant: "destructive" });
      return;
    }
    setSendingLink(prev => ({ ...prev, [id]: true }));
    sendPaymentLink.mutate(
      { id, data: { paymentLink: link.trim() } },
      {
        onSuccess: () => {
          toast({ title: `Payment link sent to ${app.email} ✓` });
          invalidate();
          qc.invalidateQueries({ queryKey: getAdminGetFighterApplicationEmailLogQueryKey(id) });
          setPaymentLinks(prev => ({ ...prev, [id]: "" }));
          setSendingLink(prev => ({ ...prev, [id]: false }));
        },
        onError: (err: any) => {
          const data = (err as any)?.response?.data ?? {};
          const errorType: string = data?.errorType ?? "Unknown SMTP error";
          const detail: string = data?.error ?? "Failed to send email";
          const cfg = data?.smtpConfig;
          // Log full SMTP context with password hidden
          console.error(
            `[IFA] Send payment link failed — ${errorType}: ${detail}`,
            cfg
              ? `\nSMTP_HOST=${cfg.SMTP_HOST ?? "NOT SET"} SMTP_PORT=${cfg.SMTP_PORT} SMTP_USER=${cfg.SMTP_USER ?? "NOT SET"} SMTP_PASS=${cfg.SMTP_PASS} SMTP_FROM=${cfg.SMTP_FROM}`
              : "(no SMTP config returned)",
          );
          toast({
            title: errorType,
            description: detail,
            variant: "destructive",
          });
          setSendingLink(prev => ({ ...prev, [id]: false }));
        },
      }
    );
  };

  // Derive unique country options from the currently returned (already server-filtered) data
  const countries = useMemo(() => {
    if (!applications) return [];
    return Array.from(new Set(applications.map(a => a.country))).sort();
  }, [applications]);

  // Derive unique discipline options from the full unfiltered dataset so the
  // discipline dropdown stays stable regardless of other active filters.
  // Server-side filtering handles status + discipline + search; we only apply
  // country client-side since it isn't a server param.
  const filtered = useMemo(() => {
    if (!applications) return [];
    if (filterCountry === "all") return applications;
    return applications.filter(app => app.country === filterCountry);
  }, [applications, filterCountry]);

  const pending = applications?.filter(a => a.status === "pending").length ?? 0;
  const paid = applications?.filter(a => a.paymentStatus === "paid").length ?? 0;

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">Fighter Applications</h1>
              <p className="text-muted-foreground text-sm mt-1">Review applications, send payment links, and manage membership status.</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-400 hover:text-white gap-2 shrink-0"
            onClick={() => { setTestEmailResult(null); testEmail.mutate(); }}
            disabled={testEmail.isPending}
          >
            <FlaskConical className="h-4 w-4" />
            {testEmail.isPending ? "Sending…" : "Test Email Config"}
          </Button>
        </div>

        {/* SMTP test result panel */}
        {testEmailResult && (
          <div className={`mb-6 rounded border p-4 text-sm ${testEmailResult.ok ? "border-green-800 bg-green-950/40" : "border-red-800 bg-red-950/40"}`}>
            <div className="flex items-start gap-3">
              {testEmailResult.ok
                ? <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                : <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${testEmailResult.ok ? "text-green-300" : "text-red-300"}`}>{testEmailResult.msg}</p>
                {testEmailResult.config && (
                  <div className="mt-2 font-mono text-xs text-zinc-400 space-y-0.5">
                    <div>SMTP_HOST: <span className="text-zinc-200">{String(testEmailResult.config.SMTP_HOST ?? "NOT SET")}</span></div>
                    <div>SMTP_PORT: <span className="text-zinc-200">{String(testEmailResult.config.SMTP_PORT)}</span></div>
                    <div>SMTP_USER: <span className="text-zinc-200">{String(testEmailResult.config.SMTP_USER ?? "NOT SET")}</span></div>
                    <div>SMTP_PASS: <span className="text-zinc-200">{String(testEmailResult.config.SMTP_PASS)}</span></div>
                    <div>SMTP_FROM: <span className="text-zinc-200">{String(testEmailResult.config.SMTP_FROM)}</span></div>
                  </div>
                )}
              </div>
              <button onClick={() => setTestEmailResult(null)} className="text-zinc-500 hover:text-zinc-300 text-lg leading-none ml-2">×</button>
            </div>
          </div>
        )}

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
              placeholder="Search by name or email..."
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
                  <SelectItem value="Boxing">Boxing</SelectItem>
                  <SelectItem value="MMA">MMA</SelectItem>
                  <SelectItem value="Kickboxing">Kickboxing</SelectItem>
                  <SelectItem value="Muay Thai">Muay Thai</SelectItem>
                  <SelectItem value="Wrestling">Wrestling</SelectItem>
                  <SelectItem value="Judo">Judo</SelectItem>
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
              const linkValue = paymentLinks[app.id] !== undefined ? paymentLinks[app.id] : (app.paymentLink ?? "");
              const isSending = sendingLink[app.id] ?? false;
              const isApproved = app.status === "approved";

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
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
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

                    {app.boxrecLink && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">BoxRec</div>
                        <a
                          href={app.boxrecLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-primary hover:underline truncate font-medium"
                        >
                          <Link2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{app.boxrecLink}</span>
                        </a>
                      </div>
                    )}

                    {app.bio && (
                      <div className="text-sm text-muted-foreground italic bg-background border border-border rounded p-3">
                        "{app.bio}"
                      </div>
                    )}

                    {/* Payment Link — only shown for approved applications */}
                    {isApproved && (
                      <div className="bg-background border border-primary/20 rounded-md p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Link2 className="h-4 w-4 text-primary" />
                          <p className="text-xs font-bold uppercase tracking-widest text-primary font-heading">
                            Payment Link
                          </p>
                          {app.paymentLink && (
                            <span className="text-xs text-muted-foreground italic ml-auto truncate max-w-[200px]">{app.paymentLink}</span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            className="bg-zinc-950 flex-1 text-sm placeholder:text-muted-foreground/50"
                            placeholder="Paste Stripe, PayPal or bank payment link..."
                            value={linkValue}
                            onChange={e => setPaymentLinks(prev => ({ ...prev, [app.id]: e.target.value }))}
                          />
                          <Button
                            size="sm"
                            className="font-heading uppercase tracking-wider text-xs shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleSendPaymentLink(app.id, app)}
                            disabled={isSending || !linkValue.trim()}
                          >
                            <Send className="h-3 w-3" />
                            {isSending ? "Sending..." : "Send Payment Link"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sends a bilingual EN/ES email to <span className="text-foreground">{app.email}</span> with the €20/month payment link. The link is saved automatically.
                        </p>
                      </div>
                    )}

                    {/* Email History */}
                    <EmailHistory applicationId={app.id} />

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
