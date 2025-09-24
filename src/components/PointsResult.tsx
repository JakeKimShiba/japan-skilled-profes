import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Warning, Trophy, Download, Lightbulb } from "@phosphor-icons/react";
import { calculateTotalPoints, getCategoryPoints, getQualificationStatus } from "@/lib/calculator";
import { PointsData, VisaType } from "@/lib/models";
import { useReactToPrint } from 'react-to-print';
import { trackEvent } from '@/lib/analytics';
import { useI18n } from "@/i18n";

interface PointsResultProps {
  data: PointsData;
}

export function PointsResult({ data }: PointsResultProps) {
  const { t } = useI18n();
  const [totalPoints, setTotalPoints] = useState(0);
  const fmtPoints = (n: number) => t('points.value', { value: n });
  const [categoryPoints, setCategoryPoints] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<{ qualified: boolean; expeditedPR: boolean; benefits: string[] }>({
    qualified: false,
    expeditedPR: false,
    benefits: [],
  });
  const prevTotalRef = useRef<number>(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resultRef,
  documentTitle: `${t('result.pdfTitle') || 'HSP_points'}_${new Date().toISOString().split('T')[0]}`,
    // Important for mobile (iOS Safari/Android): don't update state before invoking print
    onBeforePrint: async () => {
      setIsGeneratingPDF(true);
    },
    onAfterPrint: async () => {
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
    // Track milestone thresholds once when crossing 70/80
    const prev = prevTotalRef.current;
    if (prev < 80 && total >= 80) {
      trackEvent('milestone_80_points', { total });
    } else if (prev < 70 && total >= 70) {
      trackEvent('milestone_70_points', { total });
    }
    prevTotalRef.current = total;
  }, [data]);

  const getBenefitLabel = (benefit: string) => {
    switch(benefit) {
      case 'spouse_work':
        return t('benefit.spouse_work');
      case 'housekeeping':
        return t('benefit.housekeeping');
      case 'parent_visit':
        return t('benefit.parent_visit');
      default:
        return benefit;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'academic':
        return t('category.academic');
      case 'career':
        return t('category.career');
      case 'age':
        return t('category.age');
      case 'salary':
        return t('category.salary');
      case 'research':
        return t('category.research');
      case 'license':
        return t('category.license');
      case 'language':
        return t('category.language');
      case 'special':
        return t('category.special');
      default:
        return category;
    }
  };

  const getVisaTypeLabel = (type: VisaType): string => {
    switch (type) {
      case 'academic':
        return t('visa.academic.type');
      case 'technical':
        return t('visa.technical.type');
      case 'business':
        return t('visa.business.type');
      default:
        return t('visa.technical.type');
    }
  };

  const handleDownloadPDF = () => {
    // Call print synchronously within the click handler without any prior state updates
    try {
      const locale = (document.documentElement.getAttribute('lang') || 'ko').toLowerCase();
      trackEvent('pdf_download_click', { locale, total_points: totalPoints });
    } catch {}
    handlePrint();
  };

  // Suggestion helpers
  const simulate = (patch: Partial<PointsData>) => {
    return calculateTotalPoints({ ...data, ...patch });
  };

  const nextIncomeOptionsByAge = (age: string) => {
    const base = ['under3m'];
    if (age === '30to34') base.push('3to5m');
    if (age === '35to39') base.push('3to6m');
    if (age === '40plus') base.push('3to8m');
    if (age === '29under') base.push('4m');
    if (age === '29under' || age === '30to34') base.push('5m');
    if (age !== '40plus') base.push('6m','7m');
    base.push('8m','9m','10m');
    return base;
  };

  const buildSuggestions = () => {
    const suggestions: { label: string; delta: number; key: string; difficulty: number; timeframe: string; priority: number }[] = [];
    const currentTotal = totalPoints;
    
    // 비자 타입별 우선순위 가중치 계산
    const getVisaPriority = (key: string) => {
      if (data.visaType === 'academic') {
        // Academic: 연구 실적 > 학위 > 일본어 > 기타
        if (key === 'research') return 1;
        if (key.startsWith('edu-')) return 2;
        if (key.startsWith('jlpt-') || key.startsWith('japanese-')) return 3;
        return 4;
      } else if (data.visaType === 'technical') {
        // Technical: 일본어 > 자격증 > 급여 > 기타
        if (key.startsWith('jlpt-') || key.startsWith('japanese-')) return 1;
        if (key.startsWith('license-')) return 2;
        if (key.startsWith('salary-')) return 3;
        return 4;
      } else if (data.visaType === 'business') {
        // Business: 급여 > 경영경험 > 학위 > 기타
        if (key.startsWith('salary-')) return 1;
        if (key === 'work-next') return 2;
        if (key.startsWith('edu-')) return 3;
        return 4;
      }
      return 4; // 기본값
    };

    // Language (JLPT/BJT)
    if (data.japaneseLanguage === 'none') {
      // Only suggest N2 if user doesn't have Japanese education bonus (since N2 would cancel it)
      if (!data.japaneseEducation) {
        const n2 = simulate({ japaneseLanguage: 'n2' });
        suggestions.push({ 
          key: 'jlpt-n2', 
          label: 'JLPT N2 취득', 
          delta: n2 - currentTotal, 
          difficulty: 2, 
          timeframe: '3-6개월',
          priority: getVisaPriority('jlpt-n2')
        });
      }
      // Always suggest N1/BJT since they don't conflict with Japanese education
      const n1 = simulate({ japaneseLanguage: 'n1' });
      suggestions.push({ 
        key: 'jlpt-n1-or-bjt', 
        label: 'JLPT N1 혹은 BJT 480점 취득', 
        delta: n1 - currentTotal, 
        difficulty: 3, 
        timeframe: '6-12개월',
        priority: getVisaPriority('jlpt-n1-or-bjt')
      });
    } else if (data.japaneseLanguage === 'n2') {
      // Combine N1 and BJT since they both give 15 points
      const n1 = simulate({ japaneseLanguage: 'n1' });
      suggestions.push({ 
        key: 'jlpt-n1-or-bjt', 
        label: 'JLPT N1 혹은 BJT 480점 취득', 
        delta: n1 - currentTotal, 
        difficulty: 3, 
        timeframe: '6-12개월',
        priority: getVisaPriority('jlpt-n1-or-bjt')
      });
    }

    // Licenses
    if (!data.licenses.includes('other')) {
      const lic = simulate({ licenses: [...data.licenses, 'other'] });
      suggestions.push({ 
        key: 'license-other', 
        label: '외국 자격증 취득', 
        delta: lic - currentTotal, 
        difficulty: 2, 
        timeframe: '3-6개월',
        priority: getVisaPriority('license-other')
      });
    }
    if ((data.jpNationalLicenses ?? 0) < 2) {
      const nextCount = Math.min(2, (data.jpNationalLicenses ?? 0) + 1);
      const lic = simulate({ jpNationalLicenses: nextCount });
      suggestions.push({ 
        key: 'license-jp', 
        label: '일본 국가자격증 1개 추가', 
        delta: lic - currentTotal, 
        difficulty: 2, 
        timeframe: '6-12개월',
        priority: getVisaPriority('license-jp')
      });
    }

    // Research achievements
    if ((data.researchAchievements?.length ?? 0) === 0) {
      const r = simulate({ researchAchievements: ['patents'] });
      suggestions.push({ 
        key: 'research', 
        label: '연구 실적 확보(특허/논문/공식 연구)', 
        delta: r - currentTotal, 
        difficulty: 4, 
        timeframe: '1-3년',
        priority: getVisaPriority('research')
      });
    }

    // Education (long-term)
    if (data.educationLevel === 'bachelors') {
      const m = simulate({ educationLevel: 'masters' });
      suggestions.push({ 
        key: 'edu-m', 
        label: '석사 학위 취득', 
        delta: m - currentTotal, 
        difficulty: 4, 
        timeframe: '2-3년',
        priority: getVisaPriority('edu-m')
      });
    } else if (data.educationLevel === 'masters') {
      const d = simulate({ educationLevel: 'doctorate' });
      suggestions.push({ 
        key: 'edu-d', 
        label: '박사 학위 취득', 
        delta: d - currentTotal, 
        difficulty: 4, 
        timeframe: '3-5년',
        priority: getVisaPriority('edu-d')
      });
    } else if (data.educationLevel === 'none') {
      const b = simulate({ educationLevel: 'bachelors' });
      suggestions.push({ 
        key: 'edu-b', 
        label: '학사 학위 취득', 
        delta: b - currentTotal, 
        difficulty: 4, 
        timeframe: '4년',
        priority: getVisaPriority('edu-b')
      });
    }

    // Work experience (next bracket)
    const workOrder = ['less3','3to5','5to7','7to10','10plus'];
    const currentWorkIdx = workOrder.indexOf(data.workExperience);
    if (currentWorkIdx >= 0 && currentWorkIdx < workOrder.length - 1) {
      const nextW = workOrder[currentWorkIdx + 1];
      const w = simulate({ workExperience: nextW });
      suggestions.push({ 
        key: 'work-next', 
        label: '다음 경력 구간 도달', 
        delta: w - currentTotal, 
        difficulty: 3, 
        timeframe: '1-3년',
        priority: getVisaPriority('work-next')
      });
    }

    // Salary (next higher valid bracket)
    const incomeOrder = nextIncomeOptionsByAge(data.age);
    const currentIdx = incomeOrder.indexOf(data.annualSalary);
    if (currentIdx >= 0) {
      for (let i = currentIdx + 1; i < incomeOrder.length; i++) {
        const nextIncome = incomeOrder[i];
        const s = simulate({ annualSalary: nextIncome });
        const delta = s - currentTotal;
        if (delta > 0) {
          suggestions.push({ 
            key: `salary-${nextIncome}`, 
            label: labelForIncomeGoal(nextIncome), 
            delta, 
            difficulty: 3, 
            timeframe: '6-24개월',
            priority: getVisaPriority(`salary-${nextIncome}`)
          });
          break;
        }
      }
    }

    // Employer-related bonuses
    if (!data.innovationBonus) {
      const inv = simulate({ innovationBonus: true });
      suggestions.push({ 
        key: 'bonus-innovation', 
        label: '혁신 지원조치 기업 취업', 
        delta: inv - currentTotal, 
        difficulty: 4, 
        timeframe: '6개월-2년',
        priority: getVisaPriority('bonus-innovation')
      });
    }
    if (!data.researchCostBonus) {
      const rdb = simulate({ researchCostBonus: true });
      suggestions.push({ 
        key: 'bonus-rd', 
        label: 'R&D 비율 3% 초과 중소기업 취업', 
        delta: rdb - currentTotal, 
        difficulty: 4, 
        timeframe: '6개월-2년',
        priority: getVisaPriority('bonus-rd')
      });
    }

    // Japanese education (not available for JLPT N2 users due to restriction)
    if (!data.japaneseEducation && data.japaneseLanguage !== 'n2') {
      const je = simulate({ japaneseEducation: true });
      suggestions.push({ 
        key: 'edu-jp', 
        label: '일본 고등교육 학위 보유', 
        delta: je - currentTotal, 
        difficulty: 4, 
        timeframe: '2-4년',
        priority: getVisaPriority('edu-jp')
      });
    }

    // Filter positive deltas and sort by visa-type priority, then difficulty, then point delta
    return suggestions
      .filter(s => s.delta > 0)
      .sort((a, b) => {
        // Primary: Sort by visa-type priority (lower number = higher priority)
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        // Secondary: Sort by difficulty (easier first)
        if (a.difficulty !== b.difficulty) {
          return a.difficulty - b.difficulty;
        }
        // Tertiary: Sort by point gain (higher first)
        return b.delta - a.delta;
      })
      .slice(0, 4);
  };

  const labelForIncomeGoal = (key: string) => {
    switch(key) {
      case 'under3m': return '연 소득 300만엔 미만 달성';
      case '3to4m': return '연 소득 300만엔~400만엔 달성';
      case '4to5m': return '연 소득 400만엔~500만엔 달성';
      case '5to6m': return '연 소득 500만엔~600만엔 달성';
      case '6to8m': return '연 소득 600만엔~800만엔 달성';
      case '8to10m': return '연 소득 800만엔~1000만엔 달성';
      case '10m': return '연 소득 1000만엔 이상 달성';
      case '10to15m': return '연 소득 1000만엔~1500만엔 달성';
      case '15to20m': return '연 소득 1500만엔~2000만엔 달성';
      case '20to25m': return '연 소득 2000만엔~2500만엔 달성';
      case '25to30m': return '연 소득 2500만엔~3000만엔 달성';
      case '30m': return '연 소득 3000만엔 이상 달성';
      default: return `연 소득 ${key} 달성`;
    }
  };

  const labelForIncome = (key: string) => {
    switch(key) {
      case 'under3m': return '3백만 엔 미만';
      case '3to5m': return '3백만~5백만 엔 미만';
      case '3to6m': return '3백만~6백만 엔 미만';
      case '3to8m': return '3백만~8백만 엔 미만';
      case '4m': return '4백만 엔 이상';
      case '5m': return '5백만 엔 이상';
      case '6m': return '6백만 엔 이상';
      case '7m': return '7백만 엔 이상';
      case '8m': return '8백만 엔 이상';
      case '9m': return '9백만 엔 이상';
      case '10m': return '1천만 엔 이상';
      default: return key;
    }
  };

  const suggestions = buildSuggestions();
  const target = totalPoints >= 70 ? 80 : 70;
  const gap = Math.max(0, target - totalPoints);

  return (
    <Card ref={resultRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-primary">{t('result.title')}</CardTitle>
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            variant="outline"
            size="sm"
            className="gap-2 no-print"
          >
            <Download size={16} />
            {isGeneratingPDF ? t('result.downloading') : t('result.downloadPDF')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">{t('result.visaType')}</h3>
            <span className="text-sm font-medium">{getVisaTypeLabel(data.visaType)}</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{t('result.totalPoints')}</h3>
            <span className="text-2xl font-bold">{fmtPoints(totalPoints)}</span>
          </div>
          <Progress value={(totalPoints / 100) * 100} className="h-3" />
          <div className="flex justify-between text-xs mt-1">
            <span>{t('result.scale.min')}</span>
            <span className="text-primary font-medium">{t('result.scale.threshold')}</span>
            <span>{t('result.scale.max')}</span>
          </div>
        </div>

        {/* 300만엔 미만 연봉 경고 (Technical/Business 비자) */}
        {(data.visaType === 'technical' && data.annualSalary === 'under3m') || 
         (data.visaType === 'business' && data.annualSalary === 'under10m') ? (
          <Alert variant="destructive" className="mt-4">
            <Warning className="h-4 w-4" />
            <AlertTitle>비자 신청 불가</AlertTitle>
            <AlertDescription>
              {data.visaType === 'technical' 
                ? '고도 전문 기술 분야는 최소 연 소득 300만엔 이상이 필요합니다.' 
                : '고도 경영 관리 분야는 최소 연 소득 300만엔 이상이 필요합니다.'}
            </AlertDescription>
          </Alert>
        ) : null}

        <Alert variant={status.qualified ? "default" : "destructive"} className="mt-4">
          {status.qualified ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>{t('result.qualified.title')}</AlertTitle>
              <AlertDescription>
                {t('result.qualified.description')}
                {status.expeditedPR && ` ${t('result.qualified.expedited')}`}
              </AlertDescription>
            </>
          ) : (
            <>
              <Warning className="h-4 w-4" />
              <AlertTitle>{t('result.notQualified.title')}</AlertTitle>
              <AlertDescription>
                {t('result.notQualified.description')}
              </AlertDescription>
            </>
          )}
        </Alert>

        {/* Suggestions: hide when expeditedPR (80+) */}
        {status.expeditedPR ? (
          <div className="mt-2">
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-primary" />
                <h3 className="font-medium">{t('suggestions.title')}</h3>
              </div>
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">{t('suggestions.congrats')}</span>
              </div>
            </div>
          </div>
        ) : suggestions.length > 0 && (
          <div className="mt-2">
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-primary" />
                <h3 className="font-medium">{t('suggestions.title')}</h3>
              </div>
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">{t('suggestions.goal', { target, gap })}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((s, index) => (
                <div key={s.key} className="flex items-center justify-between rounded border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">#{index + 1}</span>
                      <span className="text-sm font-medium">{s.label}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 ml-3">+{fmtPoints(s.delta)}</Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t('suggestions.note')}</p>
          </div>
  )}

        <Separator className="my-4" />

        <div>
          <h3 className="font-medium mb-3">{t('result.categoriesTitle')}</h3>
          <div className="space-y-3">
            {Object.entries(categoryPoints).map(([category, points]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{getCategoryLabel(category)}</span>
                  <span className="font-medium">{fmtPoints(points)}</span>
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