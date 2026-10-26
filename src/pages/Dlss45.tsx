import React from 'react';
import SEO from '../components/SEO';
import Dlss45Content from '../components/Dlss45Content';
import { dlss45Copy, dlss45Schema, DLSS45_ALTERNATES } from '../content/dlss45';
export default function Dlss45({ locale = 'en' }: { locale?: 'en' | 'zh' }) {
 const page = dlss45Copy(locale).page;
 return <><SEO title={page.title} description={page.intro} canonical={page.path} language={locale === 'zh' ? 'zh-CN' : 'en-US'} alternates={DLSS45_ALTERNATES} keywords={['dlss 4.5']} structuredData={dlss45Schema(locale)}/><Dlss45Content locale={locale}/></>;
}
