// Lightweight GA4 loader. Enabled only when VITE_GA_MEASUREMENT_ID is defined.
export function initAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!id) return;

  // Avoid double-injection
  if (document.getElementById('ga4-gtag')) return;

  // gtag script
  const gtagScript = document.createElement('script');
  gtagScript.id = 'ga4-gtag';
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(gtagScript);

  // gtag config
  const inline = document.createElement('script');
  inline.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}', { send_page_view: true });
  `;
  document.head.appendChild(inline);
}

export function trackPageView(path?: string) {
  // @ts-ignore - gtag may exist at runtime only
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', 'page_view', path ? { page_path: path } : undefined);
  }
}
