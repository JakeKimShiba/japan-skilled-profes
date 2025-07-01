import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VisaType } from "@/lib/models";

interface InfoPanelProps {
  currentVisaType: VisaType;
}

export function InfoPanel({ currentVisaType }: InfoPanelProps) {
  const getVisaTypeLabel = (): string => {
    switch (currentVisaType) {
      case 'technical':
        return '고도 전문 기술 활동 (高度専門職 1号 イ)';
      case 'research':
        return '학술 연구 활동 (高度専門職 1号 ア)';
      case 'business':
        return '경영 관리 활동 (高度専門職 1号 ウ)';
      default:
        return '고도 전문 기술 활동 (高度専門職 1号 イ)';
    }
  };

  const getVisaTypeDescription = (): string => {
    switch (currentVisaType) {
      case 'technical':
        return '엔지니어, 프로그래머, 디자이너와 같은 전문 기술직 종사자를 위한 비자입니다. IT, 공학, 디자인 등의 분야에서 고도의 전문성을 인정받은 외국인에게 발급됩니다.';
      case 'research':
        return '대학, 연구소, 기업 연구소 등에서 학술 연구를 수행하는 연구원을 위한 비자입니다. 과학, 의학, 인문학 등 다양한 분야의 연구자에게 적합합니다.';
      case 'business':
        return '기업의 경영, 관리 업무를 담당하는 전문가를 위한 비자입니다. 회사 경영, 재무 관리, 인사 관리 등 기업 운영에 필수적인 역할을 수행하는 외국인에게 발급됩니다.';
      default:
        return '엔지니어, 프로그래머, 디자이너와 같은 전문 기술직 종사자를 위한 비자입니다. IT, 공학, 디자인 등의 분야에서 고도의 전문성을 인정받은 외국인에게 발급됩니다.';
    }
  };

  return (
    <Card className="mb-6 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-xl text-primary">고도인재 비자 ({getVisaTypeLabel()})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          일본의 고도인재 포인트 제도(高度人材ポイント制度)는 학력, 경력, 연봉 등을 
          포인트로 환산하여 일정 점수(70점) 이상인 외국인에게 출입국 관리상의 우대 조치를 제공하는 제도입니다.
        </p>
        
        <p className="mt-2 text-primary-foreground bg-primary/80 p-2 rounded-md">
          본 계산기는 <strong>{getVisaTypeLabel()}</strong> 기준으로 포인트를 계산합니다.
          {currentVisaType === 'technical' && ' 이 유형은 엔지니어링, IT 등의 전문 기술 직종에 적합합니다.'}
          {currentVisaType === 'research' && ' 이 유형은 연구원, 교수 등의 학술 연구 활동에 적합합니다.'}
          {currentVisaType === 'business' && ' 이 유형은 회사 경영, 임원 등의 경영 관리 활동에 적합합니다.'}
        </p>
        
        <p>
          {getVisaTypeDescription()}
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