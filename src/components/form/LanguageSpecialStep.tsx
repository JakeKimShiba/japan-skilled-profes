import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PointsData, isN2Equivalent } from "@/lib/models";
import { useI18n } from "@/i18n";

interface LanguageSpecialStepProps {
  data: PointsData;
  onDataChange: (field: keyof PointsData, value: string | boolean) => void;
}

export function LanguageSpecialStep({ data, onDataChange }: LanguageSpecialStepProps) {
  const { t } = useI18n();
  const fmtPoints = (n: number) => t('points.value', { value: n });

  const n2Equivalent = isN2Equivalent(data.japaneseLanguage);

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
            <RadioGroupItem value="bjt400" id="japanese-bjt400" />
            <Label htmlFor="japanese-bjt400" className="flex justify-between w-full">
              <span>{t('language.bjt400')}</span>
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
              disabled={n2Equivalent}
              onCheckedChange={(checked) => onDataChange("japaneseEducation", !!checked)}
            />
            <Label 
              htmlFor="japanese-education" 
              className={`flex justify-between w-full ${n2Equivalent ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{t('special.japaneseEducation')}</span>
              <Badge variant="outline" className={`ml-2 ${n2Equivalent ? 'bg-muted/30' : 'bg-primary/10'}`}>
                {fmtPoints(10)}
              </Badge>
            </Label>
          </div>
          {n2Equivalent && (
            <div className="ml-6 text-xs text-muted-foreground">
              {t('special.japaneseEducation.n2Restriction')}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}