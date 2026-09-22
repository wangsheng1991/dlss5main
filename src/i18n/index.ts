import i18n, { type BackendModule, type ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SITE_PROFILE, brandCopy } from '../config/profile';

import enUS from './locales/en-US.json';

/**
 * English is the fallback and ships inside the bundle, so a visitor always has a language to read.
 * Every other locale is fetched only when the browser asks for it — eight packs walked into the
 * entry bundle before, which is a hundred kilobytes nobody who reads the site in one language needs.
 */
const LOCALES: Record<string, () => Promise<Record<string, unknown>>> = {
  'zh-CN': () => import('./locales/zh-CN.json').then((module) => module.default),
  ja: () => import('./locales/ja.json').then((module) => module.default),
  ko: () => import('./locales/ko.json').then((module) => module.default),
  ru: () => import('./locales/ru.json').then((module) => module.default),
  uk: () => import('./locales/uk.json').then((module) => module.default),
  id: () => import('./locales/id.json').then((module) => module.default),
  et: () => import('./locales/et.json').then((module) => module.default),
};

/**
 * i18next asks this backend for the language it detected, and only for that one. A language with no
 * pack here resolves to nothing and the bundled English carries the page.
 */
const localeLoader: BackendModule = {
  type: 'backend',
  init() {},
  read(language: string, _namespace: string, callback: ReadCallback) {
    const load = LOCALES[language];
    if (!load) {
      callback(null, {});
      return;
    }
    load().then((translation) => callback(null, translation), (error: Error) => callback(error, null));
  },
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

/** Resolves once the visitor's own language pack is in hand, or once it cannot be fetched. */
export const i18nReady: Promise<unknown> = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(brandNames)
  .use(localeLoader)
  .init({
    resources: {
      'en-US': { translation: enUS },
    },
    // The bundled English above and the packs fetched by `localeLoader` are one set of resources.
    partialBundledLanguages: true,
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
