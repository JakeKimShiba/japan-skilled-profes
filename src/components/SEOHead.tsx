import { useEffect } from "react";
import { useI18n, type Locale } from "@/i18n";
import { canonicalUrl, languageAlternates } from "@/lib/seo";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>[];
  locale?: Locale;
}

export function SEOHead({ title, description, path, type = 'website', jsonLd, locale: pageLocale }: SEOHeadProps) {
  const { locale: selectedLocale } = useI18n();
  const locale = pageLocale ?? selectedLocale;
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const fullUrl = canonicalUrl(path, locale);

    setMeta("title", title);
    setMeta("description", description);
    setMeta("og:type", type, "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", fullUrl, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:url", fullUrl);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    languageAlternates(path).forEach(alternate => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alternate.locale;
      link.href = alternate.href;
      document.head.appendChild(link);
    });

    const existingScripts = document.querySelectorAll('script[data-page-jsonld], script[data-guide-jsonld]');
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      jsonLd.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-page-jsonld", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('script[data-page-jsonld], script[data-guide-jsonld]').forEach((s) => s.remove());
    };
  }, [title, description, path, type, jsonLd, locale]);

  return null;
}
