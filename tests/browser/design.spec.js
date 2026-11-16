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
  for (const text of await page.locator('label[for="income-under3m"] > span > span').all()) {
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

test('Named progress bars expose determinate steps and preserve scores above the visual scale', async ({ page }) => {
  await page.goto(`/?lang=ko&${profile}`);
  const steps = page.getByRole('progressbar', { name: ko['form.steps'], exact: true });
  const points = page.getByRole('progressbar', { name: ko['result.totalPoints'], exact: true });
  await expect(steps).toHaveAttribute('aria-valuenow', '0');
  await expect(points).toHaveAttribute('aria-valuenow', '70');
  await page.getByRole('button', { name: ko['nav.next'], exact: true }).click();
  await expect(steps).toHaveAttribute('aria-valuenow', '25');
  await expect(steps).toHaveAttribute('aria-valuetext', `2 / 5: ${ko['form.experience']}`);
  await page.getByRole('button', { name: new RegExp(ko['form.languageSpecial.short']) }).click();
  await expect(steps).toHaveAttribute('aria-valuenow', '100');
  await page.goto('/?lang=ko&v=technical&e=doctorate&w=10plus&a=29under&s=8m&j=n1&ue=1');
  await expect(points).toHaveAttribute('aria-valuenow', '100');
  await expect(points).toHaveAttribute('aria-valuetext', ko['points.value'].replace('{value}', '120'));
});

test('Same-band score changes have polite feedback without duplicating qualification alerts', async ({ page }) => {
  await page.goto(`/?lang=ko&${profile}`);
  const announcement = page.getByRole('status', { name: ko['result.totalPoints'], exact: true });
  await expect(announcement).toBeEmpty();
  const next = page.getByRole('button', { name: ko['nav.next'], exact: true });
  await next.click();
  await next.click();
  await page.locator('#income-6m').click();
  await expect(announcement).toHaveText(`${ko['result.totalPoints']}: ${ko['points.value'].replace('{value}', '75')}`);
  await expect(announcement).toHaveAttribute('aria-live', 'polite');
  await page.locator('#income-8m').click();
  await expect(announcement).toBeEmpty();
  await expect(page.getByRole('alert').filter({ hasText: ko['result.qualified.expedited'] })).toBeVisible();
});

for (const locale of ['ko', 'en', 'ja']) {
  test(`${locale}: small guide chart values and callout links have readable contrast`, async ({ page }) => {
    await page.goto(`/guide/${encodeURIComponent('고도인재-비자-완벽-가이드')}/?lang=${locale}`);
    await expect(page.locator('.guide-bar-fill').first()).toBeVisible();
    const text = page.locator('.guide-bar-fill, .guide-flow-step.primary, .guide-flow-step.accent, .guide-callout a');
    expect(await text.count()).toBeGreaterThan(6);
    for (const target of await text.all()) {
      expect(await textContrast(target)).toBeGreaterThanOrEqual(4.5);
    }
  });
}

test('FAQ category tabs control real labeled panels and preserve arrow-key filtering', async ({ page }) => {
  await page.goto('/guide/faq?lang=ko');
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(8);
  for (const tab of await tabs.all()) {
    const target = await tab.getAttribute('aria-controls');
    await expect(page.locator(`[id="${target}"]`)).toHaveCount(1);
  }
  await page.getByRole('tab', { name: ko['faq.category.salary'], exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: ko['faq.category.salary'], exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: ko['faq.q5.question'], exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: ko['faq.q1.question'], exact: true })).toHaveCount(0);
  await page.keyboard.press('ArrowRight', { delay: 50 });
  await expect(page.getByRole('tabpanel', { name: ko['faq.category.experience'], exact: true })).toBeVisible();
});

test('Selected visa summary keeps the first mobile question visible and comparison available', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/?lang=ko&${profile}`);
  await expect(page.locator('#mba')).toBeInViewport();
  await page.getByRole('button', { name: ko['visa.select.other'], exact: true }).click();
  await expect(page.getByRole('radio')).toHaveCount(3);
  for (const type of ['academic', 'technical', 'business']) {
    await expect(page.getByText(ko[`visa.${type}.description`], { exact: true })).toBeVisible();
  }
});

test('Mobile comparison keeps all columns readable in a keyboard-scrollable table', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/guide/${encodeURIComponent('고도인재-비자-완벽-가이드')}/?lang=ko`);
  const table = page.getByRole('table', { name: '비자 유형 비교', exact: true });
  await expect(table.getByRole('columnheader')).toHaveCount(4);
  await expect(table.getByRole('row')).toHaveCount(4);
  const target = table.locator('tbody tr').nth(1).locator('td').nth(2);
  expect((await target.boundingBox()).width).toBeGreaterThanOrEqual(176);
  await table.focus();
  await page.keyboard.press('ArrowRight', { delay: 100 });
  await expect.poll(() => table.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('FAQ page introduces itself once and retains all questions', async ({ page }) => {
  await page.goto('/guide/faq?lang=ko');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByText(ko['faq.subtitle'], { exact: true })).toHaveCount(1);
  await expect(page.getByRole('tabpanel').getByRole('button')).toHaveCount(14);
});

test('Narrow Korean headings and short age choices keep words together', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`/?lang=ko&${profile}`);
    const title = page.getByText(ko['app.title'], { exact: true }).first();
    await expect(title).toBeVisible();
    const linesPerWord = await title.evaluate(element => {
      const text = element.firstChild;
      return [...text.textContent.matchAll(/\S+/g)].map(match => {
        const range = document.createRange();
        range.setStart(text, match.index);
        range.setEnd(text, match.index + match[0].length);
        return range.getClientRects().length;
      });
    });
    expect(linesPerWord.every(count => count === 1)).toBe(true);
    const next = page.getByRole('button', { name: ko['nav.next'], exact: true });
    await next.click();
    await next.click();
    const lines = await page.locator('label[for="age-29under"] > span > span').first().evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getClientRects().length;
    });
    expect(lines).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('Radio-to-text gaps select the income option and preserve keyboard movement', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/?lang=ko&${profile}`);
  const next = page.getByRole('button', { name: ko['nav.next'], exact: true });
  await next.click();
  await next.click();
  const radio = page.locator('#income-6m');
  await radio.evaluate(element => element.scrollIntoView({ block: 'center' }));
  const bounds = await radio.boundingBox();
  await page.mouse.click(bounds.x + bounds.width + 4, bounds.y + bounds.height / 2);
  await expect(radio).toBeChecked();
  await expect(radio).toBeFocused();
  await radio.press('ArrowDown', { delay: 50 });
  await expect(page.locator('#income-7m')).toBeChecked();
});
