import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { guides as defaultGuides, getGuides } from '@/content/guides';
import type { Guide } from '@/content/guides';

/**
 * Returns locale-aware guides. Falls back to Korean while loading.
 */
export function useGuides(): Guide[] {
  const { locale } = useI18n();
  const [guides, setGuides] = useState<Guide[]>(defaultGuides);

  useEffect(() => {
    let cancelled = false;
    getGuides(locale).then((g) => {
      if (!cancelled) setGuides(g);
    });
    return () => { cancelled = true; };
  }, [locale]);

  return guides;
}
