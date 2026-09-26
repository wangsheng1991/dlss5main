import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Copy, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SUPPORT_EMAIL } from '../config/site';

/**
 * The one thing `/download` exists for: hand the request mailbox to a signed-in visitor and nobody else.
 *
 * The address is deliberately not in the bundle as a visible string until React renders it for a
 * signed-in user — a signed-out visitor sees the requirement, not the mailbox. It is still an
 * address that a determined visitor could read out of the JavaScript, so this is a conversion and
 * record-keeping gate, not a secret: what it buys is a real account, a request trail and a way to
 * answer the person who asked.
 *
 * The copy is passed in rather than written here, so the page keeps one source for its text
 * (see `src/content/studioPage.ts`).
 */
interface StudioRequestProps {
  /** Resolves a copy key for the reader's language. */
  t: (key: string) => string;
}

export default function StudioRequest({ t }: StudioRequestProps) {
  const { user, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  const account = user?.email || user?.uid || '';
  /** Both the subject and the draft are templates: a placeholder left in either one reaches the inbox. */
  const fill = useMemo(() => {
    const uid = user?.uid.slice(0, 8) ?? '';
    return (value: string) => value.replaceAll('{account}', account).replaceAll('{uid}', uid);
  }, [account, user]);
  const mailto = useMemo(() => {
    if (!user) return '';
    const subject = fill(t('request.mailSubject'));
    const body = fill(t('request.mailBody'));
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [fill, t, user]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-low p-8 md:p-10">
        <div className="h-5 w-40 rounded bg-surface-high animate-pulse" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-surface-high animate-pulse" />
        <div className="mt-3 h-4 w-2/3 rounded bg-surface-high animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-nvidia-green/25 bg-gradient-to-br from-nvidia-green/10 to-primary/5 p-8 md:p-10">
        <div className="flex items-center gap-3 text-nvidia-green text-xs font-label uppercase tracking-widest mb-4">
          <Lock className="w-4 h-4" aria-hidden="true" />
          {t('request.locked.eyebrow')}
        </div>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('request.locked.title')}</h2>
        <p className="text-zinc-300 leading-relaxed max-w-2xl">{t('request.locked.body')}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/register?next=%2Fdownload"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-nvidia-green text-black font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors"
          >
            {t('request.locked.ctaRegister')}
          </Link>
          <Link
            to="/login?next=%2Fdownload"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-outline-variant/30 text-white font-semibold rounded-xl hover:bg-surface-high transition-colors"
          >
            {t('request.locked.ctaLogin')}
          </Link>
        </div>
        <p className="mt-5 text-sm text-zinc-500">{t('request.locked.note')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-nvidia-green/30 bg-gradient-to-br from-nvidia-green/12 to-primary/5 p-8 md:p-10">
      <div className="flex items-center gap-3 text-nvidia-green text-xs font-label uppercase tracking-widest mb-4">
        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        {t('request.open.eyebrow')}
      </div>
      <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('request.open.title')}</h2>
      <p className="text-zinc-300 leading-relaxed max-w-2xl">{t('request.open.body')}</p>
      <p className="mt-3 text-sm text-zinc-400">
        {t('request.open.as').replace('{account}', account)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <code className="px-4 py-3 rounded-lg bg-black/40 border border-outline-variant/30 text-nvidia-green font-mono text-base md:text-lg select-all">
          {SUPPORT_EMAIL}
        </code>
        <button
          type="button"
          onClick={copyAddress}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-outline-variant/30 text-sm text-zinc-300 hover:bg-surface-high transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-nvidia-green" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
          {copied ? t('request.open.copied') : t('request.open.copy')}
        </button>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href={mailto}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-nvidia-green text-black font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors"
        >
          <Mail className="w-5 h-5" aria-hidden="true" />
          {t('request.open.ctaSend')}
        </a>
        <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
          <Clock className="w-4 h-4" aria-hidden="true" />
          {t('request.open.reply')}
        </span>
      </div>

      <ul className="mt-7 space-y-2 text-sm text-zinc-400">
        <li>{t('request.open.include1')}</li>
        <li>{t('request.open.include2')}</li>
        <li>{t('request.open.include3')}</li>
      </ul>

      <p className="mt-5 text-xs text-zinc-500">{t('request.open.note')}</p>
    </div>
  );
}
