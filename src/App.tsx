import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsResult } from "@/components/PointsResult";
import { InfoPanel } from "@/components/InfoPanel";
import { PointsData, VisaType } from "@/lib/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function App() {
  const [pointsData, setPointsData] = useState<PointsData>({
    visaType: 'technical',
    educationLevel: 'bachelors',
    workExperience: 'less3',
    age: '30to34',
    annualSalary: 'under3m',
    researchAchievements: [],
    licenses: [],
    jpNationalLicenses: 0,
    japaneseLanguage: 'none',
    japaneseEducation: false
  });

  useEffect(() => {
    // Map old work experience values to new ones if needed
    if (pointsData.workExperience === '10to15' || pointsData.workExperience === '15plus') {
      setPointsData({
        ...pointsData,
        workExperience: '10plus'
      });
    }
  }, []);

  const handleVisaTypeChange = (type: VisaType) => {
    setPointsData({
      ...pointsData,
      visaType: type
    });
  };

  const getVisaTypeLabel = (type: VisaType): string => {
    switch (type) {
      case 'technical':
        return '고도 전문 기술 활동';
      case 'research':
        return '학술 연구 활동';
      case 'business':
        return '경영 관리 활동';
      default:
        return '';
    }
  };

  const getVisaTypeEnglishName = (type: VisaType): string => {
    switch (type) {
      case 'technical':
        return 'Advanced Specialized/Technical Activities';
      case 'research':
        return 'Academic Research Activities';
      case 'business':
        return 'Business Management Activities';
      default:
        return '';
    }
  };
  
  const getVisaTypeJapaneseName = (type: VisaType): string => {
    switch (type) {
      case 'technical':
        return '高度専門職 1号 イ';
      case 'research':
        return '高度専門職 1号 ア';
      case 'business':
        return '高度専門職 1号 ウ';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calculator">포인트 계산기</TabsTrigger>
            <TabsTrigger value="info">제도 안내</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-3">비자 유형 선택</h3>
                  <RadioGroup
                    value={pointsData.visaType}
                    onValueChange={(value) => handleVisaTypeChange(value as VisaType)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="technical" id="visa-technical" />
                      <Label htmlFor="visa-technical" className="flex flex-col">
                        <span className="font-medium">고도 전문 기술 활동</span>
                        <span className="text-xs text-muted-foreground">高度専門職 1号 イ</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="research" id="visa-research" />
                      <Label htmlFor="visa-research" className="flex flex-col">
                        <span className="font-medium">고도 학술 연구 활동</span>
                        <span className="text-xs text-muted-foreground">高度専門職 1号 ア</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="visa-business" />
                      <Label htmlFor="visa-business" className="flex flex-col">
                        <span className="font-medium">고도 경영 · 관리 활동</span>
                        <span className="text-xs text-muted-foreground">高度専門職 1号 ウ</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <PointsForm data={pointsData} setData={setPointsData} />
              </div>
              <div className="md:col-span-1">
                <PointsResult data={pointsData} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <InfoPanel currentVisaType={pointsData.visaType} />
          </TabsContent>
        </Tabs>
        
        <Separator className="my-8" />
        
        <footer className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 일본 고도인재 비자 포인트 계산기 ({getVisaTypeLabel(pointsData.visaType)})</p>
          <p className="mt-1">
            高度人材ポイント制度 / Points-based Preferential Immigration Treatment for Highly Skilled Foreign Professionals
          </p>
          <p className="mt-1 text-xs">
            {getVisaTypeJapaneseName(pointsData.visaType)} / {getVisaTypeEnglishName(pointsData.visaType)}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;