import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Warning, Info, CheckCircle } from "@phosphor-icons/react";
import { PointsData } from "@/lib/models";

interface DocumentGuideProps {
  data: PointsData;
  totalPoints: number;
}

export function DocumentGuide({ data, totalPoints }: DocumentGuideProps) {
  const getRequiredDocuments = () => {
    const docs = [
      // 기본 서류
      { category: '기본서류', items: ['여권', '거주지 증명서', '사진 2장'] },
      
      // 학력 관련
      { 
        category: '학력증명', 
        items: data.educationLevel !== 'none' 
          ? ['졸업증명서', '성적증명서', '학위인증서'] 
          : [] 
      },
      
      // 경력 관련
      { 
        category: '경력증명', 
        items: data.workExperience !== 'less3' 
          ? ['재직증명서', '경력증명서', '업무상세서'] 
          : ['재직증명서'] 
      },
      
      // 연봉 관련
      { 
        category: '소득증명', 
        items: ['근로계약서', '급여명세서(최근 3개월)', '소득증명서'] 
      },
      
      // 언어능력 관련
      { 
        category: '언어능력', 
        items: data.japaneseLanguage !== 'none' 
          ? data.japaneseLanguage === 'major' 
            ? ['졸업증명서(일본어전공 명시)', '교육과정 설명서']
            : ['JLPT 또는 BJT 합격증']
          : [] 
      }
    ].filter(doc => doc.items.length > 0);

    // 비자별 추가 서류
    if (data.visaType === 'academic' && data.academicResearchBonus) {
      docs.push({ 
        category: '연구실적', 
        items: ['논문 목록', '특허증', '연구보고서', '학회발표 자료'] 
      });
    }
    
    if (data.visaType === 'business' && data.businessExecutiveBonus !== 'none') {
      docs.push({ 
        category: '경영진 증명', 
        items: ['임원 등기부등본', '조직도', '업무분장표'] 
      });
    }

    return docs;
  };

  const getApplicationTips = () => {
    const tips = [];
    
    if (totalPoints >= 70 && totalPoints < 80) {
      tips.push({
        type: 'success',
        title: '신청 가능 상태',
        message: '고도인재 기준을 충족하여 신청 가능합니다.'
      });
    } else if (totalPoints < 70) {
      tips.push({
        type: 'warning', 
        title: '점수 부족',
        message: `${70 - totalPoints}점이 부족합니다. 추가 점수 확보 후 신청하세요.`
      });
    }
    
    if (data.japaneseEducation) {
      tips.push({
        type: 'info',
        title: '일본 학력 가산점',
        message: '일본 대학 졸업 증명서류 반드시 준비하세요.'
      });
    }
    
    return tips;
  };

  return (
    <div className="space-y-6">
      {/* 신청 상태 알림 */}
      <div className="space-y-2">
        {getApplicationTips().map((tip, index) => (
          <Alert 
            key={index}
            className={
              tip.type === 'success' ? 'border-green-200 bg-green-50' :
              tip.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }
          >
            {tip.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {tip.type === 'warning' && <Warning className="h-4 w-4" />}
            {tip.type === 'info' && <Info className="h-4 w-4" />}
            <AlertDescription>
              <strong>{tip.title}:</strong> {tip.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* 서류 준비 가이드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            서류 준비 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRequiredDocuments().map((docGroup, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{docGroup.category}</Badge>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-4">
                  {docGroup.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* 주의사항 */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">📋 서류 준비 주의사항</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 모든 외국 서류는 일본어 번역본 첨부 필요</li>
              <li>• 원본 또는 공증된 사본만 인정</li>  
              <li>• 발행일로부터 3개월 이내 서류 사용</li>
              <li>• 불분명한 사항은 사전에 입국관리소 문의 필수</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}