import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import ko from './locales/ko.json';
import en from './locales/en.json';
import zhcn from './locales/zh-cn.json';
import zhtw from './locales/zh-tw.json';
import ja from './locales/ja.json';

export type Locale = 'ko' | 'en' | 'zh-cn' | 'zh-tw' | 'ja';

export type Translations = Record<string, string>;

const translationsMap: Record<Locale, Translations> = {
  'ko': ko as any,
  'en': en as any,
  'zh-cn': zhcn as any,
  'zh-tw': zhtw as any,
  'ja': ja as any
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, any> | string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('locale');
      if (saved && ['ko','en','zh-cn','zh-tw','ja'].includes(saved)) return saved as Locale;
    } catch (e) {}
    return 'ko';
  });

  useEffect(() => {
    try { localStorage.setItem('locale', locale); } catch (e) {}
    // Update document language for accessibility and SEO
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
        const meta = document.querySelector('meta[http-equiv="content-language"]');
        if (meta) {
          meta.setAttribute('content', locale);
        }
      }
    } catch (e) {}
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (key: string, params?: Record<string, any> | string) => {
    const dict = translationsMap[locale] || translationsMap['ko'];
    const raw = (dict as any)[key] ?? (params && typeof params === 'string' ? params : key);
    if (!params || typeof params === 'string') return raw;
    // Simple interpolation {key}
    return raw.replace(/\{(.*?)\}/g, (_, k) => String((params as any)[k.trim()] ?? ''));
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useT() {
  const { t } = useI18n();
  return t;
}
