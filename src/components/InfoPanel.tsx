import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function InfoPanel() {
  return (
    <Card className="mb-6 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-xl text-primary">고도인재 비자 (고도 전문 기술 활동)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          일본의 고도인재 포인트 제도(高度人材ポイント制度)는 학력, 경력, 연봉 등을 
          포인트로 환산하여 일정 점수(70점) 이상인 외국인에게 출입국 관리상의 우대 조치를 제공하는 제도입니다.
        </p>
        
        <p className="mt-2 text-primary-foreground bg-primary/80 p-2 rounded-md">
          본 계산기는 <strong>고도 전문 기술 활동</strong>(高度専門職 1호 イ) 기준으로 작성되었으며, 
          학술 연구 활동이나 경영/관리 활동 분야는 포함하지 않습니다.
        </p>
        
        <Separator className="my-3" />
        
        <div className="space-y-2">
          <h3 className="font-medium">주요 혜택</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>복수 활동 허가 (여러 분야에서 활동 가능)</li>
            <li>재류 기간 5년 부여</li>
            <li>배우자 취업 활동 허가</li>
            <li>일정 조건 하에서 부모 동반 허가</li>
            <li>가사 도우미 고용 허가</li>
            <li>영주권 신청 요건 완화 (80점 이상)</li>
          </ul>
        </div>
        
        <Separator className="my-3" />
        
        <div className="space-y-2">
          <h3 className="font-medium">포인트 계산 항목</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>학력 (최대 30점)</li>
            <li>경력 (최대 25점)</li>
            <li>연봉 (최대 60점)</li>
            <li>나이 (최대 15점)</li>
            <li>연구 실적 및 자격증 (최대 25점)</li>
            <li>일본어/외국어 능력 (최대 25점)</li>
            <li>특별 가산 항목 (최대 20점)</li>
          </ul>
        </div>
        
        <Separator className="my-3" />
        
        <p className="text-muted-foreground text-xs">
          ※ 본 계산기는 참고용으로 제공됩니다. 정확한 정보는 일본 출입국 재류관리청의 공식 정보를 확인하세요.
        </p>
      </CardContent>
    </Card>
  );
}