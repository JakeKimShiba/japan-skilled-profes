import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateTotalPoints, getQualificationStatus } from "@/lib/calculator";
import { PointsData } from "@/lib/models";
import { useI18n } from "@/i18n";
import { 
  EducationStep, 
  ExperienceStep, 
  AgeIncomeStep,
  FormNavigation 
} from "@/components/form";

interface PointsFormProps {
  data: PointsData;
  setData: (data: PointsData) => void;
}

export function PointsForm({ data, setData }: PointsFormProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  const handleChange = (field: keyof PointsData, value: string | boolean | string[] | number) => {
    const newData = {
      ...data,
      [field]: value,
    };
    
    // Reset Japanese education bonus if JLPT N2 is selected (not eligible)
    if (field === 'japaneseLanguage' && value === 'n2') {
      newData.japaneseEducation = false;
    }
    
    setData(newData);
  };

  const steps = [
    { id: 'education', key: 'form.education', shortKey: 'form.education.short' },
    { id: 'experience', key: 'form.experience', shortKey: 'form.experience.short' },
    { id: 'ageIncome', key: 'form.ageIncome', shortKey: 'form.ageIncome.short' },
    { id: 'researchLicense', key: 'form.researchLicense', shortKey: 'form.researchLicense.short' },
    { id: 'languageSpecial', key: 'form.languageSpecial', shortKey: 'form.languageSpecial.short' }
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goTo = (index: number) => setCurrentStep(index);
  const goReset = () => goTo(0);

  // Mobile summary values
  const totalPoints = calculateTotalPoints(data);
  const target = totalPoints >= 70 ? 80 : 70;
  const gap = Math.max(0, target - totalPoints);
  const qualified = totalPoints >= 70;

  // Basic validation for navigation
  const canGoNext = (() => {
    switch (currentStep) {
      case 0: // Education
        return !!data.educationLevel;
      case 1: // Experience  
        return !!data.workExperience;
      case 2: // Age & Income
        return !!data.age && !!data.annualSalary;
      default:
        return true;
    }
  })();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EducationStep data={data} onDataChange={handleChange} />;
      case 1:
        return <ExperienceStep data={data} onDataChange={handleChange} />;
      case 2:
        return <AgeIncomeStep data={data} onDataChange={handleChange} />;
      case 3:
        // TODO: Research & License Step
        return <div>Research & License Step - Coming Soon</div>;
      case 4:
        // TODO: Language & Special Step  
        return <div>Language & Special Step - Coming Soon</div>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center mb-3 min-w-0">
          <CardTitle className="text-xl text-primary max-w-[60%]">
            {t('form.title')}
          </CardTitle>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:inline">
              {t(steps[currentStep].key)}
            </span>
            <span className="text-muted-foreground sm:hidden">
              {t(steps[currentStep].shortKey)}
            </span>
          </div>
        </div>
        
        <FormNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrev={goPrev}
          onNext={goNext}
          onReset={goReset}
          canGoNext={canGoNext}
          steps={steps}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStep()}
      </CardContent>

      {/* Mobile sticky summary bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-primary">
              {fmtPoints(totalPoints)}
            </span>
            <span className="text-xs text-muted-foreground">
              {qualified 
                ? t('result.qualified') 
                : t('result.needMore', { gap })
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {qualified ? (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                <span className="text-xs font-medium">{t('result.qualified')}</span>
              </Badge>
            ) : (
              <Badge variant="secondary">
                <span className="text-xs">{t('result.target', { target })}</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}