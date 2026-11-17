import { test, expect } from '@playwright/test';
import { seo, guidesByLocale, dictionaries, pages } from '../../scripts/site-data.mjs';

const errors = new WeakMap();
const articlePath = `/guide/${guidesByLocale.ko[0].slug}`;
const shared = 'v=technical&e=bachelors&w=5to7&a=29under&s=5m&j=n1&li=other';
const schemas = page => page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent)));

test.beforeEach(async ({ page }) => {
  errors.set(page, []);
  page.on('pageerror', error => errors.get(page).push(error.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:5181(?:\/|$))/, route => route.abort());
  await page.clock.setFixedTime(new Date('2026-11-16T12:00:00+09:00'));
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
});

for (const path of pages) {
  for (const locale of seo.pageLocales(path)) {
    test(`${path}, ${locale}: one accurate canonical, reciprocal same-topic alternates and page schemas`, async ({ page }) => {
      const dict = dictionaries[locale];
      const response = await page.goto(seo.localizedPath(path, locale));
      expect(response.status()).toBe(200);
      const guide = guidesByLocale[locale]?.find(item => path === `/guide/${item.slug}`);
      const title = guide?.title ?? dict[path === '/' ? 'app.title' : path === '/guide' ? 'guide.index.title' : path === '/guide/info' ? 'tabs.info' : 'tabs.faq'];
      await expect(page).toHaveTitle(`${title} | kodocalc.com`);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', seo.canonicalUrl(path, locale));
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', seo.canonicalUrl(path, locale));
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(nodes => nodes.map(node => ({
        locale: node.hreflang, href: node.href,
      })));
      expect(alternates).toEqual(seo.languageAlternates(path));
      const data = await schemas(page);
      if (guide) {
        expect(data).toEqual(seo.guideSchemas(guide, locale, { home: dict['breadcrumb.home'], guide: dict['breadcrumb.guide'] }));
        await expect(page.locator('article')).toHaveAttribute('lang', locale);
        await expect(page.locator('article')).toContainText(guide.dateModified);
        await expect(page.getByRole('complementary', { name: dict['guide.sources'] })).toBeVisible();
        if (guide.slug.startsWith('jlpt-')) {
          await expect(page.getByRole('link', { name: dict['guide.source.jlpt'], exact: true })).toBeVisible();
          await expect(page.getByRole('link', { name: dict['guide.source.bjt'], exact: true })).toBeVisible();
        }
      } else {
        expect(data.some(item => item['@type'] === 'Article')).toBe(false);
        expect(data.filter(item => item['@type'] === 'FAQPage')).toHaveLength(path === '/guide/faq' ? 1 : 0);
        expect(data.filter(item => item['@type'] === 'WebApplication')).toHaveLength(path === '/' ? 1 : 0);
      }
    });
  }
}

for (const locale of ['zh-cn', 'zh-tw']) {
  test(`${locale}: unsupported article language is disclosed without claiming a translation`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(seo.localizedPath(articlePath, locale));
    await expect(page.locator('[data-translation-fallback]')).toContainText(dictionaries[locale]['guide.translationFallback']);
    await expect(page.locator('article')).toHaveAttribute('lang', 'ko');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', seo.canonicalUrl(articlePath, 'ko'));
    expect((await schemas(page)).find(item => item['@type'] === 'Article').inLanguage).toBe('ko');
    await page.locator('[data-translation-fallback]').getByRole('link', { name: 'English', exact: true }).click();
    await expect(page.locator('article')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-translation-fallback]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
}

test('A failed translation download is a disclosed Korean fallback, not an endless loader or mislabeled article', async ({ page }) => {
  await page.route('**/assets/en-*.js', route => route.abort());
  await page.goto(seo.localizedPath(articlePath, 'en'));
  await expect(page.locator('[data-translation-fallback]')).toBeVisible();
  await expect(page.locator('article')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', seo.canonicalUrl(articlePath, 'ko'));
  expect((await schemas(page)).find(item => item['@type'] === 'Article').inLanguage).toBe('ko');
});

test('Crawlable language links keep calculation inputs, score and reload state while canonical stays clean', async ({ page }) => {
  await page.goto(`/?lang=ko&${shared}&bd=1997-01-01`);
  const before = new URL(page.url()).searchParams;
  await page.locator('a[hreflang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const after = new URL(page.url()).searchParams;
  for (const [key, value] of before) if (key !== 'lang') expect(after.get(key), key).toBe(value);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://kodocalc.com/?lang=en');
  const card = page.locator('[data-slot="card"]').filter({ hasText: dictionaries.en['result.totalPoints'] }).last();
  await expect(card).toContainText(dictionaries.en['points.value'].replace('{value}', '70'));
  await page.reload();
  await expect(card).toContainText(dictionaries.en['points.value'].replace('{value}', '70'));
});

test('Localized internal navigation, schema replacement and back/forward work without stale page identity', async ({ page }) => {
  await page.goto('/?lang=en');
  await page.locator('a[href="/guide?lang=en"]').click();
  await expect(page).toHaveTitle(`${dictionaries.en['guide.index.title']} | kodocalc.com`);
  await page.getByRole('link').filter({ hasText: guidesByLocale.en[0].title }).first().click();
  await expect(page).toHaveTitle(`${guidesByLocale.en[0].title} | kodocalc.com`);
  await page.locator('a[hreflang="ja"]').click();
  await expect(page).toHaveTitle(`${guidesByLocale.ja[0].title} | kodocalc.com`);
  await page.locator('a[href="/guide?lang=ja"]').last().click();
  await page.locator('a[href="/guide/faq?lang=ja"]').click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', seo.canonicalUrl('/guide/faq', 'ja'));
  expect((await schemas(page)).map(item => item['@type'])).toEqual(['FAQPage']);
  await page.goBack();
  await expect(page).toHaveTitle(`${dictionaries.ja['guide.index.title']} | kodocalc.com`);
  await page.goBack();
  await expect(page).toHaveTitle(`${guidesByLocale.ja[0].title} | kodocalc.com`);
});

test('A Korean link explicitly overrides an English saved preference in a fresh document', async ({ page }) => {
  await page.goto('/guide?lang=en');
  const href = await page.locator('a[hreflang="ko"]').getAttribute('href');
  await page.goto(href);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://kodocalc.com/guide');
});

test('Static fallback uses complete shared content and marked schema without a wrong query-language canonical', async ({ request }) => {
  for (const path of pages) {
    const response = await request.get(`${path === '/' ? '' : path}/?lang=en`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('undefined');
    expect(html).toContain('hreflang="en"');
    const data = [...html.matchAll(/<script type="application\/ld\+json" data-page-jsonld="true">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const guide = guidesByLocale.ko.find(item => path === `/guide/${item.slug}`);
    if (guide) {
      expect(data).toEqual(seo.guideSchemas(guide, 'ko', { home: dictionaries.ko['breadcrumb.home'], guide: dictionaries.ko['breadcrumb.guide'] }));
      for (const section of guide.sections) expect(html).toContain(section.content);
    } else {
      expect(data.map(item => item['@type'])).toEqual(path === '/' ? ['WebApplication'] : []);
    }
  }
});

test('Built sitemap discovers every supported canonical translation with real content dates, not aliases', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/g)];
  const expected = pages.flatMap(path => seo.pageLocales(path).map(locale => seo.canonicalUrl(path, locale)));
  expect(entries.map(match => match[1].replaceAll('&amp;', '&'))).toEqual(expected);
  expect(new Set(expected).size).toBe(expected.length);
  for (const [, location, date] of entries) {
    const url = new URL(location.replaceAll('&amp;', '&'));
    const locale = url.searchParams.get('lang') ?? 'ko';
    const guide = guidesByLocale[locale]?.find(item => url.pathname === new URL(seo.canonicalUrl(`/guide/${item.slug}`, locale)).pathname);
    expect(date).toBe(guide?.dateModified ?? seo.SITE_UPDATED);
  }
});
