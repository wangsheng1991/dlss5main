import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SITE_PROFILE, brandCopy } from '../config/profile';

import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';
import id from './locales/id.json';
import et from './locales/et.json';

const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
  'ja': { translation: ja },
  'ko': { translation: ko },
  'ru': { translation: ru },
  'uk': { translation: uk },
  'id': { translation: id },
  'et': { translation: et },
};

/**
 * The copy was written for the original storefront and names that product throughout. A deployment
 * selling under a different brand rewrites those names on the way out instead of keeping eight
 * locale files in sync per brand; for the original storefront this is a pass-through.
 */
const brandNames = {
  type: 'postProcessor' as const,
  name: 'brand-rewrite',
  process(value: string, key: string) {
    const override = SITE_PROFILE.copyOverrides[key];
    if (override !== undefined) return override;
    return typeof value === 'string' ? brandCopy(value) : value;
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(brandNames)
  .init({
    resources,
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'zh-CN', 'ja', 'ko', 'ru', 'uk', 'id', 'et'],
    interpolation: {
      escapeValue: false,
    },
    postProcess: ['brand-rewrite'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
