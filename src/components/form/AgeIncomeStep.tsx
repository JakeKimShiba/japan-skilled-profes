import { useState, useEffect, useRef, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PointsData, VisaType, agePoints, annualSalaryPoints } from "@/lib/models";
import { PointsCalculationService } from "@/services/PointsCalculationService";
import { useI18n } from "@/i18n";
import { formatEnMillionsJPY, formatManEn } from "@/lib/utils";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";

interface AgeIncomeStepProps {
  data: PointsData;
  onDataChange: (field: keyof PointsData, value: string) => void;
}

interface DateComponents {
  year: string;
  month: string;  
  day: string;
}

export function AgeIncomeStep({ data, onDataChange }: AgeIncomeStepProps) {
  const { t, locale } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  // Parse birth date into components
  const parseBirthDate = (birthDateString: string | undefined): DateComponents => {
    if (!birthDateString) return { year: '', month: '', day: '' };
    const parts = birthDateString.split('-');
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || ''
    };
  };

  const [dateComponents, setDateComponents] = useState<DateComponents>(() => {
    return parseBirthDate(data.birthDate);
  });

  // Handle date component changes
  const handleDateComponentChange = (field: keyof DateComponents, value: string) => {
    const newDateComponents = { ...dateComponents, [field]: value };
    setDateComponents(newDateComponents);
    
    // If all components are filled, update birth date and age
    const { year, month, day } = newDateComponents;
    if (year && month && day) {
      const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      // Only update if the birth date has actually changed
      if (data.birthDate !== birthDate) {
        onDataChange("birthDate", birthDate);
        
        // Auto-calculate age category
        const age = calculateKoreanAge(birthDate);
        if (age !== null) {
          let ageCategory = '';
          if (age <= 29) ageCategory = '29under';
          else if (age <= 34) ageCategory = '30to34';
          else if (age <= 39) ageCategory = '35to39';
          else ageCategory = '40plus';
          
          // Only update age if it's different from current age
          if (data.age !== ageCategory) {
            onDataChange("age", ageCategory);
          }
        }
      }
    }
  };

  // Calculate Korean age
  const calculateKoreanAge = (birthDateString: string): number | null => {
    try {
      const birth = new Date(birthDateString);
      const today = new Date();
      
      if (birth > today) return null; // Future date
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return null;
    }
  };

  // Get available salary options based on age and visa type
  const availableSalaryOptions = useMemo(() => {
    if (!data.visaType || !data.age) return [];
    
    if (data.visaType === 'business') {
      return ['under10m', '10m', '15m', '20m', '25m', '30m'];
    }
    
    return PointsCalculationService.getAvailableSalaryOptions(data.age, data.visaType);
  }, [data.age, data.visaType]);

  // Reset salary selection if current selection is not available for new age/visa
  useEffect(() => {
    if (data.annualSalary && availableSalaryOptions.length > 0 && !availableSalaryOptions.includes(data.annualSalary)) {
      onDataChange("annualSalary", "");
    }
  }, [availableSalaryOptions, data.annualSalary, onDataChange]);

  // Generate salary option labels
  const getSalaryLabel = (option: string): string => {
    // Use translation keys for salary levels
    const translationKey = `salary.level.${option}`;
    return t(translationKey) || option;
  };

  // Generate date options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 80 }, (_, i) => currentYear - 20 - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const dayOptions = (() => {
    if (dateComponents.year && dateComponents.month) {
      const daysInMonth = getDaysInMonth(parseInt(dateComponents.year), parseInt(dateComponents.month));
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }
    return Array.from({ length: 31 }, (_, i) => i + 1);
  })();

  // Get age points
  const getAgePoints = (ageCategory: string) => {
    if (!data.visaType) return 0;
    return agePoints[data.visaType]?.[ageCategory as keyof (typeof agePoints)[VisaType]] || 0;
  };

  // Get salary points
  const getAnnualSalaryPoints = (salary: string) => {
    if (!data.visaType) return 0;
    return annualSalaryPoints[data.visaType]?.[salary as keyof (typeof annualSalaryPoints)[VisaType]] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Age Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.age')}</h3>
        </div>
        
        {/* Birth Date Input */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            {t('form.birthDate.instruction')}
          </p>
          
          <div className="inline-flex items-center gap-2 p-3 border rounded-lg bg-card">
            {/* Year Dropdown */}
            <div className="w-20">
              <Select 
                value={dateComponents.year} 
                onValueChange={(value) => handleDateComponentChange('year', value)}
              >
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
              <Select 
                value={dateComponents.month} 
                onValueChange={(value) => handleDateComponentChange('month', value)}
              >
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
              <Select 
                value={dateComponents.day} 
                onValueChange={(value) => handleDateComponentChange('day', value)}
              >
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
        </div>
        
        {/* Age Categories */}
        <RadioGroup
          value={data.age}
          onValueChange={(value) => onDataChange("age", value)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="29under" id="age-29under" />
            <Label htmlFor="age-29under" className="flex justify-between w-full">
              <span>{t('age.29under')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(getAgePoints('29under'))}
              </Badge>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30to34" id="age-30to34" />
            <Label htmlFor="age-30to34" className="flex justify-between w-full">
              <span>{t('age.30to34')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(getAgePoints('30to34'))}
              </Badge>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="35to39" id="age-35to39" />
            <Label htmlFor="age-35to39" className="flex justify-between w-full">
              <span>{t('age.35to39')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(getAgePoints('35to39'))}
              </Badge>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="40plus" id="age-40plus" />
            <Label htmlFor="age-40plus" className="flex justify-between w-full">
              <span>{t('age.40plus')}</span>
              <Badge variant="outline" className="bg-muted/30 ml-2">
                {fmtPoints(0)}
              </Badge>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Annual Income Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.annualIncome')}</h3>
        </div>
        
        <Alert className="mb-3 bg-amber-50 border-amber-200">
          <Warning className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            <span className="font-medium">{t('income.minimum.title')}</span> {t('income.minimum.description')}
          </AlertDescription>
        </Alert>

        <RadioGroup
          value={data.annualSalary}
          onValueChange={(value) => onDataChange("annualSalary", value)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {availableSalaryOptions.map((option) => {
            const isIneligible = option === 'under3m' || option === 'under10m';
            const isZeroPoints = option === 'under5m' || option === 'under6m' || option === 'under8m';
            const points = getAnnualSalaryPoints(option);
            
            return (
              <div 
                key={option} 
                className={`flex items-center space-x-2 ${isIneligible ? 'opacity-60' : ''}`}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`income-${option}`} 
                  disabled={isIneligible}
                />
                <Label 
                  htmlFor={`income-${option}`} 
                  className={`flex justify-between items-center w-full ${
                    isIneligible ? 'text-muted-foreground/70' : ''
                  }`}
                >
                  <span>{getSalaryLabel(option)}</span>
                  {isIneligible ? (
                    <Badge 
                      variant="outline" 
                      className="bg-pink-50 text-pink-400 border-pink-200 hover:bg-pink-50"
                    >
                      {t('warning.visa.ineligible')}
                    </Badge>
                  ) : isZeroPoints ? (
                    <Badge variant="outline" className="bg-muted/30 ml-2">
                      {fmtPoints(0)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-primary/10 ml-2">
                      {fmtPoints(points)}
                    </Badge>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}