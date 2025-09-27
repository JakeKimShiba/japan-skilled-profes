import { PointsData } from "@/lib/models";
import { PointsCalculationService } from "./PointsCalculationService";
import { SuggestionService, Suggestion } from "./SuggestionService";
import { ValidationService, ValidationResult } from "./ValidationService";

/**
 * Main service facade that provides a unified API for all business logic
 */
export class VisaCalculatorService {
  /**
   * Calculate points with validation and suggestions
   */
  static calculatePoints(data: PointsData) {
    // Validate input data
    const validation = ValidationService.validatePointsData(data);
    
    // Calculate points if data is valid
    const totalPoints = validation.isValid 
      ? PointsCalculationService.calculateTotal(data)
      : 0;
    
    // Get category breakdown
    const categoryPoints = validation.isValid
      ? PointsCalculationService.calculateByCategory(data)
      : null;
    
    // Get qualification status
    const qualificationStatus = PointsCalculationService.getQualificationStatus(totalPoints);
    
    // Generate suggestions if not qualified or for premium tier
    const suggestions = validation.isValid
      ? SuggestionService.generateSuggestions(data, totalPoints >= 70 ? 80 : 70)
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
      isPremium: qualificationStatus.expeditedPR,
      pointsNeeded: Math.max(0, 70 - totalPoints),
      pointsToNextTier: totalPoints >= 80 ? 0 : Math.max(0, 80 - totalPoints)
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
        if (points >= 20) {
          strengths.push(category);
        } else if (points < 10) {
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