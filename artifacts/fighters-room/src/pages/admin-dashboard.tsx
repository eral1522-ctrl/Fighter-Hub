import { Layout } from "@/components/layout";
import { Link } from "wouter";
import {
  useAdminGetStats,
  useAdminListFighterApplications,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Users, Clock, CheckCircle2, CreditCard, AlertTriangle, Target, ArrowRight } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-950 text-amber-400 border-amber-900",
  approved: "bg-green-950 text-green-400 border-green-900",
  rejected: "bg-red-950 text-red-400 border-red-900",
};

function StatCard({ icon: Icon, label, value, isLoading, tone }: { icon: any; label: string; value: number | undefined; isLoading: boolean; tone?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-2">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <div className={`text-3xl font-bold font-heading ${tone ?? ""}`}>
          {isLoading ? <Skeleton className="h-8 w-12" /> : value ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminGetStats();
  const { data: applications, isLoading: appsLoading } = useAdminListFighterApplications();

  const isUnauthorized = (statsError as any)?.status === 401 || (statsError as any)?.status === 403;
  const s = stats as any;

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

  const recentApplications = [...(applications ?? [])].reverse().slice(0, 10);

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight">Admin Dashboard</h1>
        </div>

        {/* Key stats — all from fighter_applications, the canonical
            source of truth for registration/approval/payment */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard icon={Users} label="Total Applications" value={s?.canonicalTotalApplications} isLoading={statsLoading} />
          <StatCard icon={Clock} label="Pending Review" value={s?.canonicalPendingReview} isLoading={statsLoading} tone="text-amber-400" />
          <StatCard icon={CheckCircle2} label="Approved" value={s?.canonicalApproved} isLoading={statsLoading} tone="text-green-400" />
          <StatCard icon={CreditCard} label="Paid Members" value={s?.canonicalPaidMembers} isLoading={statsLoading} tone="text-primary" />
          <StatCard icon={AlertTriangle} label="Approved, Unpaid" value={s?.canonicalApprovedUnpaid} isLoading={statsLoading} tone="text-amber-400" />
          <StatCard icon={Target} label="Published Opportunities" value={s?.publishedOpportunities} isLoading={statsLoading} />
        </div>

        {/* Quick nav to the full management pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <Link href="/admin/applications">
            <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg uppercase tracking-wide mb-1">Manage Applications</h3>
                  <p className="text-sm text-muted-foreground">Who's registered, approve or reject, send payment links.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary shrink-0" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/opportunities">
            <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg uppercase tracking-wide mb-1">Manage Opportunities</h3>
                  <p className="text-sm text-muted-foreground">Draft, verify and publish fight & sponsor opportunities.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent registrations, right here — answers "who's registered"
            without clicking through */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Registrations</CardTitle>
            <Link href="/admin/applications" className="text-xs text-primary hover:underline font-heading uppercase tracking-wide">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              <div className="space-y-2">
                {recentApplications.map((app: any) => (
                  <div key={app.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-md border border-border">
                    <div>
                      <div className="font-heading text-sm">{app.name}</div>
                      <div className="text-xs text-muted-foreground">{app.email} · {app.discipline}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`border ${STATUS_STYLE[app.status] ?? ""}`}>{app.status}</Badge>
                      <Badge variant="outline" className={app.paymentStatus === "paid" ? "text-green-400 border-green-900" : "text-muted-foreground"}>
                        {app.paymentStatus === "paid" ? "Paid" : "Not Paid"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-8">
          Looking for the older fighter-profile system? <Link href="/admin/legacy" className="text-primary hover:underline">Legacy records →</Link>
        </p>
      </div>
    </Layout>
  );
}
