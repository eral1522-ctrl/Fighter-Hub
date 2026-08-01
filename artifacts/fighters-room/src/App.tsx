import React from "react";
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, SignIn, Show, useClerk } from "@clerk/react";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import NotFound from "@/pages/not-found";
import { useEffect, useRef } from "react";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import AdminLegacyPage from "@/pages/admin";
import AdminDashboardPage from "@/pages/admin-dashboard";
import ApplyPage from "@/pages/apply";
import AdminApplicationsPage from "@/pages/admin-applications";
import AdminOpportunitiesPage from "@/pages/admin-opportunities";
import StatutesPage from "@/pages/statutes";
import AssociationPage from "@/pages/association";
import PresidentMessagePage from "@/pages/president-message";
import AboutPage from "@/pages/about";
import MembershipPage from "@/pages/membership";
import GlobalBoxingSummitPage from "@/pages/global-boxing-summit";
import ContactPage from "@/pages/contact";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import LegalNoticePage from "@/pages/legal-notice";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

// NOTE: Clerk's own internal "Continue to {applicationName}" text comes
// from the Application Name set in the Clerk Dashboard (Configure →
// General), not from anything in this codebase. A previous attempt to
// override it via a guessed `localization` key
// (`unstable__applicationName`) was not a real/verified Clerk API and
// broke Clerk JS from loading at all, taking down the entire site (not
// just the sign-in page) — removed. The custom "IFA Member Portal" text
// rendered above the widget in SignInPage below is the verified-working
// fix; renaming the app in the Clerk Dashboard is the only reliable way
// to change Clerk's own internal text.

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(0 85% 42%)",
    colorForeground: "hsl(0 0% 96%)",
    colorMutedForeground: "hsl(0 0% 55%)",
    colorDanger: "hsl(0 72% 51%)",
    colorBackground: "hsl(0 0% 5%)",
    colorInput: "hsl(0 0% 12%)",
    colorInputForeground: "hsl(0 0% 96%)",
    colorNeutral: "hsl(0 0% 14%)",
    fontFamily: "'Barlow Condensed', sans-serif",
    borderRadius: "0.25rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-zinc-950 rounded-md border border-border w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary hover:text-primary/90",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-green-500",
    alertText: "text-destructive-foreground",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    return addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
  }, [addListener, qc]);
  return null;
}

function SignInPage() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-background px-4">
      <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground">{t.auth.portalTitle}</p>
      <SignIn routing="path" path={`${basePath}/sign-in`} />
      <p className="text-sm text-muted-foreground">
        {t.auth.notMember}{" "}
        <a href={`${basePath}/apply`} className="text-primary hover:underline font-medium">
          {t.auth.applyLink}
        </a>
      </p>
    </div>
  );
}

function SignUpPage() {
  // /sign-up is intentionally not a public entry point anymore — every new
  // member must go through /apply first. This redirects any direct visit
  // (typed URL, old bookmark, external link) straight to the application.
  return <Redirect to="/apply" />;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/dashboard" /></Show>
      <Show when="signed-out"><LandingPage /></Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in"><Component /></Show>
      <Show when="signed-out"><Redirect to="/" /></Show>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/dashboard"><ProtectedRoute component={DashboardPage} /></Route>
      <Route path="/profile"><ProtectedRoute component={ProfilePage} /></Route>
      <Route path="/admin"><ProtectedRoute component={AdminDashboardPage} /></Route>
      <Route path="/admin/legacy"><ProtectedRoute component={AdminLegacyPage} /></Route>
      <Route path="/admin/applications"><ProtectedRoute component={AdminApplicationsPage} /></Route>
      <Route path="/admin/opportunities"><ProtectedRoute component={AdminOpportunitiesPage} /></Route>
      <Route path="/apply" component={ApplyPage} />
      <Route path="/statutes" component={StatutesPage} />
      <Route path="/association" component={AssociationPage} />
      <Route path="/president-message" component={PresidentMessagePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/membership" component={MembershipPage} />
      <Route path="/global-boxing-summit" component={GlobalBoxingSummitPage} />
      <Route path="/news-events">
        {/* Old News & Events route — unconfirmed news/events content was
            removed per instruction. Redirect rather than 404 so existing
            links/bookmarks land somewhere real. */}
        <Redirect to="/global-boxing-summit" />
      </Route>
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/legal-notice" component={LegalNoticePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [, setLocation] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProvider
            publishableKey={clerkPubKey}
            proxyUrl={clerkProxyUrl}
            appearance={clerkAppearance}
            signInUrl={`${basePath}/sign-in`}
            routerPush={(to) => setLocation(stripBase(to))}
            routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
          >
            <ClerkQueryClientCacheInvalidator />
            <Router />
            <Toaster />
          </ClerkProvider>
        </WouterRouter>
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
