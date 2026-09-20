import React from 'react';
import { LEGAL } from '../config/legal';

/**
 * Shared shell for the legal documents: one column, the same type scale as the marketing pages, and
 * the "last updated" line plus a reachable mailbox, which is what a payment review looks for on a
 * subscription site.
 */
export default function LegalPage({ eyebrow, title, intro, children }: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <header className="mb-12">
        <span className="text-nvidia-green text-xs uppercase tracking-[0.2em]">{eyebrow}</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mt-4 mb-4">{title}</h1>
        {intro && <p className="text-zinc-400 leading-relaxed">{intro}</p>}
      </header>
      <div className="space-y-9">{children}</div>
      <footer className="mt-14 pt-6 border-t border-outline-variant/10 text-zinc-600 text-xs">
        Last updated {LEGAL.updatedAt}. Questions about this document: <a className="text-primary underline" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </footer>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-headline font-bold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 list-disc pl-5">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
}
