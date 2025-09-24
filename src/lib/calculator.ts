import {
  PointsData,
  VisaType,
  educationPoints,
  workExperiencePoints,
  agePoints,
  annualSalaryPoints,
  researchPoints,
  licensePoints,
  languagePoints,
  specialPoints,
  visaSpecificBonusPoints,
  statusThresholds
} from './models';

export function calculateTotalPoints(data: PointsData): number {
  const visaType = data.visaType;

  // Calculate points for academic background
  const education = educationPoints[visaType]?.[data.educationLevel as keyof (typeof educationPoints)[VisaType]] || 0;
  
  // Calculate points for professional career
  const career = workExperiencePoints[visaType]?.[data.workExperience as keyof (typeof workExperiencePoints)[VisaType]] || 0;
  
  // Calculate points for age
  const age = agePoints[visaType]?.[data.age as keyof (typeof agePoints)[VisaType]] || 0;
  
  // Calculate points for salary based on visa type
  const salary = annualSalaryPoints[visaType]?.[data.annualSalary as keyof (typeof annualSalaryPoints)[VisaType]] || 0;
  
  // Calculate points for research achievements based on visa type
  let research = 0;
  if (data.visaType === 'academic') {
    // Academic 비자: 각 연구 실적의 개별 점수 합계
    research = data.researchAchievements.reduce((total, achievement) => {
      return total + (researchPoints[visaType]?.[achievement as keyof (typeof researchPoints)[VisaType]] || 0);
    }, 0);
  } else {
    // Technical/Business 비자: 기존처럼 하나만 선택
    research = data.researchAchievements.length > 0 
      ? (researchPoints[visaType]?.[data.researchAchievements[0] as keyof (typeof researchPoints)[VisaType]] || 0)
      : 0;
  }
  
  // Calculate points for licenses
  const license = data.licenses.reduce((total, lic) => {
    return total + (licensePoints[lic as keyof typeof licensePoints] || 0);
  }, 0) + (data.jpNationalLicenses * 5); // 5 points per Japanese national license
  
  // Calculate points for language abilities
  // Map the value directly to the keys in languagePoints
  let langKey = `japanese_${data.japaneseLanguage}`;
  const japaneseLanguage = languagePoints[langKey as keyof typeof languagePoints] || 0;
  
  // Calculate special points
  const japaneseEducationPoints = data.japaneseEducation ? specialPoints.japanese_education : 0;
  // University bonus
  const universityBonus = data.universityEligible ? 10 : 0;

  // Calculate bonus points
  const innovationBonusPoints = data.innovationBonus ? 10 : 0;
  const researchCostBonusPoints = data.researchCostBonus ? 5 : 0;
  
  // Calculate visa-specific bonus points
  let visaSpecificBonus = 0;
  
  // Academic 비자: 연구 실적이 2개 이상일 경우 25점 보너스
  if (data.visaType === 'academic' && data.researchAchievements.length >= 2) {
    visaSpecificBonus += visaSpecificBonusPoints.academic.research_achievements;
  }
  
  if (data.visaType === 'business' && data.businessExecutiveBonus) {
    const bonusPoints = visaSpecificBonusPoints.business[data.businessExecutiveBonus as keyof typeof visaSpecificBonusPoints.business];
    visaSpecificBonus += bonusPoints || 0;
  }
  
  // Calculate total points
  const total = education + career + age + salary + research + license + 
                japaneseLanguage + 
                japaneseEducationPoints +
                universityBonus +
                innovationBonusPoints +
                researchCostBonusPoints +
                visaSpecificBonus;

  return total;
}

export function getQualificationStatus(totalPoints: number) {
  if (totalPoints < statusThresholds.qualified) {
    return {
      qualified: false,
      expeditedPR: false,
      benefits: []
    };
  }
  
  const benefits = [];
  
  if (totalPoints >= statusThresholds.spouse_work) {
    benefits.push('spouse_work');
  }
  
  if (totalPoints >= statusThresholds.housekeeping) {
    benefits.push('housekeeping');
  }
  
  if (totalPoints >= statusThresholds.parent_visit) {
    benefits.push('parent_visit');
  }
  
  return {
    qualified: true,
    expeditedPR: totalPoints >= statusThresholds.expedited_pr,
    benefits
  };
}

export function getCategoryPoints(data: PointsData) {
  const visaType = data.visaType;
  
  // Calculate bonus points
  const innovationBonusPoints = data.innovationBonus ? 10 : 0;
  const researchCostBonusPoints = data.researchCostBonus ? 5 : 0;
  const bonusPoints = innovationBonusPoints + researchCostBonusPoints + (data.universityEligible ? 10 : 0);
  
  return {
    academic: educationPoints[visaType]?.[data.educationLevel as keyof (typeof educationPoints)[VisaType]] || 0,
    career: workExperiencePoints[visaType]?.[data.workExperience as keyof (typeof workExperiencePoints)[VisaType]] || 0,
    age: agePoints[visaType]?.[data.age as keyof (typeof agePoints)[VisaType]] || 0,
    salary: annualSalaryPoints[visaType]?.[data.annualSalary as keyof (typeof annualSalaryPoints)[VisaType]] || 0,
    research: data.visaType === 'academic' 
      ? data.researchAchievements.reduce((total, achievement) => {
          return total + (researchPoints[visaType]?.[achievement as keyof (typeof researchPoints)[VisaType]] || 0);
        }, 0)
      : (data.researchAchievements.length > 0
          ? (researchPoints[visaType]?.[data.researchAchievements[0] as keyof (typeof researchPoints)[VisaType]] || 0)
          : 0),
    license: data.licenses.reduce((total, lic) => {
      return total + (licensePoints[lic as keyof typeof licensePoints] || 0);
    }, 0) + (data.jpNationalLicenses * 5), // 5 points per Japanese national license
    language: languagePoints[`japanese_${data.japaneseLanguage}` as keyof typeof languagePoints] || 0,
    special: (data.japaneseEducation ? specialPoints.japanese_education : 0) + bonusPoints
  };
}