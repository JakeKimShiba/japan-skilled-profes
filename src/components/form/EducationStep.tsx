import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PointsData, VisaType, educationPoints } from "@/lib/models";
import { useI18n } from "@/i18n";
import UniversitySelector from "@/components/UniversitySelector";

interface EducationStepProps {
  data: PointsData;
  onDataChange: (field: keyof PointsData, value: string | boolean) => void;
}

export function EducationStep({ data, onDataChange }: EducationStepProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  // Get education points from model
  const getEducationPoints = (level: string) => {
    if (!data.visaType) return 0;
    return educationPoints[data.visaType]?.[level as keyof (typeof educationPoints)[VisaType]] || 0;
  };

  return (
    <div>
      {/* Academic Background - 기존과 동일한 구조 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.education')}</h3>
        </div>
        <RadioGroup
          value={data.educationLevel}
          onValueChange={(value) => onDataChange("educationLevel", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          {data.visaType === 'business' && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mba" id="mba" />
              <Label htmlFor="mba" className="flex justify-between w-full">
                <span>{t('education.mba')}</span>
                <Badge variant="outline" className="bg-primary/10 ml-2">
                  {fmtPoints(getEducationPoints('mba'))}
                </Badge>
              </Label>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="doctorate" id="doctorate" />
            <Label htmlFor="doctorate" className="flex justify-between w-full">
              <span>{t('education.doctorate')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(getEducationPoints('doctorate'))}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="masters" id="masters" />
            <Label htmlFor="masters" className="flex justify-between w-full">
              <span>{t('education.masters')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(getEducationPoints('masters'))}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bachelors" id="bachelors" />
            <Label htmlFor="bachelors" className="flex justify-between w-full">
              <span>{t('education.bachelors')}</span>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {fmtPoints(getEducationPoints('bachelors'))}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="no-degree" />
            <Label htmlFor="no-degree" className="flex justify-between w-full">
              <span>{t('common.none')}</span>
              <Badge variant="outline" className="bg-muted/30 ml-2">
                {fmtPoints(0)}
              </Badge>
            </Label>
          </div>
        </RadioGroup>

        {/* University Bonus Section - 기존과 동일한 구조 */}
        <div className="mt-4 border-t pt-4">
          <div className="mt-1">
            <div className="mb-2 flex items-center gap-1">
              <div className="font-medium">{t('form.special')}</div>
              <Badge variant="outline" className="bg-primary/10 ml-2">
                {t('university.confirm.badge')}
              </Badge>
            </div>
            <UniversitySelector
              selectedName={data.university}
              onSelect={(opt) => {
                if (opt) {
                  onDataChange("university", opt.name);
                  onDataChange("universityEligible", opt.eligible);
                } else {
                  onDataChange("university", "");
                  onDataChange("universityEligible", false);
                }
              }}
            />
          </div>

          {/* Confirmation checkbox - 기존과 동일 */}
          <div className="mt-3 flex items-center space-x-2">
            <Checkbox
              id="uni-confirm"
              checked={Boolean(data.universityEligible)}
              onCheckedChange={(checked) => {
                const isTrue = checked === true;
                onDataChange("universityEligible", isTrue);
                if (!isTrue) {
                  onDataChange("university", "");
                }
              }}
            />
            <Label htmlFor="uni-confirm" className="flex-1">
              {t('university.confirm.label')}
            </Label>
          </div>
          
          {data.university && (
            <div className="mt-2 text-sm min-w-0">
              <span className="text-muted-foreground">{t('university.selected')}: </span>
              <span className="font-medium truncate">{data.university}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}