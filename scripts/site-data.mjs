import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const previous = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};

export const seo = require('../src/lib/seo.ts');
export const { guideSources } = require('../src/lib/guide-sources.ts');
export const guidesByLocale = {
  ko: require('../src/content/guides/ko.ts').guidesKo,
  en: require('../src/content/guides/en.ts').guidesEn,
  ja: require('../src/content/guides/ja.ts').guidesJa,
};
if (previous) require.extensions['.ts'] = previous;
else delete require.extensions['.ts'];

export const dictionaries = Object.fromEntries(seo.SITE_LOCALES.map(locale => [
  locale, JSON.parse(readFileSync(new URL(`../src/i18n/locales/${locale}.json`, import.meta.url), 'utf8')),
]));
export const pages = ['/', '/guide', '/guide/info', '/guide/faq', ...guidesByLocale.ko.map(guide => `/guide/${guide.slug}`)];
