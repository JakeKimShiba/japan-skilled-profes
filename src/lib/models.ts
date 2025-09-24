// Point calculation models for the Highly Skilled Professional visa

export type VisaType = 'academic' | 'technical' | 'business';

export interface PointsData {
  // Visa Type
  visaType: VisaType | null;
  
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
  
  // Visa-specific bonuses
  academicResearchBonus: boolean; // Academic visa: Research achievements (25 points)
  academicUniversityBonus: string; // Academic visa: Special university bonus (10-15 points)
  businessExecutiveBonus: string; // Business visa: Executive position bonus (5-10 points)
  businessInvestmentBonus: string; // Business visa: Investment/export performance (5-15 points)
  
  // Contract organization bonuses (Academic)
  contractResearchBonus: boolean; // Contract organization research performance (5 points)
  innovativeFieldBonus: boolean;  // Innovative business field (10 points)
  
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
    'doctorate': 30,  // 박사학위 취득자
    'masters': 20,    // 석사학위 취득자
    'none': 0         // 해당없음
  },
  technical: {
    'doctorate': 30,  // 박사학위 취득자
    'masters': 20,    // 석사학위 취득자
    'bachelors': 10,  // 학사학위 취득자
    'none': 0         // 해당없음
  },
  business: {
    'mba': 25,           // MBA, MOT 학위 취득자
    'doctorate': 20,     // 박사학위 취득자
    'masters': 20,       // 석사학위 취득자
    'bachelors': 10,     // 학사학위 취득자
    'none': 0            // 해당없음
  }
};

export const workExperiencePoints = {
  academic: {
    'less3': 0,
    '3to5': 5,
    '5to7': 10,
    '7plus': 15
  },
  technical: {
    'less3': 0,
    '3to5': 5,
    '5to7': 10,
    '7to10': 15,
    '10plus': 20
  },
  business: {
    'less3': 0,
    '3to5': 10,    // 공식 테이블: 3년 이상 = 10점
    '5to7': 15,    // 공식 테이블: 5년 이상 = 15점
    '7to10': 20,   // 공식 테이블: 7년 이상 = 20점
    '10plus': 25   // 공식 테이블: 10년 이상 = 25점
  }
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
    'under3m': 0,     // 300만엔 미만
    '3to5m': 10,      // 300만엔~500만엔 미만 
    '3to6m': 15,      // 300만엔~600만엔 미만  
    '3to8m': 20,      // 300만엔~800만엔 미만 
    '4m': 10,         // 400만엔 이상 (Academic 관대한 점수)
    '5m': 15,         // 500만엔 이상 
    '6m': 20,         // 600만엔 이상 
    '7m': 25,         // 700만엔 이상 
    '8m': 30,         // 800만엔 이상 
    '9m': 35,         // 900만엔 이상 
    '10m': 40         // 1000만엔 이상
  },
  technical: {
    'under3m': 0,     // 300만엔 미만 (점수 없음)
    '4m': 10,         // 400만엔 이상 (29세 이하만 가능)
    '5m': 15,         // 500만엔 이상 (29세 이하, 30-34세 가능)
    '6m': 20,         // 600만엔 이상 (39세 이하까지 가능)
    '7m': 25,         // 700만엔 이상 (39세 이하까지 가능)
    '8m': 30,         // 800만엔 이상 (모든 나이)
    '9m': 35,         // 900만엔 이상 (모든 나이)
    '10m': 40         // 1000만엔 이상 (모든 나이)
  },
  business: {
    'under10m': 0,    // 1000만엔 미만 (공식 테이블 기준)
    '10m': 10,        // 1000만엔 이상 (공식 테이블: 10점)
    '15m': 20,        // 1500만엔 이상 (공식 테이블: 20점)
    '20m': 30,        // 2000만엔 이상 (공식 테이블: 30점)
    '25m': 40,        // 2500만엔 이상 (공식 테이블: 40점)
    '30m': 50         // 3000만엔 이상 (공식 테이블: 50점)
  }
};

export const researchPoints = {
  academic: {
    'patent_invention': 20,        // 특허 발명 1건 이상
    'official_journal': 20,        // 입국 전에 공식 기관에서 인정받은 연구에 종사했던 실적 3건 이상
    'academic_database': 20,       // 연구논문 실적에 대해서 일본의 국가 기관에서 이용되고 있는 학술 논문 데이터베이스에 등록되어 있는 논문 (신청인이 책임 저자제1저자일 경우에 한함) 3건 이상
    'award_research': 20,          // 상기의 학문 이외에 상기 학문에 비교해 동등한 연구 실적이 있는 신청자가 이끄는 경우 (저명한 상의 수상이력 등) 관련 행정기관장의 의견을 들은 곳에서 법무대신이 개별로 포인트 부여 여부를 판단함
    'none': 0
  },
  technical: {
    'patent_invention': 15,        // 특허 발명 1건 이상 (Technical: 15점)
    'official_journal': 15,        // 입국 전에 공식 기관에서 인정받은 연구에 종사했던 실적 3건 이상 (Technical: 15점)
    'academic_database': 15,       // 연구논문 실적에 대해서 일본의 국가 기관에서 이용되고 있는 학술 논문 데이터베이스에 등록되어 있는 논문 3건 이상 (Technical: 15점)
    'award_research': 15,          // 상기 학문에 비교해 동등한 연구 실적 (Technical: 15점)
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
  'japanese_major': 15,    // 일본어 전공 학위 보유자
  'japanese_overseas_major': 15,  // 해외 대학 일본어 전공 졸업
  'japanese_n2': 10,
  'japanese_none': 0,
  'foreign_business': 10,
  'foreign_none': 0
};

export const specialPoints = {
  // Common for all visa types
  'japanese_education': 10
};

// Visa-specific bonus points  
export const visaSpecificBonusPoints = {
  academic: {
    // 고도 학술 연구 활동(イ)의 연구 실적 점수는 calculator.ts에서 직접 처리
    // 1개: 20점, 2개 이상: 25점 (별도 보너스 없음)
    'university_top': 15,            // Top-tier university contract
    'university_recognized': 10,     // Recognized university contract  
    'contract_research': 5,          // Contract organization research
    'innovative_field': 10,          // Innovative business field
    'none': 0
  },
  business: {
    'executive_senior': 10,          // Senior executive position
    'executive_manager': 5,          // Management position
    'investment_large': 15,          // Large investment performance
    'investment_medium': 10,         // Medium investment performance
    'export_performance': 10,        // Export performance
    'employment_creation': 5,        // Employment creation
    'none': 0
  }
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