import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Clock, Copy, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadFirebase } from '../lib/firebase';
import { SUPPORT_EMAIL } from '../config/site';
import GoogleSignInButton from './GoogleSignInButton';

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
  const { user, loading, signInWithGoogle } = useAuth();
  const { t: ui } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [note, setNote] = useState('');
  const [machine, setMachine] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [sendError, setSendError] = useState('');

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

  /**
   * Creating the account here rather than on `/register` is the whole point: the gate exists so that
   * a registered visitor sees the address, and a round trip through another page loses the ones who
   * came for the download. Nothing calls navigate — `AuthContext` reports the new session and this
   * same card re-renders as the signed-in one, with the address already in place.
   */
  const createAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setSignUpError('');
    setBusy(true);
    try {
      const { auth, createUserWithEmailAndPassword } = await loadFirebase();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setSignUpError(ui('register.errorRegisterFailed'));
    } finally {
      setBusy(false);
    }
  };

  const continueWithGoogle = async () => {
    setSignUpError('');
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setSignUpError(ui('register.errorGoogleFailed'));
    } finally {
      setBusy(false);
    }
  };

  /**
   * Filings happen here, on the page. The visitor writes one line and presses once: no mail client
   * has to be configured, nothing is handed off to another program, and the request is recorded so
   * the answer below is a fact rather than an assumption. The `mailto:` draft stays for anyone who
   * would rather send it themselves.
   */
  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSendError('');
    setSending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      // Firebase token refresh and the request API are separate network hops. Bound both so a
      // stale session or a sleeping function turns into a useful retry message instead of a button
      // that says “Sending…” forever.
      const token = await Promise.race([
        user.getIdToken(),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('request_timeout')), 10000)),
      ]);
      const response = await fetch('/api/studio/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note, machine }),
        signal: controller.signal,
      });
      const detail = (await response.json().catch(() => ({}))) as { code?: string; ok?: boolean; delivered?: boolean };
      if (!response.ok) {
        throw new Error(detail.code === 'too_soon' ? t('request.open.tooSoon') : t('request.open.sendFailed'));
      }
      if (!detail.ok) throw new Error(t('request.open.sendFailed'));
      setDeliveryConfirmed(Boolean(detail.delivered));
      setSent(true);
    } catch (error) {
      setSendError(error instanceof DOMException && error.name === 'AbortError' || error instanceof Error && error.message === 'request_timeout'
        ? t('request.open.timeout')
        : error instanceof Error && error.message ? error.message : t('request.open.sendFailed'));
    } finally {
      window.clearTimeout(timeout);
      setSending(false);
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
        {/* The account is created right here. Sending the visitor to `/register` cost two page
            loads and lost everything this page had just told them; `AuthContext` flips this card
            the moment the account exists, so the address appears where they are already looking. */}
        <div className="mt-7 max-w-md space-y-3">
          <GoogleSignInButton label={ui('register.continueGoogle')} disabled={busy} onClick={() => void continueWithGoogle()} />
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="h-px flex-1 bg-outline-variant/30" aria-hidden="true" />
            {ui('register.orEmail')}
            <span className="h-px flex-1 bg-outline-variant/30" aria-hidden="true" />
          </div>
          <form onSubmit={createAccount} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label={ui('register.emailLabel')}
              placeholder={ui('register.emailPlaceholder')}
              className="w-full rounded-lg bg-surface-lowest border border-outline-variant/30 px-4 py-3 text-white outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-label={ui('register.passwordLabel')}
              placeholder={ui('register.passwordLabel')}
              className="w-full rounded-lg bg-surface-lowest border border-outline-variant/30 px-4 py-3 text-white outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full px-7 py-3.5 bg-nvidia-green text-black font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors disabled:opacity-50"
            >
              {busy ? ui('register.provisioning') : t('request.locked.ctaRegister')}
            </button>
          </form>
          {signUpError && <p role="alert" className="text-sm text-red-300">{signUpError}</p>}
        </div>
        <p className="mt-5 text-sm text-zinc-500">
          <Link to="/login?next=%2Fdownload" className="text-nvidia-green hover:underline">
            {ui('register.hasAccount')} {t('request.locked.ctaLogin')}
          </Link>
          <span className="mx-2 text-zinc-600" aria-hidden="true">·</span>
          {t('request.locked.note')}
        </p>
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
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant/30 text-sm text-zinc-300 hover:bg-surface-high transition-colors"
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
          {t('request.open.byMail')}
        </a>
        <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
          <Clock className="w-4 h-4" aria-hidden="true" />
          {t('request.open.reply')}
        </span>
      </div>

      {sent ? (
        <div role="status" className="mt-6 rounded-xl border border-nvidia-green/30 bg-nvidia-green/10 p-5">
          <p className="text-nvidia-green font-semibold">{t('request.open.sentTitle')}</p>
          <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
            {(deliveryConfirmed ? t('request.open.sentBody') : t('request.open.sentBodyPending')).replace('{account}', account)}
          </p>
        </div>
      ) : (
        <form onSubmit={submitRequest} className="mt-6 max-w-xl space-y-3">
          <div>
            <label htmlFor="studio-request-note" className="block text-sm text-zinc-300 mb-2">{t('request.open.noteLabel')}</label>
            <textarea
              id="studio-request-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder={t('request.open.notePlaceholder')}
              className="w-full bg-surface-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-y"
            />
          </div>
          <div>
            <label htmlFor="studio-request-machine" className="block text-sm text-zinc-300 mb-2">{t('request.open.machineLabel')}</label>
            <input
              id="studio-request-machine"
              type="text"
              value={machine}
              onChange={(event) => setMachine(event.target.value)}
              maxLength={200}
              placeholder={t('request.open.machinePlaceholder')}
              className="w-full bg-surface-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={sending || (!note.trim() && !machine.trim())}
            aria-busy={sending}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-nvidia-green text-black font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            {sending ? t('request.open.submitting') : t('request.open.submit')}
          </button>
          {sendError && <p role="alert" className="text-sm text-red-300">{sendError}</p>}
        </form>
      )}

      <ul className="mt-7 space-y-2 text-sm text-zinc-400">
        <li>{t('request.open.include1')}</li>
        <li>{t('request.open.include2')}</li>
        <li>{t('request.open.include3')}</li>
      </ul>

      <p className="mt-5 text-xs text-zinc-500">{t('request.open.note')}</p>
    </div>
  );
}
