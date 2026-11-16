import {
  PointsData,
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

function pointsFor(table: Record<string, number>, key: string): number {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : 0;
}

export function calculateTotalPoints(data: PointsData): number {
  return Object.values(getCategoryPoints(data)).reduce((total, points) => total + points, 0);
}

export function getQualificationStatus(totalPoints: number) {
  if (totalPoints < statusThresholds.qualified) {
    return { qualified: false, expeditedPR: false, benefits: [] };
  }

  const benefits = [];
  if (totalPoints >= statusThresholds.spouse_work) benefits.push('spouse_work');
  if (totalPoints >= statusThresholds.housekeeping) benefits.push('housekeeping');
  if (totalPoints >= statusThresholds.parent_visit) benefits.push('parent_visit');

  return {
    qualified: true,
    expeditedPR: totalPoints >= statusThresholds.expedited_pr,
    benefits
  };
}

export function getCategoryPoints(data: PointsData) {
  const visaType = data.visaType;
  const empty = { academic: 0, career: 0, age: 0, salary: 0, research: 0, license: 0, language: 0, special: 0 };
  if (!visaType || !Object.prototype.hasOwnProperty.call(educationPoints, visaType)) return empty;

  const achievements = [...new Set(data.researchAchievements)].filter(
    achievement => achievement !== 'none' && Object.prototype.hasOwnProperty.call(researchPoints[visaType], achievement)
  );
  const research = visaType === 'academic'
    ? (achievements.length >= 2 ? 25 : achievements.length === 1 ? 20 : 0)
    : pointsFor(researchPoints[visaType], achievements[0] || 'none');
  const nationalLicenses = Number.isInteger(data.jpNationalLicenses) && data.jpNationalLicenses >= 0 && data.jpNationalLicenses <= 2
    ? data.jpNationalLicenses
    : 0;
  const licenses = [...new Set(data.licenses)].filter(license => license !== 'jp_national_per_license')
    .reduce((total, license) => total + pointsFor(licensePoints, license), 0);
  const executiveBonus = visaType === 'business'
    ? pointsFor(visaSpecificBonusPoints.business, data.businessExecutiveBonus)
    : 0;

  return {
    academic: pointsFor(educationPoints[visaType], data.educationLevel) + (data.universityEligible ? 10 : 0),
    career: pointsFor(workExperiencePoints[visaType], data.workExperience),
    age: pointsFor(agePoints[visaType], data.age),
    salary: pointsFor(annualSalaryPoints[visaType], data.annualSalary),
    research,
    license: licenses + nationalLicenses * licensePoints.jp_national_per_license,
    language: pointsFor(languagePoints, `japanese_${data.japaneseLanguage}`),
    special: (data.japaneseEducation ? specialPoints.japanese_education : 0)
      + (data.innovationBonus ? specialPoints.innovation_bonus : 0)
      + (data.researchCostBonus ? specialPoints.research_cost_bonus : 0)
      + executiveBonus
  };
}
