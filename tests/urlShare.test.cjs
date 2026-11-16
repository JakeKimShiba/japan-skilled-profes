const assert = require('node:assert/strict');
const { test } = require('node:test');
const { base } = require('./fixtures.cjs');
const { encodePointsData, decodePointsData, buildShareUrl, replacePointsDataInUrl } = require('../src/lib/urlShare.ts');
const { VisaCalculatorService } = require('../src/services/VisaCalculatorService.ts');
const restore = (search, today = new Date(2026, 10, 16)) => decodePointsData(search, today);

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
    assert.deepEqual(restore(`?${encodePointsData(data)}`), data);
  }
});

test('Share links preserve all five locales without copying unrelated query parameters', () => {
  for (const lang of ['ko', 'en', 'ja', 'zh-cn', 'zh-tw']) {
    withWindow(`https://kodocalc.com/?lang=${lang}&utm_source=example`, () => {
      const shared = new URL(buildShareUrl(base));
      assert.equal(shared.searchParams.get('lang'), lang);
      assert.equal(shared.searchParams.has('utm_source'), false);
      assert.deepEqual(restore(shared.search), base);
    });
  }
});

test('Synchronizing edits preserves language, unrelated params, hash and router state', () => {
  withWindow('https://kodocalc.com/?lang=en&utm_source=example#results', calls => {
    const data = { ...base, birthDate: '1997-01-01', annualSalary: '7m' };
    replacePointsDataInUrl(data);
    assert.deepEqual(restore(global.window.location.search), data);
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
    assert.equal(restore(global.window.location.search), null);
  });
});

test('Malformed and out-of-range shared license counts remain invalid instead of truncating to a valid integer', () => {
  for (const raw of ['1.5', '2x', '-1', '99', 'Infinity', '']) {
    const restored = restore(`?${encodePointsData(base)}&nl=${encodeURIComponent(raw)}`);
    const result = VisaCalculatorService.calculatePoints(restored);
    assert.equal(result.isValid, false, raw);
    assert.equal(result.isQualified, false, raw);
    assert.equal(result.categoryPoints.license, 0, raw);
  }
});

test('Unsupported or impossible shared birth dates cannot qualify', () => {
  for (const birthDate of ['invalid', '1997-02-30', '9999-01-01']) {
    const restored = restore(`?${encodePointsData({
      ...base, japaneseLanguage: 'n1', licenses: ['other'], birthDate,
    })}`);
    assert.equal(VisaCalculatorService.calculatePoints(restored).isQualified, false, birthDate);
  }
});

test('Restoring a birth date recalculates age and qualification across birthday boundaries', () => {
  const shared = `?${encodePointsData({
    ...base, annualSalary: '8m', licenses: ['other'], birthDate: '1997-01-01',
  })}`;
  for (const [today, age, score] of [
    [new Date(2026, 11, 31), '29under', 70],
    [new Date(2027, 0, 1), '30to34', 65],
    [new Date(2027, 0, 2), '30to34', 65],
    [new Date(2032, 0, 1), '35to39', 60],
    [new Date(2037, 0, 1), '40plus', 55],
  ]) {
    const restored = restore(shared, today);
    assert.equal(restored.age, age);
    assert.equal(restored.birthDate, '1997-01-01');
    const result = VisaCalculatorService.calculatePoints(restored);
    assert.equal(result.totalPoints, score);
    assert.equal(result.isQualified, score >= 70);
  }
});

test('Birth date is the source of truth for all activities, while age-only links stay unchanged', () => {
  for (const visaType of ['technical', 'academic', 'business']) {
    const shared = `?${encodePointsData({ ...base, visaType, birthDate: '1997-01-01' })}`;
    assert.equal(restore(shared, new Date(2027, 0, 2)).age, '30to34');
    assert.equal(restore(shared.replace('a=29under&', ''), new Date(2027, 0, 2)).age, '30to34');
    const ageOnly = { ...base, visaType };
    assert.deepEqual(restore(`?${encodePointsData(ageOnly)}`, new Date(2037, 0, 2)), ageOnly);
  }
});

test('An expired age-specific salary requires reselection instead of retaining a qualified result', () => {
  const restored = restore(`?${encodePointsData({
    ...base, age: '30to34', birthDate: '1992-01-01', japaneseLanguage: 'n1', licenses: ['other'],
  })}`, new Date(2027, 0, 2));
  assert.equal(restored.age, '35to39');
  assert.equal(restored.annualSalary, '5m');
  const result = VisaCalculatorService.calculatePoints(restored);
  assert.equal(result.isQualified, false);
  assert.ok(result.validation.errors.some(error => error.code === 'INVALID_SALARY_OPTION'));
});
