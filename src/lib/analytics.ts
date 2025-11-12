// Lightweight GA4 loader. Enabled only when VITE_GA_MEASUREMENT_ID is defined.
export function initAnalytics() {
  // Only initialize in production builds
  if (!import.meta.env.PROD) return;
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

export function trackEvent(eventName: string, params?: Record<string, any>) {
  // Only track in production, and if gtag exists
  if (!import.meta.env.PROD) return;
  // @ts-ignore - gtag may exist at runtime only
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', eventName, params);
  }
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
