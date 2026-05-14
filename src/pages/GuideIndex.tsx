import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "@phosphor-icons/react";
import { guides } from "@/content/guides";
import { SEOHead } from "@/components/SEOHead";

export function GuideIndex() {
  return (
    <>
      <SEOHead
        title="고도인재 비자 가이드 | kodocalc.com"
        description="일본 고도인재 비자(HSP) 신청에 필요한 모든 정보를 정리한 가이드 모음. 포인트 계산, 영주권 신청, 대학 보너스 등."
        path="/guide"
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            고도인재 비자 가이드
          </h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            일본 고도인재 비자(高度専門職) 신청에 필요한 모든 정보를 한곳에 모았습니다.
            포인트 계산부터 영주권 신청까지, 단계별로 안내합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <Link key={guide.slug} to={`/guide/${guide.slug}`} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:bg-primary/5">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {guide.title}
                    </h2>
                    <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {guide.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.keywords.slice(0, 3).map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA to calculator */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center space-y-3">
            <h2 className="text-xl font-semibold">지금 바로 포인트를 계산해보세요</h2>
            <p className="text-muted-foreground">
              학력, 경력, 연봉, 자격증 등을 입력하면 즉시 고도인재 포인트를 확인할 수 있습니다.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              무료 포인트 계산기 →
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
