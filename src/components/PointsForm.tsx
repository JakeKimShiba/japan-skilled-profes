import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PointsData } from "@/lib/models";
import { VisaCalculatorService, ValidationService } from "@/services";
import { useI18n } from "@/i18n";
import { trackFieldChanged } from "@/lib/analytics";
import { 
  EducationStep, 
  ExperienceStep, 
  AgeIncomeStep,
  ResearchLicenseStep,
  LanguageSpecialStep,
  FormNavigation,
  ProgressBar
} from "@/components/form";

interface PointsFormProps {
  data: PointsData;
  setData: (data: PointsData) => void;
  onViewResults?: () => void;
}

export function PointsForm({ data, setData, onViewResults }: PointsFormProps) {
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
    
    // Track field changes on step 5 (language and special bonuses)
    if (currentStep === 4) {
      trackFieldChanged({
        field_name: field,
        field_value: value,
        step_number: 5,
        visa_type: data.visaType
      });
    }
    
    setData(newData);
  };

  const handleBatchChange = (updates: Partial<PointsData>) => {
    const newData = {
      ...data,
      ...updates,
    };
    
    // Track field changes on step 5 (language and special bonuses)
    if (currentStep === 4) {
      Object.entries(updates).forEach(([key, value]) => {
        trackFieldChanged({
          field_name: key,
          field_value: value,
          step_number: 5,
          visa_type: data.visaType
        });
      });
    }
    
    setData(newData);
  };

  const toggleArrayValue = (field: keyof PointsData, value: string) => {
    const currentValues = [...(data[field] as string[])];
    const index = currentValues.indexOf(value);
    
    if (index === -1) {
      currentValues.push(value);
    } else {
      currentValues.splice(index, 1);
    }
    
    handleChange(field, currentValues);
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
  
  const handleClearAll = () => {
    // Reset to initial state
    const initialData: PointsData = {
      visaType: data.visaType, // Keep visa type
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
    setData(initialData);
    goTo(0); // Go back to first step
  };

  // Mobile summary values using improved service
  const calculationResult = VisaCalculatorService.calculatePoints(data);
  const { totalPoints, isQualified, pointsNeeded, pointsToNextTier } = calculationResult;
  const target = totalPoints >= 70 ? 80 : 70;

  // Enhanced validation for navigation using service
  const canGoNext = ValidationService.validateStep(data, currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EducationStep data={data} onDataChange={handleChange} onBatchChange={handleBatchChange} />;
      case 1:
        return <ExperienceStep data={data} onDataChange={handleChange} />;
      case 2:
        return <AgeIncomeStep data={data} onDataChange={handleChange} />;
      case 3:
        return (
          <ResearchLicenseStep 
            data={data} 
            onDataChange={handleChange}
            toggleArrayValue={toggleArrayValue}
          />
        );
      case 4:
        return (
          <LanguageSpecialStep 
            data={data} 
            onDataChange={handleChange}
          />
        );
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
          <div className="ml-auto flex items-center gap-3">
            {/* Step Counter */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-medium">{currentStep + 1}</span>
                <span>/</span>
                <span>{steps.length}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border"></div>
            </div>
            
            {/* Current Step Title */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-primary">
                  {t(steps[currentStep].key)}
                </span>
              </div>
              <div className="sm:hidden px-2 py-1 bg-primary/10 rounded-md">
                <span className="text-xs font-medium text-primary">
                  {t(steps[currentStep].shortKey)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar at Top */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onGoTo={goTo}
        />
      </CardHeader>

      <CardContent className="space-y-6 pb-28 md:pb-6">
        {/* Step Content */}
        {renderStep()}
        
        {/* Navigation Buttons at Bottom */}
        <FormNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrev={goPrev}
          onNext={goNext}
          onReset={goReset}
          onClearAll={handleClearAll}
          onViewResults={onViewResults}
          canGoNext={canGoNext}
          visaType={data.visaType}
        />
      </CardContent>

      {/* Mobile sticky summary bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-primary">
              {fmtPoints(totalPoints)}
            </span>
            <span className="text-xs text-muted-foreground">
              {isQualified 
                ? t('result.qualified') 
                : t('result.needMore', { gap: pointsNeeded })
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isQualified ? (
              <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
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