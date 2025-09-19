import { useI18n } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function InfoPanel() {
  const { t } = useI18n();

  return (
    <Card className="mb-6 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{t('info.title', { visa: t('visa.type') })}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>{t('info.intro')}</p>

        <p className="mt-2 text-primary-foreground bg-primary/80 p-2 rounded-md">{t('info.notice', { visa: t('visa.type') })}</p>

        <p>{t('info.description')}</p>

        <Separator className="my-3" />

        <div className="space-y-2">
          <h3 className="font-medium">{t('info.benefits.title')}</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('info.benefits.multiActivity')}</li>
            <li>{t('info.benefits.fiveYears')}</li>
            <li>{t('info.benefits.spouseWork')}</li>
            <li>{t('info.benefits.parentVisit')}</li>
            <li>{t('info.benefits.housekeeping')}</li>
            <li>
              {t('info.benefits.prShorter')}
              <ul className="list-disc pl-5 text-xs mt-1 space-y-1">
                <li>{t('info.benefits.pr70')}</li>
                <li>{t('info.benefits.pr80')}</li>
              </ul>
            </li>
          </ul>
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <h3 className="font-medium">{t('info.categories.title')}</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('info.categories.education')}</li>
            <li>{t('info.categories.career')}</li>
            <li>{t('info.categories.salary')}</li>
            <li>{t('info.categories.age')}</li>
            <li>{t('info.categories.research')}</li>
            <li>{t('info.categories.language')}</li>
            <li>{t('info.categories.special')}</li>
          </ul>
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <h3 className="font-medium">{t('info.pr.title')}</h3>
          <p>{t('info.pr.description')}</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>{t('info.pr.rule70')}</li>
            <li>{t('info.pr.rule80')}</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">{t('info.pr.note')}</p>
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <h3 className="font-medium">{t('info.license.title')}</h3>
          <p>{t('info.license.jpNational')}</p>
          <p>{t('info.license.krAccepted')}</p>
          <p className="mt-2">
            <a
              href="https://www.moj.go.jp/isa/policies/bill/nyukan_hourei_h09.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {t('info.license.linkText')}
            </a>
          </p>
        </div>

        <Separator className="my-3" />

        <p className="text-muted-foreground text-xs">
          {t('info.disclaimer')}
          <a
            href="https://www.moj.go.jp/isa/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline ml-1"
          >
            {t('info.disclaimer.link')}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}