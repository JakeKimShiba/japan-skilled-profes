import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const dictionaries = Object.fromEntries(['ko', 'en', 'ja', 'zh-cn', 'zh-tw'].map(locale => [
  locale, JSON.parse(readFileSync(new URL(`../../src/i18n/locales/${locale}.json`, import.meta.url), 'utf8')),
]));
const ko = dictionaries.ko;
const profile = 'v=technical&e=bachelors&w=5to7&a=29under&s=5m&j=n1&li=other';
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

for (const width of [390, 1440]) {
  test(`${width}px: selected visa can be changed with the keyboard`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/?lang=ko&${profile}`);
    const change = page.getByRole('button', { name: ko['visa.select.other'], exact: true });
    await change.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('radio', { name: ko['visa.technical.type'], exact: true })).toBeFocused();
    const academic = page.getByRole('radio', { name: ko['visa.academic.type'], exact: true });
    await academic.focus();
    await page.keyboard.press('Space');
    await expect(change).toBeVisible();
    await expect(page).toHaveURL(/v=academic/);
  });
}
