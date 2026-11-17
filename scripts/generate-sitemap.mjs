import { writeFileSync } from 'node:fs';
import { seo, guidesByLocale, pages } from './site-data.mjs';

const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const urls = pages.flatMap(path => seo.pageLocales(path).map(locale => {
  const guide = guidesByLocale[locale]?.find(item => path === `/guide/${item.slug}`);
  return `  <url>
    <loc>${escape(seo.canonicalUrl(path, locale))}</loc>
    <lastmod>${guide?.dateModified ?? seo.SITE_UPDATED}</lastmod>
  </url>`;
}));
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);
console.log(`Generated sitemap with ${urls.length} canonical language URLs.`);
