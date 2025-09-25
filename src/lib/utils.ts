import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers as JPY currency for display, localized by app locale
export function formatJPY(amount: number, locale?: string) {
  const localeMap: Record<string, string> = {
    'ko': 'ko-KR',
    'ja': 'ja-JP',
    'en': 'en-US',
    'zh-cn': 'zh-CN',
    'zh-tw': 'zh-TW',
  }
  const resolved = locale ? (localeMap[locale] ?? locale) : undefined
  try {
    return new Intl.NumberFormat(resolved, {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    // Fallback simple formatting
    return `¥ ${amount.toLocaleString('en-US')}`
  }
}

// Format amount as units of 10,000 JPY ("man en"), e.g., 3,000,000 -> 300 man
export function formatManEn(amount: number, locale?: string) {
  const units = Math.round(amount / 10000); // 10k JPY units
  const localeMap: Record<string, string> = {
    'ko': 'ko-KR',
    'ja': 'ja-JP',
    'en': 'en-US',
    'zh-cn': 'zh-CN',
    'zh-tw': 'zh-TW',
  };
  const resolved = locale ? (localeMap[locale] ?? locale) : undefined;
  const n = new Intl.NumberFormat(resolved, { maximumFractionDigits: 0 }).format(units);
  const unitLabel = (() => {
    switch ((locale || '').toLowerCase()) {
      case 'ko': return '만 엔';
      case 'ja': return '万円';
      case 'zh-cn': return '万日元';
      case 'zh-tw': return '萬日圓';
      default: return '10k JPY';
    }
  })();
  return `${n} ${unitLabel}`;
}

// English-compact formatter: format amounts as millions of JPY, e.g., 8,000,000 -> "¥8M"
export function formatEnMillionsJPY(amount: number) {
  const millions = amount / 1_000_000;
  // We expect our thresholds to be exact million increments, but format defensively
  const hasFraction = Math.abs(millions - Math.round(millions)) > 1e-6;
  const digits = hasFraction ? 1 : 0;
  const n = new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(millions);
  return `¥${n}M`;
}

// Calculate Korean age (만 나이) from birth date
export function calculateKoreanAge(birthDate: string): number | null {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Check if birth date is valid and not in the future
  if (isNaN(birth.getTime()) || birth > today) {
    return null;
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // If birthday hasn't occurred this year yet, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Convert calculated age to age category for HSP points
export function getAgeCategoryFromAge(age: number): string {
  if (age < 30) return "29under";
  if (age >= 30 && age <= 34) return "30to34";
  if (age >= 35 && age <= 39) return "35to39";
  return "40plus";
}
