import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function InfoPanel() {
  const getVisaTypeLabel = (): string => {
    return '고도 전문 기술 활동 (高度専門職 1号 イ)';
  };

  const getVisaTypeDescription = (): string => {
    return '엔지니어, 프로그래머, 디자이너와 같은 전문 기술직 종사자를 위한 비자입니다. IT, 공학, 디자인 등의 분야에서 고도의 전문성을 인정받은 외국인에게 발급됩니다.';
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
          이 유형은 엔지니어링, IT 등의 분야에 적합합니다.
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
            <li>영주권 신청 요건 완화:
              <ul className="list-disc pl-5 text-xs mt-1 space-y-1">
                <li>70점 이상: 3년간 비자 유지 후 또는 3년 전부터 연속으로 자격 충족 시 신청 가능</li>
                <li>80점 이상: 1년 비자 유지 후 또는 1년 전부터 자격 충족 시 신청 가능</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <Separator className="my-3" />
        
        <div className="space-y-2">
          <h3 className="font-medium">포인트 계산 항목</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>학력 (최대 30점)</li>
            <li>직무경력 (최대 20점)</li>
            <li>연봉 (최대 60점)</li>
            <li>나이 (최대 15점)</li>
            <li>연구 실적 및 자격증 (최대 25점)</li>
            <li>일본어/외국어 능력 (최대 25점)</li>
            <li>특별 가산 항목 (최대 20점)</li>
          </ul>
        </div>
        
        <Separator className="my-3" />
        
        <div className="space-y-2">
          <h3 className="font-medium">영주권 신청 혜택 상세</h3>
          <p>고도인재 비자의 큰 장점 중 하나는 일반 취업비자보다 영주권 취득 기간이 단축된다는 점입니다:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>70점 이상 취득자</strong>: 일본에서 3년간 비자 유지 후 또는 고도인재 자격 요건을 3년 전부터 연속으로 충족하고 있었음을 증명할 경우 영주권 신청 가능</li>
            <li><strong>80점 이상 취득자</strong>: 일본에서 1년간 비자 유지 후 또는 고도인재 자격 요건을 1년 전부터 연속으로 충족하고 있었음을 증명할 경우 영주권 신청 가능</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">※ 일반적인 영주권 신청은 10년 이상의 체류기간이 필요한 것에 비해 크게 단축된 혜택입니다.</p>
        </div>
        
        <Separator className="my-3" />
        <div className="space-y-2">
          <h3 className="font-medium">자격증 정보</h3>
          <p>직무에 관련된 일본의 국가자격증을 보유하면 1개당 5점(최대 10점)을 획득할 수 있습니다.</p>
          <p>한국의 정보처리기사/정보처리산업기사 자격증도 일본에서 인정되어 최대 5점을 취득할 수 있습니다.</p>
          <p className="mt-2">
            <a 
              href="https://www.moj.go.jp/isa/policies/bill/nyukan_hourei_h09.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              일본 국가자격증 목록 확인하기
            </a>
          </p>
        </div>
        
        <Separator className="my-3" />
        
        <p className="text-muted-foreground text-xs">
          ※ 본 계산기는 참고용으로 제공됩니다. 정확한 정보는 
          <a href="https://www.moj.go.jp/isa/index.html" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-primary hover:underline ml-1">
            일본 출입국 재류관리청의 공식 사이트
          </a>를 확인해 주세요.
        </p>
      </CardContent>
    </Card>
  );
}