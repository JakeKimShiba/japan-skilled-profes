import { PointsData, VisaType } from "@/lib/models";
import { calculateTotalPoints, getCategoryPoints, getQualificationStatus } from "@/lib/calculator";

/**
 * Points calculation service
 * Provides a clean, stateless API for all point calculations
 * Acts as a facade over the calculator module
 */
export class PointsCalculationService {
  /**
   * Calculate total points for given data
   * @param data - The points data to calculate
   * @returns Total points as number
   */
  static calculateTotal(data: PointsData): number {
    if (!data.visaType) return 0;
    return calculateTotalPoints(data);
  }

  /**
   * Calculate points breakdown by category
   * @param data - The points data to analyze
   * @returns Object with points per category
   */
  static calculateByCategory(data: PointsData) {
    if (!data.visaType) {
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
    return getCategoryPoints(data);
  }

  /**
   * Get qualification status based on total points
   * @param totalPoints - Total calculated points
   * @returns Qualification status with benefits and level
   */
  static getQualificationStatus(totalPoints: number) {
    return getQualificationStatus(totalPoints);
  }

  /**
   * Calculate impact of changing a specific field
   * @param data - Current points data
   * @param field - Field to change
   * @param value - New value for the field
   * @returns Object with current, new points and difference
   */
  static calculateFieldImpact(data: PointsData, field: keyof PointsData, value: any) {
    const currentPoints = this.calculateTotal(data);
    const newData = { ...data, [field]: value };
    const newPoints = this.calculateTotal(newData);
    
    return {
      currentPoints,
      newPoints,
      difference: newPoints - currentPoints,
      isImprovement: newPoints > currentPoints
    };
  }

  /**
   * Calculate minimum points needed for qualification
   * @param currentPoints - Current total points
   * @param targetLevel - Target qualification level (70 or 80)
   * @returns Points needed to reach target
   */
  static calculatePointsNeeded(currentPoints: number, targetLevel: number = 70): number {
    return Math.max(0, targetLevel - currentPoints);
  }

  /**
   * Check if points data has minimum required fields for calculation
   * @param data - Points data to validate
   * @returns True if data is sufficient for calculation
   */
  static hasMinimumData(data: PointsData): boolean {
    return !!(
      data.visaType &&
      data.educationLevel &&
      data.workExperience &&
      data.age &&
      data.annualSalary
    );
  }

  /**
   * Validate consistency between age and experience
   * @param data - Points data to validate
   * @returns Validation result with any issues found
   */
  static validateConsistency(data: PointsData): {
    isValid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    // Extract age from category
    const ageNum = this.extractAgeFromCategory(data.age);
    const experienceYears = this.extractExperienceYears(data.workExperience);
    
    // Check if experience is feasible given age (assuming work starts at 22)
    if (ageNum && experienceYears && (ageNum - 22) < experienceYears) {
      violations.push('experience_exceeds_possible_years');
    }

    // Check minimum salary requirements by visa type
    if (data.visaType === 'business' && data.annualSalary === 'under3m') {
      violations.push('business_visa_minimum_salary_not_met');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Extract numerical age from age category string
   * @private
   */
  private static extractAgeFromCategory(ageCategory: string): number | null {
    if (!ageCategory) return null;
    
    const match = ageCategory.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Extract numerical years from work experience category
   * @private
   */
  private static extractExperienceYears(experienceCategory: string): number | null {
    if (!experienceCategory) return null;
    
    const match = experienceCategory.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Sort salary options by income amount (low to high)
   * @private
   */
  private static sortSalaryOptions(options: string[]): string[] {
    const salaryOrder = [
      'under3m', 'under5m', 'under6m', 'under8m', 'under10m', 
      '3to5m', '3to6m', '3to8m', 
      '4m', '5m', '6m', '7m', '8m', '9m', '10m', 
      '15m', '20m', '25m', '30m'
    ];
    
    return options.sort((a, b) => {
      const indexA = salaryOrder.indexOf(a);
      const indexB = salaryOrder.indexOf(b);
      return indexA - indexB;
    });
  }

  /**
   * Get available salary options based on visa type and age
   * @param ageCategory - Age category string
   * @param visaType - Visa type (academic or technical)
   * @returns Array of available salary option keys
   */
  static getAvailableSalaryOptions(ageCategory: string, visaType: string): string[] {
    if (!visaType || !ageCategory) return [];

    const ageNum = this.extractAgeFromCategory(ageCategory);
    if (!ageNum) return [];

    if (visaType === 'academic') {
      const options = ['under3m'];
      
      // Age-based restrictions for academic visa (same as technical)
      if (ageNum <= 29) {
        options.push('4m', '5m');
      } else if (ageNum >= 30 && ageNum <= 34) {
        options.push('under5m', '5m');
      } else if (ageNum >= 35 && ageNum <= 39) {
        options.push('under6m', '6m', '7m');
      } else if (ageNum >= 40) {
        options.push('under8m');
      }
      
      // Available for all ages
      options.push('8m', '9m', '10m');
      
      // Remove duplicates and sort by income amount
      return this.sortSalaryOptions([...new Set(options)]);
    }

    if (visaType === 'technical') {
      const options = ['under3m'];
      
      // Age-based restrictions for technical visa
      if (ageNum <= 29) {
        options.push('4m', '5m');
      } else if (ageNum >= 30 && ageNum <= 34) {
        options.push('under5m', '5m');
      } else if (ageNum >= 35 && ageNum <= 39) {
        options.push('under6m', '6m', '7m');
      } else if (ageNum >= 40) {
        options.push('under8m');
      }
      
      // Available for all ages
      options.push('8m', '9m', '10m');
      
      // Remove duplicates and sort by income amount
      return this.sortSalaryOptions([...new Set(options)]);
    }

    if (visaType === 'business') {
      const options = ['under10m', '10m', '15m', '20m', '25m', '30m'];
      return this.sortSalaryOptions(options);
    }

    return [];
  }
}