import { PointsData, VisaType } from './models';

// Short key mapping for URL parameters
const KEY_MAP: Record<string, keyof PointsData> = {
  v: 'visaType',
  e: 'educationLevel',
  w: 'workExperience',
  a: 'age',
  s: 'annualSalary',
  j: 'japaneseLanguage',
  u: 'university',
  ue: 'universityEligible',
  je: 'japaneseEducation',
  ib: 'innovationBonus',
  rc: 'researchCostBonus',
  ar: 'academicResearchBonus',
  be: 'businessExecutiveBonus',
  cr: 'contractResearchBonus',
  inf: 'innovativeFieldBonus',
  nl: 'jpNationalLicenses',
  ra: 'researchAchievements',
  li: 'licenses',
};

// Reverse mapping: field name → short key
const REVERSE_KEY_MAP: Record<string, string> = {};
for (const [short, full] of Object.entries(KEY_MAP)) {
  REVERSE_KEY_MAP[full] = short;
}

// Fields to skip when they have default/empty values
const DEFAULT_VALUES: Record<string, unknown> = {
  visaType: null,
  educationLevel: '',
  workExperience: '',
  age: '',
  annualSalary: '',
  japaneseLanguage: 'none',
  university: '',
  universityEligible: false,
  japaneseEducation: false,
  innovationBonus: false,
  researchCostBonus: false,
  academicResearchBonus: false,
  businessExecutiveBonus: 'none',
  contractResearchBonus: false,
  innovativeFieldBonus: false,
  jpNationalLicenses: 0,
};

/**
 * Encode PointsData into URL search params string.
 * Only includes non-default values to keep URLs short.
 */
export function encodePointsData(data: PointsData): string {
  const params = new URLSearchParams();

  for (const [shortKey, fieldName] of Object.entries(KEY_MAP)) {
    const value = data[fieldName];
    const defaultVal = DEFAULT_VALUES[fieldName];

    // Skip default values
    if (value === defaultVal) continue;
    if (value === undefined || value === null) continue;

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      params.set(shortKey, value.join(','));
      continue;
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      if (!value) continue;
      params.set(shortKey, '1');
      continue;
    }

    // Handle numbers
    if (typeof value === 'number') {
      if (value === 0) continue;
      params.set(shortKey, String(value));
      continue;
    }

    // Handle strings
    if (typeof value === 'string' && value !== '' && value !== 'none') {
      params.set(shortKey, value);
    }
  }

  return params.toString();
}

/**
 * Decode URL search params back into a partial PointsData.
 * Returns null if no share params are found.
 */
export function decodePointsData(search: string): PointsData | null {
  const params = new URLSearchParams(search);

  // Check if there's at least a visa type — minimum for a valid share link
  if (!params.has('v')) return null;

  const data: PointsData = {
    visaType: null,
    educationLevel: '',
    workExperience: '',
    age: '',
    annualSalary: '',
    researchAchievements: [],
    licenses: [],
    jpNationalLicenses: 0,
    innovationBonus: false,
    researchCostBonus: false,
    academicResearchBonus: false,
    businessExecutiveBonus: 'none',
    contractResearchBonus: false,
    innovativeFieldBonus: false,
    japaneseLanguage: 'none',
    japaneseEducation: false,
    university: '',
    universityEligible: false,
  };

  for (const [shortKey, fieldName] of Object.entries(KEY_MAP)) {
    const raw = params.get(shortKey);
    if (raw === null) continue;

    switch (fieldName) {
      case 'visaType':
        if (['academic', 'technical', 'business'].includes(raw)) {
          data.visaType = raw as VisaType;
        }
        break;

      case 'researchAchievements':
      case 'licenses':
        (data[fieldName] as string[]) = raw.split(',').filter(Boolean);
        break;

      case 'universityEligible':
      case 'japaneseEducation':
      case 'innovationBonus':
      case 'researchCostBonus':
      case 'academicResearchBonus':
      case 'contractResearchBonus':
      case 'innovativeFieldBonus':
        (data[fieldName] as boolean) = raw === '1';
        break;

      case 'jpNationalLicenses':
        data.jpNationalLicenses = parseInt(raw, 10) || 0;
        break;

      default:
        // String fields
        (data[fieldName] as string) = raw;
        break;
    }
  }

  return data;
}

/**
 * Build a full shareable URL from current PointsData.
 */
export function buildShareUrl(data: PointsData): string {
  const encoded = encodePointsData(data);
  const base = window.location.origin + window.location.pathname;
  return encoded ? `${base}?${encoded}` : base;
}
