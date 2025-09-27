import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PointsData, researchPoints, visaSpecificBonusPoints, specialPoints, licensePoints } from "@/lib/models";
import { useI18n } from "@/i18n";

interface ResearchLicenseStepProps {
  data: PointsData;
  onDataChange: (field: keyof PointsData, value: string | boolean | number | string[]) => void;
  toggleArrayValue: (field: keyof PointsData, value: string) => void;
}

export function ResearchLicenseStep({ data, onDataChange, toggleArrayValue }: ResearchLicenseStepProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  // Get research points based on visa type
  const getResearchPoints = (research: string) => {
    if (!data.visaType) return 0;
    return researchPoints[data.visaType]?.[research as keyof (typeof researchPoints)[typeof data.visaType]] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Research & Business Position Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">
            {data.visaType === 'business' ? t('business.executive.title') : t('form.researchLicense')}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {data.visaType === 'business' ? t('business.position.title') : t('research.title')}
            </h4>
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
                  checked={data.researchAchievements?.includes('patent_invention') || false}
                  onCheckedChange={(checked) => {
                    const currentAchievements = data.researchAchievements || [];
                    const newAchievements = checked
                      ? [...currentAchievements, 'patent_invention']
                      : currentAchievements.filter(item => item !== 'patent_invention');
                    onDataChange("researchAchievements", newAchievements);
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
                  checked={data.researchAchievements?.includes('official_journal') || false}
                  onCheckedChange={(checked) => {
                    const currentAchievements = data.researchAchievements || [];
                    const newAchievements = checked
                      ? [...currentAchievements, 'official_journal']
                      : currentAchievements.filter(item => item !== 'official_journal');
                    onDataChange("researchAchievements", newAchievements);
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
                  checked={data.researchAchievements?.includes('academic_database') || false}
                  onCheckedChange={(checked) => {
                    const currentAchievements = data.researchAchievements || [];
                    const newAchievements = checked
                      ? [...currentAchievements, 'academic_database']
                      : currentAchievements.filter(item => item !== 'academic_database');
                    onDataChange("researchAchievements", newAchievements);
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
                  checked={data.researchAchievements?.includes('award_research') || false}
                  onCheckedChange={(checked) => {
                    const currentAchievements = data.researchAchievements || [];
                    const newAchievements = checked
                      ? [...currentAchievements, 'award_research']
                      : currentAchievements.filter(item => item !== 'award_research');
                    onDataChange("researchAchievements", newAchievements);
                  }}
                />
                <Label htmlFor="research-award-research" className="flex justify-between w-full">
                  <span className="text-sm">{t('research.awards.detailed')}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(getResearchPoints('award_research'))}</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="research-none"
                  checked={!data.researchAchievements || data.researchAchievements.length === 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onDataChange("researchAchievements", []);
                    }
                  }}
                />
                <Label htmlFor="research-none" className="flex justify-between w-full">
                  <span className="text-sm">{t('common.none')}</span>
                  <Badge variant="outline" className="bg-muted/30 ml-2">{fmtPoints(0)}</Badge>
                </Label>
              </div>
              
              {data.researchAchievements && data.researchAchievements.length >= 2 && (
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
              onValueChange={(value) => onDataChange("businessExecutiveBonus", value === "none" ? "" : value)}
              className="grid grid-cols-1 gap-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="executive_senior" id="executive-senior" />
                <Label htmlFor="executive-senior" className="flex justify-between w-full">
                  <span className="text-sm">{t('business.ceo.label')}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(visaSpecificBonusPoints.business.executive_senior || 0)}</Badge>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="executive_manager" id="executive-manager" />
                <Label htmlFor="executive-manager" className="flex justify-between w-full">
                  <span className="text-sm">{t('business.director.label')}</span>
                  <Badge variant="outline" className="bg-primary/10 ml-2">{fmtPoints(visaSpecificBonusPoints.business.executive_manager || 0)}</Badge>
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
              value={data.researchAchievements && data.researchAchievements.length > 0 ? data.researchAchievements[0] : "none"}
              onValueChange={(value) => onDataChange("researchAchievements", value === "none" ? [] : [value])}
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
        </div>
      </div>

      <Separator />

      {/* Professional Licenses */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mt-4">{t('licenses.title')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="md:col-span-2">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="jp-national-licenses" className="flex items-center justify-between">
                <span>{t('licenses.jpNational')}</span>
              </Label>
              <RadioGroup
                value={data.jpNationalLicenses?.toString() || "0"}
                onValueChange={(value) => onDataChange("jpNationalLicenses", parseInt(value))}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="jp-license-0" />
                  <Label htmlFor="jp-license-0" className="flex items-center gap-2">
                    <span className="text-sm">{t('licenses.option.none')}</span>
                    <Badge variant="outline" className="bg-muted/30">{fmtPoints(0)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="jp-license-1" />
                  <Label htmlFor="jp-license-1" className="flex items-center gap-2">
                    <span className="text-sm">{t('licenses.option.one')}</span>
                    <Badge variant="outline" className="bg-primary/10">{fmtPoints(licensePoints.jp_national_per_license)}</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="jp-license-2" />
                  <Label htmlFor="jp-license-2" className="flex items-center gap-2">
                    <span className="text-sm">{t('licenses.option.two')}</span>
                    <Badge variant="outline" className="bg-primary/10">{fmtPoints(licensePoints.jp_national_per_license * 2)}</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="license-other" 
              checked={data.licenses?.includes('other') || false}
              onCheckedChange={() => toggleArrayValue('licenses', 'other')}
            />
            <Label htmlFor="license-other" className="flex items-center gap-2">
              <span className="text-sm">{t('licenses.otherForeign')}</span>
              <Badge variant="outline" className="bg-primary/10">{fmtPoints(licensePoints.other)}</Badge>
            </Label>
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-muted-foreground mt-4">{t('special.bonus.title')}</h4>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="innovation-bonus" 
              checked={data.innovationBonus || false}
              onCheckedChange={(checked) => onDataChange("innovationBonus", !!checked)}
            />
            <Label htmlFor="innovation-bonus" className="flex justify-between w-full">
              <span className="text-sm">{t('special.bonus.innovation')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(specialPoints.innovation_bonus)}
              </Badge>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="research-cost-bonus"
              checked={data.researchCostBonus || false}
              onCheckedChange={(checked) => onDataChange("researchCostBonus", !!checked)}
            />
            <Label htmlFor="research-cost-bonus" className="flex justify-between w-full">
              <span className="text-sm">{t('special.bonus.researchCost')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(specialPoints.research_cost_bonus)}
              </Badge>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}