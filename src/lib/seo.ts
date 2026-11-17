import type { Locale } from '../i18n';
import type { Guide } from '../content/guides/types';

export const SITE_ORIGIN = 'https://kodocalc.com';
export const SITE_UPDATED = '2026-11-17';
export const SITE_LOCALES: Locale[] = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw'];
export const GUIDE_LOCALES: Locale[] = ['ko', 'en', 'ja'];
export const LANGUAGE_NAMES: Record<Locale, string> = {
  ko: '한국어', en: 'English', ja: '日本語', 'zh-cn': '简体中文', 'zh-tw': '繁體中文',
};

export function pagePath(input: string): string {
  return new URL(input, SITE_ORIGIN).pathname.replace(/\/+$/, '') || '/';
}

export function pageLocales(input: string): Locale[] {
  const path = pagePath(input);
  return path.startsWith('/guide/') && !['/guide/info', '/guide/faq'].includes(path)
    ? GUIDE_LOCALES : SITE_LOCALES;
}

export function contentLocale(input: string, locale: Locale): Locale {
  return pageLocales(input).includes(locale) ? locale : 'ko';
}

export function localizedPath(input: string, locale: Locale, explicitLocale = true): string {
  const url = new URL(input, SITE_ORIGIN);
  url.pathname = pagePath(input);
  url.searchParams.delete('lang');
  if (explicitLocale || locale !== 'ko') url.searchParams.set('lang', locale);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function canonicalUrl(input: string, locale: Locale): string {
  return SITE_ORIGIN + localizedPath(pagePath(input), contentLocale(input, locale), false);
}

export function languageAlternates(input: string) {
  return [
    ...pageLocales(input).map(locale => ({ locale, href: canonicalUrl(input, locale) })),
    { locale: 'x-default', href: canonicalUrl(input, 'ko') },
  ];
}

export function applicationSchema(locale: Locale, name: string, description: string) {
  const url = canonicalUrl('/', locale);
  return {
    '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${url}#calculator`,
    url, name, description, inLanguage: locale, applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any', isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'Jake Kim' },
  };
}

export function guideSchemas(guide: Guide, locale: Locale, labels: { home: string; guide: string }) {
  const path = `/guide/${guide.slug}`;
  const url = canonicalUrl(path, locale);
  return [
    {
      '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
      url, inLanguage: contentLocale(path, locale),
      headline: guide.title, description: guide.description,
      author: { '@type': 'Person', name: 'Jake Kim' },
      publisher: { '@type': 'Organization', name: 'kodocalc.com' },
      datePublished: guide.datePublished, dateModified: guide.dateModified,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: labels.home, item: canonicalUrl('/', locale) },
        { '@type': 'ListItem', position: 2, name: labels.guide, item: canonicalUrl('/guide', locale) },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ],
    },
    ...(guide.faq.length ? [{
      '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${url}#faq`,
      inLanguage: contentLocale(path, locale),
      mainEntity: guide.faq.map(item => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    }] : []),
  ];
}
