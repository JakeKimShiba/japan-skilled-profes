import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { PointsData, VisaType, workExperiencePoints } from "@/lib/models";
import { useI18n } from "@/i18n";

interface ExperienceStepProps {
  data: PointsData;
  onDataChange: (field: keyof PointsData, value: string) => void;
}

export function ExperienceStep({ data, onDataChange }: ExperienceStepProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  // Get work experience points from model
  const getWorkExperiencePoints = (experience: string) => {
    if (!data.visaType) return 0;
    return workExperiencePoints[data.visaType]?.[experience as keyof (typeof workExperiencePoints)[VisaType]] || 0;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-medium">{t('form.experience')}</h3>
      </div>
      
      <RadioGroup
        value={data.workExperience}
        onValueChange={(value) => onDataChange("workExperience", value)}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="10plus" id="work-10plus" />
          <Label htmlFor="work-10plus" className="flex justify-between w-full">
            <span>{t('work.10plus')}</span>
            <Badge variant="outline" className="bg-primary/10 ml-2">
              {fmtPoints(getWorkExperiencePoints('10plus'))}
            </Badge>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="7to10" id="work-7to10" />
          <Label htmlFor="work-7to10" className="flex justify-between w-full">
            <span>{t('work.7to10')}</span>
            <Badge variant="outline" className="bg-primary/10 ml-2">
              {fmtPoints(getWorkExperiencePoints('7to10'))}
            </Badge>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="5to7" id="work-5to7" />
          <Label htmlFor="work-5to7" className="flex justify-between w-full">
            <span>{t('work.5to7')}</span>
            <Badge variant="outline" className="bg-primary/10 ml-2">
              {fmtPoints(getWorkExperiencePoints('5to7'))}
            </Badge>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3to5" id="work-3to5" />
          <Label htmlFor="work-3to5" className="flex justify-between w-full">
            <span>{t('work.3to5')}</span>
            <Badge variant="outline" className="bg-primary/10 ml-2">
              {fmtPoints(getWorkExperiencePoints('3to5'))}
            </Badge>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="under3" id="work-under3" />
          <Label htmlFor="work-under3" className="flex justify-between w-full">
            <span>{t('work.under3')}</span>
            <Badge variant="outline" className="bg-muted/30 ml-2">
              {fmtPoints(0)}
            </Badge>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}