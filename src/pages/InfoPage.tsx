import { InfoPanel } from "@/components/InfoPanel";
import { SEOHead } from "@/components/SEOHead";
import { useI18n } from "@/i18n";

export function InfoPage() {
  const { t } = useI18n();
  return (
    <>
      <SEOHead
        title={`${t('tabs.info')} | kodocalc.com`}
        description={t('guide.index.info.desc')}
        path="/guide/info"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('tabs.info')}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {t('guide.index.info.desc')}
          </p>
        </div>
        <InfoPanel />
      </div>
    </>
  );
}
