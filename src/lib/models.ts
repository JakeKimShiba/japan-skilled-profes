// Point calculation models for the Highly Skilled Professional visa

export type VisaType = 'technical' | 'research' | 'business';

export interface PointsData {
  // Visa Type
  visaType: VisaType;
  
  // Academic Background
  educationLevel: string;
  
  // Professional Career
  workExperience: string;
  
  // Age
  age: string;
  
  // Annual Salary
  annualSalary: string;
  
  // Qualifications
  researchAchievements: string[]; // Research papers, patents
  licenses: string[]; // Professional qualifications
  
  // Special Additions
  japaneseLanguage: string;
  foreignLanguage: string; // Non-Japanese, non-native language proficiency
  
  // Graduated from Japanese institutions
  japaneseEducation: boolean;
  
  // Designated initiatives by Japanese government
  innovativeProject: boolean;
}

export const educationPoints = {
  // Common for all visa types
  'doctorate': 30,
  'masters': 25,
  'professional': 20,
  'bachelors': 10,
  'none': 0
};

export const workExperiencePoints = {
  // Common for all visa types
  'less3': 0,
  '3to5': 5,
  '5to7': 10,
  '7to10': 15,
  '10to15': 20,
  '15plus': 25
};

export const agePoints = {
  // Common for all visa types
  '29under': 15,
  '30to34': 10,
  '35to39': 5,
  '40plus': 0
};

export const annualSalaryPoints = {
  technical: {
    'under3m': 0,
    '3to4m': 10,
    '4to5m': 20,
    '5to7m': 30,
    '7to8m': 40,
    '8to10m': 40,
    '10to15m': 50,
    '15to20m': 70,
    '20mplus': 80
  },
  research: {
    'under3m': 0,
    '3to4m': 10,
    '4to5m': 20,
    '5to7m': 30,
    '7to8m': 40,
    '8to10m': 40,
    '10to15m': 50,
    '15to20m': 70,
    '20mplus': 80
  },
  business: {
    'under3m': 0,
    '3to4m': 10,
    '4to5m': 20,
    '5to7m': 30,
    '7to10m': 40,
    '10to15m': 50,
    '15to25m': 70,
    '25mplus': 80
  }
};

export const researchPoints = {
  technical: {
    'patents': 20,
    'papers': 15,
    'none': 0
  },
  research: {
    'patents': 15,
    'papers': 20,
    'none': 0
  },
  business: {
    'patents': 15,
    'papers': 10,
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
  'japanese_advanced': 15,
  'japanese_business': 10,
  'japanese_daily': 5,
  'japanese_none': 0,
  'foreign_business': 10,
  'foreign_none': 0
};

export const specialPoints = {
  // Common for all visa types
  'japanese_education': 10,
  'innovative_project': 10
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