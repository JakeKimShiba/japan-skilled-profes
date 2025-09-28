import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PointsData, VisaType, languagePoints } from "@/lib/models";
import { useI18n } from "@/i18n";

interface LanguageSpecialStepProps {
  data: PointsData;
  onDataChange: (field: keyof PointsData, value: string | boolean) => void;
}

export function LanguageSpecialStep({ data, onDataChange }: LanguageSpecialStepProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  // Get language points (simplified for now)
  const getLanguagePoints = (level: string) => {
    // Return static values for now - will be replaced with proper calculation
    switch(level) {
      case 'n1': return 15;
      case 'n2': return 10;
      case 'bju': return 15;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Japanese Language */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium">{t('form.language')}</h3>
        </div>
        
        <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('language.japanese')}</h4>
        <RadioGroup
          value={data.japaneseLanguage}
          onValueChange={(value) => onDataChange("japaneseLanguage", value)}
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
              onCheckedChange={(checked) => onDataChange("japaneseEducation", !!checked)}
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
  );
}