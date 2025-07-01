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
  jpNationalLicenses: number; // Number of Japanese national licenses (0, 1, 2)
  
  // Additional bonuses
  innovationBonus: boolean; // Support measures for innovation (10 points)
  researchCostBonus: boolean; // SMEs with R&D costs exceeding 3% (5 points)
  
  // Special Additions
  japaneseLanguage: string;
  
  // Graduated from Japanese institutions
  japaneseEducation: boolean;
}

export const educationPoints = {
  // Common for all visa types
  'doctorate': 30,
  'masters': 20,
  'bachelors': 10,
  'none': 0
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
  // Common for all visa types
  '29under': 15,
  '30to34': 10,
  '35to39': 5,
  '40plus': 0
};

export const annualSalaryPoints = {
  technical: {
    'under3m': 0,
    '4m': 10,
    '5m': 15,
    '6m': 20,
    '7m': 25,
    '8m': 30,
    '9m': 35,
    '10m': 40
  }
};

export const researchPoints = {
  technical: {
    'patents': 15,
    'papers': 15,
    'research': 15,
    'awards': 15,
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