import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/i18n";
import { GlobeSimple } from "@phosphor-icons/react";

export function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <Card className="mb-6 border-none shadow-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between min-w-0">
          <CardTitle className="text-2xl md:text-3xl font-bold flex-1 min-w-0">
            <span className="text-primary">{t('app.title')}</span>
          </CardTitle>
          <div className="ml-4 w-36 flex items-center gap-2 justify-end">
            <GlobeSimple size={16} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
              <SelectTrigger aria-label={t('header.languageLabel')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh-cn">简体中文</SelectItem>
                <SelectItem value="zh-tw">繁體中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription className="text-center max-w-2xl mx-auto space-y-2 text-sm md:text-base">
          <p className="text-foreground/70">{t('app.subtitle')}</p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}