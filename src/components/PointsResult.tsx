import { useEffect, useState, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Warning, Trophy, Download, Lightbulb, CaretDown, ShareNetwork } from "@phosphor-icons/react";
import { calculateTotalPoints, getCategoryPoints, getQualificationStatus } from "@/lib/calculator";
import { PointsData, VisaType } from "@/lib/models";
import { useReactToPrint } from 'react-to-print';
import { trackEvent } from '@/lib/analytics';
import { useI18n } from "@/i18n";
import { VisaCalculatorService, SuggestionService } from "@/services";
import { buildShareUrl } from "@/lib/urlShare";
import { CategoryDetailsAccordion } from "@/components/CategoryDetailsAccordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PointsResultProps {
  data: PointsData;
}

export function PointsResult({ data }: PointsResultProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });
  const prevTotalRef = useRef<number>(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);
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
        /* Expand all collapsible suggestions in print */
        [data-state="closed"] > [data-radix-collapsible-content] {
          display: block !important;
          height: auto !important;
        }
      }
    `
  });

  // Use direct calculation functions for immediate response
  const totalPoints = useMemo(() => calculateTotalPoints(data), [data]);
  const categoryPoints = useMemo(() => getCategoryPoints(data), [data]);
  const status = useMemo(() => {
    const qualified = totalPoints >= 70;
    const expeditedPR = totalPoints >= 80;
    const benefits = [];
    if (qualified) benefits.push(t('result.qualifiedBenefit') || '고도인재포인트제 해당');
    if (expeditedPR) benefits.push(t('result.expeditedBenefit') || '영주권 신청 단축');
    return { qualified, expeditedPR, benefits };
  }, [totalPoints, t]);

  // Track milestone thresholds once when crossing 70/80
  useEffect(() => {
    const prev = prevTotalRef.current;
    if (prev < 80 && totalPoints >= 80) {
      trackEvent('milestone_80_points', { total: totalPoints });
    } else if (prev < 70 && totalPoints >= 70) {
      trackEvent('milestone_70_points', { total: totalPoints });
    }
    prevTotalRef.current = totalPoints;
  }, [totalPoints, data]);



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

  const handleShare = async () => {
    const url = buildShareUrl(data);
    try {
      await navigator.clipboard.writeText(url);
      trackEvent('share_url_copied', { total_points: totalPoints, visa_type: data.visaType });
      setShareTooltip(t('result.shareCopied') || 'URL copied!');
    } catch {
      // Fallback for browsers that don't support clipboard API
      setShareTooltip(t('result.shareError') || 'Copy failed');
    }
    setTimeout(() => setShareTooltip(null), 2000);
  };

  // Suggestion helpers
  const simulate = (patch: Partial<PointsData>) => {
    const updatedData = { ...data, ...patch };
    return VisaCalculatorService.calculatePoints(updatedData).totalPoints;
  };







  // Get suggestions from service
  const suggestions = useMemo(() => {
    try {
      const target = totalPoints >= 70 ? 80 : 70;
      return SuggestionService.generateSuggestions(data, target);
    } catch (error) {
      console.error("Suggestion generation error:", error);
      return [];
    }
  }, [data, totalPoints]);
  const target = totalPoints >= 70 ? 80 : 70;
  const gap = Math.max(0, target - totalPoints);

  return (
    <Card ref={resultRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-primary">{t('result.title')}</CardTitle>
          <div className="flex gap-2 no-print">
            <div className="relative">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ShareNetwork size={16} />
                {t('result.shareResult') || 'Share'}
              </Button>
              {shareTooltip && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background shadow">
                  {shareTooltip}
                </div>
              )}
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download size={16} />
              {isGeneratingPDF ? t('result.downloading') : t('result.downloadPDF')}
            </Button>
          </div>
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
            
            <Collapsible open={showAllSuggestions} onOpenChange={setShowAllSuggestions}>
              <div className="grid grid-cols-1 gap-2">
                {/* Show first suggestion */}
                {suggestions[0] && (
                  <div className="flex items-center justify-between rounded border p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t(suggestions[0].label)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 ml-3">+{fmtPoints(suggestions[0].pointsDelta)}</Badge>
                  </div>
                )}
                
                {/* Collapsible remaining suggestions */}
                <CollapsibleContent className="space-y-2">
                  {suggestions.slice(1).map((s) => (
                    <div key={s.key} className="flex items-center justify-between rounded border p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{t(s.label)}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 ml-3">+{fmtPoints(s.pointsDelta)}</Badge>
                    </div>
                  ))}
                </CollapsibleContent>
              </div>
              
              {/* Show more button - hide in print */}
              {suggestions.length > 1 && (
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 no-print hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    <span className="text-xs">
                      {showAllSuggestions ? t('suggestions.showLess') : t('suggestions.showMore', { count: suggestions.length - 1 })}
                    </span>
                    <CaretDown 
                      size={14} 
                      className={`ml-1 transition-transform ${showAllSuggestions ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
              )}
            </Collapsible>
            
            <p className="text-xs text-muted-foreground mt-2">{t('suggestions.note')}</p>
          </div>
  )}

        <Separator className="my-4" />

        <CategoryDetailsAccordion data={data} categoryPoints={categoryPoints} />
      </CardContent>
    </Card>
  );
}