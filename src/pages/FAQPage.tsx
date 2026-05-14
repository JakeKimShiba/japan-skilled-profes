import { FAQ } from "@/components/FAQ";
import { SEOHead } from "@/components/SEOHead";

export function FAQPage() {
  return (
    <>
      <SEOHead
        title="고도인재 비자 자주 묻는 질문 (FAQ) | kodocalc.com"
        description="일본 고도인재 비자(HSP) 포인트 계산, 학력·연봉·자격증 기준, 영주권 신청 등에 대한 자주 묻는 질문과 답변을 모았습니다."
        path="/guide/faq"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            자주 묻는 질문
          </h1>
          <p className="mt-3 text-muted-foreground">
            고도인재 비자에 대해 자주 묻는 질문과 답변을 확인하세요.
          </p>
        </div>
        <FAQ />
      </div>
    </>
  );
}
