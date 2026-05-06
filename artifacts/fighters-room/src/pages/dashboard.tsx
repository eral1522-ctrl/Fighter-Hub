import { Layout } from "@/components/layout";
import { useGetDashboardStats, useListOpportunities, useListEvents, useListMyApplications, useCreateApplication, getListMyApplicationsQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Scale, AlertTriangle, Lock, Plane, BedDouble, Trophy, X, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLanguage } from "@/lib/i18n";
import { useState, useMemo } from "react";

const PAST_STATUSES = ["completed", "closed"];
const UPCOMING_STATUSES = ["open", "scouting", "recruiting", "expected", "active"];

function getStatusColor(status: string) {
  switch (status) {
    case "open": return "bg-emerald-900/60 text-emerald-300 border-emerald-700/50";
    case "scouting": return "bg-blue-900/60 text-blue-300 border-blue-700/50";
    case "recruiting": return "bg-violet-900/60 text-violetald-300 border-violet-700/50 text-violet-300";
    case "expected": return "bg-amber-900/60 text-amber-300 border-amber-700/50";
    case "completed": return "bg-zinc-800 text-zinc-400 border-zinc-700";
    case "closed": return "bg-zinc-900 text-zinc-500 border-zinc-800";
    default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
  }
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStats();
  const { data: allOpportunities, isLoading: isOppLoading } = useListOpportunities();
  const { data: events, isLoading: isEventsLoading } = useListEvents();
  const { data: applications, isLoading: isAppsLoading } = useListMyApplications();

  const createApplication = useCreateApplication();
  const { toast } = useToast();
  const qc = useQueryClient();

  const isPaid = stats?.paymentStatus === "paid";
  const membershipCta = stats?.paymentLink || "https://wa.me/34603304636";

  // Filter state
  const [sportFilter, setSportFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [weightFilter, setWeightFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fightOpps = useMemo(() => allOpportunities?.filter(o => o.type === "fight") ?? [], [allOpportunities]);

  const upcomingOpps = useMemo(() => fightOpps.filter(o => UPCOMING_STATUSES.includes(o.status)), [fightOpps]);
  const pastOpps = useMemo(() => fightOpps.filter(o => PAST_STATUSES.includes(o.status)), [fightOpps]);

  // Unique filter options
  const sports = useMemo(() => [...new Set(upcomingOpps.map(o => o.sport).filter(Boolean))].sort(), [upcomingOpps]);
  const countries = useMemo(() => [...new Set(upcomingOpps.map(o => o.country).filter(Boolean))].sort(), [upcomingOpps]);
  const weightClasses = useMemo(() => [...new Set(upcomingOpps.map(o => o.weightClass).filter(Boolean))].sort(), [upcomingOpps]);
  const statuses = useMemo(() => [...new Set(upcomingOpps.map(o => o.status).filter(Boolean))].sort(), [upcomingOpps]);

  const filteredUpcoming = useMemo(() => upcomingOpps.filter(o => {
    if (sportFilter !== "all" && o.sport !== sportFilter) return false;
    if (countryFilter !== "all" && o.country !== countryFilter) return false;
    if (weightFilter !== "all" && o.weightClass !== weightFilter) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  }), [upcomingOpps, sportFilter, countryFilter, weightFilter, statusFilter]);

  const hasActiveFilters = sportFilter !== "all" || countryFilter !== "all" || weightFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSportFilter("all");
    setCountryFilter("all");
    setWeightFilter("all");
    setStatusFilter("all");
  };

  const hasFighterProfile = !isStatsLoading && stats?.approvalStatus !== undefined && stats.approvalStatus !== "none";

  function getAppError(err: any): string {
    return err?.data?.error || err?.message || t.dashboard.appErrorFallback;
  }

  const handleApplyOpportunity = (id: number) => {
    if (!hasFighterProfile) {
      toast({ title: t.dashboard.appFailed, description: t.dashboard.noProfile, variant: "destructive" });
      return;
    }
    if (!isPaid) {
      toast({ title: t.dashboard.appFailed, description: t.dashboard.notPaidApply, variant: "destructive" });
      return;
    }
    createApplication.mutate({ data: { opportunityId: id } }, {
      onSuccess: () => {
        toast({ title: t.dashboard.appSuccess });
        qc.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      },
      onError: (err: any) => {
        toast({ title: t.dashboard.appFailed, description: getAppError(err), variant: "destructive" });
      }
    });
  };

  const handleApplyEvent = (id: number) => {
    if (!hasFighterProfile) {
      toast({ title: t.dashboard.appFailed, description: t.dashboard.noProfile, variant: "destructive" });
      return;
    }
    if (!isPaid) {
      toast({ title: t.dashboard.appFailed, description: t.dashboard.notPaidApply, variant: "destructive" });
      return;
    }
    createApplication.mutate({ data: { eventId: id } }, {
      onSuccess: () => {
        toast({ title: t.dashboard.appSuccess });
        qc.invalidateQueries({ queryKey: getListMyApplicationsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      },
      onError: (err: any) => {
        toast({ title: t.dashboard.appFailed, description: getAppError(err), variant: "destructive" });
      }
    });
  };

  const hasAppliedOpp = (oppId: number) => applications?.some(a => a.opportunityId === oppId);
  const hasAppliedEvent = (eventId: number) => applications?.some(a => a.eventId === eventId);

  const getStatusLabel = (status: string): string => {
    const map = t.dashboard.status as Record<string, string>;
    return map[status] ?? status;
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight">{t.dashboard.heading}</h1>
            <p className="text-muted-foreground mt-1">{t.dashboard.subtitle}</p>
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

        {/* Payment wall banner */}
        {!isStatsLoading && !isPaid && (
          <div className="bg-primary/10 border border-primary/40 rounded-md p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Lock className="h-6 w-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <p className="font-heading font-bold text-base uppercase tracking-wide text-primary mb-0.5">
                {t.dashboard.paymentBanner}
              </p>
            </div>
            <a href={membershipCta} target="_blank" rel="noopener noreferrer">
              <Button className="font-heading uppercase tracking-wider font-bold shrink-0 whitespace-nowrap">
                {t.dashboard.completeMembership}
              </Button>
            </a>
          </div>
        )}

        {/* Approval pending banner */}
        {stats?.approvalStatus === "pending" && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-md mb-8 flex items-start gap-3 text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold">{t.dashboard.pendingTitle}</h3>
              <p className="text-sm opacity-90">{t.dashboard.pendingDesc}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.dashboard.stats.opportunities, value: stats?.totalOpportunities },
            { label: t.dashboard.stats.events, value: stats?.totalEvents },
            { label: t.dashboard.stats.myApplications, value: stats?.myApplications },
            { label: t.dashboard.stats.approvedFights, value: stats?.approvedApplications, gold: true },
          ].map(({ label, value, gold }) => (
            <Card key={label} className="bg-zinc-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase font-heading tracking-wider">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold font-heading ${gold ? "text-primary" : ""}`}>
                  {isStatsLoading ? <Skeleton className="h-8 w-12" /> : value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="fights" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 overflow-x-auto">
            {[
              { value: "fights", label: t.dashboard.tabs.fights },
              { value: "sponsors", label: t.dashboard.tabs.sponsors },
              { value: "events", label: t.dashboard.tabs.events },
              { value: "applications", label: t.dashboard.tabs.applications },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-heading uppercase tracking-wider text-base h-full px-6 shrink-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── FIGHT OPPORTUNITIES ── */}
          <TabsContent value="fights" className="mt-6 space-y-10">

            {/* Upcoming: Filters */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-primary">
                  {t.dashboard.upcomingOpps}
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t.dashboard.filters.clearFilters}
                  </button>
                )}
              </div>

              {/* Filter row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <FilterSelect
                  label={t.dashboard.filters.sport}
                  value={sportFilter}
                  onValueChange={setSportFilter}
                  options={sports as string[]}
                  allLabel={t.dashboard.filters.all}
                />
                <FilterSelect
                  label={t.dashboard.filters.country}
                  value={countryFilter}
                  onValueChange={setCountryFilter}
                  options={countries as string[]}
                  allLabel={t.dashboard.filters.all}
                />
                <FilterSelect
                  label={t.dashboard.filters.weightClass}
                  value={weightFilter}
                  onValueChange={setWeightFilter}
                  options={weightClasses as string[]}
                  allLabel={t.dashboard.filters.all}
                />
                <FilterSelect
                  label={t.dashboard.filters.status}
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statuses as string[]}
                  allLabel={t.dashboard.filters.all}
                  renderOption={(s) => getStatusLabel(s)}
                />
              </div>

              {/* Upcoming cards */}
              {isOppLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-md" />)}
                </div>
              ) : filteredUpcoming.length === 0 ? (
                <EmptyState message={t.dashboard.noUpcoming} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredUpcoming.map(opp => (
                    <FightCard
                      key={opp.id}
                      opp={opp}
                      isPaid={isPaid}
                      applied={!!hasAppliedOpp(opp.id)}
                      isPending={createApplication.isPending}
                      onApply={() => handleApplyOpportunity(opp.id)}
                      membershipCta={membershipCta}
                      t={t}
                      getStatusLabel={getStatusLabel}
                      isPast={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* Past Opportunities */}
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-muted-foreground mb-5">
                {t.dashboard.pastOpps}
              </h2>
              {isOppLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-md" />)}
                </div>
              ) : pastOpps.length === 0 ? (
                <EmptyState message={t.dashboard.noPast} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {pastOpps.map(opp => (
                    <FightCard
                      key={opp.id}
                      opp={opp}
                      isPaid={isPaid}
                      applied={!!hasAppliedOpp(opp.id)}
                      isPending={createApplication.isPending}
                      onApply={() => handleApplyOpportunity(opp.id)}
                      membershipCta={membershipCta}
                      t={t}
                      getStatusLabel={getStatusLabel}
                      isPast={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── SPONSORSHIPS ── */}
          <TabsContent value="sponsors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allOpportunities?.filter(o => o.type === "sponsor").map(opp => (
                <OpportunityCard
                  key={opp.id}
                  isPaid={isPaid}
                  membershipCta={membershipCta}
                  applied={!!hasAppliedOpp(opp.id)}
                  closed={opp.status === "closed"}
                  isPending={createApplication.isPending}
                  onApply={() => handleApplyOpportunity(opp.id)}
                  applyLabel={t.dashboard.applySponsorship}
                  appliedLabel={t.dashboard.applied}
                  closedLabel={t.dashboard.closed}
                  paywallLabel={t.dashboard.paywallBtn}
                  variant="sponsor"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="uppercase bg-primary/20 text-primary border-primary/30">Sponsorship</Badge>
                    {opp.compensation && <Badge className="bg-green-900 text-green-100 border-green-800"><Coins className="w-3 h-3 mr-1" />{opp.compensation}</Badge>}
                  </div>
                  <CardTitle className="font-heading text-2xl uppercase mb-1">{opp.title}</CardTitle>
                  <p className={`text-sm text-muted-foreground line-clamp-2 ${!isPaid ? "blur-[3px] select-none pointer-events-none" : ""}`}>{opp.description}</p>
                  {isPaid && opp.location && (
                    <div className="space-y-2 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{opp.location}</div>
                    </div>
                  )}
                </OpportunityCard>
              ))}
            </div>
          </TabsContent>

          {/* ── EVENTS ── */}
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
                          {hasAppliedEvent(event.id) ? t.dashboard.applied : t.dashboard.applyEvent}
                        </Button>
                      ) : (
                        <PaywallButton membershipCta={membershipCta} label={t.dashboard.paywallBtn} />
                      )}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* ── MY APPLICATIONS ── */}
          <TabsContent value="applications" className="mt-6">
            <div className="space-y-4">
              {isAppsLoading ? <Skeleton className="h-40 w-full" /> : applications?.length === 0 ? (
                <div className="text-center py-12 bg-zinc-950 rounded-md border border-dashed border-border">
                  <p className="text-muted-foreground">{t.dashboard.noApps}</p>
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

// ── Fight Card ──────────────────────────────────────────────
interface FightCardProps {
  opp: any;
  isPaid: boolean;
  applied: boolean;
  isPending: boolean;
  onApply: () => void;
  membershipCta: string;
  t: any;
  getStatusLabel: (s: string) => string;
  isPast: boolean;
}

function FightCard({ opp, isPaid, applied, isPending, onApply, membershipCta, t, getStatusLabel, isPast }: FightCardProps) {
  const isClosed = ["closed", "completed"].includes(opp.status);

  return (
    <Card className={`flex flex-col relative overflow-hidden ${isPast ? "opacity-70" : ""}`}>
      {/* Top accent */}
      {!isPast && (
        <div className={`h-0.5 w-full ${opp.status === "open" ? "bg-emerald-500" : opp.status === "scouting" ? "bg-blue-500" : opp.status === "recruiting" ? "bg-violet-500" : "bg-amber-500"}`} />
      )}

      <CardHeader className="pb-3">
        {/* Status + Sport row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider border ${getStatusColor(opp.status)}`}>
            {getStatusLabel(opp.status)}
          </span>
          {opp.sport && (
            <span className="text-[11px] font-heading uppercase tracking-wider text-muted-foreground">{opp.sport}</span>
          )}
        </div>

        {/* Title */}
        <CardTitle className="font-heading text-xl uppercase leading-tight mb-1">{opp.title}</CardTitle>

        {/* Location */}
        {(opp.city || opp.country) && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{[opp.city, opp.country].filter(Boolean).join(", ")}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0 space-y-3">
        {/* Weight class + Level */}
        <div className="flex flex-wrap gap-2">
          {opp.weightClass && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
              <Scale className="w-3 h-3" />
              {opp.weightClass}
            </div>
          )}
          {opp.level && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
              <Trophy className="w-3 h-3" />
              {opp.level}
            </div>
          )}
        </div>

        {/* Purse */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-heading uppercase tracking-wider text-muted-foreground">{t.dashboard.details.purse}</span>
          {isPaid ? (
            <span className="font-heading font-bold text-lg text-primary">{opp.purse ?? "—"}</span>
          ) : (
            <span className="text-sm text-muted-foreground/50 blur-[4px] select-none font-bold">€00,000</span>
          )}
        </div>

        {/* Travel + Accommodation */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          <div className={`flex items-center gap-1 ${opp.travelIncluded ? "text-emerald-400" : "text-zinc-600"}`}>
            <Plane className="w-3.5 h-3.5" />
            {t.dashboard.details.travel}: {opp.travelIncluded ? t.dashboard.details.included : t.dashboard.details.notIncluded}
          </div>
          <div className={`flex items-center gap-1 ${opp.accommodationIncluded ? "text-emerald-400" : "text-zinc-600"}`}>
            <BedDouble className="w-3.5 h-3.5" />
            {t.dashboard.details.accommodation}: {opp.accommodationIncluded ? t.dashboard.details.included : t.dashboard.details.notIncluded}
          </div>
        </div>
      </CardContent>

      {/* Paywall overlay for non-paid */}
      {!isPaid && (
        <div className="absolute inset-0 rounded-[inherit] bg-zinc-950/30 backdrop-blur-[0.5px] flex items-end pointer-events-none" />
      )}

      <CardFooter className="relative z-10 pt-3">
        {!isPaid ? (
          <PaywallButton membershipCta={membershipCta} label={t.dashboard.paywallBtn} />
        ) : isClosed ? (
          <Button className="w-full font-heading uppercase tracking-wider font-bold" disabled variant="secondary">
            {t.dashboard.closed}
          </Button>
        ) : applied ? (
          <Button className="w-full font-heading uppercase tracking-wider font-bold" disabled variant="secondary">
            {t.dashboard.applied}
          </Button>
        ) : (
          <Button
            className="w-full font-heading uppercase tracking-wider font-bold"
            onClick={onApply}
            disabled={isPending}
          >
            {t.dashboard.applyFight}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ── Filter Select ────────────────────────────────────────────
interface FilterSelectProps {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  allLabel: string;
  renderOption?: (s: string) => string;
}

function FilterSelect({ label, value, onValueChange, options, allLabel, renderOption }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-zinc-950 border-zinc-800 font-heading text-xs uppercase tracking-wider h-9">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-950 border-zinc-800">
        <SelectItem value="all" className="font-heading text-xs uppercase tracking-wider">
          {label}: {allLabel}
        </SelectItem>
        {options.map(opt => (
          <SelectItem key={opt} value={opt} className="font-heading text-xs uppercase tracking-wider">
            {renderOption ? renderOption(opt) : opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── Paywall Button ───────────────────────────────────────────
function PaywallButton({ membershipCta, label }: { membershipCta: string; label: string }) {
  return (
    <a href={membershipCta} target="_blank" rel="noopener noreferrer" className="w-full">
      <Button variant="outline" className="w-full font-heading uppercase tracking-wider font-bold border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground gap-2">
        <Lock className="w-4 h-4" />
        {label}
      </Button>
    </a>
  );
}

// ── Empty State ──────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 bg-zinc-950 rounded-md border border-dashed border-border">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

// ── Legacy OpportunityCard (used by sponsors tab) ────────────
interface OpportunityCardProps {
  isPaid: boolean;
  membershipCta: string;
  applied: boolean;
  closed: boolean;
  isPending: boolean;
  onApply: () => void;
  applyLabel: string;
  appliedLabel: string;
  closedLabel: string;
  paywallLabel: string;
  variant: "fight" | "sponsor";
  children: React.ReactNode;
}

function OpportunityCard({ isPaid, membershipCta, applied, closed, isPending, onApply, applyLabel, appliedLabel, closedLabel, paywallLabel, variant, children }: OpportunityCardProps) {
  return (
    <Card className={`flex flex-col relative ${variant === "sponsor" ? "border-primary/20 bg-zinc-950/50" : ""}`}>
      <CardHeader className="flex-1">
        {children}
      </CardHeader>
      {!isPaid && (
        <div className="absolute inset-0 rounded-[inherit] bg-zinc-950/40 backdrop-blur-[1px] flex items-end pointer-events-none" />
      )}
      <CardFooter className="relative z-10">
        {!isPaid ? (
          <PaywallButton membershipCta={membershipCta} label={paywallLabel} />
        ) : variant === "sponsor" ? (
          <Button
            variant="outline"
            className="w-full font-heading uppercase tracking-wider font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={onApply}
            disabled={applied || closed || isPending}
          >
            {applied ? appliedLabel : closed ? closedLabel : applyLabel}
          </Button>
        ) : (
          <Button
            className="w-full font-heading uppercase tracking-wider font-bold"
            onClick={onApply}
            disabled={applied || closed || isPending}
          >
            {applied ? appliedLabel : closed ? closedLabel : applyLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
