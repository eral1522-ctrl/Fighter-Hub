import { Layout } from "@/components/layout";
import { useGetDashboardStats, useListOpportunities, useListEvents, useListMyApplications, useCreateApplication, getListMyApplicationsQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Scale, Coins, AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStats();
  const { data: opportunities, isLoading: isOppLoading } = useListOpportunities();
  const { data: events, isLoading: isEventsLoading } = useListEvents();
  const { data: applications, isLoading: isAppsLoading } = useListMyApplications();

  const createApplication = useCreateApplication();
  const { toast } = useToast();
  const qc = useQueryClient();

  const isPaid = stats?.paymentStatus === "paid";

  const handleApplyOpportunity = (id: number) => {
    if (!isPaid) return;
    createApplication.mutate({ data: { opportunityId: id } }, {
      onSuccess: () => {
        toast({ title: "Application sent", description: "You have successfully applied to this opportunity." });
        qc.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      },
      onError: (err: any) => {
        toast({ title: "Application failed", description: err?.response?.data?.error || "An error occurred", variant: "destructive" });
      }
    });
  };

  const handleApplyEvent = (id: number) => {
    if (!isPaid) return;
    createApplication.mutate({ data: { eventId: id } }, {
      onSuccess: () => {
        toast({ title: "Application sent", description: "You have successfully applied to this event." });
        qc.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      },
      onError: (err: any) => {
        toast({ title: "Application failed", description: err?.response?.data?.error || "An error occurred", variant: "destructive" });
      }
    });
  };

  const hasAppliedOpp = (oppId: number) => applications?.some(a => a.opportunityId === oppId);
  const hasAppliedEvent = (eventId: number) => applications?.some(a => a.eventId === eventId);

  const membershipCta = stats?.paymentLink || "https://wa.me/34603304636";

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">IFA Member Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your career and apply for IFA opportunities.</p>
          </div>

          {isStatsLoading ? (
            <Skeleton className="h-10 w-40" />
          ) : (
            <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-md border border-border">
              <Badge variant={stats?.approvalStatus === "approved" ? "default" : "secondary"} className="uppercase tracking-wider">
                {stats?.approvalStatus}
              </Badge>
              <Badge variant={isPaid ? "default" : "outline"} className="uppercase tracking-wider">
                {isPaid ? "IFA Pro" : "IFA Member"}
              </Badge>
            </div>
          )}
        </div>

        {/* Payment wall banner — not_paid */}
        {!isStatsLoading && !isPaid && (
          <div className="bg-primary/10 border border-primary/40 rounded-md p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Lock className="h-6 w-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <p className="font-heading font-bold text-base uppercase tracking-wide text-primary mb-0.5">
                Your membership is not active. Complete your €20/month membership to unlock full access.
              </p>
              <p className="text-sm text-muted-foreground">
                Tu membresía no está activa. Completa tu membresía de €20/mes para desbloquear acceso completo.
              </p>
            </div>
            <a href={membershipCta} target="_blank" rel="noopener noreferrer">
              <Button className="font-heading uppercase tracking-wider font-bold shrink-0 whitespace-nowrap">
                Complete Membership
              </Button>
            </a>
          </div>
        )}

        {/* Approval pending banner */}
        {stats?.approvalStatus === "pending" && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-md mb-8 flex items-start gap-3 text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold">Profile Pending Approval</h3>
              <p className="text-sm opacity-90">Your IFA profile is currently under review by our team. You can still browse opportunities, but applications may be restricted until approved.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">IFA Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.totalOpportunities}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.totalEvents}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.myApplications}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">Approved Fights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-primary">{isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.approvedApplications}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fights" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            <TabsTrigger value="fights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6">
              Fight Opportunities
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6">
              Sponsorships
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6">
              Events
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6">
              My Applications
            </TabsTrigger>
          </TabsList>

          {/* Fight Opportunities */}
          <TabsContent value="fights" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isOppLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-md" />) :
                opportunities?.filter(o => o.type === "fight").map(opp => (
                  <OpportunityCard
                    key={opp.id}
                    isPaid={isPaid}
                    membershipCta={membershipCta}
                    applied={!!hasAppliedOpp(opp.id)}
                    closed={opp.status === "closed"}
                    isPending={createApplication.isPending}
                    onApply={() => handleApplyOpportunity(opp.id)}
                    applyLabel="Apply for Fight"
                    variant="fight"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="uppercase">{opp.status}</Badge>
                      {opp.compensation && <Badge className="bg-green-900 text-green-100 border-green-800"><Coins className="w-3 h-3 mr-1" />{opp.compensation}</Badge>}
                    </div>
                    <CardTitle className="font-heading text-2xl uppercase mb-1">{opp.title}</CardTitle>
                    <CardDescription className={isPaid ? "line-clamp-2" : "line-clamp-1 blur-[3px] select-none pointer-events-none"}>
                      {opp.description}
                    </CardDescription>
                    {isPaid && (
                      <div className="space-y-2 text-sm text-muted-foreground mt-4">
                        {opp.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{opp.location}</div>}
                        {opp.date && <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{format(new Date(opp.date), "MMM d, yyyy")}</div>}
                        {opp.weightClass && <div className="flex items-center"><Scale className="w-4 h-4 mr-2" />{opp.weightClass}</div>}
                      </div>
                    )}
                  </OpportunityCard>
                ))}
            </div>
          </TabsContent>

          {/* Sponsorships */}
          <TabsContent value="sponsors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities?.filter(o => o.type === "sponsor").map(opp => (
                <OpportunityCard
                  key={opp.id}
                  isPaid={isPaid}
                  membershipCta={membershipCta}
                  applied={!!hasAppliedOpp(opp.id)}
                  closed={opp.status === "closed"}
                  isPending={createApplication.isPending}
                  onApply={() => handleApplyOpportunity(opp.id)}
                  applyLabel="Apply for Sponsorship"
                  variant="sponsor"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="uppercase bg-primary/20 text-primary border-primary/30">Sponsorship</Badge>
                    {opp.compensation && <Badge className="bg-green-900 text-green-100 border-green-800"><Coins className="w-3 h-3 mr-1" />{opp.compensation}</Badge>}
                  </div>
                  <CardTitle className="font-heading text-2xl uppercase mb-1">{opp.title}</CardTitle>
                  <CardDescription className={isPaid ? "line-clamp-2" : "line-clamp-1 blur-[3px] select-none pointer-events-none"}>
                    {opp.description}
                  </CardDescription>
                  {isPaid && opp.location && (
                    <div className="space-y-2 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{opp.location}</div>
                    </div>
                  )}
                </OpportunityCard>
              ))}
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEventsLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-md" />) :
                events?.map(event => (
                  <Card key={event.id} className="flex flex-col overflow-hidden">
                    <CardHeader className="bg-zinc-900/50 border-b border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="uppercase">{event.status}</Badge>
                        <span className="text-xs font-bold text-muted-foreground uppercase">{event.promoter}</span>
                      </div>
                      <CardTitle className="font-heading text-2xl uppercase">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pt-4">
                      <p className={`text-sm mb-4 line-clamp-2 text-muted-foreground ${!isPaid ? "blur-[3px] select-none pointer-events-none" : ""}`}>
                        {event.description}
                      </p>
                      {isPaid ? (
                        <div className="space-y-2 text-sm font-medium">
                          <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" />{format(new Date(event.date), "MMMM d, yyyy")}</div>
                          <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" />{event.location}</div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm font-medium blur-[3px] select-none pointer-events-none">
                          <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" />██████████</div>
                          <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" />████████</div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {isPaid ? (
                        <Button
                          className="w-full font-heading uppercase tracking-wider font-bold"
                          onClick={() => handleApplyEvent(event.id)}
                          disabled={hasAppliedEvent(event.id) || event.status === "cancelled" || event.status === "past" || createApplication.isPending}
                        >
                          {hasAppliedEvent(event.id) ? "Applied" : "Apply to Fight on Card"}
                        </Button>
                      ) : (
                        <PaywallButton membershipCta={membershipCta} />
                      )}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* My Applications */}
          <TabsContent value="applications" className="mt-6">
            <div className="space-y-4">
              {isAppsLoading ? <Skeleton className="h-40 w-full" /> : applications?.length === 0 ? (
                <div className="text-center py-12 bg-zinc-950 rounded-md border border-dashed border-border">
                  <p className="text-muted-foreground">You haven't applied to anything yet.</p>
                </div>
              ) : (
                applications?.map(app => (
                  <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-950 border border-border rounded-md gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"} className="uppercase text-[10px]">
                          {app.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{app.opportunityId ? "Opportunity" : "Event"}</span>
                      </div>
                      <h3 className="font-heading text-xl uppercase">{app.opportunityTitle}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Applied on {format(new Date(app.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    {app.message && (
                      <div className="text-sm max-w-xs text-muted-foreground italic">
                        "{app.message}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

/* ── Shared paywall CTA button ── */
function PaywallButton({ membershipCta }: { membershipCta: string }) {
  return (
    <a href={membershipCta} target="_blank" rel="noopener noreferrer" className="w-full">
      <Button variant="outline" className="w-full font-heading uppercase tracking-wider font-bold border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground gap-2">
        <Lock className="w-4 h-4" />
        Unlock full access with IFA Membership (€20/month)
      </Button>
    </a>
  );
}

/* ── Generic opportunity card with paywall support ── */
interface OpportunityCardProps {
  isPaid: boolean;
  membershipCta: string;
  applied: boolean;
  closed: boolean;
  isPending: boolean;
  onApply: () => void;
  applyLabel: string;
  variant: "fight" | "sponsor";
  children: React.ReactNode;
}

function OpportunityCard({ isPaid, membershipCta, applied, closed, isPending, onApply, applyLabel, variant, children }: OpportunityCardProps) {
  const isLocked = !isPaid;

  return (
    <Card className={`flex flex-col relative ${variant === "sponsor" ? "border-primary/20 bg-zinc-950/50" : ""}`}>
      <CardHeader className="flex-1">
        {children}
      </CardHeader>
      {isLocked && (
        <div className="absolute inset-0 rounded-[inherit] bg-zinc-950/40 backdrop-blur-[1px] flex items-end pointer-events-none" />
      )}
      <CardFooter className="relative z-10">
        {isLocked ? (
          <PaywallButton membershipCta={membershipCta} />
        ) : variant === "sponsor" ? (
          <Button
            variant="outline"
            className="w-full font-heading uppercase tracking-wider font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={onApply}
            disabled={applied || closed || isPending}
          >
            {applied ? "Applied" : closed ? "Closed" : applyLabel}
          </Button>
        ) : (
          <Button
            className="w-full font-heading uppercase tracking-wider font-bold"
            onClick={onApply}
            disabled={applied || closed || isPending}
          >
            {applied ? "Applied" : closed ? "Closed" : applyLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
