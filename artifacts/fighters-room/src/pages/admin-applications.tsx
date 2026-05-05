import { Layout } from "@/components/layout";
import {
  useAdminListFighterApplications,
  useAdminUpdateFighterApplication,
  getAdminListFighterApplicationsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

type Status = "pending" | "approved" | "rejected";

function statusBadge(status: string) {
  if (status === "approved") return <Badge className="uppercase text-[10px] bg-green-900 text-green-100 border-green-800">Approved</Badge>;
  if (status === "rejected") return <Badge variant="destructive" className="uppercase text-[10px]">Rejected</Badge>;
  return <Badge variant="secondary" className="uppercase text-[10px]">Pending</Badge>;
}

export default function AdminApplicationsPage() {
  const { data: applications, isLoading } = useAdminListFighterApplications();
  const updateApplication = useAdminUpdateFighterApplication();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<number, boolean>>({});

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

  const pending = applications?.filter(a => a.status === "pending").length ?? 0;

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">Fighter Applications</h1>
            <p className="text-muted-foreground text-sm mt-1">Public /apply form submissions — review and update status below.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">Total Applications</CardTitle>
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
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        ) : applications?.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-md border border-dashed border-border">
            <p className="text-muted-foreground">No applications yet. They will appear here when fighters submit the /apply form.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications?.map(app => {
              const notesValue = editingNotes[app.id] !== undefined ? editingNotes[app.id] : (app.adminNotes ?? "");
              return (
                <div key={app.id} className="bg-zinc-950 border border-border rounded-md overflow-hidden">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {statusBadge(app.status)}
                      <h3 className="font-heading text-xl uppercase tracking-wide">{app.name}</h3>
                      <span className="text-xs text-muted-foreground">{format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                    </div>
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
