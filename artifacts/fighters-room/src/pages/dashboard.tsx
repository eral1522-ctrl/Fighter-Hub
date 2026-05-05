import { Layout } from "@/components/layout";
import { useGetDashboardStats, useListOpportunities, useListEvents, useListMyApplications, useCreateApplication, getListMyApplicationsQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Scale, Coins, AlertTriangle } from "lucide-react";
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

  const handleApplyOpportunity = (id: number) => {
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
              <Badge variant={stats?.membershipStatus === "active" ? "default" : "outline"} className="uppercase tracking-wider">
                {stats?.membershipStatus === "active" ? "IFA Pro" : "IFA Member"}
              </Badge>
            </div>
          )}
        </div>

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

          <TabsContent value="fights" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isOppLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-md" />) :
                opportunities?.filter(o => o.type === "fight").map(opp => (
                  <Card key={opp.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="uppercase">{opp.status}</Badge>
                        {opp.compensation && <Badge className="bg-green-900 text-green-100 border-green-800"><Coins className="w-3 h-3 mr-1"/> {opp.compensation}</Badge>}
                      </div>
                      <CardTitle className="font-heading text-2xl uppercase">{opp.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{opp.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {opp.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {opp.location}</div>}
                        {opp.date && <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {format(new Date(opp.date), "MMM d, yyyy")}</div>}
                        {opp.weightClass && <div className="flex items-center"><Scale className="w-4 h-4 mr-2" /> {opp.weightClass}</div>}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full font-heading uppercase tracking-wider font-bold" 
                        onClick={() => handleApplyOpportunity(opp.id)}
                        disabled={hasAppliedOpp(opp.id) || opp.status === 'closed' || createApplication.isPending}
                      >
                        {hasAppliedOpp(opp.id) ? "Applied" : opp.status === 'closed' ? "Closed" : "Apply for Fight"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="sponsors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities?.filter(o => o.type === "sponsor").map(opp => (
                <Card key={opp.id} className="flex flex-col border-primary/20 bg-zinc-950/50">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="uppercase bg-primary/20 text-primary border-primary/30">Sponsorship</Badge>
                      {opp.compensation && <Badge className="bg-green-900 text-green-100 border-green-800"><Coins className="w-3 h-3 mr-1"/> {opp.compensation}</Badge>}
                    </div>
                    <CardTitle className="font-heading text-2xl uppercase">{opp.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{opp.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                     <div className="space-y-2 text-sm text-muted-foreground">
                        {opp.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {opp.location}</div>}
                      </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full font-heading uppercase tracking-wider font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                      onClick={() => handleApplyOpportunity(opp.id)}
                      disabled={hasAppliedOpp(opp.id) || opp.status === 'closed' || createApplication.isPending}
                    >
                      {hasAppliedOpp(opp.id) ? "Applied" : opp.status === 'closed' ? "Closed" : "Apply for Sponsorship"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

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
                      <p className="text-sm mb-4 line-clamp-2 text-muted-foreground">{event.description}</p>
                      <div className="space-y-2 text-sm font-medium">
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" /> {format(new Date(event.date), "MMMM d, yyyy")}</div>
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" /> {event.location}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full font-heading uppercase tracking-wider font-bold" 
                        onClick={() => handleApplyEvent(event.id)}
                        disabled={hasAppliedEvent(event.id) || event.status === 'cancelled' || event.status === 'past' || createApplication.isPending}
                      >
                        {hasAppliedEvent(event.id) ? "Applied" : "Apply to Fight on Card"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

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
                        <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                          {app.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{app.opportunityId ? 'Opportunity' : 'Event'}</span>
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