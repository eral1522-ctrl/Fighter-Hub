import { PublicPageLayout } from "@/components/public-page-layout";
import { usePageMeta } from "@/lib/use-page-meta";
import { useLanguage } from "@/lib/i18n";

const SECTIONS = [
  {
    title: "1. Who We Are (Data Controller)",
    text: `IFA – International Fighters Association ("IFA", "we", "us", or "our") is a global independent membership association operating internationally. IFA is a trading name of NLIS UK Investments Limited, Company Number 16061459, registered in England and Wales with registered office at Kingston House, Myton St, Hull, United Kingdom, HU1 2PS, which acts as the data controller for personal data processed through the Platform.

This Privacy Policy explains how we collect, use, store, and protect your personal data when you interact with our website at fightersassociation.com and related services (collectively, the "Platform").

Our contact for data matters: info@fightersassociation.com`,
  },
  {
    title: "2. Data We Collect",
    text: `We collect personal data through the following means:

Registration and membership forms: Full name, email address, country of residence, professional record, discipline, weight class, bio, social media handles, coach/manager contact details, video/media links, WhatsApp number.

Account usage: Dashboard activity, opportunity applications, profile updates, login timestamps.

Technical data: IP address, browser type, device type, referring URLs, and cookies.

Communications: Any messages or inquiries sent to IFA via email, contact forms, or social media.`,
  },
  {
    title: "3. Legal Basis for Processing",
    text: `Under the General Data Protection Regulation (GDPR), we process your personal data on the following legal bases:

Performance of a contract: To provide you with IFA membership services, process your application, and manage your member profile.

Legitimate interests: To improve our platform, manage security, and communicate with members about relevant opportunities.

Consent: For marketing communications, and for any non-essential cookies should they ever be introduced (none are used today — see Section 7). You may withdraw consent at any time.

Legal obligation: Where required by applicable law.`,
  },
  {
    title: "4. Purpose of Processing",
    text: `We use your personal data to:

• Process and manage your fighter membership application and active membership.
• Operate the IFA member portal and dashboard.
• Connect you with fight opportunities, sponsorships, and events.
• Share your professional profile (with your consent) with promoters, matchmakers, and sponsors.
• Send service-related communications, including status updates and member notifications.
• Improve our services and maintain platform security.
• Comply with applicable legal obligations.`,
  },
  {
    title: "5. Data Sharing",
    text: `We do not sell your personal data. We may share your data with:

Service providers: Third-party processors that help us operate the platform (hosting, authentication, payment processing). These processors are bound by data protection agreements.

Promoters, matchmakers and sponsors: Your professional fighter profile is only shared with verified event promoters, matchmakers and brand sponsors in our network where there is an adequate legal basis for doing so — normally your explicit consent, or the performance of the membership services you have requested.

Legal authorities: Where required by law, court order, or to protect IFA's legal rights.

We require all third parties to maintain appropriate security measures and only use your data for specified purposes.`,
  },
  {
    title: "6. Your Rights (GDPR)",
    text: `As a data subject under GDPR, you have the following rights:

Right of access: Request a copy of the personal data we hold about you.
Right to rectification: Correct any inaccurate or incomplete data.
Right to erasure ("right to be forgotten"): Request deletion of your personal data, subject to our legal obligations.
Right to restrict processing: Request that we limit how we use your data.
Right to data portability: Receive your data in a structured, machine-readable format.
Right to object: Object to processing based on legitimate interests or for direct marketing.
Right to withdraw consent: Where processing is based on consent, withdraw it at any time without affecting prior processing.

To exercise any of these rights, contact us at: info@fightersassociation.com

You also have the right to lodge a complaint with your local data protection authority.`,
  },
  {
    title: "7. Cookies",
    text: `The Platform only uses strictly necessary cookies and similar technologies. Because no analytics, advertising or other non-essential cookies are set, no cookie consent banner is required.

Specifically, we use:

• Authentication and session cookies set by our authentication provider (Clerk) to keep you securely signed in and to protect your account (security tokens, session state).
• Local browser storage to remember your language preference (English/Spanish). This stays on your device and is not used to track you.

We do not use analytics cookies, third-party advertising cookies, or tracking pixels. If this changes in the future, we will implement a consent mechanism (rejected by default for non-essential cookies) before any such cookies are set, and update this policy accordingly. You can delete cookies and local storage at any time through your browser settings; essential cookies will be recreated when you sign in again.`,
  },
  {
    title: "8. Data Retention",
    text: `We retain your personal data for as long as your membership is active or as necessary to provide our services. If you cancel your membership or request deletion, we will retain your data only for as long as required by applicable law (generally up to 7 years for financial records).

Technical logs are retained for a maximum of 90 days.`,
  },
  {
    title: "9. Security",
    text: `We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, destruction, or alteration. These include encrypted connections (TLS), secure authentication via Clerk, and access control on our database systems.

No system is 100% secure. If you believe your data has been compromised, contact us immediately at info@fightersassociation.com.`,
  },
  {
    title: "10. International Operations",
    text: `IFA operates globally and serves members across multiple jurisdictions. Your personal data may be processed and stored on servers located outside your country of residence, including in the European Economic Area and the United States.

Where data is transferred outside the EEA, we rely on Standard Contractual Clauses or other legally recognized transfer mechanisms to ensure an adequate level of protection.`,
  },
  {
    title: "11. Minors and Guardian Consent",
    text: `Applicants under 18 may only apply for membership with the express authorization of a parent or legal guardian, provided through the guardian section of the application form.

For minor applicants we additionally collect the guardian's full name, relationship to the applicant, email address, phone number and country. The guardian authorizes the processing of the minor's personal data for the purposes of the application and membership, accepts the terms and this Privacy Policy on behalf of the minor, and is our point of contact for any matter concerning the minor's data.

The guardian is responsible for the accuracy of the information provided and may exercise the minor's data protection rights on their behalf. IFA may request additional documentation to verify the guardian's identity and the validity of the authorization. A minor's profile is never shared with promoters, matchmakers or sponsors without a valid legal basis and the guardian's adequate authorization.

To exercise a minor's rights or withdraw guardian consent, contact: info@fightersassociation.com`,
  },
  {
    title: "12. Changes to This Policy",
    text: `We may update this Privacy Policy from time to time. We will notify members of material changes via email or through the member portal. The date of the latest revision is shown below.

Last updated: August 2026`,
  },
  {
    title: "13. Contact",
    text: `For any questions, concerns, or requests regarding this Privacy Policy or your personal data:

IFA – International Fighters Association
NLIS UK Investments Limited, Kingston House, Myton St, Hull, United Kingdom, HU1 2PS
Email: info@fightersassociation.com
Website: https://fightersassociation.com`,
  },
];

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: "Privacy Policy",
    description: "How the International Fighters Association collects, uses, and protects your personal data.",
    path: "/privacy-policy",
  });
  return (
    <PublicPageLayout>
      <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-3xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{t.footer.legalHeading}</p>
          <h1 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">Privacy Policy</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            This policy explains how IFA – International Fighters Association collects, uses, and protects your personal data. We are committed to processing personal data responsibly and in accordance with applicable data protection laws, including the GDPR where applicable.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="space-y-12">
            {SECTIONS.map((section, i) => (
              <div key={i} className="border-b border-border pb-10 last:border-0 last:pb-0">
                <h2 className="font-heading text-xl uppercase tracking-wide mb-4 text-foreground">{section.title}</h2>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{section.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
