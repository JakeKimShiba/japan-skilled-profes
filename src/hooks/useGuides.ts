import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { guides as defaultGuides, getGuides } from '@/content/guides';
import type { Guide } from '@/content/guides';
import { contentLocale } from '@/lib/seo';
import type { Locale } from '@/i18n';

export function useGuides() {
  const { locale } = useI18n();
  const targetLocale = contentLocale('/guide/article', locale);
  const [loaded, setLoaded] = useState<{ guides: Guide[]; locale: Locale; requestedLocale: Locale }>({
    guides: defaultGuides, locale: 'ko', requestedLocale: 'ko',
  });

  useEffect(() => {
    let cancelled = false;
    getGuides(targetLocale).then((guides) => {
      if (!cancelled) setLoaded({ guides, locale: guides === defaultGuides ? 'ko' : targetLocale, requestedLocale: targetLocale });
    });
    return () => { cancelled = true; };
  }, [targetLocale]);

  return { guides: loaded.guides, contentLocale: loaded.locale, isLoading: loaded.requestedLocale !== targetLocale };
}
