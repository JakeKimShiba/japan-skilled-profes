import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const locales = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw'];
const dictionaries = Object.fromEntries(locales.map(locale => [
  locale, JSON.parse(readFileSync(join(root, 'src', 'i18n', 'locales', `${locale}.json`), 'utf8')),
]));
const ko = dictionaries.ko;
const baseQuery = 'v=technical&e=bachelors&w=5to7&a=29under&s=5m';
const profiles = [
  { type: 'technical', query: `${baseQuery}&j=n1&li=other`, score: 70 },
  { type: 'academic', query: 'v=academic&e=doctorate&w=7plus&a=29under&s=under3m&j=n1&ue=1', score: 85 },
  { type: 'business', query: 'v=business&e=doctorate&w=10plus&a=29under&s=3to10m&j=n1&ue=1&be=executive_senior', score: 80 },
];
const runtimeErrors = new WeakMap();
const card = (page, locale = 'ko') => page.locator('[data-slot="card"]')
  .filter({ hasText: dictionaries[locale]['result.totalPoints'] }).last();

async function open(page, query = '', locale = 'ko') {
  const response = await page.goto(`/?lang=${locale}&${query}`, { waitUntil: 'networkidle' });
  expect(response.status()).toBe(200);
  await expect(page.getByText(dictionaries[locale]['app.title'], { exact: true }).first()).toBeVisible();
}

async function next(page) {
  await page.getByRole('button', { name: ko['nav.next'], exact: true }).click();
}

async function clear(page) {
  await page.getByRole('button', { name: ko['nav.clearAll'], exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: ko['nav.clearAll'], exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  runtimeErrors.set(page, []);
  page.on('pageerror', error => runtimeErrors.get(page).push(error.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:5181(?:\/|$))/, route => route.abort());
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

for (const locale of locales) {
  for (const width of [320, 1440]) {
    for (const profile of profiles) {
      test(`${profile.type}, ${locale}, ${width}px: valid result and localized metadata`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await open(page, profile.query, locale);
        const dict = dictionaries[locale];
        await expect(card(page, locale).locator('[data-slot="alert-title"]')).toHaveText(dict['result.qualified.title']);
        await expect(card(page, locale)).toContainText(dict['points.value'].replace('{value}', String(profile.score)));
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page).toHaveTitle(`${dict['app.title']} | kodocalc.com`);
        for (const selector of ['meta[name="title"]', 'meta[property="og:title"]', 'meta[property="twitter:title"]']) {
          await expect(page.locator(selector)).toHaveAttribute('content', `${dict['app.title']} | kodocalc.com`);
        }
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', dict['app.subtitle']);
        const dimensions = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, width: innerWidth }));
        expect(dimensions.actual).toBeLessThanOrEqual(dimensions.width);
        if (profile.type === 'business') await expect(card(page, locale)).toContainText(dict['result.businessRequirements']);
      });
    }
  }
}

for (const locale of locales) {
  test(`${locale}: minimum-income error is localized and never qualified`, async ({ page }) => {
    await open(page, profiles[2].query.replace('s=3to10m', 's=under3m'), locale);
    await expect(card(page, locale)).toContainText(dictionaries[locale]['validation.MINIMUM_SALARY_BUSINESS']);
    await expect(card(page, locale)).not.toContainText(dictionaries[locale]['result.qualified.title']);
  });
}

for (const [name, query] of [
  ['unsupported education', 'v=technical&e=outdated-degree&w=10plus&a=29under&s=8m&j=n1&ue=1'],
  ['unsupported license count', `${baseQuery}&nl=99`],
  ['N2 and Japanese education conflict', `${baseQuery}&j=n2&je=1`],
  ['BJT 400 and Japanese education conflict', `${baseQuery}&j=bjt400&je=1`],
]) {
  test(`${name}: restored URL cannot qualify`, async ({ page }) => {
    await open(page, query);
    await expect(card(page).locator('[data-slot="alert-title"]')).toHaveText(ko['result.invalid.title']);
    await expect(card(page)).not.toContainText('545');
    await expect(card(page)).not.toContainText(ko['result.qualified.title']);
  });
}

test('Incomplete high score stays provisional without premium suggestions', async ({ page }) => {
  await open(page, 'v=technical&e=doctorate&a=29under&s=8m&j=n1&ue=1');
  await expect(card(page)).toContainText(ko['points.value'].replace('{value}', '100'));
  await expect(card(page).locator('[data-slot="alert-title"]')).toHaveText(ko['result.incomplete.title']);
  await expect(card(page)).not.toContainText('점수 향상 제안');
  await expect(card(page)).not.toContainText('이미 프리미엄');
});

test('Fresh mobile input, language exclusion and reset', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await page.getByText(ko['visa.technical.type'], { exact: true }).click();
  await expect(page.getByRole('button', { name: ko['nav.next'], exact: true })).toBeDisabled();
  await page.locator('#bachelors').click();
  await next(page);
  await page.locator('#work-5to7').click();
  await next(page);
  await page.locator('#age-29under').click();
  await page.locator('#income-5m').click();
  await next(page);
  await next(page);
  await page.locator('#japanese-n1').click();
  await page.locator('#japanese-education').click();
  await expect(card(page)).toContainText('75점');
  await page.locator('#japanese-n2').click();
  await expect(page.locator('#japanese-education')).toBeDisabled();
  await expect(page.locator('#japanese-education')).toHaveAttribute('aria-checked', 'false');
  await expect(card(page)).toContainText('60점');
  await clear(page);
  await expect(card(page).locator('[data-slot="alert-title"]')).toHaveText(ko['result.incomplete.title']);
  await page.reload({ waitUntil: 'networkidle' });
  expect(new URL(page.url()).searchParams.has('e')).toBe(false);
});

test('Birth date and age are updated atomically, survive refresh and clear on reset', async ({ page }) => {
  await open(page, baseQuery);
  await next(page);
  await next(page);
  for (const [field, value] of [['year', '1980'], ['month', '01'], ['day', '01']]) {
    await page.getByRole('combobox', { name: ko[`form.birthDate.${field}`], exact: true }).click();
    await page.getByRole('option', { name: value, exact: true }).click();
  }
  await expect(page).toHaveURL(/bd=1980-01-01/);
  expect(new URL(page.url()).searchParams.get('a')).toBe('40plus');
  await page.locator('#income-8m').click();
  await page.reload({ waitUntil: 'networkidle' });
  expect(new URL(page.url()).searchParams.get('bd')).toBe('1980-01-01');
  await expect(card(page)).toContainText('50점');
  await next(page);
  await next(page);
  await expect(page.getByRole('combobox', { name: ko['form.birthDate.year'], exact: true })).toHaveText('1980');
  await clear(page);
  await page.reload({ waitUntil: 'networkidle' });
  expect(new URL(page.url()).searchParams.has('bd')).toBe(false);
  expect(new URL(page.url()).searchParams.has('a')).toBe(false);
});

test('BJT 400 is selectable, excludes the education bonus and survives refresh', async ({ page }) => {
  await open(page, `${baseQuery}&j=n1&je=1`);
  for (let step = 0; step < 4; step++) await next(page);
  await page.locator('#japanese-bjt400').click();
  await expect(page.locator('#japanese-education')).toBeDisabled();
  await expect(page.locator('#japanese-education')).toHaveAttribute('aria-checked', 'false');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(card(page)).toContainText('60점');
  await page.locator('[data-slot="accordion-trigger"]').filter({ hasText: ko['category.language'] }).click();
  await expect(card(page)).toContainText(ko['language.bjt400']);
});

test('Under-35 salary choices include 6M/7M and language details use display labels', async ({ page }) => {
  await open(page, `${baseQuery}&j=n2`);
  await next(page);
  await next(page);
  await expect(page.locator('#income-6m')).toBeVisible();
  await expect(page.locator('#income-7m')).toBeVisible();
  await page.locator('[data-slot="accordion-trigger"]').filter({ hasText: ko['category.language'] }).click();
  await expect(card(page)).toContainText(ko['language.jlptN2']);
});

test('Legacy business salary requests reselection and recovers', async ({ page }) => {
  await open(page, profiles[2].query.replace('s=3to10m', 's=under10m'));
  await expect(card(page)).toContainText(ko['validation.AMBIGUOUS_SALARY']);
  await next(page);
  await next(page);
  await page.locator('#income-3to10m').click();
  await expect(card(page).locator('[data-slot="alert-title"]')).toHaveText(ko['result.qualified.title']);
});

test('Clipboard sharing preserves locale, birth date and score through refresh', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async text => { window.__copiedUrl = text; } }, configurable: true,
    });
  });
  await open(page, `${profiles[0].query}&bd=1997-01-01`, 'en');
  await page.getByRole('button', { name: dictionaries.en['result.shareResult'], exact: true }).click();
  const copied = await page.evaluate(() => window.__copiedUrl);
  const shared = new URL(copied);
  expect(shared.searchParams.get('lang')).toBe('en');
  expect(shared.searchParams.get('bd')).toBe('1997-01-01');
  await page.goto(copied, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(card(page, 'en')).toContainText(dictionaries.en['points.value'].replace('{value}', '70'));
});

for (const failure of ['503', 'html', 'empty']) {
  test(`University ${failure} response has an explicit error and working retry`, async ({ page }) => {
    let recover = false;
    await page.route('**/resources/universities_english.csv', route => route.fulfill(recover
      ? { status: 200, contentType: 'text/csv', body: 'Aalto University,FI\n' }
      : {
          status: failure === '503' ? 503 : 200,
          contentType: failure === 'html' ? 'text/html' : 'text/plain',
          body: failure === 'html' ? '<!doctype html><body>SPA fallback</body>' : failure === 'empty' ? '' : 'unavailable',
        }));
    await open(page, baseQuery);
    await expect(page.getByRole('alert').filter({ hasText: ko['university.loadError'] })).toBeVisible();
    await expect(page.getByText(ko['university.noResults'], { exact: true })).toHaveCount(0);
    recover = true;
    await page.getByRole('button', { name: ko['university.retry'], exact: true }).click();
    await page.getByPlaceholder(ko['university.search.placeholder']).fill('Aalto');
    await page.getByRole('option').filter({ hasText: 'Aalto University' }).click();
    await expect(card(page)).toContainText('60점');
  });
}

test('University loading is distinct from an empty search and supports clearing a selection', async ({ page }) => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route('**/resources/universities_english.csv', async route => {
    await pending;
    await route.fulfill({ status: 200, contentType: 'text/csv', body: 'Aalto University,FI\n' });
  });
  try {
    await page.goto(`/?lang=ko&${baseQuery}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('status').filter({ hasText: ko['university.loading'] })).toBeVisible();
    await expect(page.getByText(ko['university.noResults'], { exact: true })).toHaveCount(0);
  } finally { release(); }
  await page.getByRole('option').filter({ hasText: 'Aalto University' }).click();
  await expect(card(page)).toContainText('60점');
  await page.locator('#uni-confirm').click();
  await expect(card(page)).toContainText('50점');
  await page.getByPlaceholder(ko['university.search.placeholder']).fill('no-such-university');
  await expect(page.getByText(ko['university.noResults'], { exact: true })).toBeVisible();
});

const guideRoutes = ['guide', 'guide/info', 'guide/faq',
  ...['고도인재-비자-완벽-가이드', '포인트-올리는-방법', 'jlpt-일본어-고도인재-비자', '고도인재-비자-영주권-가이드']
    .map(slug => `guide/${encodeURIComponent(slug)}`)];
for (const route of guideRoutes) {
  test(`Direct guide route and refresh: ${decodeURIComponent(route)}`, async ({ page }) => {
    const response = await page.goto(`/${route}?lang=ko`, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: '404', exact: true })).toHaveCount(0);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(decodeURI(canonical)).toBe(`https://kodocalc.com/${decodeURIComponent(route)}`);
  });
}

test('Guide navigation restores calculator metadata and unknown routes recover', async ({ page }) => {
  await page.goto(`/guide/${encodeURIComponent('고도인재-비자-완벽-가이드')}?lang=en`, { waitUntil: 'networkidle' });
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await page.getByRole('link', { name: dictionaries.en['guide.cta.button'], exact: true }).click();
  await expect(page).toHaveTitle(`${dictionaries.en['app.title']} | kodocalc.com`);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await page.goto('/this-route-does-not-exist?lang=ko', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: '404', exact: true })).toBeVisible();
  await page.getByRole('link', { name: ko['nav.calculator'], exact: true }).click();
  await expect(page.getByText(ko['app.title'], { exact: true }).first()).toBeVisible();
});

test('Print markup and analytics use validated status for an invalid high score', async ({ page }) => {
  await open(page, profiles[2].query.replace('s=3to10m', 's=under3m'));
  await page.evaluate(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
    const descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
      ...descriptor,
      get() {
        const frame = descriptor.get.call(this);
        if (frame) frame.print = () => { window.__printCapture = frame.document.body.innerText; };
        return frame;
      },
    });
  });
  await page.getByRole('button', { name: ko['result.downloadPDF'], exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__printCapture || '')).toContain(ko['result.invalid.title']);
  for (let step = 0; step < 4; step++) await next(page);
  await page.getByRole('button', { name: ko['nav.viewResults'], exact: true }).click();
  const events = await page.evaluate(() => window.__events);
  const completed = events.filter(event => event[1] === 'calculation_completed');
  expect(completed.length).toBeGreaterThan(0);
  expect(completed.at(-1)[2].qualified).toBe(false);
  expect(completed.at(-1)[2].expedited).toBe(false);
});

test.describe('Static guide without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('Generated body retains corrected business guidance and parseable schemas', async ({ page }) => {
    const response = await page.goto(`/guide/${encodeURIComponent('고도인재-비자-완벽-가이드')}/`);
    expect(response.status()).toBe(200);
    await expect(page.locator('body')).toContainText('고득점으로 이 기준을 우회할 수 없');
    await expect(page.locator('body')).not.toContainText('고도인재 비자(ハ)가 현실적 대안');
    for (const schema of await page.locator('script[type="application/ld+json"]').allTextContents()) JSON.parse(schema);
  });
});
