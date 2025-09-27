import { PointsData, VisaType } from "@/lib/models";
import { calculateTotalPoints, getCategoryPoints } from "@/lib/calculator";

/**
 * Points calculation service
 * Centralizes all point calculation logic and provides a clean API
 */
export class PointsCalculationService {
  /**
   * Calculate total points for given data
   */
  static calculateTotal(data: PointsData): number {
    return calculateTotalPoints(data);
  }

  /**
   * Calculate points breakdown by category
   */
  static calculateByCategory(data: PointsData) {
    return getCategoryPoints(data);
  }

  /**
   * Calculate points for specific field change
   */
  static calculateWithChange(data: PointsData, field: keyof PointsData, value: any): number {
    const updatedData = { ...data, [field]: value };
    return this.calculateTotal(updatedData);
  }

  /**
   * Get qualification status based on total points
   */
  static getQualificationStatus(totalPoints: number) {
    if (totalPoints < 70) {
      return {
        qualified: false,
        expeditedPR: false,
        benefits: [],
        level: 'insufficient' as const
      };
    }
    
    const benefits = [];
    
    if (totalPoints >= 70) {
      benefits.push('spouse_work');
    }
    
    if (totalPoints >= 80) {
      benefits.push('housekeeping', 'parent_visit');
    }
    
    return {
      qualified: true,
      expeditedPR: totalPoints >= 80,
      benefits,
      level: totalPoints >= 80 ? 'premium' as const : 'standard' as const
    };
  }

  /**
   * Calculate gap to reach target points
   */
  static calculateGapToTarget(currentPoints: number, targetPoints: number = 70): number {
    return Math.max(0, targetPoints - currentPoints);
  }

  /**
   * Check if data satisfies minimum requirements for visa type
   */
  static validateMinimumRequirements(data: PointsData): {
    isValid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    // Check minimum salary requirements
    if (data.visaType === 'technical' || data.visaType === 'academic') {
      if (data.annualSalary === 'under3m') {
        violations.push('minimum_salary_technical');
      }
    } else if (data.visaType === 'business') {
      if (data.annualSalary === 'under10m') {
        violations.push('minimum_salary_business');
      }
    }

    // Check age vs experience consistency
    const ageNum = this.extractAgeFromCategory(data.age);
    const experienceYears = this.extractExperienceYears(data.workExperience);
    
    if (ageNum && experienceYears && (ageNum - 22) < experienceYears) {
      violations.push('age_experience_mismatch');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Get available salary options based on age and visa type
   */
  static getAvailableSalaryOptions(age: string, visaType: VisaType): string[] {
    const baseOptions = ['under3m'];
    
    // Age-specific options
    if (age === '30to34') baseOptions.push('3to5m');
    if (age === '35to39') baseOptions.push('3to6m');
    if (age === '40plus') baseOptions.push('3to8m');
    if (age === '29under') baseOptions.push('4m');
    if (age === '29under' || age === '30to34') baseOptions.push('5m');
    if (age !== '40plus') baseOptions.push('6m', '7m');
    
    baseOptions.push('8m', '9m', '10m', '15m', '20m', '25m', '30m');
    
    return baseOptions;
  }

  /**
   * Extract numeric age from age category
   */
  private static extractAgeFromCategory(ageCategory: string): number | null {
    switch (ageCategory) {
      case '29under': return 25; // Approximate
      case '30to34': return 32;  // Approximate
      case '35to39': return 37;  // Approximate
      case '40plus': return 45;  // Approximate
      default: return null;
    }
  }

  /**
   * Extract years from work experience category
   */
  private static extractExperienceYears(experience: string): number | null {
    switch (experience) {
      case 'less3': return 2;   // Approximate
      case '3to5': return 4;    // Approximate
      case '5to7': return 6;    // Approximate
      case '7to10': return 8;   // Approximate
      case '10plus': return 12; // Approximate
      default: return null;
    }
  }
}