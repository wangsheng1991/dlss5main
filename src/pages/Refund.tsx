import React from 'react';
import SEO from '../components/SEO';
import LegalPage, { Bullets, Section } from '../components/LegalPage';
import { LEGAL } from '../config/legal';

export default function Refund() {
  return (
    <>
      <SEO
        title="Refund & Cancellation Policy | DLSS 5 Image Upscaler"
        description="How to cancel a DLSS5NVIDIA subscription, when a refund is available, how long it takes, and how plan changes are billed."
        keywords={['refund policy', 'cancel subscription', 'cancellation policy']}
        canonical="/refund"
      />
      <LegalPage
        eyebrow="Legal"
        title="Refund &amp; Cancellation Policy"
        intro={<>Subscriptions at {LEGAL.operator} renew monthly and you can stop them whenever you like. This page explains how cancellation works, when we refund, and how long it takes. It forms part of our <a className="text-primary underline" href="/terms">Terms of Service</a>.</>}
      >
        <Section title="1. How to cancel">
          <Bullets items={[
            <><strong className="text-zinc-200">Card subscription (Stripe):</strong> open your <a className="text-primary underline" href="/dashboard">dashboard</a> and choose <em>Manage billing</em>. The billing portal cancels the subscription, switches plans or updates the card.</>,
            <><strong className="text-zinc-200">PayPal subscription:</strong> PayPal owns the recurring agreement, so it is cancelled in your PayPal account under <em>Settings → Payments → Automatic payments</em>. Your dashboard tells you the same thing if you try to cancel there.</>,
            <>You can also email <a className="text-primary underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a> from your account address and we will cancel it for you.</>,
          ]} />
        </Section>

        <Section title="2. What happens after you cancel">
          <Bullets items={[
            <>No further charges are made. Cancelling is immediate — it never waits for a notice period.</>,
            <>You keep access and the credits of the period you already paid for, until that period ends.</>,
            <>At the end of the period the account drops to the Free plan with its free monthly allowance. Unused paid credits are not carried over and are not exchanged for money.</>,
          ]} />
        </Section>

        <Section title="3. When we refund">
          <Bullets items={[
            <><strong className="text-zinc-200">Within {LEGAL.refundWindowDays} days of a charge, unused:</strong> if you have not spent any credits from that billing period, write to us and we refund it in full, no reason needed.</>,
            <><strong className="text-zinc-200">Within {LEGAL.refundWindowDays} days, partly used:</strong> tell us what went wrong. We normally refund the unused part of the period, and we always refund fully if the service did not work as described.</>,
            <><strong className="text-zinc-200">Duplicate or accidental charge:</strong> refunded in full, whenever it is noticed.</>,
            <><strong className="text-zinc-200">A generation that failed on our side:</strong> refunded automatically as credits to your balance, so you can run it again — that is not a cash refund.</>,
          ]} />
        </Section>

        <Section title="4. When we cannot refund">
          <Bullets items={[
            <>Periods older than {LEGAL.refundWindowDays} days, or periods whose credits have already been spent.</>,
            <>Accounts closed for breaching the <a className="text-primary underline" href="/terms">Terms of Service</a>, including fraud, abuse or reselling API access without an agreement.</>,
            <>Charges already disputed with the payment processor as a chargeback — message us first and we will resolve it directly, which is faster for both of us.</>,
          ]} />
        </Section>

        <Section title="5. EU and UK consumers">
          <p>If you live in the EU or the UK you have a statutory right to withdraw from a digital service within 14 days of purchase. Credits are made available immediately, and by using them you ask us to begin performance straight away — that ends the withdrawal right for the credits you have already spent. Unspent credits are refunded on request inside that window.</p>
        </Section>

        <Section title="6. How refunds are paid and how long they take">
          <Bullets items={[
            <>Send the request from your account email to <a className="text-primary underline" href={`mailto:${LEGAL.contactEmail}?subject=Refund%20request`}>{LEGAL.contactEmail}</a>, including the PayPal transaction or subscription ID if you paid with PayPal.</>,
            <>We reply within 2 business days and, when the refund is approved, issue it within 5 business days.</>,
            <>The money goes back to the original payment method through the same processor. PayPal and card issuers usually show it within 5–10 business days.</>,
            <>Refunds are always issued in the original currency and amount charged.</>,
          ]} />
        </Section>

        <Section title="7. Plan changes">
          <p>Card subscriptions can move to another plan at any time from <em>Manage billing</em>. The change is prorated: the unused part of the current period is credited against the new price, and the new plan&apos;s allowance starts immediately. PayPal subscriptions are revised on PayPal&apos;s side, so switching a PayPal plan means cancelling it and subscribing again — nothing is lost, because the remaining period is already paid for.</p>
        </Section>
      </LegalPage>
    </>
  );
}
