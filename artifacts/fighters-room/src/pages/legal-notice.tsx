import { PublicPageLayout } from "@/components/public-page-layout";

const SECTIONS = [
  {
    title: "Organization",
    content: `IFA – International Fighters Association
International membership association for professional and amateur combat sports athletes

Operated by: NLIS UK Investments Limited
Company Number: 16061459
Registered in England and Wales
Registered Office: Hull, United Kingdom

Website: https://fightersassociation.com
Contact: info@fightersassociation.com`,
  },
  {
    title: "Nature of Operations",
    content: `IFA operates as an international, independent, non-governmental membership association managed by NLIS UK Investments Limited, a company registered in England and Wales. IFA is not a sports governing body, regulatory authority, or sanctioning organization. IFA does not grant fighting licenses.

IFA operates globally across multiple jurisdictions. Our primary operational language is English. Our services are accessible internationally, subject to applicable local laws and regulations.`,
  },
  {
    title: "Website Usage Terms",
    content: `By accessing or using the IFA website and member platform (the "Platform"), you agree to be bound by these terms. If you do not agree, you may not use the Platform.

You must be at least 18 years of age to register as an IFA member. You agree to provide accurate, current, and complete information during registration and to update it as necessary.

Unauthorized use of the Platform, including attempting to access restricted areas, disrupt service, or impersonate other members, is strictly prohibited and may result in legal action.`,
  },
  {
    title: "Membership and Services",
    content: `IFA membership provides access to the member portal, fighter profile services, fight and sponsor opportunity listings, events, and career support resources. IFA makes reasonable efforts to ensure the accuracy and availability of listed opportunities but does not guarantee specific outcomes.

IFA acts as a facilitator connecting fighters with opportunities, promoters, and sponsors. IFA is not a party to any fight contract, sponsorship agreement, or commercial arrangement between members and third parties. IFA does not provide legal advice.

Membership fees are set by IFA and are subject to change. Current pricing is displayed on the membership page. Payment is processed through third-party payment providers.`,
  },
  {
    title: "Intellectual Property",
    content: `All content on the IFA Platform — including but not limited to the IFA name, logo, text, graphics, page layouts, and software — is the property of NLIS UK Investments Limited or its content suppliers and is protected by applicable intellectual property laws.

You may not copy, reproduce, modify, distribute, transmit, display, publish, license, create derivative works from, or sell any content obtained from the Platform without prior written consent from IFA.

Members retain ownership of their fighter profiles, photos, and personal content submitted to the Platform. By submitting content, you grant IFA a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content for the purpose of operating and promoting IFA services.`,
  },
  {
    title: "Liability Limitation",
    content: `IFA provides the Platform and its services on an "as is" basis. To the fullest extent permitted by applicable law, IFA disclaims all warranties, express or implied, including fitness for a particular purpose and non-infringement.

IFA shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or IFA services, including loss of earnings, missed opportunities, or data loss.

IFA's total liability to any member or user shall not exceed the total membership fees paid in the 12 months preceding the claim.

Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.`,
  },
  {
    title: "External Links",
    content: `The IFA Platform may contain links to third-party websites including BoxRec, social media platforms, and event promoters. These links are provided for convenience only. IFA has no control over the content of external sites and accepts no responsibility for them.`,
  },
  {
    title: "Governing Law and Dispute Resolution",
    content: `These terms are governed by the laws of England and Wales. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.

IFA reserves the right to update these legal terms at any time. Material changes will be communicated to members. Continued use of the Platform after such changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "Contact",
    content: `For legal inquiries or notices:

NLIS UK Investments Limited (trading as IFA – International Fighters Association)
Company No. 16061459 — Registered in England and Wales
Email: info@fightersassociation.com
Website: https://fightersassociation.com

Last updated: June 2026`,
  },
];

export default function LegalNoticePage() {
  return (
    <PublicPageLayout>
      <section className="py-20 md:py-28 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-3xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">Legal</p>
          <h1 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">Legal Notice</h1>
          <div className="h-1 w-20 bg-primary mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            Official legal information for IFA – International Fighters Association, including organization details, website terms, liability limitations, and intellectual property notice.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="space-y-12">
            {SECTIONS.map((section, i) => (
              <div key={i} className="border-b border-border pb-10 last:border-0 last:pb-0">
                <h2 className="font-heading text-xl uppercase tracking-wide mb-4 text-foreground">{section.title}</h2>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
