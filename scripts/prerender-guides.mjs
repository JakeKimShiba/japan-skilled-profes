/**
 * Prerender guide pages for SEO
 * 
 * Generates static HTML files for each guide route so that:
 * 1. GitHub Pages serves 200 (not 404) for guide URLs
 * 2. Crawlers see real meta tags and content without JS execution
 * 3. The SPA still hydrates and takes over after load
 * 
 * Run after vite build: node scripts/prerender-guides.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

// ─── Guide data (keep in sync with src/content/guides.ts) ───────────────
const guides = [
  {
    slug: "고도인재-비자-완벽-가이드",
    title: "일본 고도인재 비자(高度専門職) 완벽 가이드 2026",
    description: "일본 고도인재 비자(HSP)란 무엇인지, 포인트 계산 방법, 비자 유형별 차이, 신청 절차, 영주권 혜택까지 한 페이지에서 모두 확인하세요. 70점·80점 기준과 실제 사례를 포함한 종합 안내서입니다.",
    keywords: ["고도인재 비자", "일본 고도인재", "고도인재비자", "HSP 비자", "고도전문직", "일본 영주권"],
    datePublished: "2026-05-14",
    sections: [
      { title: "고도인재 비자(高度専門職ビザ)란?", summary: "고도인재 비자(高度専門職ビザ)는 일본 법무성이 운영하는 포인트제 우대 비자입니다. 학력, 경력, 연봉, 나이, 자격증, 일본어 능력 등을 합산하여 70점 이상이면 취득할 수 있으며, 80점 이상이면 최단 1년 만에 영주권 신청이 가능합니다." },
      { title: "비자 3가지 유형과 차이점", summary: "고도인재 비자는 학술연구(イ), 기술·인문(ロ), 경영·관리(ハ) 3가지 유형으로 나뉩니다. 각 유형별로 포인트 배점이 다르므로 자신에게 유리한 유형을 선택하는 것이 중요합니다." },
      { title: "포인트 계산 항목별 상세 배점", summary: "포인트는 학력(최대 30점), 경력(최대 20~25점), 연봉(최대 40점), 나이(최대 15점), 일본어 능력(최대 15점), 특별 가산 항목으로 나뉩니다." },
      { title: "70점 달성을 위한 현실적인 전략", summary: "석사 + 5년 경력 + 500만엔 연봉(20대)으로 70점 달성, 학사 + 10년 경력 + 700만엔 연봉(30대)으로 75점 달성 등 현실적인 시나리오를 소개합니다." },
      { title: "고도인재 비자의 7대 혜택", summary: "복합적 활동 허가, 5년 체류 기간, 배우자 취업 허가, 부모 초청, 가사 도우미 고용, 영주권 신청 단축(70점: 3년, 80점: 1년), 입국 심사 우대." },
      { title: "신청 절차와 필요 서류", summary: "출입국재류관리청에 재류자격인정증명서 또는 재류자격변경허가를 신청합니다. 포인트 계산표, 학위증명서, 재직증명서, 원천징수표, JLPT 합격증 등이 필요합니다." },
    ],
    faq: [
      { q: "고도인재 비자와 일반 취업비자(기술·인문·국제업무)의 차이는?", a: "일반 취업비자는 하나의 활동만 허가되고 체류 기간이 1~5년이지만, 고도인재 비자는 복합 활동이 가능하고 배우자 취업, 부모 초청 등 특별 혜택이 있습니다. 가장 큰 차이는 영주권 신청 단축(일반 10년 → 고도인재 1~3년)입니다." },
      { q: "포인트가 70점 미만이면 어떻게 해야 하나요?", a: "JLPT N1 취득(+5~15점), 연봉 인상 협상, 일본 국가자격증 취득, 이노베이션 촉진 기업 이직 등을 통해 점수를 올릴 수 있습니다." },
      { q: "고도인재 비자로 전직(이직)이 가능한가요?", a: "고도인재 비자 1호는 소속 기관에 종속됩니다. 이직 시 재류자격 변경 신청이 필요합니다. 고도인재 비자 2호(무기한)는 소속 기관에 관계없이 활동 가능합니다." },
      { q: "한국 대학 졸업도 학력 포인트를 받을 수 있나요?", a: "네. 한국을 포함한 해외 대학 졸업도 학력 포인트 대상입니다. QS, THE, ARWU 세계 대학 랭킹 Top 300 이내 대학 졸업자는 +10점 보너스를 받을 수 있습니다." },
      { q: "영주권 신청 시 주의사항은?", a: "세금 체납이 없어야 하고, 이직 시 14일 이내에 입관 신고 의무를 이행해야 합니다. 건강보험·연금 납부 기록도 심사됩니다." },
    ],
  },
  {
    slug: "포인트-올리는-방법",
    title: "고도인재 포인트를 올리는 6가지 현실적인 방법",
    description: "고도인재 비자 70점·80점에 도달하기 위한 실전 전략. JLPT, 연봉 협상, 자격증, 대학 보너스 등 가장 효과적인 포인트 향상 방법을 정리했습니다.",
    keywords: ["고도인재 포인트", "포인트 올리기", "JLPT N1", "일본 자격증", "고도인재 70점"],
    datePublished: "2026-05-14",
    sections: [
      { title: "현재 점수 진단하기", summary: "포인트를 올리려면 먼저 현재 몇 점인지 정확히 파악하는 것이 중요합니다. 보통 5~15점 부족한 경우가 많으며, 아래 6가지 방법 중 2~3가지를 조합하면 충분히 달성 가능합니다." },
      { title: "방법 1: JLPT N1 취득 (+5~15점)", summary: "가장 확실하고 본인 노력으로 달성 가능한 방법입니다. N2에서 N1으로 +5점, 없음에서 N1으로 +15점." },
      { title: "방법 2: 연봉 협상 또는 이직 (+5~15점)", summary: "연봉 구간마다 5점 단위로 포인트가 올라갑니다. 100만엔만 올려도 +5점이 가능합니다." },
      { title: "방법 3: 일본 국가자격증 취득 (+5~10점)", summary: "IT 업종이라면 일본 IPA의 국가자격증이 가장 접근하기 쉽습니다. 1개 +5점, 2개 이상 +10점." },
      { title: "방법 4: Top 300 대학 보너스 확인 (+10점)", summary: "QS, THE, ARWU 세계 대학 랭킹 Top 300위 이내 대학을 졸업했다면 +10점을 받을 수 있습니다." },
      { title: "방법 5: 이노베이션 촉진 기업 소속 (+10점)", summary: "일본 정부가 지정한 이노베이션 촉진 기업에 소속되어 있으면 +10점을 받습니다." },
      { title: "방법 6: 경력 쌓기 (시간 투자)", summary: "3년→5년, 7년→10년 경계에서 큰 폭으로 상승하지만, 나이 포인트는 반대로 줄어드므로 가능하면 빨리 신청하는 것이 유리합니다." },
    ],
    faq: [
      { q: "70점과 80점의 차이는 무엇인가요?", a: "70점 이상이면 고도인재 비자를 받을 수 있고 3년 후 영주권 신청이 가능합니다. 80점 이상이면 1년 후 영주권 신청이 가능하여 영주권 취득 시간이 크게 단축됩니다." },
      { q: "포인트 계산은 신청 시점 기준인가요?", a: "네. 포인트는 비자 신청 시점의 조건을 기준으로 계산합니다. JLPT 합격, 연봉 인상 등이 확정된 후에 신청하는 것이 유리합니다." },
    ],
  },
];

const guideIndex = {
  title: "고도인재 비자 가이드 | kodocalc.com",
  description: "일본 고도인재 비자(HSP) 신청에 필요한 모든 정보를 정리한 가이드 모음. 포인트 계산, 영주권 신청, 대학 보너스 등.",
  path: "/guide",
};

// ─── HTML generation helpers ────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateJsonLd(guide, today) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": guide.title,
      "description": guide.description,
      "author": { "@type": "Person", "name": "Jake Kim" },
      "publisher": { "@type": "Organization", "name": "kodocalc.com" },
      "datePublished": guide.datePublished,
      "dateModified": today,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": guide.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://kodocalc.com/" },
        { "@type": "ListItem", "position": 2, "name": "가이드", "item": "https://kodocalc.com/guide" },
        { "@type": "ListItem", "position": 3, "name": guide.title, "item": `https://kodocalc.com/guide/${guide.slug}` },
      ],
    },
  ];
  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n    ');
}

function generateGuideBodyHtml(guide) {
  let html = `<article>`;
  html += `<h1>${escapeHtml(guide.title)}</h1>`;
  html += `<p>${escapeHtml(guide.description)}</p>`;
  html += `<nav><h2>목차</h2><ol>`;
  guide.sections.forEach((s, i) => {
    html += `<li><a href="#section-${i}">${escapeHtml(s.title)}</a></li>`;
  });
  html += `</ol></nav>`;
  guide.sections.forEach((s, i) => {
    html += `<section id="section-${i}"><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.summary)}</p></section>`;
  });
  if (guide.faq.length > 0) {
    html += `<section><h2>자주 묻는 질문</h2>`;
    guide.faq.forEach(f => {
      html += `<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`;
    });
    html += `</section>`;
  }
  html += `<p><a href="/">무료 포인트 계산기로 바로 확인하기 →</a></p>`;
  html += `</article>`;
  return html;
}

function generateGuideIndexBodyHtml() {
  let html = `<div>`;
  html += `<h1>고도인재 비자 가이드</h1>`;
  html += `<p>일본 고도인재 비자(高度専門職) 신청에 필요한 모든 정보를 한곳에 모았습니다.</p>`;
  html += `<nav><ul>`;
  html += `<li><a href="/guide/info">제도 안내</a> — 비자 유형, 혜택, 영주권, 자격증 등</li>`;
  html += `<li><a href="/guide/faq">자주 묻는 질문</a> — 포인트 기준, 신청 방법, 영주권 등</li>`;
  guides.forEach(g => {
    html += `<li><a href="/guide/${g.slug}">${escapeHtml(g.title)}</a> — ${escapeHtml(g.description)}</li>`;
  });
  html += `</ul></nav>`;
  html += `<p><a href="/">무료 포인트 계산기 →</a></p>`;
  html += `</div>`;
  return html;
}

// ─── Main ───────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];
const template = readFileSync('dist/index.html', 'utf-8');

function injectSeo(html, { title, description, path, jsonLdHtml, bodyHtml }) {
  const fullUrl = `https://kodocalc.com${path}`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // Replace meta name="title"
  html = html.replace(
    /(<meta name="title" content=")[^"]*(")/,
    `$1${escapeHtml(title)}$2`
  );

  // Replace meta name="description"
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`
  );

  // Replace OG tags
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${fullUrl}$2`
  );
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${escapeHtml(title)}$2`
  );
  html = html.replace(
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`
  );
  html = html.replace(
    /(<meta property="og:type" content=")[^"]*(")/,
    `$1article$2`
  );

  // Replace Twitter tags
  html = html.replace(
    /(<meta property="twitter:url" content=")[^"]*(")/,
    `$1${fullUrl}$2`
  );
  html = html.replace(
    /(<meta property="twitter:title" content=")[^"]*(")/,
    `$1${escapeHtml(title)}$2`
  );
  html = html.replace(
    /(<meta property="twitter:description" content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`
  );

  // Replace canonical
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${fullUrl}$2`
  );

  // Inject guide-specific JSON-LD before </head>
  if (jsonLdHtml) {
    html = html.replace('</head>', `    ${jsonLdHtml}\n  </head>`);
  }

  // Inject pre-rendered body content into <div id="root"> for crawlers
  // React will hydrate over this (or replace it on client mount)
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`
  );

  return html;
}

// Generate guide index page
{
  const dir = 'dist/guide';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const indexHtml = injectSeo(template, {
    title: guideIndex.title,
    description: guideIndex.description,
    path: guideIndex.path,
    jsonLdHtml: null,
    bodyHtml: generateGuideIndexBodyHtml(),
  });
  writeFileSync(`${dir}/index.html`, indexHtml);
  console.log(`  ✅ /guide/index.html`);
}

// Generate individual guide pages
for (const guide of guides) {
  const dir = `dist/guide/${guide.slug}`;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const guideHtml = injectSeo(template, {
    title: `${guide.title} | kodocalc.com`,
    description: guide.description,
    path: `/guide/${guide.slug}`,
    jsonLdHtml: generateJsonLd(guide, today),
    bodyHtml: generateGuideBodyHtml(guide),
  });
  writeFileSync(`${dir}/index.html`, guideHtml);
  console.log(`  ✅ /guide/${guide.slug}/index.html`);
}

// Generate info page
{
  const dir = 'dist/guide/info';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const infoHtml = injectSeo(template, {
    title: '고도인재 비자 제도 안내 | kodocalc.com',
    description: '일본 고도인재 비자(高度専門職) 제도의 개요, 혜택, 포인트 카테고리, 영주권 취득 조건, 자격증 안내 등을 정리했습니다.',
    path: '/guide/info',
    jsonLdHtml: null,
    bodyHtml: '<article><h1>고도인재 비자 제도 안내</h1><p>일본 고도인재 비자(高度専門職)의 제도 개요와 혜택을 확인하세요.</p></article>',
  });
  writeFileSync(`${dir}/index.html`, infoHtml);
  console.log(`  ✅ /guide/info/index.html`);
}

// Generate FAQ page
{
  const dir = 'dist/guide/faq';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const faqHtml = injectSeo(template, {
    title: '고도인재 비자 자주 묻는 질문 (FAQ) | kodocalc.com',
    description: '일본 고도인재 비자(HSP) 포인트 계산, 학력·연봉·자격증 기준, 영주권 신청 등에 대한 자주 묻는 질문과 답변을 모았습니다.',
    path: '/guide/faq',
    jsonLdHtml: null,
    bodyHtml: '<article><h1>자주 묻는 질문</h1><p>고도인재 비자에 대해 자주 묻는 질문과 답변을 확인하세요.</p></article>',
  });
  writeFileSync(`${dir}/index.html`, faqHtml);
  console.log(`  ✅ /guide/faq/index.html`);
}

console.log(`\n✅ Prerendered ${guides.length + 3} pages (${today})`);
