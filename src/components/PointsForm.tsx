import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PointsFormProps {
  data: PointsData;
  setData: (data: PointsData) => void;
}

export function PointsForm({ data, setData }: PointsFormProps) {
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

  // Reset annual salary is no longer needed since we only have one visa type
  useEffect(() => {
    // No need to check for visa type anymore
  }, []);

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
              <Label htmlFor="doctorate" className="flex justify-between w-full">
                <span>박사 학위</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">30점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="masters" id="masters" />
              <Label htmlFor="masters" className="flex justify-between w-full">
                <span>석사 학위</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">20점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bachelors" id="bachelors" />
              <Label htmlFor="bachelors" className="flex justify-between w-full">
                <span>학사 학위</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">10점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="no-degree" />
              <Label htmlFor="no-degree" className="flex justify-between w-full">
                <span>해당 없음</span>
                <Badge variant="outline" className="bg-muted/30 ml-2">0점</Badge>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Work Experience */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">직무경력(실무경험)</h3>
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
              <Label htmlFor="work-less3" className="flex justify-between w-full">
                <span>3년 미만</span>
                <Badge variant="outline" className="bg-muted/30 ml-2">0점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3to5" id="work-3to5" />
              <Label htmlFor="work-3to5" className="flex justify-between w-full">
                <span>3년 이상 5년 미만</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">5점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5to7" id="work-5to7" />
              <Label htmlFor="work-5to7" className="flex justify-between w-full">
                <span>5년 이상 7년 미만</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">10점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7to10" id="work-7to10" />
              <Label htmlFor="work-7to10" className="flex justify-between w-full">
                <span>7년 이상 10년 미만</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10plus" id="work-10plus" />
              <Label htmlFor="work-10plus" className="flex justify-between w-full">
                <span>10년 이상</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">20점</Badge>
              </Label>
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
              <Label htmlFor="age-29under" className="flex justify-between w-full">
                <span>29세 이하</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30to34" id="age-30to34" />
              <Label htmlFor="age-30to34" className="flex justify-between w-full">
                <span>30세 ~ 34세</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">10점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="35to39" id="age-35to39" />
              <Label htmlFor="age-35to39" className="flex justify-between w-full">
                <span>35세 ~ 39세</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">5점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="40plus" id="age-40plus" />
              <Label htmlFor="age-40plus" className="flex justify-between w-full">
                <span>40세 이상</span>
                <Badge variant="outline" className="bg-muted/30 ml-2">0점</Badge>
              </Label>
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
              <RadioGroupItem value="under3m" id="salary-under3m" />
              <Label htmlFor="salary-under3m" className="flex justify-between w-full">
                <span>3백만 엔 미만</span>
                <Badge variant="outline" className="bg-muted/30 ml-2">0점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3to4m" id="salary-3to4m" />
              <Label htmlFor="salary-3to4m" className="flex justify-between w-full">
                <span>3백만 엔 ~ 4백만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">10점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4to5m" id="salary-4to5m" />
              <Label htmlFor="salary-4to5m" className="flex justify-between w-full">
                <span>4백만 엔 ~ 5백만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">20점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5to7m" id="salary-5to7m" />
              <Label htmlFor="salary-5to7m" className="flex justify-between w-full">
                <span>5백만 엔 ~ 7백만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">30점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7to8m" id="salary-7to8m" />
              <Label htmlFor="salary-7to8m" className="flex justify-between w-full">
                <span>7백만 엔 ~ 8백만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">40점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="8to10m" id="salary-8to10m" />
              <Label htmlFor="salary-8to10m" className="flex justify-between w-full">
                <span>8백만 엔 ~ 1천만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">40점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10to15m" id="salary-10to15m" />
              <Label htmlFor="salary-10to15m" className="flex justify-between w-full">
                <span>1천만 엔 ~ 1천5백만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">50점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="15to20m" id="salary-15to20m" />
              <Label htmlFor="salary-15to20m" className="flex justify-between w-full">
                <span>1천5백만 엔 ~ 2천만 엔</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">70점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="20mplus" id="salary-20mplus" />
              <Label htmlFor="salary-20mplus" className="flex justify-between w-full">
                <span>2천만 엔 이상</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">80점</Badge>
              </Label>
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
                  <p>연구 실적은 한 가지만 선택 가능합니다.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">연구 실적</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground text-xs ml-2" size={14} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>하나의 항목만 선택 가능합니다.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <RadioGroup
              value={data.researchAchievements.length > 0 ? data.researchAchievements[0] : "none"}
              onValueChange={(value) => handleChange("researchAchievements", value === "none" ? [] : [value])}
              className="grid grid-cols-1 gap-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patents" id="research-patents" />
                <Label htmlFor="research-patents" className="flex justify-between w-full">
                  <span className="text-sm">특허 발명 1건 이상</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="research" id="research-projects" />
                <Label htmlFor="research-projects" className="flex justify-between w-full">
                  <span className="text-sm">입국 전에 공식 기관에서 인정받은 연구에 종사했던 실적 3건 이상</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="papers" id="research-papers" />
                <Label htmlFor="research-papers" className="flex justify-between w-full">
                  <span className="text-sm">연구논문 실적에 대해선 일본의 국가 기관에서 이용되고 있는 학술 논문 데이터 베이스에 등록되어 있는 학술 잡지에 게재되어 있는 논문 (신청인이 책임 저자[제 1저자]일 경우에 한함) 3건 이상</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="awards" id="research-awards" />
                <Label htmlFor="research-awards" className="flex justify-between w-full">
                  <span className="text-sm">상기의 항목 이외에 상기 항목에 비교해 동등한 연구 실적이 있는 신청자가 어필하는 경우 (저명한 상의 수상이력 등) 관련 행정기관장의 의견을 들은 곳에서 법무대신이 개별로 포인트 부여 여부를 판단함.</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="research-none" />
                <Label htmlFor="research-none" className="flex justify-between w-full">
                  <span className="text-sm">해당 없음</span>
                  <Badge variant="outline" className="bg-muted/30 ml-2">0점</Badge>
                </Label>
              </div>
            </RadioGroup>
            
            <h4 className="text-sm font-medium text-muted-foreground mt-4">자격증</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="license-national" 
                  checked={data.licenses.includes('national')}
                  onCheckedChange={() => toggleArrayValue('licenses', 'national')}
                />
                <Label htmlFor="license-national" className="flex justify-between w-full">
                  <span>국가 공인 자격증</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">20점</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="license-other" 
                  checked={data.licenses.includes('other')}
                  onCheckedChange={() => toggleArrayValue('licenses', 'other')}
                />
                <Label htmlFor="license-other" className="flex justify-between w-full">
                  <span>기타 자격증</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">5점</Badge>
                </Label>
              </div>
              <div className="md:col-span-2 mt-3">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="jp-national-licenses" className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>직무에 관련한 일본의 국가자격증</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="text-muted-foreground" size={16} />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px]">
                            <p>보유하신 일본 국가자격증의 개수를 선택하세요. (1개 - 5점, 최대 2개)</p>
                            <p className="mt-2">한국의 정보처리기사/정보처리산업기사 자격증도 일본에서 인정되어 최대 5점을 취득할 수 있습니다.</p>
                            <p className="mt-2">
                              <a 
                                href="https://www.moj.go.jp/isa/publications/materials/nyuukokukanri07_00127.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                일본 국가자격증 목록 확인하기
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
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">없음</SelectItem>
                      <SelectItem value="1">1개 보유 (5점)</SelectItem>
                      <SelectItem value="2">2개 보유 (10점)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <RadioGroupItem value="n1" id="japanese-n1" />
              <Label htmlFor="japanese-n1" className="flex justify-between w-full">
                <span>JLPT 1급</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">15점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="n2" id="japanese-n2" />
              <Label htmlFor="japanese-n2" className="flex justify-between w-full">
                <span>JLPT 2급</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">10점</Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="japanese-none" />
              <Label htmlFor="japanese-none" className="flex justify-between w-full">
                <span>없음</span>
                <Badge variant="outline" className="bg-muted/30 ml-2">0점</Badge>
              </Label>
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
              <Label htmlFor="japanese-education" className="flex justify-between w-full">
                <span>일본 교육기관 졸업</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">10점</Badge>
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}