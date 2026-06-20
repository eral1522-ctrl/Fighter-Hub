import { Layout } from "@/components/layout";
import { useAdminGetStats, useAdminListFighters, useAdminListApplications, useAdminApproveFighter, useAdminRejectFighter, useAdminApproveApplication, useAdminRejectApplication, getAdminGetStatsQueryKey, getAdminListFightersQueryKey, getAdminListApplicationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export default function AdminPage() {
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useAdminGetStats();
  const { data: fighters, isLoading: isFightersLoading } = useAdminListFighters();
  const { data: applications, isLoading: isAppsLoading } = useAdminListApplications();

  const isUnauthorized = (statsError as any)?.status === 401 || (statsError as any)?.status === 403;

  const approveFighter = useAdminApproveFighter();
  const rejectFighter = useAdminRejectFighter();
  const approveApp = useAdminApproveApplication();
  const rejectApp = useAdminRejectApplication();

  const { toast } = useToast();
  const qc = useQueryClient();

  const invalidateAdmin = () => {
    qc.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
    qc.invalidateQueries({ queryKey: getAdminListFightersQueryKey() });
    qc.invalidateQueries({ queryKey: getAdminListApplicationsQueryKey() });
  };

  const handleFighterAction = (id: number, action: 'approve' | 'reject') => {
    const mutator = action === 'approve' ? approveFighter : rejectFighter;
    mutator.mutate({ id }, {
      onSuccess: () => {
        toast({ title: `Fighter ${action}d` });
        invalidateAdmin();
      },
      onError: () => toast({ title: "Action failed", variant: "destructive" })
    });
  };

  const handleAppAction = (id: number, action: 'approve' | 'reject') => {
    const mutator = action === 'approve' ? approveApp : rejectApp;
    mutator.mutate({ id }, {
      onSuccess: () => {
        toast({ title: `Application ${action}d` });
        invalidateAdmin();
      },
      onError: () => toast({ title: "Action failed", variant: "destructive" })
    });
  };

  if (isUnauthorized) {
    return (
      <Layout>
        <div className="container py-24 flex flex-col items-center text-center gap-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            This area is restricted to IFA administrators. If you believe you should have access, contact a system administrator.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">IFA Admin Panel</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">IFA Members</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold font-heading">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.totalFighters}</div></CardContent>
          </Card>
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider text-yellow-500">Pending Approval</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold font-heading text-yellow-500">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.pendingApproval}</div></CardContent>
          </Card>
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">Total Apps</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold font-heading">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.totalApplications}</div></CardContent>
          </Card>
          <Card className="bg-zinc-950 border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider text-yellow-500">Pending Apps</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold font-heading text-yellow-500">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.pendingApplications}</div></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fighters" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-6">
            <TabsTrigger value="fighters" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6">
              Member Approvals
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6">
              Fight Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fighters">
            <div className="bg-zinc-950 rounded-md border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-900 text-muted-foreground font-heading tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Fighter</th>
                    <th className="px-6 py-4">Record / Weight</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isFightersLoading ? (
                    <tr><td colSpan={4} className="p-6 text-center"><Skeleton className="h-10 w-full" /></td></tr>
                  ) : fighters?.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No fighters found.</td></tr>
                  ) : (
                    fighters?.map(f => (
                      <tr key={f.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold">{f.fullName}</div>
                          <div className="text-muted-foreground text-xs">{f.country}, {f.city}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono">{f.record}</div>
                          <div className="text-muted-foreground text-xs">{f.weightClass}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={f.approvalStatus === 'approved' ? 'default' : f.approvalStatus === 'rejected' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                            {f.approvalStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {f.approvalStatus === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10 border-green-500/20" onClick={() => handleFighterAction(f.id, 'approve')} disabled={approveFighter.isPending}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20" onClick={() => handleFighterAction(f.id, 'reject')} disabled={rejectFighter.isPending}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="bg-zinc-950 rounded-md border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-900 text-muted-foreground font-heading tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Fighter</th>
                    <th className="px-6 py-4">Opportunity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isAppsLoading ? (
                    <tr><td colSpan={4} className="p-6 text-center"><Skeleton className="h-10 w-full" /></td></tr>
                  ) : applications?.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No applications found.</td></tr>
                  ) : (
                    applications?.map(a => (
                      <tr key={a.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4 font-bold">{a.fighterName}</td>
                        <td className="px-6 py-4">
                          <div className="font-heading uppercase tracking-wide">{a.opportunityTitle}</div>
                          <div className="text-muted-foreground text-xs">{format(new Date(a.createdAt), "MMM d, yyyy")}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={a.status === 'approved' ? 'default' : a.status === 'rejected' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                            {a.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {a.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10 border-green-500/20" onClick={() => handleAppAction(a.id, 'approve')} disabled={approveApp.isPending}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20" onClick={() => handleAppAction(a.id, 'reject')} disabled={rejectApp.isPending}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}