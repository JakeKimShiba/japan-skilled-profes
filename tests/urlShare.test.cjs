const assert = require('node:assert/strict');
const { test } = require('node:test');
const { base } = require('./fixtures.cjs');
const { encodePointsData, decodePointsData, buildShareUrl, replacePointsDataInUrl } = require('../src/lib/urlShare.ts');
const { VisaCalculatorService } = require('../src/services/VisaCalculatorService.ts');

function withWindow(url, run) {
  const calls = [];
  global.window = {
    location: new URL(url),
    history: {
      state: { idx: 3, key: 'existing-router-entry' },
      replaceState(state, unused, nextUrl) {
        calls.push({ state, nextUrl: String(nextUrl) });
        global.window.location = new URL(nextUrl);
      },
    },
  };
  try { run(calls); } finally { delete global.window; }
}

test('Ordinary and scored share data round-trip, including birth date', () => {
  for (const data of [
    base,
    { ...base, birthDate: '1997-01-01', japaneseLanguage: 'n1', licenses: ['other'], university: 'Example University', universityEligible: true },
  ]) {
    assert.deepEqual(decodePointsData(`?${encodePointsData(data)}`), data);
  }
});

test('Share links preserve all five locales without copying unrelated query parameters', () => {
  for (const lang of ['ko', 'en', 'ja', 'zh-cn', 'zh-tw']) {
    withWindow(`https://kodocalc.com/?lang=${lang}&utm_source=example`, () => {
      const shared = new URL(buildShareUrl(base));
      assert.equal(shared.searchParams.get('lang'), lang);
      assert.equal(shared.searchParams.has('utm_source'), false);
      assert.deepEqual(decodePointsData(shared.search), base);
    });
  }
});

test('Synchronizing edits preserves language, unrelated params, hash and router state', () => {
  withWindow('https://kodocalc.com/?lang=en&utm_source=example#results', calls => {
    const data = { ...base, birthDate: '1997-01-01', annualSalary: '7m' };
    replacePointsDataInUrl(data);
    assert.deepEqual(decodePointsData(global.window.location.search), data);
    assert.equal(global.window.location.searchParams.get('lang'), 'en');
    assert.equal(global.window.location.searchParams.get('utm_source'), 'example');
    assert.equal(global.window.location.hash, '#results');
    assert.deepEqual(calls[0].state, { idx: 3, key: 'existing-router-entry' });
    replacePointsDataInUrl(data);
    assert.equal(calls.length, 1, 'Unchanged state should not replace history again');
  });
});

test('Resetting to empty data removes old result fields instead of resurrecting them on refresh', () => {
  withWindow(`https://kodocalc.com/?lang=ja&${encodePointsData({ ...base, birthDate: '1997-01-01' })}`, () => {
    replacePointsDataInUrl({ ...base, visaType: null });
    assert.equal(global.window.location.search, '?lang=ja');
    assert.equal(decodePointsData(global.window.location.search), null);
  });
});

test('Malformed and out-of-range shared license counts remain invalid instead of truncating to a valid integer', () => {
  for (const raw of ['1.5', '2x', '-1', '99', 'Infinity', '']) {
    const restored = decodePointsData(`?${encodePointsData(base)}&nl=${encodeURIComponent(raw)}`);
    const result = VisaCalculatorService.calculatePoints(restored);
    assert.equal(result.isValid, false, raw);
    assert.equal(result.isQualified, false, raw);
    assert.equal(result.categoryPoints.license, 0, raw);
  }
});

test('Unsupported or impossible shared birth dates cannot qualify', () => {
  for (const birthDate of ['invalid', '1997-02-30', '9999-01-01']) {
    const restored = decodePointsData(`?${encodePointsData({
      ...base, japaneseLanguage: 'n1', licenses: ['other'], birthDate,
    })}`);
    assert.equal(VisaCalculatorService.calculatePoints(restored).isQualified, false, birthDate);
  }
});
