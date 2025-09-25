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
          label: t('suggestions.jlpt.n2.achieve'), 
          delta: n2 - currentTotal, 
          difficulty: 2, 
          timeframe: t('timeframe.3to6months'),
          priority: getVisaPriority('jlpt-n2')
        });
      }
      // Always suggest N1/BJT since they don't conflict with Japanese education
      const n1 = simulate({ japaneseLanguage: 'n1' });
      suggestions.push({ 
        key: 'jlpt-n1-or-bjt', 
        label: t('suggestions.jlpt.n1.orBjt'), 
        delta: n1 - currentTotal, 
        difficulty: 3, 
        timeframe: t('timeframe.6to12months'),
        priority: getVisaPriority('jlpt-n1-or-bjt')
      });
    } else if (data.japaneseLanguage === 'n2') {
      // Combine N1 and BJT since they both give 15 points
      const n1 = simulate({ japaneseLanguage: 'n1' });
      suggestions.push({ 
        key: 'jlpt-n1-or-bjt', 
        label: t('suggestions.jlpt.n1.orBjt'), 
        delta: n1 - currentTotal, 
        difficulty: 3, 
        timeframe: t('timeframe.6to12months'),
        priority: getVisaPriority('jlpt-n1-or-bjt')
      });
    }

    // Licenses
    if (!data.licenses.includes('other')) {
      const lic = simulate({ licenses: [...data.licenses, 'other'] });
      suggestions.push({ 
        key: 'license-other', 
        label: t('suggestions.license.foreign'), 
        delta: lic - currentTotal, 
        difficulty: 2, 
        timeframe: t('timeframe.3to6months'),
        priority: getVisaPriority('license-other')
      });
    }
    if ((data.jpNationalLicenses ?? 0) < 2) {
      const nextCount = Math.min(2, (data.jpNationalLicenses ?? 0) + 1);
      const lic = simulate({ jpNationalLicenses: nextCount });
      suggestions.push({ 
        key: 'license-jp', 
        label: t('suggestions.license.japan'), 
        delta: lic - currentTotal, 
        difficulty: 2, 
        timeframe: t('timeframe.6to12months'),
        priority: getVisaPriority('license-jp')
      });
    }

    // Research achievements
    if ((data.researchAchievements?.length ?? 0) === 0) {
      const r = simulate({ researchAchievements: ['patents'] });
      suggestions.push({ 
        key: 'research', 
        label: t('suggestions.research.achieve'), 
        delta: r - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.1to3years'),
        priority: getVisaPriority('research')
      });
    }

    // Education (long-term)
    if (data.educationLevel === 'bachelors') {
      const m = simulate({ educationLevel: 'masters' });
      suggestions.push({ 
        key: 'edu-m', 
        label: t('suggestions.education.masters'), 
        delta: m - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.2to3years'),
        priority: getVisaPriority('edu-m')
      });
    } else if (data.educationLevel === 'masters') {
      const d = simulate({ educationLevel: 'doctorate' });
      suggestions.push({ 
        key: 'edu-d', 
        label: t('suggestions.education.doctorate'), 
        delta: d - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.3to5years'),
        priority: getVisaPriority('edu-d')
      });
    } else if (data.educationLevel === 'none') {
      const b = simulate({ educationLevel: 'bachelors' });
      suggestions.push({ 
        key: 'edu-b', 
        label: t('suggestions.education.bachelors'), 
        delta: b - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.4years'),
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
        label: t('suggestions.career.next'), 
        delta: w - currentTotal, 
        difficulty: 3, 
        timeframe: t('timeframe.1to3years'),
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
            timeframe: t('timeframe.6to24months'),
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
        label: t('suggestions.employer.innovation'), 
        delta: inv - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.6monthsTo2years'),
        priority: getVisaPriority('bonus-innovation')
      });
    }
    if (!data.researchCostBonus) {
      const rdb = simulate({ researchCostBonus: true });
      suggestions.push({ 
        key: 'bonus-rd', 
        label: t('suggestions.employer.rd'), 
        delta: rdb - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.6monthsTo2years'),
        priority: getVisaPriority('bonus-rd')
      });
    }

    // Japanese education (not available for JLPT N2 users due to restriction)
    if (!data.japaneseEducation && data.japaneseLanguage !== 'n2') {
      const je = simulate({ japaneseEducation: true });
      suggestions.push({ 
        key: 'edu-jp', 
        label: t('suggestions.education.japanese'), 
        delta: je - currentTotal, 
        difficulty: 4, 
        timeframe: t('timeframe.2to3years'),
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
      case 'under3m': return t('salary.goal.under3m');
      case '3to4m': return t('salary.goal.3to4m');
      case '4to5m': return t('salary.goal.4to5m');
      case '5to6m': return t('salary.goal.5to6m');
      case '6to8m': return t('salary.goal.6to8m');
      case '8to10m': return t('salary.goal.8to10m');
      case '10m': return t('salary.goal.10m');
      case '10to15m': return t('salary.goal.10to15m');
      case '15to20m': return t('salary.goal.15to20m');
      case '20to25m': return t('salary.goal.20to25m');
      case '25to30m': return t('salary.goal.25to30m');
      case '30m': return t('salary.goal.30m');
      default: return `${t('salary.goal.default', { key })}`;
    }
  };

  const labelForIncome = (key: string) => {
    switch(key) {
      case 'under3m': return t('salary.level.under3m');
      case '3to5m': return t('salary.level.3to5m');
      case '3to6m': return t('salary.level.3to6m');
      case '3to8m': return t('salary.level.3to8m');
      case '4m': return t('salary.level.4m');
      case '5m': return t('salary.level.5m');
      case '6m': return t('salary.level.6m');
      case '7m': return t('salary.level.7m');
      case '8m': return t('salary.level.8m');
      case '9m': return t('salary.level.9m');
      case '10m': return t('salary.level.10m');
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
            <AlertTitle>{t('warning.visa.ineligible')}</AlertTitle>
            <AlertDescription>
              {data.visaType === 'technical' 
                ? t('warning.technical.minimum') 
                : t('warning.business.minimum')}
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