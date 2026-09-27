import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { loadFirebase } from '../lib/firebase';
import { afterSignInPath } from '../lib/after-sign-in';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // A page that needs a signed-in reader (the Studio download request) links here with `?next=`,
  // and landing back on `/dashboard` instead would drop that reader a click short of what they came
  // for. `afterSignInPath` accepts same-site paths only — see `src/lib/after-sign-in.ts`.
  const [searchParams] = useSearchParams();
  const afterSignIn = afterSignInPath(searchParams.get('next'));
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { auth, signInWithEmailAndPassword } = await loadFirebase();
      await signInWithEmailAndPassword(auth, email, password);
      navigate(afterSignIn);
    } catch (err: any) {
      setError(t('login.errorLoginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(afterSignIn);
    } catch (err: any) {
      setError(t('login.errorGoogleFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
        
        <h1 className="text-3xl font-headline font-bold text-white mb-2">{t('login.title')}</h1>
        <p className="text-zinc-400 text-sm mb-8">{t('login.subtitle')}</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">{error}</div>}

        <GoogleSignInButton label={t('login.continueGoogle')} disabled={loading} onClick={handleGoogleLogin} className="mb-6" />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-outline-variant/20"></div>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">{t('login.orEmail')}</span>
          <div className="flex-1 h-px bg-outline-variant/20"></div>
        </div>
        
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-zinc-500 mb-2">{t('login.emailLabel')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-lowest border-b-2 border-transparent focus:border-primary px-4 py-3 text-white outline-none transition-colors"
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-label uppercase tracking-widest text-zinc-500">{t('login.passwordLabel')}</label>
              <a href="#" className="text-xs text-primary hover:underline">{t('login.forgot')}</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-lowest border-b-2 border-transparent focus:border-primary px-4 py-3 text-white outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-container text-white font-bold py-3 rounded-lg mt-4 hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50"
          >
            {loading ? t('login.initializing') : t('login.initSession')}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-zinc-500">
          {t('login.noAccount')} <Link to="/register" className="text-primary hover:underline">{t('login.registerLink')}</Link>
        </div>
      </div>
    </main>
  );
}
