import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Share2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-surface-lowest w-full py-16 border-t border-outline-variant/10">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <span className="text-nvidia-green font-black text-2xl font-headline mb-4 block">DLSS 5</span>
            <p className="text-zinc-500 text-sm max-w-xs mb-6">{t('home.footerTagline')}</p>
            <p className="text-zinc-600 text-[10px] font-medium uppercase tracking-widest">
              © 2024 {t('home.footerSystems')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('home.platform')}</h4>
            <ul className="space-y-4">
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/models">{t('home.modelsLink')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/pricing">{t('home.pricing')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/enterprise">{t('home.enterpriseLink')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/docs">{t('home.apiDocs')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('home.resources')}</h4>
            <ul className="space-y-4">
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.blog')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/docs">{t('home.documentation')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.helpCenter')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.github')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('home.legal')}</h4>
            <ul className="space-y-4">
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.privacy')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.terms')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.security')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="#">{t('home.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 gap-4">
          <div className="flex gap-6">
            <a className="text-zinc-600 hover:text-nvidia-green transition-colors" href="#"><Hexagon className="w-5 h-5" /></a>
            <a className="text-zinc-600 hover:text-nvidia-green transition-colors" href="#"><Share2 className="w-5 h-5" /></a>
            <a className="text-zinc-600 hover:text-nvidia-green transition-colors" href="#"><MessageSquare className="w-5 h-5" /></a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-nvidia-green rounded-full animate-pulse"></div>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-medium">{t('footer.systemsOperational')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
