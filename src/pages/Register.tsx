import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(t('register.errorRegisterFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(t('register.errorGoogleFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
        
        <h1 className="text-3xl font-headline font-bold text-white mb-2">{t('register.title')}</h1>
        <p className="text-zinc-400 text-sm mb-8">{t('register.subtitle')}</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">{error}</div>}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-3 rounded-lg mb-6 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t('register.continueGoogle')}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-outline-variant/20"></div>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">{t('register.orEmail')}</span>
          <div className="flex-1 h-px bg-outline-variant/20"></div>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-zinc-500 mb-2">{t('register.nameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-lowest border-b-2 border-transparent focus:border-primary px-4 py-3 text-white outline-none transition-colors"
              placeholder={t('register.namePlaceholder')}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-zinc-500 mb-2">{t('register.emailLabel')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-lowest border-b-2 border-transparent focus:border-primary px-4 py-3 text-white outline-none transition-colors"
              placeholder={t('register.emailPlaceholder')}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-label uppercase tracking-widest text-zinc-500 mb-2">{t('register.passwordLabel')}</label>
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
            {loading ? t('register.provisioning') : t('register.provisionAccess')}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-zinc-500">
          {t('register.hasAccount')} <Link to="/login" className="text-primary hover:underline">{t('register.loginLink')}</Link>
        </div>
      </div>
    </main>
  );
}
