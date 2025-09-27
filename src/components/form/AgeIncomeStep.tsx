import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PointsData, VisaType, agePoints, annualSalaryPoints } from "@/lib/models";
import { useI18n } from "@/i18n";
import { formatEnMillionsJPY, formatManEn } from "@/lib/utils";

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

  // Update birth date when components change
  useEffect(() => {
    const { year, month, day } = dateComponents;
    if (year && month && day) {
      const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onDataChange("birthDate", birthDate);
      
      // Auto-calculate age category
      const age = calculateKoreanAge(birthDate);
      if (age !== null) {
        let ageCategory = '';
        if (age <= 29) ageCategory = '29under';
        else if (age <= 34) ageCategory = '30to34';
        else if (age <= 39) ageCategory = '35to39';
        else ageCategory = '40plus';
        
        onDataChange("age", ageCategory);
      }
    }
  }, [dateComponents, onDataChange]);

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
      {/* Birth Date Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.birthDate')}</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="birth-year">{t('form.birthDate.year')}</Label>
            <Select
              value={dateComponents.year}
              onValueChange={(value) => setDateComponents(prev => ({...prev, year: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.birthDate.yearPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="birth-month">{t('form.birthDate.month')}</Label>
            <Select
              value={dateComponents.month}
              onValueChange={(value) => setDateComponents(prev => ({...prev, month: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.birthDate.monthPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(month => (
                  <SelectItem key={month} value={month.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="birth-day">{t('form.birthDate.day')}</Label>
            <Select
              value={dateComponents.day}
              onValueChange={(value) => setDateComponents(prev => ({...prev, day: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.birthDate.dayPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map(day => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Age Display */}
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
          }
          return null;
        })()}
      </div>

      <Separator />

      {/* Age Categories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.age')}</h3>
        </div>
        
        <RadioGroup
          value={data.age}
          onValueChange={(value) => onDataChange("age", value)}
          className="space-y-2"
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
        
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
          <p className="text-xs text-amber-700">
            <span className="font-medium">{t('income.minimum.title')}</span> {t('income.minimum.description')}
          </p>
        </div>

        <RadioGroup
          value={data.annualSalary}
          onValueChange={(value) => onDataChange("annualSalary", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          {/* Income options vary by visa type */}
          {data.visaType === 'business' ? (
            <>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10m" id="income-10m" />
                <Label htmlFor="income-10m" className="flex justify-between w-full">
                  <span>{t('income.atLeast', { 
                    amount: locale === 'en' ? formatEnMillionsJPY(10000000) : formatManEn(10000000, locale) 
                  })}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">
                    {fmtPoints(getAnnualSalaryPoints('10m'))}
                  </Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15m" id="income-15m" />
                <Label htmlFor="income-15m" className="flex justify-between w-full">
                  <span>{t('income.atLeast', { 
                    amount: locale === 'en' ? formatEnMillionsJPY(15000000) : formatManEn(15000000, locale) 
                  })}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">
                    {fmtPoints(getAnnualSalaryPoints('15m'))}
                  </Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="20m" id="income-20m" />
                <Label htmlFor="income-20m" className="flex justify-between w-full">
                  <span>{t('income.atLeast', { 
                    amount: locale === 'en' ? formatEnMillionsJPY(20000000) : formatManEn(20000000, locale) 
                  })}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">
                    {fmtPoints(getAnnualSalaryPoints('20m'))}
                  </Badge>
                </Label>
              </div>
            </>
          ) : (
            <>
              {/* Technical/Academic visa income options */}
              {(data.age === "29under" || data.age === "30to34") && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4m" id="income-4m" />
                  <Label htmlFor="income-4m" className="flex justify-between w-full">
                    <span>{t('income.atLeast', { 
                      amount: locale === 'en' ? formatEnMillionsJPY(4000000) : formatManEn(4000000, locale) 
                    })}</span>
                    <Badge variant="outline" className="bg-primary/10 ml-2">
                      {fmtPoints(getAnnualSalaryPoints('4m'))}
                    </Badge>
                  </Label>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5m" id="income-5m" />
                <Label htmlFor="income-5m" className="flex justify-between w-full">
                  <span>{t('income.atLeast', { 
                    amount: locale === 'en' ? formatEnMillionsJPY(5000000) : formatManEn(5000000, locale) 
                  })}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">
                    {fmtPoints(getAnnualSalaryPoints('5m'))}
                  </Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6m" id="income-6m" />
                <Label htmlFor="income-6m" className="flex justify-between w-full">
                  <span>{t('income.atLeast', { 
                    amount: locale === 'en' ? formatEnMillionsJPY(6000000) : formatManEn(6000000, locale) 
                  })}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">
                    {fmtPoints(getAnnualSalaryPoints('6m'))}
                  </Badge>
                </Label>
              </div>
            </>
          )}
        </RadioGroup>
      </div>
    </div>
  );
}