import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const dictionaries = Object.fromEntries(['ko', 'en', 'ja', 'zh-cn', 'zh-tw'].map(locale => [
  locale, JSON.parse(readFileSync(new URL(`../../src/i18n/locales/${locale}.json`, import.meta.url), 'utf8')),
]));
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:5181(?:\/|$))/, route => route.abort());
  await page.clock.setFixedTime(new Date('2026-11-16T12:00:00+09:00'));
});

for (const [locale, dict] of Object.entries(dictionaries)) {
  test(`${locale}: visa radios have their visible activity names`, async ({ page }) => {
    await page.goto(`/?lang=${locale}`);
    for (const type of ['academic', 'technical', 'business']) {
      await expect(page.getByRole('radio', { name: dict[`visa.${type}.type`], exact: true })).toBeVisible();
    }
  });
}
