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
  
  // Return 0 if no visa type is selected
  if (!visaType) {
    return 0;
  }

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
    // 고도 학술 연구 활동(イ): 1개 선택시 20점, 2개 이상 선택시 총 25점
    if (data.researchAchievements.length === 1) {
      research = 20;
    } else if (data.researchAchievements.length >= 2) {
      research = 25;
    }
  } else {
    // 고도 전문·기술 활동(ロ) / 고도 경영·관리 활동(ハ): 기존처럼 하나만 선택
    research = data.researchAchievements.length > 0 
      ? (researchPoints[visaType]?.[data.researchAchievements[0] as keyof (typeof researchPoints)[VisaType]] || 0)
      : 0;
  }
  
  // Calculate points for licenses
  const license = data.licenses.reduce((total, lic) => {
    return total + (licensePoints[lic as keyof typeof licensePoints] || 0);
  }, 0) + (data.jpNationalLicenses * licensePoints.jp_national_per_license); // Points per Japanese national license
  
  // Calculate points for language abilities
  // Map the value directly to the keys in languagePoints
  let langKey = `japanese_${data.japaneseLanguage}`;
  const japaneseLanguage = languagePoints[langKey as keyof typeof languagePoints] || 0;
  
  // Calculate special points
  const japaneseEducationPoints = data.japaneseEducation ? specialPoints.japanese_education : 0;
  // University bonus
  const universityBonus = data.universityEligible ? 10 : 0;

  // Calculate bonus points
  const innovationBonusPoints = data.innovationBonus ? specialPoints.innovation_bonus : 0;
  const researchCostBonusPoints = data.researchCostBonus ? specialPoints.research_cost_bonus : 0;
  
  // Calculate visa-specific bonus points
  let visaSpecificBonus = 0;
  
  // 고도 경영·관리 활동(ハ)의 경영진 보너스만 적용
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
  
  // Return empty values if no visa type is selected
  if (!visaType) {
    return {
      academic: 0,
      career: 0,
      age: 0,
      salary: 0,
      research: 0,
      licenses: 0,
      bonus: 0,
      total: 0
    };
  }
  
  // Calculate bonus points
  const innovationBonusPoints = data.innovationBonus ? specialPoints.innovation_bonus : 0;
  const researchCostBonusPoints = data.researchCostBonus ? specialPoints.research_cost_bonus : 0;
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
    }, 0) + (data.jpNationalLicenses * licensePoints.jp_national_per_license), // Points per Japanese national license
    language: languagePoints[`japanese_${data.japaneseLanguage}` as keyof typeof languagePoints] || 0,
    special: (data.japaneseEducation ? specialPoints.japanese_education : 0) + bonusPoints
  };
}