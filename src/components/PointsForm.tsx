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
import { formatJPY } from "@/lib/utils";
import UniversitySelector from "@/components/UniversitySelector";

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
  const handleChange = (field: keyof PointsData, value: string | boolean | string[] | number) => {
    setData({
      ...data,
      [field]: value,
    });
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
    // Check if current salary is valid for current age
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
  }, [data.age]);

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
                      className={`flex-shrink-0 inline-flex items-center gap-1 h-8 px-2 rounded border transition whitespace-nowrap leading-none ${idx === currentStep ? 'bg-primary text-primary-foreground font-semibold underline' : 'hover:bg-muted'}`}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={t('tooltip.education')} className="inline-flex items-center">
                        <Info className="text-muted-foreground" size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('tooltip.education')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <RadioGroup
                value={data.educationLevel}
                onValueChange={(value) => handleChange("educationLevel", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctorate" id="doctorate" />
                  <Label htmlFor="doctorate" className="flex justify-between w-full">
                    <span>{t('education.doctorate')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(30)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masters" id="masters" />
                  <Label htmlFor="masters" className="flex justify-between w-full">
                    <span>{t('education.masters')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(20)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bachelors" id="bachelors" />
                  <Label htmlFor="bachelors" className="flex justify-between w-full">
                    <span>{t('education.bachelors')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="no-degree" />
                  <Label htmlFor="no-degree" className="flex justify-between w-full">
                    <span>{t('common.none')}</span>
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={t('tooltip.experience')} className="inline-flex items-center">
                        <Info className="text-muted-foreground" size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('tooltip.experience')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3to5" id="work-3to5" />
                  <Label htmlFor="work-3to5" className="flex justify-between w-full">
                    <span>{t('work.3to5')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(5)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5to7" id="work-5to7" />
                  <Label htmlFor="work-5to7" className="flex justify-between w-full">
                    <span>{t('work.5to7')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7to10" id="work-7to10" />
                  <Label htmlFor="work-7to10" className="flex justify-between w-full">
                    <span>{t('work.7to10')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10plus" id="work-10plus" />
                  <Label htmlFor="work-10plus" className="flex justify-between w-full">
                    <span>{t('work.10plus')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(20)}</Badge>
                  </Label>
                </div>
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
              <RadioGroup
                value={data.age}
                onValueChange={(value) => handleChange("age", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="29under" id="age-29under" />
                  <Label htmlFor="age-29under" className="flex justify-between w-full">
                    <span>{t('age.29under')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30to34" id="age-30to34" />
                  <Label htmlFor="age-30to34" className="flex justify-between w-full">
                    <span>{t('age.30to34')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="35to39" id="age-35to39" />
                  <Label htmlFor="age-35to39" className="flex justify-between w-full">
                    <span>{t('age.35to39')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(5)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="40plus" id="age-40plus" />
                  <Label htmlFor="age-40plus" className="flex justify-between w-full">
                    <span>{t('age.40plus')}</span>
                    <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator className="mt-[1cm]" />

            {/* Annual Income */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.annualIncome')}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={t('tooltip.income')} className="inline-flex items-center">
                        <Info className="text-muted-foreground" size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('tooltip.income')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Annual Income selection based on age */}
              <RadioGroup
                value={data.annualSalary}
                onValueChange={(value) => handleChange("annualSalary", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                {/* Lowest: under 3M */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under3m" id="income-under3m" />
                  <Label htmlFor="income-under3m" className="flex justify-between w-full">
                    <span>{t('income.under', { amount: formatJPY(3000000, locale) })}</span>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive ml-2">{t('income.notEligible')}</Badge>
                  </Label>
                </div>

                {/* Age-specific zero point intermediate bands (3M ~ X) shown BEFORE threshold 'X백만 엔 이상' tiers */}
                {data.age === "30to34" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3to5m" id="income-3to5m" />
                    <Label htmlFor="income-3to5m" className="flex justify-between w-full">
                      <span>{t('income.range', { min: formatJPY(3000000, locale), max: formatJPY(5000000, locale) })}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                )}
                {data.age === "35to39" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3to6m" id="income-3to6m" />
                    <Label htmlFor="income-3to6m" className="flex justify-between w-full">
                      <span>{t('income.range', { min: formatJPY(3000000, locale), max: formatJPY(6000000, locale) })}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                )}
                {data.age === "40plus" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3to8m" id="income-3to8m" />
                    <Label htmlFor="income-3to8m" className="flex justify-between w-full">
                      <span>{t('income.range', { min: formatJPY(3000000, locale), max: formatJPY(8000000, locale) })}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                )}

                {/* 4M threshold (only <30) */}
                {data.age === "29under" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4m" id="income-4m" />
                    <Label htmlFor="income-4m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: formatJPY(4000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                    </Label>
                  </div>
                )}

                {/* 5M threshold (only <35) */}
                {(data.age === "29under" || data.age === "30to34") && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5m" id="income-5m" />
                    <Label htmlFor="income-5m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: formatJPY(5000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                    </Label>
                  </div>
                )}

                {/* 6M threshold (not 40+) */}
                {data.age !== "40plus" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6m" id="income-6m" />
                    <Label htmlFor="income-6m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: formatJPY(6000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(20)}</Badge>
                    </Label>
                  </div>
                )}

                {/* 7M threshold (not 40+) */}
                {data.age !== "40plus" && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7m" id="income-7m" />
                    <Label htmlFor="income-7m" className="flex justify-between w-full">
                      <span>{t('income.atLeast', { amount: formatJPY(7000000, locale) })}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(25)}</Badge>
                    </Label>
                  </div>
                )}

                {/* 8M threshold (all ages) */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8m" id="income-8m" />
                  <Label htmlFor="income-8m" className="flex justify-between w-full">
                    <span>{t('income.atLeast', { amount: formatJPY(8000000, locale) })}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(30)}</Badge>
                  </Label>
                </div>

                {/* 9M threshold (all ages) */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="9m" id="income-9m" />
                  <Label htmlFor="income-9m" className="flex justify-between w-full">
                    <span>{t('income.atLeast', { amount: formatJPY(9000000, locale) })}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(35)}</Badge>
                  </Label>
                </div>

                {/* 10M threshold (all ages, highest) */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10m" id="income-10m" />
                  <Label htmlFor="income-10m" className="flex justify-between w-full">
                    <span>{t('income.atLeast', { amount: formatJPY(10000000, locale) })}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(40)}</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            {/* Research Achievements and Licenses (with bonuses) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-medium">{t('form.researchLicense')}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={t('tooltip.researchLicense')} className="inline-flex items-center">
                        <Info className="text-muted-foreground" size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('tooltip.researchLicense')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('research.title')}</h4>
                  {/* Use Popover for mobile-friendly, tap-to-open behavior */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" aria-label={t('tooltip.moreInfo')} className="inline-flex items-center">
                        <Info className="text-muted-foreground text-xs" size={14} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="max-w-[280px] text-sm">
                      <p>{t('research.onlyOne')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <RadioGroup
                  value={data.researchAchievements.length > 0 ? data.researchAchievements[0] : "none"}
                  onValueChange={(value) => handleChange("researchAchievements", value === "none" ? [] : [value])}
                  className="grid grid-cols-1 gap-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patents" id="research-patents" />
                    <Label htmlFor="research-patents" className="flex justify-between w-full">
                      <span className="text-sm">{t('research.patents')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="research" id="research-projects" />
                    <Label htmlFor="research-projects" className="flex justify-between w-full">
                      <span className="text-sm">{t('research.research')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="papers" id="research-papers" />
                    <Label htmlFor="research-papers" className="flex justify-between w-full">
                      <span className="text-sm">{t('research.papers')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="awards" id="research-awards" />
                    <Label htmlFor="research-awards" className="flex justify-between w-full">
                      <span className="text-sm">{t('research.awards')}</span>
                      <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(15)}</Badge>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="research-none" />
                    <Label htmlFor="research-none" className="flex justify-between w-full">
                      <span className="text-sm">{t('common.none')}</span>
                      <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                    </Label>
                  </div>
                </RadioGroup>
                
                <h4 className="text-sm font-medium text-muted-foreground mt-4">{t('licenses.title')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="md:col-span-2">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="jp-national-licenses" className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{t('licenses.jpNational')}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" aria-label={t('tooltip.moreInfo')} className="inline-flex items-center">
                                  <Info className="text-muted-foreground" size={16} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px]">
                                <p>{t('licenses.tooltip.count')}</p>
                                <p className="mt-2">{t('licenses.tooltip.kr')}</p>
                                <p className="mt-2">
                                  <a 
                                    href="https://www.moj.go.jp/isa/policies/bill/nyukan_hourei_h09.html" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                  >
                                    {t('licenses.linkText')}
                                  </a>
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                    onCheckedChange={(checked) => handleChange("japaneseEducation", !!checked)}
                  />
                  <Label htmlFor="japanese-education" className="flex justify-between w-full">
                    <span>{t('special.japaneseEducation')}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(10)}</Badge>
                  </Label>
                </div>
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