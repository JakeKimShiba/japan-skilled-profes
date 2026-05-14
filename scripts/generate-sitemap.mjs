/**
 * Build-time sitemap generator
 * Run after vite build: node scripts/generate-sitemap.mjs
 */

const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/?lang=ko', changefreq: 'daily', priority: '1.0' },
  { loc: '/?lang=ja', changefreq: 'daily', priority: '0.9' },
  { loc: '/?lang=en', changefreq: 'weekly', priority: '0.8' },
  { loc: '/?lang=zh-cn', changefreq: 'weekly', priority: '0.7' },
  { loc: '/?lang=zh-tw', changefreq: 'weekly', priority: '0.7' },
  { loc: '/guide', changefreq: 'weekly', priority: '0.8' },
  { loc: '/guide/info', changefreq: 'weekly', priority: '0.8' },
  { loc: '/guide/faq', changefreq: 'weekly', priority: '0.8' },
];

// Guide pages — add new guides here
const guidePages = [
  { slug: '고도인재-비자-완벽-가이드', priority: '0.9' },
  { slug: '포인트-올리는-방법', priority: '0.9' },
  { slug: 'jlpt-일본어-고도인재-비자', priority: '0.9' },
  { slug: '고도인재-비자-영주권-가이드', priority: '0.9' },
];

const urls = [
  ...staticPages.map(p => `
  <url>
    <loc>https://kodocalc.com${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ...guidePages.map(g => `
  <url>
    <loc>https://kodocalc.com/guide/${encodeURIComponent(g.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${g.priority}</priority>
  </url>`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

import { writeFileSync } from 'fs';
writeFileSync('dist/sitemap.xml', sitemap.trim());
console.log(`✅ sitemap.xml generated with ${staticPages.length + guidePages.length} URLs (${today})`);
