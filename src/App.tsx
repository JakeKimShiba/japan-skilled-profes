import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsResult } from "@/components/PointsResult";
import { InfoPanel } from "@/components/InfoPanel";
import { PointsData, VisaType } from "@/lib/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useI18n } from '@/i18n';

function App() {
  const { t } = useI18n();

  const [showAllVisaTypes, setShowAllVisaTypes] = useState(true);
  
  // 초기 데이터 상태 정의
  const initialPointsData: PointsData = {
    visaType: 'technical',
    educationLevel: 'bachelors',
    workExperience: 'less3',
    age: '40plus',
    annualSalary: 'under3m',
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
    academicUniversityBonus: 'none',
    businessInvestmentBonus: 'none',
    contractResearchBonus: false,
    innovativeFieldBonus: false
  };
  
  const [pointsData, setPointsData] = useState<PointsData>(initialPointsData);

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
    setShowAllVisaTypes(false);
  };

  // Labels are localized via i18n keys

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calculator">{t('tabs.calculator')}</TabsTrigger>
            <TabsTrigger value="info">{t('tabs.info')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {t('result.visaType')}
                    </h3>
                  </div>
                  {showAllVisaTypes ? (
                    <div className="transition-all duration-500 ease-in-out">
                      <RadioGroup
                        value={pointsData.visaType}
                        onValueChange={handleVisaTypeChange}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                    {/* Academic Visa Card */}
                    <div 
                      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        pointsData.visaType === 'academic' 
                          ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                      onClick={() => handleVisaTypeChange('academic')}
                    >
                      <RadioGroupItem value="academic" id="visa-academic" className="sr-only" />
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          pointsData.visaType === 'academic' ? 'bg-blue-500' : 'bg-blue-100'
                        }`}>
                          <span className={`text-xl ${
                            pointsData.visaType === 'academic' ? 'text-white' : 'text-blue-600'
                          }`}>🎓</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{t('visa.academic.type')}</div>
                          <div className="text-sm text-blue-600 font-medium">{t('visa.academic.jpName')}</div>
                          <div className="text-xs text-gray-500 mt-1">대학·연구기관의 연구자, 교수</div>
                        </div>
                        {pointsData.visaType === 'academic' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technical Visa Card */}
                    <div 
                      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        pointsData.visaType === 'technical' 
                          ? 'border-green-500 bg-green-50/50 shadow-md ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50/30'
                      }`}
                      onClick={() => handleVisaTypeChange('technical')}
                    >
                      <RadioGroupItem value="technical" id="visa-technical" className="sr-only" />
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          pointsData.visaType === 'technical' ? 'bg-green-500' : 'bg-green-100'
                        }`}>
                          <span className={`text-xl ${
                            pointsData.visaType === 'technical' ? 'text-white' : 'text-green-600'
                          }`}>⚙️</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{t('visa.technical.type')}</div>
                          <div className="text-sm text-green-600 font-medium">{t('visa.technical.jpName')}</div>
                          <div className="text-xs text-gray-500 mt-1">기술·전문직 (IT, 금융, 법무 등)</div>
                        </div>
                        {pointsData.visaType === 'technical' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Business Visa Card */}
                    <div 
                      className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        pointsData.visaType === 'business' 
                          ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-200' 
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                      }`}
                      onClick={() => handleVisaTypeChange('business')}
                    >
                      <RadioGroupItem value="business" id="visa-business" className="sr-only" />
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          pointsData.visaType === 'business' ? 'bg-purple-500' : 'bg-purple-100'
                        }`}>
                          <span className={`text-xl ${
                            pointsData.visaType === 'business' ? 'text-white' : 'text-purple-600'
                          }`}>💼</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{t('visa.business.type')}</div>
                          <div className="text-sm text-purple-600 font-medium">{t('visa.business.jpName')}</div>
                          <div className="text-xs text-gray-500 mt-1">경영진, 임원, 관리자</div>
                        </div>
                        {pointsData.visaType === 'business' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="space-y-4 transition-all duration-500 ease-in-out">
                      {/* Selected Visa Card - Expanded */}
                      <div className="flex justify-center">
                        <div className={`relative p-8 border-2 rounded-xl shadow-lg transition-all duration-300 ${
                          pointsData.visaType === 'academic' 
                            ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-200' 
                            : pointsData.visaType === 'technical'
                            ? 'border-green-500 bg-green-50/50 ring-2 ring-green-200'
                            : 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-200'
                        }`}>
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              pointsData.visaType === 'academic' ? 'bg-blue-500' 
                              : pointsData.visaType === 'technical' ? 'bg-green-500'
                              : 'bg-purple-500'
                            }`}>
                              <span className="text-white text-2xl">
                                {pointsData.visaType === 'academic' ? '🎓' 
                                 : pointsData.visaType === 'technical' ? '⚙️'
                                 : '💼'}
                              </span>
                            </div>
                            <div>
                              <div className="font-bold text-xl text-gray-900">
                                {pointsData.visaType === 'academic' ? t('visa.academic.type')
                                 : pointsData.visaType === 'technical' ? t('visa.technical.type')
                                 : t('visa.business.type')}
                              </div>
                              <div className={`text-base font-medium ${
                                pointsData.visaType === 'academic' ? 'text-blue-600' 
                                : pointsData.visaType === 'technical' ? 'text-green-600'
                                : 'text-purple-600'
                              }`}>
                                {pointsData.visaType === 'academic' ? t('visa.academic.jpName')
                                 : pointsData.visaType === 'technical' ? t('visa.technical.jpName')
                                 : t('visa.business.jpName')}
                              </div>
                              <div className="text-sm text-gray-500 mt-2">
                                {pointsData.visaType === 'academic' ? '대학·연구기관의 연구자, 교수'
                                 : pointsData.visaType === 'technical' ? '기술·전문직 (IT, 금융, 법무 등)'
                                 : '경영진, 임원, 관리자'}
                              </div>
                            </div>
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-current">
                              <span className="text-sm">✓</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Change Visa Type Button */}
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAllVisaTypes(true);
                            setPointsData(initialPointsData);
                          }}
                          className="px-6 py-2 text-sm font-medium border-gray-300 hover:bg-gray-50"
                        >
                          <span className="mr-2">🔄</span>
                          다른 비자 유형 선택
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <PointsForm data={pointsData} setData={setPointsData} />
              </div>
              <div className="md:col-span-1 md:sticky md:top-4 h-fit md:max-h-[calc(100vh-2rem)] md:overflow-auto">
                <PointsResult data={pointsData} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <InfoPanel />
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
          
          {/* Business Partnership & Feedback Contact */}
          <div className="mt-4 pt-4 border-t border-muted">
            <p className="text-xs text-muted-foreground/80">
              사업제휴, 피드백 및 문의 | Business Partnership & Feedback
            </p>
            <a 
              href="mailto:kodocalc@gmail.com" 
              className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-10 5L2 7"/>
              </svg>
              kodocalc@gmail.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
