import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PointsData } from "@/lib/models";
import { Info } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PointsFormProps {
  data: PointsData;
  setData: (data: PointsData) => void;
}

export function PointsForm({ data, setData }: PointsFormProps) {
  const handleChange = (field: keyof PointsData, value: string | boolean | string[]) => {
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-primary">입력 사항</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Academic Background */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">학력</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground" size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>최종 학위 또는 전문 학위를 선택하세요.</p>
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
              <Label htmlFor="doctorate">박사 학위</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masters" id="masters" />
              <Label htmlFor="masters">석사 학위</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional">전문학위 (법학, 의학 등)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bachelors" id="bachelors" />
              <Label htmlFor="bachelors">학사 학위</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="no-degree" />
              <Label htmlFor="no-degree">해당 없음</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Work Experience */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">경력 (전문 분야)</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground" size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>관련 전문 분야에서의 경력 기간을 선택하세요.</p>
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
              <Label htmlFor="work-less3">3년 미만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3to5" id="work-3to5" />
              <Label htmlFor="work-3to5">3년 이상 5년 미만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5to7" id="work-5to7" />
              <Label htmlFor="work-5to7">5년 이상 7년 미만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7to10" id="work-7to10" />
              <Label htmlFor="work-7to10">7년 이상 10년 미만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10to15" id="work-10to15" />
              <Label htmlFor="work-10to15">10년 이상 15년 미만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="15plus" id="work-15plus" />
              <Label htmlFor="work-15plus">15년 이상</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Age */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">나이</h3>
          </div>
          <RadioGroup
            value={data.age}
            onValueChange={(value) => handleChange("age", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="29under" id="age-29under" />
              <Label htmlFor="age-29under">29세 이하</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30to34" id="age-30to34" />
              <Label htmlFor="age-30to34">30세 ~ 34세</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="35to39" id="age-35to39" />
              <Label htmlFor="age-35to39">35세 ~ 39세</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="40plus" id="age-40plus" />
              <Label htmlFor="age-40plus">40세 이상</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Annual Salary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">연간 급여 (일본 엔)</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground" size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>일본 취업 시 예상되는 연간 급여를 선택하세요.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup
            value={data.annualSalary}
            onValueChange={(value) => handleChange("annualSalary", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3m" id="salary-3m" />
              <Label htmlFor="salary-3m">3백만 엔 미만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3to4m" id="salary-3to4m" />
              <Label htmlFor="salary-3to4m">3백만 엔 ~ 4백만 엔</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4to5m" id="salary-4to5m" />
              <Label htmlFor="salary-4to5m">4백만 엔 ~ 5백만 엔</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5to7m" id="salary-5to7m" />
              <Label htmlFor="salary-5to7m">5백만 엔 ~ 7백만 엔</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7to8m" id="salary-7to8m" />
              <Label htmlFor="salary-7to8m">7백만 엔 ~ 8백만 엔</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="8to10m" id="salary-8to10m" />
              <Label htmlFor="salary-8to10m">8백만 엔 ~ 1천만 엔</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10to15m" id="salary-10to15m" />
              <Label htmlFor="salary-10to15m">1천만 엔 ~ 1천5백만 엔</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="15mplus" id="salary-15mplus" />
              <Label htmlFor="salary-15mplus">1천5백만 엔 이상</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Qualifications and Achievements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">연구 실적 및 자격증</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground" size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>해당되는 항목을 모두 선택하세요. (중복 가능)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">연구 실적</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="research-patents" 
                  checked={data.researchAchievements.includes('patents')}
                  onCheckedChange={() => toggleArrayValue('researchAchievements', 'patents')}
                />
                <Label htmlFor="research-patents">특허 보유</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="research-papers" 
                  checked={data.researchAchievements.includes('papers')}
                  onCheckedChange={() => toggleArrayValue('researchAchievements', 'papers')}
                />
                <Label htmlFor="research-papers">연구 논문 발표</Label>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-muted-foreground mt-4">자격증</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="license-national" 
                  checked={data.licenses.includes('national')}
                  onCheckedChange={() => toggleArrayValue('licenses', 'national')}
                />
                <Label htmlFor="license-national">국가 공인 자격증</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="license-other" 
                  checked={data.licenses.includes('other')}
                  onCheckedChange={() => toggleArrayValue('licenses', 'other')}
                />
                <Label htmlFor="license-other">기타 자격증</Label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Language Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">언어 능력</h3>
          </div>
          
          <h4 className="text-sm font-medium text-muted-foreground mb-2">일본어 능력</h4>
          <RadioGroup
            value={data.japaneseLanguage}
            onValueChange={(value) => handleChange("japaneseLanguage", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="japanese-advanced" />
              <Label htmlFor="japanese-advanced">고급 (N1 수준)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="japanese-business" />
              <Label htmlFor="japanese-business">비즈니스 (N2 수준)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="japanese-daily" />
              <Label htmlFor="japanese-daily">일상회화 (N3, N4 수준)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="japanese-none" />
              <Label htmlFor="japanese-none">없음</Label>
            </div>
          </RadioGroup>
          
          <h4 className="text-sm font-medium text-muted-foreground mb-2">외국어 능력 (모국어, 일본어 외)</h4>
          <RadioGroup
            value={data.foreignLanguage}
            onValueChange={(value) => handleChange("foreignLanguage", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="foreign-business" />
              <Label htmlFor="foreign-business">비즈니스 수준</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="foreign-none" />
              <Label htmlFor="foreign-none">해당 없음</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Special Additions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">특별 가산 항목</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="japanese-education" 
                checked={data.japaneseEducation}
                onCheckedChange={(checked) => handleChange("japaneseEducation", !!checked)}
              />
              <Label htmlFor="japanese-education">일본 교육기관 졸업</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="innovative-project" 
                checked={data.innovativeProject}
                onCheckedChange={(checked) => handleChange("innovativeProject", !!checked)}
              />
              <Label htmlFor="innovative-project">일본 정부 지정 혁신 프로젝트 참여</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}