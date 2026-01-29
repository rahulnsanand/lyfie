import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Import JSON files
import en from './locales/en.json';
import es from './locales/es.json';

// 2. Define a TypeScript constant for your default namespace
export const defaultNS = 'translation';
export const resources = {
  en: { translation: en },
  es: { translation: es }
} as const; // 'as const' is vital for type inference!

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS,
    interpolation: { escapeValue: false }
  });

export default i18n;

// 3. THE MAGIC: Type Augmentation
// This tells i18next to use 'en.json' as the blueprint for all keys
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}