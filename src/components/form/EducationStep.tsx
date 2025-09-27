import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-medium">{t('form.education')}</h3>
      </div>
      <RadioGroup
        value={data.educationLevel}
        onValueChange={(value) => onDataChange("educationLevel", value)}
        className="space-y-2"
      >
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
          <RadioGroupItem value="none" id="education-none" />
          <Label htmlFor="education-none" className="flex justify-between w-full">
            <span>{t('common.none')}</span>
            <Badge variant="outline" className="bg-muted/30 ml-2">
              {fmtPoints(0)}
            </Badge>
          </Label>
        </div>
      </RadioGroup>

      <Separator className="mt-[1cm]" />
      
      {/* University Bonus Section */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.universityBonus')}</h3>
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
    </div>
  );
}