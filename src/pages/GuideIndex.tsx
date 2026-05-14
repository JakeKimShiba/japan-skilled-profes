import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { guides } from "@/content/guides";
import { SEOHead } from "@/components/SEOHead";

export function GuideIndex() {
  return (
    <>
      <SEOHead
        title="고도인재 비자 가이드 | kodocalc.com"
        description="일본 고도인재 비자(HSP) 신청에 필요한 모든 정보를 정리한 가이드 모음. 제도 안내, FAQ, 포인트 계산, 영주권 신청 등."
        path="/guide"
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            고도인재 비자 가이드
          </h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            일본 고도인재 비자(高度専門職) 신청에 필요한 모든 정보를 한곳에 모았습니다.
            제도 안내부터 포인트 계산, 영주권 신청까지 단계별로 안내합니다.
          </p>
        </div>

        {/* Info & FAQ quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/guide/info" className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:bg-primary/5">
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <Info size={22} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">제도 안내</div>
                  <div className="text-xs text-muted-foreground mt-0.5">비자 유형, 혜택, 영주권, 자격증 등</div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/guide/faq" className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:bg-primary/5">
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <Question size={22} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">자주 묻는 질문</div>
                  <div className="text-xs text-muted-foreground mt-0.5">포인트 기준, 신청 방법, 영주권 등</div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Guide articles */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">상세 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <Link key={guide.slug} to={`/guide/${guide.slug}`} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:bg-primary/5">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {guide.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.keywords.slice(0, 3).map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs text-muted-foreground font-normal">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
