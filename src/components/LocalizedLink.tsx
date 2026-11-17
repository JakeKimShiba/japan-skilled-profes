import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { useI18n, type Locale } from '@/i18n';
import { contentLocale, localizedPath } from '@/lib/seo';

type Props = Omit<ComponentProps<typeof Link>, 'to'> & { to: string; locale?: Locale };

export function LocalizedLink({ to, locale: requested, onClick, ...props }: Props) {
  const { locale, setLocale } = useI18n();
  const targetLocale = contentLocale(to, requested ?? locale);
  return (
    <Link
      {...props}
      to={localizedPath(to, targetLocale)}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          setLocale(targetLocale);
        }
      }}
    />
  );
}
