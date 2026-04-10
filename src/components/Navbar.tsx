import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, LogOut, User as UserIcon, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useAuth } from '../contexts/AuthContext';

const LANGUAGES = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const [guestUses, setGuestUses] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const updateGuestUses = () => {
      const stored = localStorage.getItem('dlss_guest_usage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === new Date().toISOString().split('T')[0]) {
          setGuestUses(parsed.count);
        } else {
          setGuestUses(0);
        }
      }
    };

    updateGuestUses();
    window.addEventListener('guestUsageUpdated', updateGuestUses);
    return () => window.removeEventListener('guestUsageUpdated', updateGuestUses);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLangOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link className="text-2xl font-bold tracking-tighter text-nvidia-green font-headline" to="/">DLSS 5</Link>
          {!isAuthPage && (
            <div className="hidden md:flex gap-6 items-center">
              <Link className="text-zinc-400 font-medium hover:text-zinc-100 transition-colors duration-300" to="/models">{t('navbar.models')}</Link>
              <Link className="text-zinc-400 font-medium hover:text-zinc-100 transition-colors duration-300" to="/docs">{t('navbar.docs')}</Link>
              <Link className="text-zinc-400 font-medium hover:text-zinc-100 transition-colors duration-300" to="/enterprise">{t('navbar.enterprise')}</Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {!isAuthPage && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface rounded-lg">
              <Database className="w-4 h-4 text-nvidia-green" />
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                {user ? (profile?.tier === 'pro' ? t('navbar.unlimited') : t('navbar.credits', { count: profile?.credits || 0 })) : t('navbar.guestCredits', { count: Math.max(0, 3 - guestUses) })}
              </span>
            </div>
          )}
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-surface-low border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-50">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-surface transition-colors ${lang.code === currentLang.code ? 'text-primary' : 'text-zinc-300'}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {lang.code === currentLang.code && <span className="ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-300 px-4 py-2 rounded-lg text-sm">{t('navbar.dashboard')}</Link>
                <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
                  {profile?.image ? (
                    <img src={profile.image} alt="Avatar" className="w-8 h-8 rounded-full border border-outline-variant/20" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-outline-variant/20">
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                    </div>
                  )}
                  <button onClick={logout} className="text-zinc-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-300 px-4 py-2 rounded-lg text-sm">{t('navbar.login')}</Link>
                <Link to="/register" className="bg-primary-container text-white font-bold px-5 py-2 rounded-lg text-sm active:scale-95 transition-transform hover:bg-primary hover:text-black">{t('navbar.register')}</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0e0e0e] border-b border-outline-variant/10 flex flex-col p-4 gap-4 shadow-2xl">
          {!isAuthPage && (
            <div className="flex flex-col gap-4 pb-4 border-b border-outline-variant/10">
              <Link className="text-zinc-400 font-medium hover:text-zinc-100" to="/models">{t('navbar.models')}</Link>
              <Link className="text-zinc-400 font-medium hover:text-zinc-100" to="/docs">{t('navbar.docs')}</Link>
              <Link className="text-zinc-400 font-medium hover:text-zinc-100" to="/enterprise">{t('navbar.enterprise')}</Link>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-2">
            {!isAuthPage && (
              <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg w-fit">
                <Database className="w-4 h-4 text-nvidia-green" />
                <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  {user ? (profile?.tier === 'pro' ? t('navbar.unlimited') : t('navbar.credits', { count: profile?.credits || 0 })) : t('navbar.guestCredits', { count: Math.max(0, 3 - guestUses) })}
                </span>
              </div>
            )}

            {/* Language Switcher Mobile */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">{t('language.switch')}</span>
            </div>
            <div className="flex gap-2 pl-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${lang.code === currentLang.code ? 'bg-primary/20 text-primary border border-primary' : 'bg-surface text-zinc-400 border border-outline-variant/20 hover:border-primary/50'}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            {user ? (
              <>
                <Link to="/dashboard" className="text-zinc-400 font-medium hover:text-zinc-100">{t('navbar.dashboard')}</Link>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    {profile?.image ? (
                      <img src={profile.image} alt="Avatar" className="w-8 h-8 rounded-full border border-outline-variant/20" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-outline-variant/20">
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                    <span className="text-sm text-zinc-400">{profile?.name || user.email}</span>
                  </div>
                  <button onClick={logout} className="text-zinc-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-center text-zinc-400 font-medium hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-300 px-4 py-3 rounded-lg text-sm border border-outline-variant/20">{t('navbar.login')}</Link>
                <Link to="/register" className="text-center bg-primary-container text-white font-bold px-5 py-3 rounded-lg text-sm active:scale-95 transition-transform hover:bg-primary hover:text-black">{t('navbar.register')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
