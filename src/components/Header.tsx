import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Header() {
  return (
    <Card className="mb-6 border-none shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-bold flex flex-col md:flex-row justify-center items-center gap-2">
          <span className="text-primary">일본 고도인재 포인트 계산기</span>
        </CardTitle>
        <CardDescription className="text-center max-w-2xl mx-auto space-y-2 text-sm md:text-base">
          <p className="text-foreground/70">
            高度人材ポイント制度 / Points-based Preferential Immigration Treatment
          </p>
          <p>
            일본의 고도인재 비자(고도 전문 기술 활동) 자격을 확인하기 위한 포인트를 계산해보세요.
          </p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}