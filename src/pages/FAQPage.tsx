import { FAQ } from "@/components/FAQ";
import { SEOHead } from "@/components/SEOHead";
import { useI18n } from "@/i18n";

export function FAQPage() {
  const { t } = useI18n();
  return (
    <>
      <SEOHead
        title={`${t('tabs.faq')} | kodocalc.com`}
        description={t('faq.subtitle')}
        path="/guide/faq"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('tabs.faq')}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>
        <FAQ />
      </div>
    </>
  );
}
