export function guideSources(slug: string) {
  const sources = [
    { key: 'points', href: 'https://www.moj.go.jp/isa/applications/resources/newimmiact_3_system_index.html' },
  ];
  if (slug.includes('영주권') || slug.includes('완벽')) {
    sources.push({ key: 'pr', href: 'https://www.moj.go.jp/isa/applications/resources/nyukan_nyukan50.html' });
  }
  if (slug.toLowerCase().includes('jlpt')) {
    sources.push(
      { key: 'jlpt', href: 'https://www.jlpt.jp/about/levelsummary.html' },
      { key: 'bjt', href: 'https://www.kanken.or.jp/bjt/merit/' },
    );
  }
  return sources;
}
