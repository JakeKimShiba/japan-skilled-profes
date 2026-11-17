import { useI18n } from '@/i18n';
import { guideSources } from '@/lib/guide-sources';

export function GuideSources({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  return (
    <aside lang={locale} className="my-6 rounded-lg border p-4 text-sm space-y-2" aria-label={t('guide.sources')}>
      <p className="font-semibold">{t('guide.sources')}</p>
      <ul className="list-disc pl-5">
        {guideSources(slug).map(source => (
          <li key={source.key}><a className="text-primary underline" href={source.href} target="_blank" rel="noopener noreferrer">{t(`guide.source.${source.key}`)}</a></li>
        ))}
      </ul>
      <p className="text-muted-foreground">{t('guide.scope')}</p>
      <p className="text-muted-foreground">{t('guide.responsibility')}</p>
    </aside>
  );
}
