import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Warning, Trophy, Download } from "@phosphor-icons/react";
import { calculateTotalPoints, getCategoryPoints, getQualificationStatus } from "@/lib/calculator";
import { PointsData, VisaType } from "@/lib/models";
import { useReactToPrint } from 'react-to-print';

interface PointsResultProps {
  data: PointsData;
}

export function PointsResult({ data }: PointsResultProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [categoryPoints, setCategoryPoints] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<{ qualified: boolean; expeditedPR: boolean; benefits: string[] }>({
    qualified: false,
    expeditedPR: false,
    benefits: [],
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resultRef,
    documentTitle: `일본_고도인재_비자_점수표_${new Date().toISOString().split('T')[0]}`,
    onBeforeGetContent: () => {
      setIsGeneratingPDF(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }
      }
    `
  });

  useEffect(() => {
    const total = calculateTotalPoints(data);
    setTotalPoints(total);
    
    const categories = getCategoryPoints(data);
    setCategoryPoints(categories);
    
    const qualificationStatus = getQualificationStatus(total);
    setStatus(qualificationStatus);
  }, [data]);

  const getBenefitLabel = (benefit: string) => {
    switch(benefit) {
      case 'spouse_work':
        return '배우자 취업 허가';
      case 'housekeeping':
        return '가사 도우미 초청 가능';
      case 'parent_visit':
        return '부모 초청 가능';
      default:
        return benefit;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'academic':
        return '학력';
      case 'career':
        return '직무경력(실무경험)';
      case 'age':
        return '나이';
      case 'salary':
        return '연 수익';
      case 'research':
        return '연구 실적';
      case 'license':
        return '자격증';
      case 'language':
        return '언어 능력';
      case 'special':
        return '특별 가산';
      default:
        return category;
    }
  };

  const getVisaTypeLabel = (type: VisaType): string => {
    return '고도 전문 기술 활동';
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    handlePrint();
    // Reset state after a short delay to allow print dialog to appear
    setTimeout(() => setIsGeneratingPDF(false), 1000);
  };

  return (
    <Card ref={resultRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-primary">결과</CardTitle>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            variant="outline"
            size="sm"
            className="gap-2 no-print"
          >
            <Download size={16} />
            {isGeneratingPDF ? 'PDF 준비 중...' : '결과 PDF 다운로드'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">비자 유형</h3>
            <span className="text-sm font-medium">{getVisaTypeLabel(data.visaType)}</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">총 점수</h3>
            <span className="text-2xl font-bold">{totalPoints}점</span>
          </div>
          <Progress value={(totalPoints / 100) * 100} className="h-3" />
          <div className="flex justify-between text-xs mt-1">
            <span>0점</span>
            <span className="text-primary font-medium">자격 기준: 70점</span>
            <span>100점</span>
          </div>
        </div>

        <Alert variant={status.qualified ? "default" : "destructive"} className="mt-4">
          {status.qualified ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>자격 요건 충족</AlertTitle>
              <AlertDescription>
                고도인재 비자 자격 요건을 충족합니다.
                {status.expeditedPR && " 80점 이상으로 '고도인재 우대제도' 혜택을 받을 수 있습니다."}
              </AlertDescription>
            </>
          ) : (
            <>
              <Warning className="h-4 w-4" />
              <AlertTitle>자격 요건 미달</AlertTitle>
              <AlertDescription>
                고도인재 비자 자격 요건(70점)을 충족하지 못합니다. 추가 점수를 획득할 수 있는 방법을 검토해보세요.
              </AlertDescription>
            </>
          )}
        </Alert>

        {status.qualified && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">혜택</h3>
            <div className="flex flex-wrap gap-2">
              {status.expeditedPR && (
                <Badge variant="outline" className="bg-primary/10 border-primary">
                  <Trophy size={14} className="mr-1" />
                  영주권 신청 요건 완화
                </Badge>
              )}
              {status.benefits.map((benefit) => (
                <Badge key={benefit} variant="outline" className="bg-secondary/10 border-secondary">
                  {getBenefitLabel(benefit)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div>
          <h3 className="font-medium mb-3">카테고리별 점수</h3>
          <div className="space-y-3">
            {Object.entries(categoryPoints).map(([category, points]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{getCategoryLabel(category)}</span>
                  <span className="font-medium">{points}점</span>
                </div>
                <Progress value={points > 0 ? 100 : 0} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}