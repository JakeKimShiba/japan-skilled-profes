import { InfoPanel } from "@/components/InfoPanel";
import { SEOHead } from "@/components/SEOHead";

export function InfoPage() {
  return (
    <>
      <SEOHead
        title="고도인재 비자 제도 안내 | kodocalc.com"
        description="일본 고도인재 비자(高度専門職) 제도의 개요, 혜택, 포인트 카테고리, 영주권 취득 조건, 자격증 안내 등을 정리했습니다."
        path="/guide/info"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            고도인재 비자 제도 안내
          </h1>
          <p className="mt-3 text-muted-foreground">
            일본 고도인재 비자(高度専門職)의 제도 개요와 혜택을 확인하세요.
          </p>
        </div>
        <InfoPanel />
      </div>
    </>
  );
}
