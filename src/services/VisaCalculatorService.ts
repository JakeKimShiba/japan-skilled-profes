import { PointsData } from "@/lib/models";
import { PointsCalculationService } from "./PointsCalculationService";
import { SuggestionService, type Suggestion } from "./SuggestionService";
import { ValidationService, type ValidationResult } from "./ValidationService";

export interface CalculationResult {
  // Core calculation results
  totalPoints: number;
  categoryPoints: ReturnType<typeof PointsCalculationService.calculateByCategory>;
  qualificationStatus: ReturnType<typeof PointsCalculationService.getQualificationStatus>;
  
  // Suggestions and improvements
  suggestions: Suggestion[];
  
  // Validation results
  validation: ValidationResult;
  
  // Convenience properties
  isValid: boolean;
  isQualified: boolean;
  isPremium: boolean;
  pointsNeeded: number;
  pointsToNextTier: number;
}

/**
 * Main service facade that provides a unified API for all visa calculation business logic
 * This is the primary entry point for all calculation-related operations
 */
export class VisaCalculatorService {
  /**
   * Calculate points with validation and suggestions
   * @param data - Points data to calculate
   * @returns Complete calculation result with all analysis
   */
  static calculatePoints(data: PointsData): CalculationResult {
    // Validate input data
    const validation = ValidationService.validatePointsData(data);
    
    // Calculate points even if some fields are missing (for progressive calculation)
    const totalPoints = PointsCalculationService.calculateTotal(data);
    
    // Get category breakdown
    const categoryPoints = PointsCalculationService.calculateByCategory(data);
    
    // Get qualification status
    const qualificationStatus = PointsCalculationService.getQualificationStatus(totalPoints);
    
    // Generate suggestions based on current status
    const targetPoints = totalPoints >= 70 ? 80 : 70;
    const suggestions = validation.isValid && data.visaType
      ? SuggestionService.generateSuggestions(data, targetPoints)
      : [];

    return {
      totalPoints,
      categoryPoints,
      qualificationStatus,
      suggestions,
      validation,
      // Convenience flags
      isValid: validation.isValid,
      isQualified: qualificationStatus.qualified,
      isPremium: qualificationStatus.expeditedPR || false,
      pointsNeeded: PointsCalculationService.calculatePointsNeeded(totalPoints, 70),
      pointsToNextTier: PointsCalculationService.calculatePointsNeeded(totalPoints, 80)
    };
  }

  /**
   * Simulate field change and get impact
   */
  static simulateFieldChange(data: PointsData, field: keyof PointsData, value: any) {
    const currentResult = this.calculatePoints(data);
    const newData = { ...data, [field]: value };
    const newResult = this.calculatePoints(newData);
    
    return {
      currentPoints: currentResult.totalPoints,
      newPoints: newResult.totalPoints,
      pointsDelta: newResult.totalPoints - currentResult.totalPoints,
      newQualificationStatus: newResult.qualificationStatus,
      qualificationChanged: currentResult.isQualified !== newResult.isQualified,
      tierChanged: currentResult.isPremium !== newResult.isPremium
    };
  }

  /**
   * Get detailed analysis for the current state
   */
  static getDetailedAnalysis(data: PointsData) {
    const result = this.calculatePoints(data);
    
    // Analyze strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    if (result.categoryPoints) {
      Object.entries(result.categoryPoints).forEach(([category, points]) => {
        const numPoints = typeof points === 'number' ? points : 0;
        if (numPoints >= 20) {
          strengths.push(category);
        } else if (numPoints < 10 && numPoints > 0) {
          weaknesses.push(category);
        }
      });
    }

    // Get next milestone
    let nextMilestone = null;
    if (result.totalPoints < 70) {
      nextMilestone = { target: 70, type: 'qualification' as const };
    } else if (result.totalPoints < 80) {
      nextMilestone = { target: 80, type: 'premium' as const };
    }

    return {
      ...result,
      strengths,
      weaknesses,
      nextMilestone,
      completionPercentage: Math.min(100, (result.totalPoints / 70) * 100),
      premiumPercentage: Math.min(100, (result.totalPoints / 80) * 100)
    };
  }

  /**
   * Get quick validation for real-time feedback
   */
  static validateField(data: PointsData, field: keyof PointsData, value: any): ValidationResult {
    const testData = { ...data, [field]: value };
    return ValidationService.validatePointsData(testData);
  }

  /**
   * Export services for direct use if needed
   */
  static get services() {
    return {
      calculation: PointsCalculationService,
      suggestion: SuggestionService,
      validation: ValidationService
    };
  }
}