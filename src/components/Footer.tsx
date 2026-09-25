import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LEGAL } from '../config/legal';
import { SITE_PROFILE, profileHas } from '../config/profile';
import { TOOL_LANDINGS } from '../content/toolLandings';
import { USE_CASES } from '../content/useCases';
import { MICRO_TOOLS } from '../content/microTools';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-surface-lowest w-full py-16 border-t border-outline-variant/10">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <span className="text-nvidia-green font-black text-2xl font-headline mb-4 block">{SITE_PROFILE.brand}</span>
            <p className="text-zinc-500 text-sm max-w-xs mb-6">{t('home.footerTagline')}</p>
            <p className="text-zinc-600 text-[10px] font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} {t('home.footerSystems')}
            </p>
            {/* The business behind the subscription, on every page. */}
            <p className="text-zinc-500 text-[10px] mt-2">
              {LEGAL.operator} · {LEGAL.website}
            </p>
            <p className="text-zinc-600 text-[9px] mt-3 leading-relaxed max-w-xs">
              {t('footer.trademarkDisclaimer')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('home.platform')}</h4>
            <ul className="space-y-4">
              {profileHas('models') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/models">{t('home.modelsLink')}</Link></li>}
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/pricing">{t('home.pricing')}</Link></li>
              {profileHas('enterprise') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/enterprise">{t('home.enterpriseLink')}</Link></li>}
              {profileHas('docs') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/docs">{t('home.apiDocs')}</Link></li>}
            </ul>
          </div>

          {/* The free tools, one row per page: they are the pages a search visitor lands on first. */}
          {profileHas('tools') && (
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('navbar.tools')}</h4>
              <ul className="space-y-4">
                {TOOL_LANDINGS.map(tool => (
                  <li key={tool.path}><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to={tool.path}>{tool.heading}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {profileHas('useCases') && (
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('navbar.useCases')}</h4>
              <ul className="space-y-4">
                {USE_CASES.map(item => <li key={item.path}><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to={item.path}>{item.heading}</Link></li>)}
              </ul>
            </div>
          )}

          {profileHas('microTools') && (
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('navbar.smallTools')}</h4>
              <ul className="space-y-4">
                {MICRO_TOOLS.map(item => <li key={item.path}><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to={item.path}>{item.heading}</Link></li>)}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('home.resources')}</h4>
            <ul className="space-y-4">
              {profileHas('blog') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/blog">{t('home.blog')}</Link></li>}
              {profileHas('docs') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/docs">{t('home.documentation')}</Link></li>}
              {profileHas('download') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/download">{t('navbar.download')}</Link></li>}
              {profileHas('about') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/about">{t('navbar.about')}</Link></li>}
              {profileHas('tools') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/game-character-style">Game character cases</Link></li>}
              {profileHas('tools') && <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/video-upscaler">Video upscaler workflow</Link></li>}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6 font-label">{t('home.legal')}</h4>
            <ul className="space-y-4">
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/privacy">{t('home.privacy')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/terms">{t('home.terms')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/refund">{t('home.refundPolicy')}</Link></li>
              <li><Link className="text-zinc-500 hover:text-nvidia-green text-sm transition-colors" to="/pricing">{t('home.pricing')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 gap-4">
          {/* A reachable mailbox instead of social icons that pointed nowhere. */}
          <a className="text-zinc-500 hover:text-nvidia-green transition-colors text-sm" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-nvidia-green rounded-full animate-pulse"></div>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-medium">{t('footer.systemsOperational')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
