import type { Locale } from '@/i18n';
import type { Guide } from './types';
import { guidesKo } from './ko';

export type { Guide, GuideSection, GuideFAQ } from './types';

type GuideLoader = () => Promise<{ default: Guide[] } | { guidesJa: Guide[] } | { guidesEn: Guide[] }>;

const loaders: Record<string, () => Promise<Guide[]>> = {
  ko: () => Promise.resolve(guidesKo),
  ja: () => import('./ja').then(m => m.guidesJa),
  en: () => import('./en').then(m => m.guidesEn),
};

// Sync access for Korean (default, always loaded)
export const guides = guidesKo;

// Async access for any locale (lazy-loads translations)
export async function getGuides(locale: Locale): Promise<Guide[]> {
  const loader = loaders[locale];
  if (loader) {
    try {
      const result = await loader();
      // Fallback if translation is empty/placeholder
      return result.length > 0 ? result : guidesKo;
    } catch {
      return guidesKo; // fallback
    }
  }
  return guidesKo; // zh-cn, zh-tw fallback to Korean for now
}
