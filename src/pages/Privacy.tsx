import React from 'react';
import SEO from '../components/SEO';
import LegalPage, { Bullets, Section } from '../components/LegalPage';
import { LEGAL } from '../config/legal';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | DLSS 5 Image Upscaler"
        description="What DLSS5NVIDIA collects, why it is collected, which processors handle it, how long it is kept, and how to have your account data deleted."
        keywords={['privacy policy', 'data protection', 'ai image upscaler privacy']}
        canonical="/privacy"
      />
      <LegalPage
        eyebrow="Legal"
        title="Privacy Policy"
        intro={<>This policy explains what {LEGAL.operator} collects when you use {LEGAL.website}, why, and what you can ask us to do about it. It covers account and billing data, uploaded images, and the processors that handle them for us.</>}
      >
        <Section title="1. What we collect">
          <Bullets items={[
            <><strong className="text-zinc-200">Account data</strong> — your email address, your display name and profile picture if you sign in with Google, your sign-in provider, and the internal account identifier that links everything together.</>,
            <><strong className="text-zinc-200">Billing data</strong> — your plan, credit balance and credit history, subscription identifiers and the last status we received from our payment processors. Card numbers are entered on the processor&apos;s page and never reach our servers.</>,
            <><strong className="text-zinc-200">Content you submit</strong> — the images and prompts you upload, the settings of each generation, and the results we produce for you.</>,
            <><strong className="text-zinc-200">Technical data</strong> — IP address, browser type and language, the pages you open, and a limited set of usage events. IP addresses are used for rate limiting and abuse prevention.</>,
            <><strong className="text-zinc-200">Support messages</strong> — anything you send to {LEGAL.contactEmail}, kept so we can answer and follow up.</>,
          ]} />
        </Section>

        <Section title="2. Why we use it">
          <Bullets items={[
            <>To provide the service: authenticate you, process your images, keep your history and credit balance correct.</>,
            <>To bill you, to grant and deduct credits, and to prevent payment fraud.</>,
            <>To keep the service stable and secure: rate limiting, abuse detection, and diagnosing errors.</>,
            <>To understand which features are used, so we can improve them, using aggregated analytics.</>,
            <>To send service notices (for example a failed payment or a material change to these documents) and, if you opt in, product news.</>,
          ]} />
          <p>We do not sell your personal data, and we do not use your images or prompts to train models.</p>
        </Section>

        <Section title="3. Who processes it for us">
          <Bullets items={[
            <><strong className="text-zinc-200">Google Firebase</strong> — authentication and the account database.</>,
            <><strong className="text-zinc-200">PayPal, Stripe and Dodo Payments</strong> — taking payment and managing subscriptions. Each processor handles your payment details under its own privacy policy.</>,
            <><strong className="text-zinc-200">Vercel</strong> — hosting and content delivery for the site and its API.</>,
            <><strong className="text-zinc-200">Model and storage providers</strong> — the AI services that upscale, generate or edit your images, and the object storage that holds them while a job runs.</>,
            <><strong className="text-zinc-200">Google Analytics</strong> — aggregated visitor statistics, only for visits where the page load completes.</>,
          ]} />
          <p>These providers act on our instructions and may process data outside your country.</p>
        </Section>

        <Section title="4. Cookies and local storage">
          <p>We use technically necessary storage to keep you signed in and to remember your language choice. Analytics storage helps us count visits and see which pages are used. You can block or clear these in your browser; signing in will then not persist between visits.</p>
        </Section>

        <Section title="5. How long we keep it">
          <Bullets items={[
            <>Account and billing records: for as long as your account exists, and afterwards as long as tax, accounting or fraud-prevention rules require.</>,
            <>Uploaded files and generated results: until you delete them or close your account. Ask us and we will delete a specific file or your full history.</>,
            <>Server and error logs: a short operational window (weeks, not years), then deleted on a rolling basis.</>,
            <>Analytics data: aggregated and retained in line with the analytics tool&apos;s own retention setting.</>,
          ]} />
        </Section>

        <Section title="6. Your rights">
          <p>Write to <a className="text-primary underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> from your account address to access your data, correct it, export it, delete your account and its files, or object to a particular use. We answer within 30 days and do not charge for it. If you are in the EU or UK you also have the right to complain to your national data protection authority.</p>
        </Section>

        <Section title="7. Security">
          <p>Traffic to the site is encrypted in transit, provider API keys stay on the server and are never shipped to the browser, and access to production data is restricted to the people who operate the service. If a breach affects your data, we will tell you and the competent authority without undue delay.</p>
        </Section>

        <Section title="8. Children">
          <p>The service is not intended for anyone under 18, or under the age of majority where they live. We do not knowingly collect data from children; if you believe a child has an account, tell us and we will delete it.</p>
        </Section>

        <Section title="9. Changes and contact">
          <p>We update this policy when our processing changes; the date at the bottom of the page shows the current version and we email subscribers about material changes. Controller and contact for any privacy question: {LEGAL.operator}, <a className="text-primary underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.</p>
        </Section>
      </LegalPage>
    </>
  );
}
