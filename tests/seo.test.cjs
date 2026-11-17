const assert = require('node:assert/strict');
const { test } = require('node:test');
const { canonicalUrl, languageAlternates, localizedPath, guideSchemas } = require('../src/lib/seo.ts');
const { guidesKo } = require('../src/content/guides/ko.ts');
const { guidesEn } = require('../src/content/guides/en.ts');
const { guidesJa } = require('../src/content/guides/ja.ts');
const { VisaCalculatorService } = require('../src/services/VisaCalculatorService.ts');
const { base } = require('./fixtures.cjs');
const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');

test('Canonicals retain page and actual content language, never calculation or tracking parameters', () => {
  const article = `/guide/${guidesKo[0].slug}`;
  for (const path of ['/', '/guide', '/guide/info', '/guide/faq', article]) {
    for (const locale of ['ko', 'en', 'ja', 'zh-cn', 'zh-tw']) {
      const url = new URL(canonicalUrl(`${path}?v=technical&bd=1997-01-01&lang=ja&utm_source=test#section-1`, locale));
      const actual = path === article && locale.startsWith('zh-') ? 'ko' : locale;
      assert.equal(url.origin, 'https://kodocalc.com');
      assert.equal(decodeURIComponent(url.pathname), path);
      assert.equal(url.search, actual === 'ko' ? '' : `?lang=${actual}`);
      assert.equal(url.hash, '');
    }
  }
});

test('Alternate-language groups contain only real translations of the same topic and are reciprocal', () => {
  const articles = [guidesKo, guidesEn, guidesJa];
  assert.deepEqual(guidesEn.map(guide => guide.slug), guidesKo.map(guide => guide.slug));
  assert.deepEqual(guidesJa.map(guide => guide.slug), guidesKo.map(guide => guide.slug));
  for (const [index, guide] of guidesKo.entries()) {
    const path = `/guide/${guide.slug}`;
    const group = languageAlternates(path);
    assert.deepEqual(group.map(item => item.locale), ['ko', 'en', 'ja', 'x-default']);
    for (const item of group) assert.deepEqual(languageAlternates(item.href), group);
    for (const [position, locale] of ['ko', 'en', 'ja'].entries()) {
      const translated = articles[position][index];
      const [schema, breadcrumbs, faq] = guideSchemas(translated, locale, { home: 'Home', guide: 'Guide' });
      assert.equal(schema.url, canonicalUrl(path, locale));
      assert.equal(schema.inLanguage, locale);
      assert.equal(schema.headline, translated.title);
      assert.equal(schema.dateModified, translated.dateModified);
      assert.equal(breadcrumbs.itemListElement[2].item, schema.url);
      assert.equal(faq.mainEntity.length, translated.faq.length);
    }
  }
});

test('Language-link URLs preserve shared input, unrelated parameters and fragments and explicitly select Korean', () => {
  const input = '/?lang=en&v=technical&bd=1997-01-01&e=masters&w=5to7&utm_source=example#results';
  const korean = new URL(localizedPath(input, 'ko'), 'https://kodocalc.com');
  assert.equal(korean.searchParams.get('lang'), 'ko');
  for (const [key, value] of new URL(input, korean).searchParams) {
    if (key !== 'lang') assert.equal(korean.searchParams.get(key), value);
  }
  assert.equal(korean.hash, '#results');
  assert.equal(canonicalUrl(korean.href, 'ko'), 'https://kodocalc.com/');
});

test('Published examples specify exact ages and their displayed totals agree with the calculator', () => {
  for (const guides of [guidesKo, guidesEn, guidesJa]) {
    const content = guides[0].sections.map(section => section.content).join('\n');
    assert.match(content, /28/);
    assert.match(content, /32/);
    const totals = [...content.matchAll(/guide-stat-value">(\d+)(?:점|点| pts) ✅/g)].map(match => Number(match[1]));
    const profiles = [
      { ...base, educationLevel: 'masters', age: '29under', japaneseLanguage: 'n2' },
      { ...base, workExperience: '10plus', age: '30to34', annualSalary: '7m', japaneseLanguage: 'n2' },
    ];
    assert.deepEqual(totals, profiles.map(profile => VisaCalculatorService.calculatePoints(profile).totalPoints));
  }
});

test('Content edit dates remain unchanged when the same source is loaded on a later build date', () => {
  const script = `
    const OriginalDate = Date;
    globalThis.Date = class extends OriginalDate {
      constructor(...args) { super(...(args.length ? args : ['2040-01-01T00:00:00Z'])); }
    };
    const { guidesByLocale, seo } = await import('./scripts/site-data.mjs');
    console.log(JSON.stringify({ site: seo.SITE_UPDATED, guides: Object.values(guidesByLocale).flatMap(items => items.map(item => item.dateModified)) }));
  `;
  const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: resolve(__dirname, '..'), encoding: 'utf8',
  });
  const dates = JSON.parse(output);
  assert.equal(dates.site, require('../src/lib/seo.ts').SITE_UPDATED);
  assert.deepEqual(dates.guides, [guidesKo, guidesEn, guidesJa].flatMap(items => items.map(item => item.dateModified)));
});
