import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { seo, guidesByLocale, dictionaries, pages, guideSources } from './site-data.mjs';

const template = readFileSync('dist/index.html', 'utf8');
const dict = dictionaries.ko;
const escape = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = (path, title) => `<a href="${escape(seo.localizedPath(path, 'ko'))}">${escape(title)}</a>`;
const guideLinks = guidesByLocale.ko.map(guide => `<li>${link(`/guide/${guide.slug}`, guide.title)}</li>`).join('');
const sourceLinks = `<p>${escape(dict['guide.scope'])}</p><p>${escape(dict['guide.responsibility'])}</p>`;

for (const path of pages) {
  const guide = guidesByLocale.ko.find(item => path === `/guide/${item.slug}`);
  const titleKey = path === '/' ? 'app.title' : path === '/guide' ? 'guide.index.title' : path === '/guide/info' ? 'tabs.info' : 'tabs.faq';
  const descKey = path === '/' ? 'app.subtitle' : path === '/guide' ? 'guide.index.desc' : path === '/guide/info' ? 'guide.index.info.desc' : 'faq.subtitle';
  const title = `${guide?.title ?? dict[titleKey]} | kodocalc.com`;
  const description = guide?.description ?? dict[descKey];
  if (!description || title.includes('undefined')) throw new Error(`Missing metadata for ${path}`);

  const schemas = guide
    ? seo.guideSchemas(guide, 'ko', { home: dict['breadcrumb.home'], guide: dict['breadcrumb.guide'] })
    : path === '/' ? [seo.applicationSchema('ko', dict['app.title'], description)] : [];
  const alternates = seo.languageAlternates(path).map(item =>
    `<link rel="alternate" hreflang="${item.locale}" href="${escape(item.href)}" />`).join('\n');
  const jsonLd = schemas.map(schema =>
    `<script type="application/ld+json" data-page-jsonld="true">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`).join('\n');

  let content = '';
  if (guide) {
    content = `<article lang="ko"><h1>${escape(guide.title)}</h1><p>${escape(guide.description)}</p>
      <p>${escape(dict['guide.lastUpdated'])}: ${guide.dateModified}</p>
      <aside><h2>${escape(dict['guide.sources'])}</h2><ul>${guideSources(guide.slug).map(source => `<li><a href="${source.href}">${escape(dict[`guide.source.${source.key}`])}</a></li>`).join('')}</ul>${sourceLinks}</aside>
      ${guide.sections.map((section, index) => `<section id="section-${index}"><h2>${escape(section.title)}</h2>${section.content}</section>`).join('\n')}
      <section><h2>${escape(dict['guide.faq'])}</h2>${guide.faq.map(item => `<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join('')}</section>
      </article>`;
  } else if (path === '/guide/faq') {
    const questions = Object.entries(dict).filter(([key]) => /^faq\.q\d+\.question$/.test(key));
    content = `<h1>${escape(dict[titleKey])}</h1><p>${escape(description)}</p>${questions.map(([key, question]) => {
      const prefix = key.replace('question', '');
      const answers = Object.entries(dict).filter(([candidate]) => candidate.startsWith(prefix) && candidate !== key);
      return `<section><h2>${escape(question)}</h2>${answers.map(([, text]) => `<p>${escape(text)}</p>`).join('')}</section>`;
    }).join('')}`;
  } else {
    content = `<h1>${escape(dict[titleKey])}</h1><p>${escape(description)}</p>
      ${path === '/' ? `<p>${escape(dict['info.description'])}</p>` : ''}
      ${path === '/guide/info' ? `<p>${escape(dict['info.notice'])}</p>${sourceLinks}` : ''}
      <ul>${guideLinks}</ul>`;
  }
  const body = `<main>${content}<nav>${link('/', dict['tabs.calculator'])} · ${link('/guide', dict['breadcrumb.guide'])} · ${link('/guide/info', dict['guide.index.info'])} · ${link('/guide/faq', dict['guide.index.faq'])}</nav>
    <nav aria-label="${escape(dict['header.languageLabel'])}">${seo.pageLocales(path).map(locale => `<a lang="${locale}" hreflang="${locale}" href="${escape(seo.localizedPath(path, locale))}">${escape(seo.LANGUAGE_NAMES[locale])}</a>`).join(' · ')}</nav></main>`;

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:title|og:title|twitter:title)" content=")[^"]*"/g, (_, prefix) => `${prefix}${escape(title)}"`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*"/g, (_, prefix) => `${prefix}${escape(description)}"`)
    .replace(/(<meta property="og:type" content=")[^"]*"/, `$1${guide ? 'article' : 'website'}"`)
    .replace('</head>', `${alternates}\n${jsonLd}\n</head>`)
    .replace(/<div id="root"><\/div>/, () => `<div id="root">${body}</div>`);
  const directory = join('dist', ...path.split('/').filter(Boolean));
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, 'index.html'), html);
}
console.log(`Prerendered ${pages.length} default-language pages from shared content; query locales resolve in the app.`);
