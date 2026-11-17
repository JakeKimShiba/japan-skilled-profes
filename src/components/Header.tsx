import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/i18n";
import { GlobeSimple } from "@phosphor-icons/react/dist/ssr/GlobeSimple";
import { useLocation } from "react-router-dom";
import { LANGUAGE_NAMES, localizedPath, pageLocales } from "@/lib/seo";
import type { Locale } from "@/i18n";

export function Header({ primaryTitle = false }: { primaryTitle?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const Title = primaryTitle ? 'h1' : 'span';
  const languageHref = (language: Locale) => localizedPath(
    `${window.location.pathname}${window.location.search}${window.location.hash}`, language,
  );

  return (
    <Card className="mb-6 border-none shadow-md">
      <CardHeader className="text-center">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between min-w-0">
          <CardTitle className={`text-2xl md:text-3xl font-bold flex-1 min-w-0 ${locale === 'ko' ? 'break-keep text-balance' : ''}`}>
            <Title className="text-primary">{t('app.title')}</Title>
          </CardTitle>
          {/* Mobile: place below title and right-align; Desktop: stay on the right */}
          <div className="mt-3 md:mt-0 ml-auto md:ml-4 w-36 flex items-center gap-2 self-end md:self-auto md:justify-end">
            <GlobeSimple size={16} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
              <SelectTrigger aria-label={t('header.languageLabel')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
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
        <nav aria-label={t('header.languageLabel')} className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {pageLocales(location.pathname).map(language => (
            <a key={language} href={languageHref(language)} hrefLang={language} lang={language}
              aria-current={language === locale ? 'page' : undefined}
              className="underline underline-offset-2 hover:text-primary"
              onClick={event => {
                event.currentTarget.href = languageHref(language);
                if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                  event.preventDefault();
                  setLocale(language);
                }
              }}
              onAuxClick={event => { event.currentTarget.href = languageHref(language); }}
            >{LANGUAGE_NAMES[language]}</a>
          ))}
        </nav>
      </CardHeader>
    </Card>
  );
}