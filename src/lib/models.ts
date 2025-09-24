// Point calculation models for the Highly Skilled Professional visa

export type VisaType = 'academic' | 'technical' | 'business';

export interface PointsData {
  // Visa Type
  visaType: VisaType;
  
  // Academic Background
  educationLevel: string;
  
  // Professional Career
  workExperience: string;
  
  // Age
  age: string;
  birthDate?: string; // Optional birth date for automatic age calculation
  
  // Annual Salary
  annualSalary: string;
  
  // Qualifications
  researchAchievements: string[]; // Research papers, patents
  licenses: string[]; // Professional qualifications
  jpNationalLicenses: number; // Number of Japanese national licenses (0, 1, 2)
  
  // Additional bonuses
  innovationBonus: boolean; // Support measures for innovation (10 points)
  researchCostBonus: boolean; // SMEs with R&D costs exceeding 3% (5 points)
  
  // Special Additions
  japaneseLanguage: string;
  
  // Graduated from Japanese institutions
  japaneseEducation: boolean;

  // University bonus fields
  university?: string;
  universityEligible?: boolean;
}

export const educationPoints = {
  academic: {
    'doctorate': 30,
    'masters': 20,
    'bachelors': 10,
    'none': 0
  },
  technical: {
    'doctorate': 30,
    'masters': 20,
    'bachelors': 10,
    'none': 0
  },
  business: {
    'doctorate': 20,
    'masters': 20,
    'bachelors': 10,
    'none': 0
  }
};

export const workExperiencePoints = {
  // Common for all visa types
  'less3': 0,
  '3to5': 5,
  '5to7': 10,
  '7to10': 15,
  '10plus': 20
};

export const agePoints = {
  academic: {
    '29under': 15,
    '30to34': 10,
    '35to39': 5,
    '40plus': 0
  },
  technical: {
    '29under': 15,
    '30to34': 10,
    '35to39': 5,
    '40plus': 0
  },
  business: {
    '29under': 0,
    '30to34': 0,
    '35to39': 0,
    '40plus': 0
  }
};

export const annualSalaryPoints = {
  academic: {
    'under3m': 0,
    '3to5m': 0, // 3백만 엔 이상 5백만 엔 미만 (30~34세 전용)
    '3to6m': 0, // 3백만 엔 이상 6백만 엔 미만 (35~39세 전용)
    '3to8m': 0, // 3백만 엔 이상 8백만 엔 미만 (40세 이상 전용)
    '4m': 10,
    '5m': 15,
    '6m': 20,
    '7m': 25,
    '8m': 30,
    '9m': 35,
    '10m': 40
  },
  technical: {
    'under3m': 0,
    '3to5m': 0, // 3백만 엔 이상 5백만 엔 미만 (30~34세 전용)
    '3to6m': 0, // 3백만 엔 이상 6백만 엔 미만 (35~39세 전용)
    '3to8m': 0, // 3백만 엔 이상 8백만 엔 미만 (40세 이상 전용)
    '4m': 10,
    '5m': 15,
    '6m': 20,
    '7m': 25,
    '8m': 30,
    '9m': 35,
    '10m': 40
  },
  business: {
    'under3m': 0,
    '3to5m': 0,
    '3to6m': 0, 
    '3to8m': 0,
    '5m': 10,
    '7m': 20,
    '10m': 25,
    '15m': 30,
    '20m': 35,
    '30m': 40
  }
};

export const researchPoints = {
  academic: {
    'papers_3plus': 20,
    'papers_1to2': 15,
    'conference_intl': 15,
    'conference_domestic': 10,
    'grants': 15,
    'none': 0
  },
  technical: {
    'patents': 15,
    'papers': 15,
    'research': 15,
    'awards': 15,
    'none': 0
  },
  business: {
    'management_record': 25,
    'business_achievement': 20,
    'company_growth': 15,
    'innovation': 10,
    'none': 0
  }
};

export const licensePoints = {
  // Common for all visa types
  'national': 20,
  'other': 5,
  'none': 0
};

export const languagePoints = {
  // Common for all visa types
  'japanese_n1': 15,
  'japanese_bjt480': 15,
  'japanese_n2': 10,
  'japanese_none': 0,
  'foreign_business': 10,
  'foreign_none': 0
};

export const specialPoints = {
  // Common for all visa types
  'japanese_education': 10
};

// Status based on total points
export const statusThresholds = {
  'not_qualified': 0,
  'qualified': 70,
  'spouse_work': 70,
  'housekeeping': 70,
  'parent_visit': 70,
  'expedited_pr': 80
};