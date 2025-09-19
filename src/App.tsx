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
import { useI18n } from '@/i18n';

function App() {
  const { t } = useI18n();

  const [pointsData, setPointsData] = useState<PointsData>({
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
    japaneseLanguage: 'none',
    japaneseEducation: false,
    university: '',
    universityEligible: false
  });

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
    // Only technical type is available now
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
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-3">{t('result.visaType')}</h3>
                  <div className="flex items-center space-x-2">
                    <Label className="flex flex-col">
                      <span>{t('visa.type')}</span>
                      <span className="text-xs text-muted-foreground">{t('visa.jpName')}</span>
                    </Label>
                  </div>
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
          <p>© {new Date().getFullYear()} {t('app.title')} ({t('visa.type')})</p>
          <p className="mt-1">
            高度人材ポイント制度 / Points-based Preferential Immigration Treatment for Highly Skilled Foreign Professionals
          </p>
          <p className="mt-1 text-xs">
            {t('visa.jpName')} / {t('visa.enName')}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
