import { useParams, Link, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator } from "@phosphor-icons/react";
import { guides } from "@/content/guides";
import { SEOHead } from "@/components/SEOHead";

export function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guide" replace />;
  }

  return (
    <>
      <SEOHead
        title={`${guide.title} | kodocalc.com`}
        description={guide.description}
        path={`/guide/${guide.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": guide.title,
            "description": guide.description,
            "author": { "@type": "Person", "name": "Jake Kim" },
            "publisher": { "@type": "Organization", "name": "kodocalc.com" },
            "datePublished": guide.datePublished,
            "dateModified": guide.dateModified,
          },
          ...(guide.faq.length > 0
            ? [{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": guide.faq.map((f) => ({
                  "@type": "Question",
                  "name": f.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer,
                  },
                })),
              }]
            : []),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://kodocalc.com/" },
              { "@type": "ListItem", "position": 2, "name": "가이드", "item": "https://kodocalc.com/guide" },
              { "@type": "ListItem", "position": 3, "name": guide.title, "item": `https://kodocalc.com/guide/${guide.slug}` },
            ],
          },
        ]}
      />

      <article className="prose-container">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-xs text-muted-foreground font-normal">{kw}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {guide.description}
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            최종 업데이트: {guide.dateModified}
          </div>
        </header>

        {/* Table of Contents */}
        {guide.sections.length > 2 && (
          <nav className="mb-8 p-4 bg-muted/50 rounded-lg border">
            <h2 className="text-sm font-semibold mb-3">목차</h2>
            <ol className="space-y-1.5 text-sm">
              {guide.sections.map((section, idx) => (
                <li key={idx}>
                  <a
                    href={`#section-${idx}`}
                    className="text-primary hover:text-primary/80 transition-colors hover:underline"
                  >
                    {idx + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {guide.sections.map((section, idx) => (
            <section key={idx} id={`section-${idx}`} className="scroll-mt-20">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">
                {section.title}
              </h2>
              <div
                className="text-foreground/90 leading-relaxed space-y-4 [&_table]:w-full [&_table]:border-collapse [&_table]:block [&_table]:overflow-x-auto [&_th]:bg-muted [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:border [&_th]:whitespace-nowrap [&_td]:p-3 [&_td]:border [&_td]:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>

        {/* FAQ */}
        {guide.faq.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
                자주 묻는 질문
              </h2>
              <div className="space-y-4">
                {guide.faq.map((item, idx) => (
                  <details key={idx} className="group border rounded-lg">
                    <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-foreground hover:bg-muted/50 transition-colors rounded-lg">
                      {item.question}
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="px-4 pb-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center space-y-3">
            <h2 className="text-xl font-semibold">나의 고도인재 포인트는?</h2>
            <p className="text-muted-foreground text-sm">
              무료 계산기로 학력·경력·연봉·자격증을 입력하면 즉시 확인할 수 있습니다.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Calculator size={18} />
              포인트 계산하기
            </Link>
          </CardContent>
        </Card>

        {/* Related Guides */}
        {guides.filter((g) => g.slug !== guide.slug).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">관련 가이드</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guides
                .filter((g) => g.slug !== guide.slug)
                .slice(0, 4)
                .map((g) => (
                  <Link
                    key={g.slug}
                    to={`/guide/${g.slug}`}
                    className="p-3 border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <div className="font-medium text-sm group-hover:text-primary transition-colors">
                      {g.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {g.description}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
