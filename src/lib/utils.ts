import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers as JPY currency for display, localized by app locale
export function formatJPY(amount: number, locale?: string) {
  const localeMap: Record<string, string> = {
    'ko': 'ko-KR',
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
