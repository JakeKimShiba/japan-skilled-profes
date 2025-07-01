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
  statusThresholds
} from './models';

export function calculateTotalPoints(data: PointsData): number {
  const visaType = data.visaType;

  // Calculate points for academic background
  const education = educationPoints[data.educationLevel as keyof typeof educationPoints] || 0;
  
  // Calculate points for professional career
  const career = workExperiencePoints[data.workExperience as keyof typeof workExperiencePoints] || 0;
  
  // Calculate points for age
  const age = agePoints[data.age as keyof typeof agePoints] || 0;
  
  // Calculate points for salary based on visa type
  const salary = annualSalaryPoints[visaType]?.[data.annualSalary as keyof (typeof annualSalaryPoints)[VisaType]] || 0;
  
  // Calculate points for research achievements based on visa type
  const research = data.researchAchievements.reduce((total, achievement) => {
    return total + (researchPoints[visaType]?.[achievement as keyof (typeof researchPoints)[VisaType]] || 0);
  }, 0);
  
  // Calculate points for licenses
  const license = data.licenses.reduce((total, lic) => {
    return total + (licensePoints[lic as keyof typeof licensePoints] || 0);
  }, 0);
  
  // Calculate points for language abilities
  const japaneseLanguage = languagePoints[`japanese_${data.japaneseLanguage}` as keyof typeof languagePoints] || 0;
  const foreignLanguage = languagePoints[`foreign_${data.foreignLanguage}` as keyof typeof languagePoints] || 0;
  
  // Calculate special points
  const japaneseEducationPoints = data.japaneseEducation ? specialPoints.japanese_education : 0;
  const innovativeProjectPoints = data.innovativeProject ? specialPoints.innovative_project : 0;
  
  // Calculate total points
  const total = education + career + age + salary + research + license + 
                japaneseLanguage + foreignLanguage + 
                japaneseEducationPoints + innovativeProjectPoints;
  
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
  
  return {
    academic: educationPoints[data.educationLevel as keyof typeof educationPoints] || 0,
    career: workExperiencePoints[data.workExperience as keyof typeof workExperiencePoints] || 0,
    age: agePoints[data.age as keyof typeof agePoints] || 0,
    salary: annualSalaryPoints[visaType]?.[data.annualSalary as keyof (typeof annualSalaryPoints)[VisaType]] || 0,
    research: data.researchAchievements.reduce((total, achievement) => {
      return total + (researchPoints[visaType]?.[achievement as keyof (typeof researchPoints)[VisaType]] || 0);
    }, 0),
    license: data.licenses.reduce((total, lic) => {
      return total + (licensePoints[lic as keyof typeof licensePoints] || 0);
    }, 0),
    language: (languagePoints[`japanese_${data.japaneseLanguage}` as keyof typeof languagePoints] || 0) + 
              (languagePoints[`foreign_${data.foreignLanguage}` as keyof typeof languagePoints] || 0),
    special: (data.japaneseEducation ? specialPoints.japanese_education : 0) + 
             (data.innovativeProject ? specialPoints.innovative_project : 0)
  };
}