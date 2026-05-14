import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsResult } from "@/components/PointsResult";
import { InfoPanel } from "@/components/InfoPanel";
import { decodePointsData } from "@/lib/urlShare";
import { FAQ } from "@/components/FAQ";
import { PointsData, VisaType } from "@/lib/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useI18n } from '@/i18n';
import { trackVisaTypeSelected, trackCalculationCompleted } from '@/lib/analytics';
import { VisaCalculatorService } from '@/services';
import { GraduationCap, Gear, Briefcase, Check, ArrowsClockwise } from "@phosphor-icons/react";
import { GuideLayout } from "@/pages/GuideLayout";
import { GuideIndex } from "@/pages/GuideIndex";
import { GuidePage } from "@/pages/GuidePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
      <Route path="/guide" element={<GuideLayout />}>
        <Route index element={<GuideIndex />} />
        <Route path=":slug" element={<GuidePage />} />
      </Route>
    </Routes>
  );
}

function CalculatorPage() {
  const { t } = useI18n();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [showAllVisaTypes, setShowAllVisaTypes] = useState(true);
  
  // 초기 데이터 상태 정의 (비자 유형 선택 전 상태)
  const initialPointsData: PointsData = {
    visaType: null,
    educationLevel: '',
    workExperience: '',
    age: '',
    annualSalary: '',
    researchAchievements: [],
    licenses: [],
    jpNationalLicenses: 0,
    innovationBonus: false,
    researchCostBonus: false,
    academicResearchBonus: false,
    businessExecutiveBonus: 'none',
    japaneseLanguage: 'none',
    japaneseEducation: false,
    university: '',
    universityEligible: false,
    contractResearchBonus: false,
    innovativeFieldBonus: false
  };
  
  const [pointsData, setPointsData] = useState<PointsData>(initialPointsData);

  // Restore state from shared URL parameters
  useEffect(() => {
    const shared = decodePointsData(window.location.search);
    if (shared) {
      setPointsData(shared);
      setShowAllVisaTypes(false);
      // Clean up URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Map old work experience values to new ones if needed
    if (pointsData.workExperience === '10to15' || pointsData.workExperience === '15plus') {
      setPointsData({
        ...pointsData,
        workExperience: '10plus'
      });
    }
    
    // Map old annual salary values to new ones
    if (['3to4m', '4to5m', '5to7m', '7to8m', '8to10m', '10to15m', '15to20m', '20mplus'].includes(pointsData.annualSalary)) {
      // Set to under3m by default (will be invalid, but safest default)
      setPointsData({
        ...pointsData,
        annualSalary: 'under3m'
      });
    }
  }, []);

  const handleVisaTypeChange = (type: VisaType) => {
    setPointsData({
      ...pointsData,
      visaType: type
    });
    // Track visa type selection
    trackVisaTypeSelected(type);
    // 실제 비자 타입이 선택된 경우에만 축소 모드로 전환
    setShowAllVisaTypes(false);
  };

  const handleViewResults = () => {
    // Track calculation completion with detailed data
    const calculationResult = VisaCalculatorService.calculatePoints(pointsData);
    
    trackCalculationCompleted({
      total_points: calculationResult.totalPoints,
      qualified: calculationResult.isQualified,
      expedited: calculationResult.totalPoints >= 80,
      visa_type: pointsData.visaType as 'technical' | 'academic' | 'business',
      education_level: pointsData.educationLevel,
      work_experience: pointsData.workExperience,
      age_category: pointsData.age,
      salary_range: pointsData.annualSalary,
      has_university_bonus: pointsData.universityEligible,
      language_ability: pointsData.japaneseLanguage
    });
    
    // 모바일에서 결과 섹션으로 스크롤
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Labels are localized via i18n keys

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="calculator">{t('tabs.calculator')}</TabsTrigger>
            <TabsTrigger value="info">{t('tabs.info')}</TabsTrigger>
            <TabsTrigger value="faq">{t('tabs.faq')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-primary">
                      {t('result.visaType')}
                    </h3>
                  </div>
                  {showAllVisaTypes ? (
                    <div className="transition-all duration-500 ease-in-out">
                      <RadioGroup
                        value={pointsData.visaType || ''}
                        onValueChange={handleVisaTypeChange}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                    {/* Academic Visa Card */}
                    <div 
                      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                        pointsData.visaType === 'academic' 
                          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                          : 'border-muted hover:border-primary/40 hover:bg-primary/5'
                      }`}
                      onClick={() => handleVisaTypeChange('academic')}
                    >
                      <RadioGroupItem value="academic" id="visa-academic" className="sr-only" />
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          pointsData.visaType === 'academic' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <GraduationCap size={24} weight="duotone" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{t('visa.academic.type')}</div>
                          <div className="text-sm text-primary font-medium">{t('visa.academic.jpName')}</div>
                          <div className="text-xs text-muted-foreground mt-1">{t('visa.academic.description')}</div>
                        </div>
                        {pointsData.visaType === 'academic' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check size={14} weight="bold" className="text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technical Visa Card */}
                    <div 
                      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                        pointsData.visaType === 'technical' 
                          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                          : 'border-muted hover:border-primary/40 hover:bg-primary/5'
                      }`}
                      onClick={() => handleVisaTypeChange('technical')}
                    >
                      <RadioGroupItem value="technical" id="visa-technical" className="sr-only" />
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          pointsData.visaType === 'technical' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <Gear size={24} weight="duotone" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{t('visa.technical.type')}</div>
                          <div className="text-sm text-primary font-medium">{t('visa.technical.jpName')}</div>
                          <div className="text-xs text-muted-foreground mt-1">{t('visa.technical.description')}</div>
                        </div>
                        {pointsData.visaType === 'technical' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check size={14} weight="bold" className="text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Business Visa Card */}
                    <div 
                      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                        pointsData.visaType === 'business' 
                          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                          : 'border-muted hover:border-primary/40 hover:bg-primary/5'
                      }`}
                      onClick={() => handleVisaTypeChange('business')}
                    >
                      <RadioGroupItem value="business" id="visa-business" className="sr-only" />
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          pointsData.visaType === 'business' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <Briefcase size={24} weight="duotone" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{t('visa.business.type')}</div>
                          <div className="text-sm text-primary font-medium">{t('visa.business.jpName')}</div>
                          <div className="text-xs text-muted-foreground mt-1">{t('visa.business.description')}</div>
                        </div>
                        {pointsData.visaType === 'business' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check size={14} weight="bold" className="text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="space-y-4 transition-all duration-500 ease-in-out">
                      {/* Selected Visa Card - Expanded */}
                      {/* Mobile: Simple selected visa card */}
                      <div className="md:hidden flex justify-center px-4">
                        {(() => {
                          const visaType = pointsData.visaType;
                          const iconMap = {
                            academic: <GraduationCap size={24} weight="duotone" />,
                            technical: <Gear size={24} weight="duotone" />,
                            business: <Briefcase size={24} weight="duotone" />,
                          };
                          
                          return (
                            <div className="bg-card rounded-xl border-2 border-primary ring-2 ring-primary/20 p-6 w-full max-w-sm shadow-lg relative">
                              <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                  {iconMap[visaType]}
                                </div>
                                <div>
                                  <div className="font-bold text-lg text-foreground">
                                    {t(`visa.${visaType}.type`)}
                                  </div>
                                  <div className="text-sm font-medium text-primary mt-1">
                                    {t(`visa.${visaType}.jpName`)}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {t(`visa.${visaType}.description`)}
                                  </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md">
                                  <Check size={16} weight="bold" className="text-primary-foreground" />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      
                      {/* Desktop: Carousel-style visa type display */}
                      <div className="hidden md:block">
                        <div className="flex items-center justify-center gap-6 px-8">
                          {(['academic', 'technical', 'business'] as const).map((visaType) => {
                            const isSelected = visaType === pointsData.visaType;
                            const iconMap = {
                              academic: <GraduationCap size={isSelected ? 28 : 24} weight="duotone" />,
                              technical: <Gear size={isSelected ? 28 : 24} weight="duotone" />,
                              business: <Briefcase size={isSelected ? 28 : 24} weight="duotone" />,
                            };
                            
                            return (
                              <div 
                                key={visaType} 
                                className={`bg-card rounded-xl border-2 transition-all duration-300 ${
                                  isSelected 
                                    ? 'border-primary ring-2 ring-primary/20 p-8 w-80 opacity-100 scale-100 z-10 shadow-lg' 
                                    : 'border-muted p-6 w-64 opacity-40 scale-90 blur-[1.5px] hover:opacity-60 hover:scale-95 hover:blur-[0.5px] cursor-pointer shadow-sm'
                                }`}
                                onClick={() => {
                                  if (!isSelected) {
                                    setPointsData({ ...initialPointsData, visaType });
                                  }
                                }}
                              >
                                <div className="relative">
                                  <div className="flex flex-col items-center text-center space-y-4">
                                    <div className={`rounded-full flex items-center justify-center transition-colors ${
                                      isSelected 
                                        ? 'w-16 h-16 bg-primary text-primary-foreground' 
                                        : 'w-12 h-12 bg-primary/10 text-primary'
                                    }`}>
                                      {iconMap[visaType]}
                                    </div>
                                    <div>
                                      <div className={`font-bold text-foreground ${isSelected ? 'text-xl' : 'text-base'}`}>
                                        {t(`visa.${visaType}.type`)}
                                      </div>
                                      {isSelected && (
                                        <>
                                          <div className="text-base font-medium text-primary mt-1">
                                            {t(`visa.${visaType}.jpName`)}
                                          </div>
                                          <div className="text-sm text-muted-foreground mt-2">
                                            {t(`visa.${visaType}.description`)}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                                        <Check size={16} weight="bold" className="text-primary-foreground" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Change Visa Type Button - Mobile only */}
                      <div className="md:hidden flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAllVisaTypes(true);
                            setPointsData(initialPointsData);
                          }}
                          className="px-6 py-2 text-sm font-medium border-2 border-muted hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-sm transition-all duration-200 hover:scale-[1.02] gap-2"
                        >
                          <ArrowsClockwise size={16} />
                          {t('visa.select.other')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {pointsData.visaType !== null && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <PointsForm 
                    data={pointsData} 
                    setData={setPointsData} 
                    onViewResults={handleViewResults}
                  />
                </div>
                <div 
                  ref={resultsRef}
                  className="md:col-span-1 md:sticky md:top-4 h-fit md:max-h-[calc(100vh-2rem)] md:overflow-auto"
                >
                  <PointsResult data={pointsData} />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="info">
            <InfoPanel />
          </TabsContent>
          
          <TabsContent value="faq">
            <FAQ />
          </TabsContent>
        </Tabs>
        
        <Separator className="my-8" />
        
        <footer className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t('app.title')}</p>
          <p className="mt-1">
            高度人材ポイント制度 / Points-based Preferential Immigration Treatment for Highly Skilled Foreign Professionals
          </p>
          <p className="mt-1 text-xs">
            {pointsData.visaType === 'academic' && `${t('visa.academic.jpName')} / ${t('visa.academic.enName')}`}
            {pointsData.visaType === 'technical' && `${t('visa.technical.jpName')} / ${t('visa.technical.enName')}`}
            {pointsData.visaType === 'business' && `${t('visa.business.jpName')} / ${t('visa.business.enName')}`}
          </p>
          
          {/* Disclaimer */}
          <div className="mt-4 pt-4 border-t border-muted">
            <p className="text-xs text-muted-foreground/70">
              {t('info.disclaimer')}{' '}
              <a 
                href="https://www.moj.go.jp/isa/applications/resources/newimmiact_3_system_index.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                {t('info.disclaimer.link')}
              </a>
            </p>
          </div>
          
          {/* Business Partnership & Feedback Contact */}
          <div className="mt-4 pt-4 border-t border-muted">
            <p className="text-xs text-muted-foreground/80">
              {t('footer.contact')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
              <a 
                href="mailto:kodocalc@gmail.com" 
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-10 5L2 7"/>
                </svg>
                kodocalc@gmail.com
              </a>
              <span className="hidden sm:inline text-muted-foreground/50">|</span>
              <a 
                href="https://forms.gle/KiG8NP3u5eA7UvLEA" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                {t('footer.feedback')}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
