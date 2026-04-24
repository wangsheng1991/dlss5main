import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'zh-CN', 'ja', 'ko', 'ru', 'uk', 'id', 'et'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
