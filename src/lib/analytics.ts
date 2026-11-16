type GtagArguments =
  | ['js', Date]
  | ['set', Record<string, unknown>]
  | ['config', string, Record<string, unknown>]
  | ['event', string, Record<string, unknown>?];

declare global {
  interface Window {
    gtag?: (...args: GtagArguments) => void;
    dataLayer?: unknown[];
  }
}

function sanitizeUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    url.search = '';
    url.hash = '';
    url.username = '';
    url.password = '';
    return url.href;
  } catch {
    return '';
  }
}

function getPageContext(path?: string) {
  let pageLocation = sanitizeUrl(window.location.href);
  if (path) {
    try {
      pageLocation = sanitizeUrl(new URL(path, window.location.href).href) || pageLocation;
    } catch {
      // Invalid overrides must not fall back to the unfiltered document URL.
    }
  }
  return {
    page_location: pageLocation,
    page_path: new URL(pageLocation).pathname,
    page_referrer: sanitizeUrl(document.referrer),
  };
}

// Lightweight GA4 loader. Enabled only when VITE_GA_MEASUREMENT_ID is defined.
export function initAnalytics() {
  // Only initialize in production builds
  if (!import.meta.env.PROD) return;
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!id) return;

  // Avoid double-injection
  if (document.getElementById('ga4-gtag')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    // eslint-disable-next-line prefer-rest-params -- Preserve the Google tag's Arguments-based queue format.
    window.dataLayer!.push(arguments);
  };
  const context = getPageContext();
  // Queue sanitized defaults before the tag can emit its first automatic event.
  window.gtag('set', context);
  window.gtag('js', new Date());
  window.gtag('config', id, { ...context, send_page_view: true });

  const gtagScript = document.createElement('script');
  gtagScript.id = 'ga4-gtag';
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(gtagScript);
}

export function trackPageView(path?: string) {
  sendEvent('page_view', undefined, path);
}

function sendEvent(eventName: string, params?: object, path?: string) {
  if (!import.meta.env.PROD) return;
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, { ...params, ...getPageContext(path) });
  }
}

export function trackEvent(eventName: string, params?: object) {
  sendEvent(eventName, params);
}

// Analytics event types
export interface StepCompletedParams {
  step_number: number;
  step_name: 'education' | 'experience' | 'age_income' | 'research_license' | 'language_special';
  visa_type: 'technical' | 'academic' | 'business';
}

export interface FieldChangedParams {
  field_name: string;
  field_value: any;
  step_number: number;
  visa_type?: 'technical' | 'academic' | 'business';
}

export interface CalculationCompletedParams {
  total_points: number;
  qualified: boolean;
  expedited: boolean;
  visa_type: 'technical' | 'academic' | 'business';
  education_level?: string;
  work_experience?: string;
  age_category?: string;
  salary_range?: string;
  has_university_bonus?: boolean;
  language_ability?: string;
}

// Helper functions for specific events
export function trackStepCompleted(params: StepCompletedParams) {
  trackEvent('step_completed', params);
}

export function trackFieldChanged(params: FieldChangedParams) {
  trackEvent('field_changed', params);
}

export function trackCalculationCompleted(params: CalculationCompletedParams) {
  trackEvent('calculation_completed', params);
}

export function trackVisaTypeSelected(visaType: 'technical' | 'academic' | 'business') {
  trackEvent('visa_type_selected', { visa_type: visaType });
}
