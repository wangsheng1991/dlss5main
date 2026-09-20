import React from 'react';
import SEO from '../components/SEO';
import LegalPage, { Bullets, Section } from '../components/LegalPage';
import { LEGAL } from '../config/legal';

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service | DLSS 5 Image Upscaler"
        description="The terms that govern DLSS5NVIDIA accounts, subscriptions, credits, acceptable use and liability for the online AI image upscaling service."
        keywords={['terms of service', 'subscription terms', 'ai image upscaler terms']}
        canonical="/terms"
      />
      <LegalPage
        eyebrow="Legal"
        title="Terms of Service"
        intro={<>These Terms are an agreement between you and {LEGAL.operator}, which operates {LEGAL.website} and the AI image tools offered on it. By creating an account or paying for a plan you accept them.</>}
      >
        <Section title="1. The service">
          <p>{LEGAL.operator} provides browser-based AI image tools: image upscaling and enhancement (neural super-resolution), image generation and editing, video super-resolution, and a web API for developers. Processing runs on our servers and on third-party model providers — you do not need a GPU or any installed software.</p>
          <p>We may add, change or retire individual tools and models. We will not remove a paid feature in the middle of a period you have already paid for.</p>
        </Section>

        <Section title="2. Your account">
          <Bullets items={[
            <>You must be at least 18 years old, or the age of majority where you live, to subscribe. Accounts are for a single person or organisation.</>,
            <>Keep your password and sign-in method secure; everything done through your account is treated as done by you.</>,
            <>Give us an email address you actually read — it is how we send billing and service notices.</>,
            <>One person or team per account. Sharing an account to avoid plan limits is not allowed.</>,
          ]} />
        </Section>

        <Section title="3. Plans, credits and billing">
          <p>Paid plans are subscriptions that renew automatically every month until you cancel. The current plans, prices, credit allowances, daily generation limits and concurrency limits are listed on the <a className="text-primary underline" href="/pricing">Pricing page</a> and shown again at checkout.</p>
          <Bullets items={[
            <>Credits are consumed per generation. The cost of a generation is shown before you run it.</>,
            <>Monthly plan credits are granted at the start of each billing month and <strong className="text-zinc-200">do not roll over</strong> — unused monthly credits expire when the next month is granted.</>,
            <>Promotional or bonus credits are separate, are spent after monthly credits, and expire on the first day of the following month.</>,
            <>If a generation fails on our side, the credits it consumed are returned to your balance automatically.</>,
            <>Payments are collected by our payment processors (PayPal, Stripe or another processor offered at checkout) in US dollars. We never receive or store your full card number.</>,
            <>Prices may change; a price change never applies to a period you have already paid, and we tell subscribers by email before the next renewal.</>,
          ]} />
          <p>Cancellation, plan switching and refunds are described in the <a className="text-primary underline" href="/refund">Refund &amp; Cancellation Policy</a>, which forms part of these Terms.</p>
        </Section>

        <Section title="4. Acceptable use">
          <Bullets items={[
            <>Do not upload content you have no right to process, and do not use the service to create or distribute anything unlawful, sexually explicit involving minors, hateful, or designed to harass or deceive.</>,
            <>Do not attempt to bypass credit accounting, daily limits, rate limits or authentication, and do not resell API access without a written agreement with us.</>,
            <>Do not use automated means to bulk-scrape the service, or to overload it in a way that degrades it for other customers.</>,
            <>We may suspend an account that endangers the service, our providers or other customers, and we will tell you why.</>,
          ]} />
        </Section>

        <Section title="5. Your content">
          <p>You keep all rights to the images you upload and to the results you generate. You grant us only the limited licence needed to run the service: to store, transmit and process your files on our infrastructure and on our model providers&apos; systems, and to show a result back to you.</p>
          <p>We do not claim ownership of your images and we do not use them to train models. Uploaded files and results are kept so that you can retrieve them from your account; ask us at {LEGAL.contactEmail} if you want a specific file or your whole account history deleted.</p>
        </Section>

        <Section title="6. Our content and trademarks">
          <p>The site, its text, design and software are ours or our licensors&apos; and may not be copied or resold. This is an independent tool: it is not affiliated with, sponsored by or endorsed by NVIDIA Corporation. DLSS and NVIDIA are trademarks of NVIDIA Corporation, used here only to describe the technology this independent service is inspired by. Other product names belong to their owners.</p>
        </Section>

        <Section title="7. Availability, changes and beta features">
          <p>We work to keep the service available, but it is provided without an uptime guarantee unless we have signed a separate agreement with you (see the <a className="text-primary underline" href="/enterprise">Enterprise page</a>). Features marked beta or preview may change or be withdrawn, and third-party model providers can be unavailable from time to time — failed generations are refunded in credits automatically.</p>
        </Section>

        <Section title="8. Suspension and termination">
          <p>You can stop using the service and cancel your subscription at any time. We may suspend or terminate an account that materially breaches these Terms, that we are required to act against by law, or that is used for fraud — where practical we warn you first and give you time to export your results. If we terminate your account without cause, we refund the unused part of the period you paid for.</p>
        </Section>

        <Section title="9. Disclaimers and limitation of liability">
          <p>The service is provided &quot;as is&quot;. AI output is generated automatically and may be inaccurate or unsuitable for a particular purpose; check results before you rely on them, and keep your own copies of anything important. We are not liable for indirect, incidental or consequential losses, loss of profit, or loss of data beyond what we can reasonably recover.</p>
          <p>To the extent the law allows, our total liability arising out of the service is limited to the amount you paid us in the three months before the event giving rise to the claim.</p>
        </Section>

        <Section title="10. Governing law and disputes">
          <p>These Terms are governed by the laws of {LEGAL.governingLaw}, and its courts have exclusive jurisdiction, without affecting any mandatory consumer protection you have where you live. Before starting a formal dispute, write to {LEGAL.contactEmail} — most problems are settled there in a day.</p>
        </Section>

        <Section title="11. Changes to these Terms">
          <p>We may update these Terms as the service changes. The date at the bottom of this page always shows the current version, and we email subscribers about material changes at least 14 days before they take effect. Continuing to use the service after that means you accept the new version.</p>
        </Section>

        <Section title="12. Contact">
          <p>{LEGAL.operator}, operating {LEGAL.website}. All questions, notices and complaints: <a className="text-primary underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.</p>
        </Section>
      </LegalPage>
    </>
  );
}
