import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const dictionaries = Object.fromEntries(['ko', 'en', 'ja', 'zh-cn', 'zh-tw'].map(locale => [
  locale, JSON.parse(readFileSync(new URL(`../../src/i18n/locales/${locale}.json`, import.meta.url), 'utf8')),
]));
const ko = dictionaries.ko;
const profile = 'v=technical&e=bachelors&w=5to7&a=29under&s=5m&j=n1&li=other';

async function textContrast(locator) {
  return locator.evaluate(element => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.fillStyle = '#fff';
    context.fillRect(0, 0, 1, 1);
    const ancestors = [];
    for (let node = element; node; node = node.parentElement) ancestors.unshift(node);
    let opacity = 1;
    for (const node of ancestors) {
      const style = getComputedStyle(node);
      opacity *= Number(style.opacity);
      context.globalAlpha = opacity;
      context.fillStyle = style.backgroundColor;
      context.fillRect(0, 0, 1, 1);
    }
    const background = [...context.getImageData(0, 0, 1, 1).data];
    context.fillStyle = getComputedStyle(element).color;
    context.fillRect(0, 0, 1, 1);
    const foreground = [...context.getImageData(0, 0, 1, 1).data];
    const luminance = rgb => rgb.slice(0, 3).map(value => value / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
      .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  });
}
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

test('University search has one keyboard entry and supports filtering and arrow selection', async ({ page }) => {
  await page.route('**/resources/universities_english.csv', route => route.fulfill({
    contentType: 'text/csv',
    body: 'Aalto University,FI\nSeoul National University,KR\nUniversity of Tokyo,JP\n',
  }));
  await page.goto(`/?lang=ko&${profile}`);
  const search = page.getByRole('textbox', { name: ko['university.search.label'], exact: true });
  const list = page.getByRole('radiogroup', { name: ko['university.search.label'], exact: true });
  await expect(list.getByRole('radio')).toHaveCount(3);
  await search.focus();
  await page.keyboard.press('Tab');
  await expect(list.getByRole('radio').first()).toBeFocused();
  await page.keyboard.press('ArrowDown', { delay: 50 });
  await expect(list.getByRole('radio').nth(1)).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(page.locator('#uni-confirm')).toBeFocused();
  await search.fill('Seoul');
  await expect(list.getByRole('radio')).toHaveCount(1);
  await search.fill('no-matching-university');
  await expect(page.getByText(ko['university.noResults'], { exact: true })).toBeVisible();
});

test('Explicit step and result transitions transfer focus without stealing it on edits', async ({ page }) => {
  await page.goto('/?lang=ko');
  await page.getByRole('radio', { name: ko['visa.technical.type'], exact: true }).press('Space');
  await expect(page.getByRole('group', { name: ko['form.education'], exact: true })).toBeFocused();
  await page.locator('#bachelors').click();
  await expect(page.locator('#bachelors')).toBeFocused();
  await page.goto(`/?lang=ko&${profile}`);
  const next = page.getByRole('button', { name: ko['nav.next'], exact: true });
  await next.click();
  await expect(page.getByRole('group', { name: ko['form.experience'], exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#work-5to7')).toBeFocused();
  await page.getByRole('button', { name: ko['form.education.short'], exact: false }).first().click();
  await expect(page.getByRole('group', { name: ko['form.education'], exact: true })).toBeFocused();
  await page.getByRole('button', { name: new RegExp(ko['form.languageSpecial.short']) }).click();
  await page.getByRole('button', { name: ko['nav.viewResults'], exact: true }).click();
  await expect(page.getByRole('region', { name: ko['result.title'], exact: true })).toBeFocused();
});

test('Error guidance and reset text retain readable small-text contrast', async ({ page }) => {
  await page.goto(`/?lang=ko&${profile.replace('s=5m', 's=under3m')}`);
  const alert = page.getByRole('alert').filter({ hasText: ko['result.invalid.title'] });
  for (const target of [
    alert.locator('[data-slot="alert-title"]'),
    alert.locator('[data-slot="alert-description"]'),
    page.getByRole('button', { name: ko['nav.clearAll'], exact: true }),
  ]) {
    await expect(target).toBeVisible();
    expect(await textContrast(target)).toBeGreaterThanOrEqual(4.5);
  }
});

test('Below-minimum income remains selectable with readable labels and an invalid result', async ({ page }) => {
  await page.goto(`/?lang=ko&${profile}`);
  const next = page.getByRole('button', { name: ko['nav.next'], exact: true });
  await next.click();
  await next.click();
  const radio = page.locator('#income-under3m');
  await expect(radio).toBeEnabled();
  for (const text of await page.locator('label[for="income-under3m"] > span').all()) {
    expect(await textContrast(text)).toBeGreaterThanOrEqual(4.5);
  }
  await radio.click();
  await expect(radio).toBeChecked();
  await expect(page.getByRole('alert').filter({ hasText: ko['result.invalid.title'] })).toBeVisible();
});

test('University confirmation explains its prerequisite and restored bonuses remain removable', async ({ page }) => {
  await page.goto(`/?lang=ko&${profile}`);
  const confirm = page.locator('#uni-confirm');
  await expect(confirm).toBeDisabled();
  await expect(confirm).toHaveAccessibleDescription(ko['university.confirm.prerequisite']);
  await page.getByRole('radio', { name: ko['university.selectAria'].replace('{name}', 'Aalto University'), exact: true }).click();
  await expect(confirm).toBeEnabled();
  await expect(confirm).toBeChecked();
  await confirm.click();
  await expect(confirm).not.toBeChecked();
  await expect(confirm).toBeDisabled();
  await page.goto(`/?lang=ko&${profile}&ue=1`);
  await expect(confirm).toBeEnabled();
  await expect(confirm).toBeChecked();
  await confirm.click();
  await expect(confirm).not.toBeChecked();
});
