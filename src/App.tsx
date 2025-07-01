import { useState } from "react";
import { Header } from "@/components/Header";
import { PointsForm } from "@/components/PointsForm";
import { PointsResult } from "@/components/PointsResult";
import { InfoPanel } from "@/components/InfoPanel";
import { PointsData } from "@/lib/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

function App() {
  const [pointsData, setPointsData] = useState<PointsData>({
    educationLevel: 'bachelors',
    workExperience: 'less3',
    age: '30to34',
    annualSalary: '5to7m',
    researchAchievements: [],
    licenses: [],
    japaneseLanguage: 'none',
    foreignLanguage: 'none',
    japaneseEducation: false,
    innovativeProject: false
  });

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
            <InfoPanel />
          </TabsContent>
        </Tabs>
        
        <Separator className="my-8" />
        
        <footer className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 일본 고도인재 비자 포인트 계산기</p>
          <p className="mt-1">
            高度人材ポイント制度 / Points-based Preferential Immigration Treatment for Highly Skilled Foreign Professionals
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;