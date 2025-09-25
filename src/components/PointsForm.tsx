import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateTotalPoints, getQualificationStatus } from "@/lib/calculator";
import { 
  PointsData, 
  VisaType,
  educationPoints, 
  workExperiencePoints, 
  agePoints, 
  annualSalaryPoints,
  researchPoints,
  licensePoints,
  languagePoints,
  specialPoints
} from "@/lib/models";
import { Info } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/i18n";
import { formatJPY, formatManEn, formatEnMillionsJPY, calculateKoreanAge, getAgeCategoryFromAge } from "@/lib/utils";
import UniversitySelector from "@/components/UniversitySelector";

// Mobile-friendly InfoButton component
const InfoButton = ({ content, ariaLabel }: { content: string; ariaLabel: string }) => {
  return (
    <>
      {/* Desktop: Tooltip */}
      <div className="hidden md:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button" 
                aria-label={ariaLabel} 
                className="inline-flex items-center touch-none hover:touch-auto focus:touch-auto p-1 -m-1 rounded transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Info className="text-muted-foreground" size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{content}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Mobile: Popover */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button 
              type="button" 
              aria-label={ariaLabel}
              className="inline-flex items-center p-1 -m-1 rounded transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Info className="text-muted-foreground" size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-xs font-medium leading-relaxed">
            <p>{content}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
import { Input } from "@/components/ui/input";

interface PointsFormProps {
  data: PointsData;
  setData: (data: PointsData) => void;
}

interface UniversityOption {
  name: string;
  eligible: boolean;
  country?: string;
}

export function PointsForm({ data, setData }: PointsFormProps) {
  const { t, locale } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });
  
  // Parse birth date into year, month, day
    const getEducationPoints = (level: string) => {
    return educationPoints[data.visaType]?.[level as keyof (typeof educationPoints)[VisaType]] || 0;
  };

  const getWorkExperiencePoints = (experience: string) => {
    return workExperiencePoints[data.visaType]?.[experience as keyof (typeof workExperiencePoints)[VisaType]] || 0;
  };

  const getAnnualSalaryPoints = (salary: string) => {
    return annualSalaryPoints[data.visaType]?.[salary as keyof (typeof annualSalaryPoints)[VisaType]] || 0;
  };

  const getResearchPoints = (research: string) => {
    if (data.visaType === 'academic') {
      // 고도 학술 연구 활동: 개별 항목 표시용으로는 20점, 실제 계산은 calculator.ts에서 처리
      return 20;
    }
    return researchPoints[data.visaType]?.[research as keyof (typeof researchPoints)[VisaType]] || 0;
  };

  const getAgePoints = (ageCategory: string) => {
    return agePoints[data.visaType]?.[ageCategory as keyof (typeof agePoints)[VisaType]] || 0;
  };

  const parseBirthDate = (birthDateString: string | undefined) => {
    if (!birthDateString) return { year: '', month: '', day: '' };
    const parts = birthDateString.split('-');
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || ''
    };
  };
  
  // Separate state for date components to ensure UI updates properly
  const [dateComponents, setDateComponents] = useState(() => {
    const parsed = parseBirthDate(data.birthDate);
    return parsed;
  });

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

  // Reset annual salary if age changes and current salary is not valid for the new age
  useEffect(() => {
    // Skip auto-redirect - let user make conscious choice
    if (data.annualSalary === "under3m") {
      return; // Don't auto-redirect, let user choose
    }

    // Check if current salary is valid for current age (Technical visa only)
    if (data.visaType === 'technical') {
      if (data.age === "40plus" && (data.annualSalary === "7m" || data.annualSalary === "6m" || data.annualSalary === "5m" || data.annualSalary === "4m" || data.annualSalary === "3to5m" || data.annualSalary === "3to6m")) {
        handleChange("annualSalary", "8m"); // Default to 8m for 40+
      } else if (data.age === "35to39" && (data.annualSalary === "5m" || data.annualSalary === "4m" || data.annualSalary === "3to5m" || data.annualSalary === "3to8m")) {
        handleChange("annualSalary", "6m"); // Default to 6m for 35-39
      } else if (data.age === "30to34" && (data.annualSalary === "4m" || data.annualSalary === "3to8m")) {
        handleChange("annualSalary", "5m"); // Default to 5m for 30-34
      } else if (data.age !== "30to34" && data.annualSalary === "3to5m") {
        handleChange("annualSalary", "5m"); // Reset custom band when leaving 30-34
      } else if (data.age !== "35to39" && data.annualSalary === "3to6m") {
        handleChange("annualSalary", "6m"); // Reset custom band when leaving 35-39
      } else if (data.age !== "40plus" && data.annualSalary === "3to8m") {
        handleChange("annualSalary", "8m"); // Reset custom band when leaving 40+
      }
    }
  }, [data.age, data.annualSalary, data.visaType]);

  // Handle birth date change and automatically calculate age
  const handleBirthDateChange = (birthDate: string) => {
    handleChange("birthDate", birthDate);
    
    if (birthDate) {
      const calculatedAge = calculateKoreanAge(birthDate);
      if (calculatedAge !== null) {
        const ageCategory = getAgeCategoryFromAge(calculatedAge);
        handleChange("age", ageCategory);
      }
    }
  };

  // Update dateComponents when data.birthDate changes from external sources
  useEffect(() => {
    const parsed = parseBirthDate(data.birthDate);
    setDateComponents(parsed);
  }, [data.birthDate]);

  const { year, month, day } = dateComponents;

  // Handle individual date component changes
  const handleDateComponentChange = (component: 'year' | 'month' | 'day', value: string) => {
    const newComponents = { ...dateComponents, [component]: value };
    setDateComponents(newComponents);
    
    // If all components are selected, create complete date and trigger age calculation
    if (newComponents.year && newComponents.month && newComponents.day) {
      const newBirthDate = `${newComponents.year}-${newComponents.month.padStart(2, '0')}-${newComponents.day.padStart(2, '0')}`;
      handleBirthDateChange(newBirthDate);
    }
  };

  // Generate year options (1940 to current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);
  
  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate day options (1-31, but should be validated based on month/year)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  const dayOptions = (() => {
    if (year && month) {
      const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }
    return Array.from({ length: 31 }, (_, i) => i + 1);
  })();

  const steps = [
    { id: 'education', key: 'form.education', shortKey: 'form.education.short' },
    { id: 'experience', key: 'form.experience', shortKey: 'form.experience.short' },
    { id: 'ageIncome', key: 'form.ageIncome', shortKey: 'form.ageIncome.short' },
    { id: 'researchLicense', key: 'form.researchLicense', shortKey: 'form.researchLicense.short' },
    { id: 'languageSpecial', key: 'form.languageSpecial', shortKey: 'form.languageSpecial.short' }
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const progressValue = ((currentStep) / (steps.length - 1)) * 100;
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goTo = (index: number) => setCurrentStep(index);

  // Mobile summary values
  const totalPoints = calculateTotalPoints(data);
  const target = totalPoints >= 70 ? 80 : 70;
  const gap = Math.max(0, target - totalPoints);
  const qualified = totalPoints >= 70;

  const [showUniversitySearch, setShowUniversitySearch] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityOption | null>(null);

  const handleUniversitySelect = (opt: UniversityOption | null) => {
    if (!opt) {
      // cleared selection
      setSelectedUniversity(null);
      setData({ ...data, university: '', universityEligible: false });
      return;
    }

    setSelectedUniversity(opt);
    // When a user clicks a result, we auto-check confirmation and award +10
    setData({ ...data, university: opt.name, universityEligible: true });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center mb-3 min-w-0">
          <CardTitle className="text-xl text-primary max-w-[60%]">{t('form.title')}</CardTitle>
          <nav className="hidden md:flex gap-2 overflow-x-auto ml-3 md:ml-4" aria-label={t('form.steps')} tabIndex={0}
               onKeyDown={(e) => {
                 if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
                 if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
               }}>
            {steps.map((step, idx) => (
              <TooltipProvider key={step.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => goTo(idx)}
                      aria-current={idx === currentStep ? 'step' : undefined}
                      aria-label={`${idx + 1}. ${t(step.key)}`}
                      className={`flex-shrink-0 inline-flex items-center gap-1 h-8 px-2 rounded border transition whitespace-nowrap leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${idx === currentStep ? 'bg-primary text-primary-foreground font-semibold underline' : 'hover:bg-muted'}`}
                    >
                      <span className={`inline-flex items-center justify-center w-5 h-5 text-[11px] rounded-full ${idx === currentStep ? 'bg-primary-foreground/20' : 'bg-muted text-foreground'}`}>{idx + 1}</span>
                      <span className="text-xs font-medium">{t(step.shortKey)}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t(step.key)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
        {/* Keyboard navigation supported on the step nav via tabIndex and onKeyDown */}
        <Progress value={progressValue} className="h-2" />
        <div className="mt-2 flex md:hidden justify-between text-xs text-muted-foreground">
          <span>{t(steps[currentStep].key)}</span>
          <span>{currentStep + 1}/{steps.length}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-24 md:pb-0">
        {/* Live region for dynamic totals and qualification updates (screen readers) */}
        <div className="sr-only" aria-live="polite" role="status">
          {t('total.score')}: {totalPoints} {qualified ? t('mobile.summary.qualified') : t('mobile.summary.insufficient', { gap })}
        </div>
        {/* STEP 1: Academic Background */}
        {currentStep === 0 && (
          <div>
            {/* Academic Background */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.education')}</h3>
                <InfoButton content={t('tooltip.education')} ariaLabel={t('tooltip.education')} />
              </div>
              <RadioGroup
                value={data.educationLevel}
                onValueChange={(value) => handleChange("educationLevel", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                {data.visaType === 'business' && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mba" id="mba" />
                    <Label htmlFor="mba" className="flex justify-between w-full">
                      <span>{t('education.mba')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getEducationPoints('mba'))}</Badge>
                    </Label>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctorate" id="doctorate" />
                  <Label htmlFor="doctorate" className="flex justify-between w-full">
                    <span>{t('education.doctorate')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getEducationPoints('doctorate'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masters" id="masters" />
                  <Label htmlFor="masters" className="flex justify-between w-full">
                    <span>{t('education.masters')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getEducationPoints('masters'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bachelors" id="bachelors" />
                  <Label htmlFor="bachelors" className="flex justify-between w-full">
                    <span>{t('education.bachelors')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getEducationPoints('bachelors'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="no-degree" />
                  <Label htmlFor="no-degree" className="flex justify-between w-full">
                    <span>{t('common.none')}</span>
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(getEducationPoints('none'))}</Badge>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4 border-t pt-4">
                {/* Search is shown by default */}
                <div className="mt-1">
                  <div className="mb-2 flex items-center gap-1">
                    <div className="font-medium">{t('form.special')}</div>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{t('university.confirm.badge')}</Badge>
                  </div>
                  <UniversitySelector onSelect={(opt) => handleUniversitySelect(opt)} selectedName={selectedUniversity?.name} />
                </div>

                {/* Confirmation checkbox below search */}
                <div className="mt-3 flex items-center space-x-2">
                  <Checkbox
                    id="uni-confirm"
                    checked={Boolean(data.universityEligible)}
                    onCheckedChange={(checked) => {
                      const isTrue = checked === true;
                      // Update both fields in a single call to avoid overwriting
                      setData({ ...data, universityEligible: isTrue, university: isTrue ? data.university : '' });
                      if (!isTrue) {
                        setSelectedUniversity(null);
                      }
                    }}
                  />
                  <Label htmlFor="uni-confirm" className="flex-1">
                    {t('university.confirm.label')}
                  </Label>
                </div>
                {selectedUniversity && (
                  <div className="mt-2 text-sm min-w-0">
                    <span className="block">
                      {t('university.selected')}: <strong>{selectedUniversity.name}</strong>{selectedUniversity.country ? ` (${selectedUniversity.country})` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            {/* Work Experience (moved into step) */}
            {/* Work Experience */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.experience')}</h3>
                <InfoButton content={t('tooltip.experience')} ariaLabel={t('tooltip.experience')} />
              </div>
              <RadioGroup
                value={data.workExperience}
                onValueChange={(value) => handleChange("workExperience", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less3" id="work-less3" />
                  <Label htmlFor="work-less3" className="flex justify-between w-full">
                    <span>{t('work.less3')}</span>
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(getWorkExperiencePoints('less3'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3to5" id="work-3to5" />
                  <Label htmlFor="work-3to5" className="flex justify-between w-full">
                    <span>{t('work.3to5')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getWorkExperiencePoints('3to5'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5to7" id="work-5to7" />
                  <Label htmlFor="work-5to7" className="flex justify-between w-full">
                    <span>{t('work.5to7')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getWorkExperiencePoints('5to7'))}</Badge>
                  </Label>
                </div>
                {(data.visaType === 'technical' || data.visaType === 'business') && (
                  <>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7to10" id="work-7to10" />
                      <Label htmlFor="work-7to10" className="flex justify-between w-full">
                        <span>{t('work.7to10')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getWorkExperiencePoints('7to10'))}</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10plus" id="work-10plus" />
                      <Label htmlFor="work-10plus" className="flex justify-between w-full">
                        <span>{t('work.10plus')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getWorkExperiencePoints('10plus'))}</Badge>
                      </Label>
                    </div>
                  </>
                )}
                {data.visaType === 'academic' && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7plus" id="work-7plus" />
                    <Label htmlFor="work-7plus" className="flex justify-between w-full">
                      <span>{t('work.7plus')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getWorkExperiencePoints('7plus'))}</Badge>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            {/* Age + Annual Income (merged) */}
            
            {/* Age */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.age')}</h3>
              </div>
              
              {/* Birth Date Input with Dropdowns */}
              <div className="mb-6">
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">
                    {t('form.birthDate.instruction')}
                  </p>
                </div>
                
                <div className="inline-flex items-center gap-2 p-3 border rounded-lg bg-card">
                  {/* Year Dropdown */}
                  <div className="w-20">
                    <Select value={year} onValueChange={(value) => handleDateComponentChange('year', value)}>
                      <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-1 focus:ring-primary">
                        <SelectValue placeholder={t('form.birthDate.year')} />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-muted-foreground">-</div>
                  
                  {/* Month Dropdown */}
                  <div className="w-16">
                    <Select value={month} onValueChange={(value) => handleDateComponentChange('month', value)}>
                      <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-1 focus:ring-primary">
                        <SelectValue placeholder={t('form.birthDate.month')} />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            {m.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-muted-foreground">-</div>
                  
                  {/* Day Dropdown */}
                  <div className="w-16">
                    <Select value={day} onValueChange={(value) => handleDateComponentChange('day', value)}>
                      <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-1 focus:ring-primary">
                        <SelectValue placeholder={t('form.birthDate.day')} />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOptions.map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Calculated Age Display */}
                {data.birthDate && (() => {
                  const calculatedAge = calculateKoreanAge(data.birthDate);
                  if (calculatedAge !== null) {
                    return (
                      <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">
                          {t('form.birthDate.calculated', { age: calculatedAge })}
                        </span>
                      </div>
                    );
                  } else if (data.birthDate) {
                    // Check if it's a future date
                    const birth = new Date(data.birthDate);
                    const today = new Date();
                    if (birth > today) {
                      return (
                        <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-700">
                            {t('form.birthDate.future')}
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-700">
                            {t('form.birthDate.invalid')}
                          </span>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
              </div>

              {/* Age Category Selection */}
              <RadioGroup
                value={data.age}
                onValueChange={(value) => handleChange("age", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="29under" id="age-29under" />
                  <Label htmlFor="age-29under" className="flex justify-between w-full">
                    <span>{t('age.29under')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAgePoints('29under'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30to34" id="age-30to34" />
                  <Label htmlFor="age-30to34" className="flex justify-between w-full">
                    <span>{t('age.30to34')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAgePoints('30to34'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="35to39" id="age-35to39" />
                  <Label htmlFor="age-35to39" className="flex justify-between w-full">
                    <span>{t('age.35to39')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAgePoints('35to39'))}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="40plus" id="age-40plus" />
                  <Label htmlFor="age-40plus" className="flex justify-between w-full">
                    <span>{t('age.40plus')}</span>
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(getAgePoints('40plus'))}</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="mt-[1cm]" />

            {/* Annual Income */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.annualIncome')} {locale === 'en' ? null : <span className="text-xs text-muted-foreground">({t('income.unit.manEn')})</span>}</h3>
                <InfoButton content={t('tooltip.income')} ariaLabel={t('tooltip.income')} />
              </div>
              
              {/* Income requirement notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                <p className="text-xs text-amber-700">
                  <span className="font-medium">{t('income.minimum.title')}</span> {t('income.minimum.description')}
                </p>
              </div>

              {/* Annual Income selection based on age */}
              <RadioGroup
                value={data.annualSalary}
                onValueChange={(value) => handleChange("annualSalary", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                {/* Business visa specific income options (simplified) */}
                {data.visaType === 'business' ? (
                  <>
                    {/* Business visa income ranges based on official table */}
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="under10m" id="income-under10m" disabled />
                      <Label htmlFor="income-under10m" className="flex justify-between w-full cursor-not-allowed">
                        <span className="text-muted-foreground">{t('income.under', { amount: locale === 'en' ? formatEnMillionsJPY(10000000) : formatManEn(10000000, locale) })}</span>
                        <Badge variant="outline" className="bg-destructive/10 text-destructive ml-2">{t('income.notEligible')}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10m" id="income-10m-business" />
                      <Label htmlFor="income-10m-business" className="flex justify-between w-full">
                        <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(10000000) : formatManEn(10000000, locale) })}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('10m'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15m" id="income-15m" />
                      <Label htmlFor="income-15m" className="flex justify-between w-full">
                        <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(15000000) : formatManEn(15000000, locale) })}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('15m'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="20m" id="income-20m" />
                      <Label htmlFor="income-20m" className="flex justify-between w-full">
                        <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(20000000) : formatManEn(20000000, locale) })}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('20m'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25m" id="income-25m" />
                      <Label htmlFor="income-25m" className="flex justify-between w-full">
                        <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(25000000) : formatManEn(25000000, locale) })}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('25m'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30m" id="income-30m" />
                      <Label htmlFor="income-30m" className="flex justify-between w-full">
                        <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(30000000) : formatManEn(30000000, locale) })}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('30m'))}</Badge>
                      </Label>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Academic/Technical visa income options (existing complex logic) */}
                {/* Lowest: under 3M - Disabled (0 points) */}
                <div className="flex items-center space-x-2 opacity-50">
                  <RadioGroupItem value="under3m" id="income-under3m" disabled />
                  <Label htmlFor="income-under3m" className="flex justify-between w-full cursor-not-allowed">
                    <span className="text-muted-foreground">{t('income.under', { amount: locale === 'en' ? formatEnMillionsJPY(3000000) : formatManEn(3000000, locale) })}</span>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive ml-2">{t('income.notEligible')}</Badge>
                  </Label>
                </div>

                {/* Age-specific zero point intermediate bands (3M ~ X) shown BEFORE threshold 'X백만 엔 이상' tiers */}
                {data.age === "30to34" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3to5m" id="income-3to5m" />
                    <Label htmlFor="income-3to5m" className="flex justify-between w-full">
                      <span>{t('income.range', { min: locale === 'en' ? formatEnMillionsJPY(3000000) : formatManEn(3000000, locale), max: locale === 'en' ? formatEnMillionsJPY(5000000) : formatManEn(5000000, locale) })}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                )}
                {data.age === "35to39" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3to6m" id="income-3to6m" />
                    <Label htmlFor="income-3to6m" className="flex justify-between w-full">
                      <span>{t('income.range', { min: locale === 'en' ? formatEnMillionsJPY(3000000) : formatManEn(3000000, locale), max: locale === 'en' ? formatEnMillionsJPY(6000000) : formatManEn(6000000, locale) })}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                )}
                {data.age === "40plus" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3to8m" id="income-3to8m" />
                    <Label htmlFor="income-3to8m" className="flex justify-between w-full">
                      <span>{t('income.range', { min: locale === 'en' ? formatEnMillionsJPY(3000000) : formatManEn(3000000, locale), max: locale === 'en' ? formatEnMillionsJPY(8000000) : formatManEn(8000000, locale) })}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                )}

                {/* 4M threshold (only <30) */}
                {data.age === "29under" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4m" id="income-4m" />
                    <Label htmlFor="income-4m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(4000000) : formatManEn(4000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('4m'))}</Badge>
                    </Label>
                  </div>
                )}

                {/* 5M threshold (only <35) */}
                {(data.age === "29under" || data.age === "30to34") && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5m" id="income-5m" />
                    <Label htmlFor="income-5m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(5000000) : formatManEn(5000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('5m'))}</Badge>
                    </Label>
                  </div>
                )}

                {/* 6M threshold (not 40+) */}
                {data.age !== "40plus" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6m" id="income-6m" />
                    <Label htmlFor="income-6m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(6000000) : formatManEn(6000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('6m'))}</Badge>
                    </Label>
                  </div>
                )}

                {/* 7M threshold (not 40+) */}
                {data.age !== "40plus" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7m" id="income-7m" />
                    <Label htmlFor="income-7m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(7000000) : formatManEn(7000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('7m'))}</Badge>
                    </Label>
                  </div>
                )}

                {/* 8M threshold (all ages) */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8m" id="income-8m" />
                  <Label htmlFor="income-8m" className="flex justify-between w-full">
                    <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(8000000) : formatManEn(8000000, locale) })}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('8m'))}</Badge>
                  </Label>
                </div>

                {/* 9M threshold (all ages) */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="9m" id="income-9m" />
                  <Label htmlFor="income-9m" className="flex justify-between w-full">
                    <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(9000000) : formatManEn(9000000, locale) })}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('9m'))}</Badge>
                  </Label>
                </div>

                    {/* 10M threshold (all ages, highest) */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10m" id="income-10m" />
                      <Label htmlFor="income-10m" className="flex justify-between w-full">
                        <span>{t('income.atLeast', { amount: locale === 'en' ? formatEnMillionsJPY(10000000) : formatManEn(10000000, locale) })}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getAnnualSalaryPoints('10m'))}</Badge>
                      </Label>
                    </div>
                  </>
                )}
              </RadioGroup>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            {/* Research Achievements and Licenses (with bonuses) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">
                  {data.visaType === 'business' ? t('business.executive.title') : t('form.researchLicense')}
                </h3>
                <InfoButton 
                  content={data.visaType === 'business' 
                    ? t('business.executive.tooltip')
                    : t('tooltip.researchLicense')
                  }
                  ariaLabel={t('tooltip.researchLicense')}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {data.visaType === 'business' ? t('business.position.title') : t('research.title')}
                  </h4>
                  {/* Use Popover for mobile-friendly, tap-to-open behavior */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" aria-label={t('tooltip.moreInfo')} className="inline-flex items-center">
                        <Info className="text-muted-foreground text-xs" size={14} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="max-w-[280px] text-sm">
                      {data.visaType === 'academic' ? (
                        <div className="space-y-2">
                          <p>{t('research.academic.multiple')}</p>
                          <p className="text-xs text-blue-600 font-medium">{t('research.academic.points')}</p>
                        </div>
                      ) : data.visaType === 'business' ? (
                        <div className="space-y-2">
                          <p>{t('business.position.description')}</p>
                          <p className="text-xs text-green-600 font-medium">{t('business.position.details')}</p>
                        </div>
                      ) : (
                        <p>{t('research.onlyOne')}</p>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                {data.visaType === 'academic' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">{t('research.academic.scoring')}</span> {t('research.academic.explanation')}
                    </p>
                  </div>
                )}

                {/* Academic 비자: 복수 선택 가능한 체크박스 */}
                {data.visaType === 'academic' && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="research-patent-invention"
                        checked={data.researchAchievements.includes('patent_invention')}
                        onCheckedChange={(checked) => {
                          const newAchievements = checked
                            ? [...data.researchAchievements, 'patent_invention']
                            : data.researchAchievements.filter(item => item !== 'patent_invention');
                          handleChange("researchAchievements", newAchievements);
                        }}
                      />
                      <Label htmlFor="research-patent-invention" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.patents.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('patent_invention'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="research-official-journal"
                        checked={data.researchAchievements.includes('official_journal')}
                        onCheckedChange={(checked) => {
                          const newAchievements = checked
                            ? [...data.researchAchievements, 'official_journal']
                            : data.researchAchievements.filter(item => item !== 'official_journal');
                          handleChange("researchAchievements", newAchievements);
                        }}
                      />
                      <Label htmlFor="research-official-journal" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.official.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('official_journal'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="research-academic-database"
                        checked={data.researchAchievements.includes('academic_database')}
                        onCheckedChange={(checked) => {
                          const newAchievements = checked
                            ? [...data.researchAchievements, 'academic_database']
                            : data.researchAchievements.filter(item => item !== 'academic_database');
                          handleChange("researchAchievements", newAchievements);
                        }}
                      />
                      <Label htmlFor="research-academic-database" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.papers.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('academic_database'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="research-award-research"
                        checked={data.researchAchievements.includes('award_research')}
                        onCheckedChange={(checked) => {
                          const newAchievements = checked
                            ? [...data.researchAchievements, 'award_research']
                            : data.researchAchievements.filter(item => item !== 'award_research');
                          handleChange("researchAchievements", newAchievements);
                        }}
                      />
                      <Label htmlFor="research-award-research" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.awards.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('award_research'))}</Badge>
                      </Label>
                    </div>
                    
                    {data.researchAchievements.length >= 2 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                        <p className="text-sm text-green-700">
                          <span className="font-medium">{t('research.multiple.bonus')}</span> {t('research.multiple.message')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Business 비자: 경영진 지위 선택 */}
                {data.visaType === 'business' && (
                  <RadioGroup
                    value={data.businessExecutiveBonus || "none"}
                    onValueChange={(value) => handleChange("businessExecutiveBonus", value === "none" ? "" : value)}
                    className="grid grid-cols-1 gap-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="executive_senior" id="executive-senior" />
                      <Label htmlFor="executive-senior" className="flex justify-between w-full">
                        <span className="text-sm">{t('business.ceo.label')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="executive_manager" id="executive-manager" />
                      <Label htmlFor="executive-manager" className="flex justify-between w-full">
                        <span className="text-sm">{t('business.director.label')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(5)}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="executive-none" />
                      <Label htmlFor="executive-none" className="flex justify-between w-full">
                        <span className="text-sm">{t('common.none')}</span>
                        <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {/* Technical 비자: 연구 실적 선택 */}
                {data.visaType === 'technical' && (
                  <RadioGroup
                    value={data.researchAchievements.length > 0 ? data.researchAchievements[0] : "none"}
                    onValueChange={(value) => handleChange("researchAchievements", value === "none" ? [] : [value])}
                    className="grid grid-cols-1 gap-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="patent_invention" id="research-patent-invention-tech" />
                      <Label htmlFor="research-patent-invention-tech" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.patents.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('patent_invention'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="official_journal" id="research-official-journal-tech" />
                      <Label htmlFor="research-official-journal-tech" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.official.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('official_journal'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="academic_database" id="research-academic-database-tech" />
                      <Label htmlFor="research-academic-database-tech" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.papers.detailed')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('academic_database'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="award_research" id="research-award-research-tech" />
                      <Label htmlFor="research-award-research-tech" className="flex justify-between w-full">
                        <span className="text-sm">{t('research.technical.equivalent')}</span>
                        <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('award_research'))}</Badge>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="research-none-tech" />
                      <Label htmlFor="research-none-tech" className="flex justify-between w-full">
                        <span className="text-sm">{t('common.none')}</span>
                        <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                )}
                
                <h4 className="text-sm font-medium text-muted-foreground mt-4">{t('licenses.title')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="md:col-span-2">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="jp-national-licenses" className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{t('licenses.jpNational')}</span>
                          <InfoButton 
                            content={`${t('licenses.tooltip.count')} ${t('licenses.tooltip.kr')}`}
                            ariaLabel={t('tooltip.moreInfo')}
                          />
                        </div>
                      </Label>
                      <Select
                        value={data.jpNationalLicenses.toString()}
                        onValueChange={(value) => handleChange("jpNationalLicenses", parseInt(value))}
                      >
                        <SelectTrigger id="jp-national-licenses">
                          <SelectValue placeholder={t('common.selectPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">{t('licenses.option.none')}</SelectItem>
                          <SelectItem value="1">{t('licenses.option.one')}</SelectItem>
                          <SelectItem value="2">{t('licenses.option.two')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="license-other" 
                      checked={data.licenses.includes('other')}
                      onCheckedChange={() => toggleArrayValue('licenses', 'other')}
                    />
                    <Label htmlFor="license-other" className="flex items-center gap-2">
                      <span>{t('licenses.otherForeign')}</span>
                      <Badge variant="outline" className="bg-primary/10">{fmtPoints(5)}</Badge>
                    </Label>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-muted-foreground mt-4">{t('special.bonus.title')}</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="innovation-bonus" 
                      checked={data.innovationBonus}
                      onCheckedChange={(checked) => handleChange("innovationBonus", !!checked)}
                    />
                    <Label htmlFor="innovation-bonus" className="flex justify-between w-full">
                      <span>{t('special.bonus.innovation')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="research-cost-bonus" 
                      checked={data.researchCostBonus}
                      onCheckedChange={(checked) => handleChange("researchCostBonus", !!checked)}
                    />
                    <Label htmlFor="research-cost-bonus" className="flex justify-between w-full">
                      <span>{t('special.bonus.researchCost')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(5)}</Badge>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div>
            {/* Language Skills + Special Additions */}
            {/* Language Skills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.language')}</h3>
              </div>
              
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('language.japanese')}</h4>
              <RadioGroup
                value={data.japaneseLanguage}
                onValueChange={(value) => handleChange("japaneseLanguage", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="n1" id="japanese-n1" />
                  <Label htmlFor="japanese-n1" className="flex justify-between w-full">
                    <span>{t('language.jlptN1')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bjt480" id="japanese-bjt480" />
                  <Label htmlFor="japanese-bjt480" className="flex justify-between w-full">
                    <span>{t('language.bjt480')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overseas_major" id="japanese-overseas-major" />
                  <Label htmlFor="japanese-overseas-major" className="flex justify-between w-full">
                    <span>{t('language.overseasMajor')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="n2" id="japanese-n2" />
                  <Label htmlFor="japanese-n2" className="flex justify-between w-full">
                    <span>{t('language.jlptN2')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="japanese-none" />
                  <Label htmlFor="japanese-none" className="flex justify-between w-full">
                    <span>{t('common.none')}</span>
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="mt-[1cm]" />

            {/* Special Additions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.special')}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="japanese-education" 
                    checked={data.japaneseEducation}
                    disabled={data.japaneseLanguage === 'n2'}
                    onCheckedChange={(checked) => handleChange("japaneseEducation", !!checked)}
                  />
                  <Label 
                    htmlFor="japanese-education" 
                    className={`flex justify-between w-full ${data.japaneseLanguage === 'n2' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>{t('special.japaneseEducation')}</span>
                    <Badge variant="outline" className={`ml-2 ${data.japaneseLanguage === 'n2' ? 'bg-muted/30' : 'bg-primary/10'}`}>
                      {fmtPoints(10)}
                    </Badge>
                  </Label>
                </div>
                {data.japaneseLanguage === 'n2' && (
                  <div className="ml-6 text-xs text-muted-foreground">
                    {t('special.japaneseEducation.n2Restriction')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button type="button" variant="outline" disabled={currentStep === 0} onClick={goPrev}>{t('nav.prev')}</Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={goNext}>{t('nav.next')}</Button>
          ) : (
            <Button type="button" variant="secondary" onClick={() => goTo(0)}>{t('nav.reset')}</Button>
          )}
        </div>
      </CardContent>

      {/* Mobile sticky summary bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-muted-foreground">{t('total.score')}</span>
            <span className="text-base font-semibold">
              {fmtPoints(totalPoints)} {qualified ? <span className="text-primary">{t('mobile.summary.qualified')}</span> : <span className="text-muted-foreground">{t('mobile.summary.insufficient', { gap })}</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" disabled={currentStep === 0} onClick={goPrev}>{t('nav.prev')}</Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" size="sm" onClick={goNext}>{t('nav.next')}</Button>
            ) : (
              <Button type="button" size="sm" variant="secondary" onClick={() => goTo(0)}>{t('nav.reset')}</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}