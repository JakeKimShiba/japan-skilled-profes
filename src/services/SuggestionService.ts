import { PointsData } from "@/lib/models";
import { PointsCalculationService } from "./PointsCalculationService";

export interface Suggestion {
  key: string;
  label: string;
  pointsDelta: number;
  difficulty: 1 | 2 | 3 | 4; // 1=쉬움, 4=매우어려움
  timeframe: string;
  description?: string;
  priority: number;
  category: 'language' | 'education' | 'salary' | 'license' | 'bonus' | 'research';
}

/**
 * Suggestion service for providing optimization recommendations
 */
export class SuggestionService {
  /**
   * Generate personalized suggestions to reach target points
   */
  static generateSuggestions(data: PointsData, targetPoints: number = 70): Suggestion[] {
    const currentTotal = PointsCalculationService.calculateTotal(data);
    const gap = targetPoints - currentTotal;
    
    if (gap <= 0) {
      // Already qualified, suggest premium tier improvements
      return this.generatePremiumSuggestions(data, 80);
    }
    
    const suggestions: Suggestion[] = [];
    
    // Language improvements
    suggestions.push(...this.getLanguageSuggestions(data, currentTotal));
    
    // Education improvements  
    suggestions.push(...this.getEducationSuggestions(data, currentTotal));
    
    // Salary improvements
    suggestions.push(...this.getSalarySuggestions(data, currentTotal));
    
    // License improvements
    suggestions.push(...this.getLicenseSuggestions(data, currentTotal));
    
    // Bonus improvements
    suggestions.push(...this.getBonusSuggestions(data, currentTotal));
    
    // Research improvements
    suggestions.push(...this.getResearchSuggestions(data, currentTotal));
    
    // Sort by effectiveness (points/difficulty ratio) and filter meaningful suggestions
    return suggestions
      .filter(s => s.pointsDelta > 0)
      .sort((a, b) => {
        // Primary sort: points delta (more points = higher priority)
        const pointsDiff = b.pointsDelta - a.pointsDelta;
        if (pointsDiff !== 0) return pointsDiff;
        
        // Secondary sort: difficulty (easier = higher priority)
        return a.difficulty - b.difficulty;
      })
      .slice(0, 8); // Top 8 suggestions
  }

  /**
   * Generate suggestions for premium tier (80+ points)
   */
  private static generatePremiumSuggestions(data: PointsData, targetPoints: number): Suggestion[] {
    const currentTotal = PointsCalculationService.calculateTotal(data);
    const gap = targetPoints - currentTotal;
    
    if (gap <= 0) {
      return [{
        key: 'already_premium',
        label: 'suggestions.items.alreadyPremium',
        pointsDelta: 0,
        difficulty: 1,
        timeframe: '달성됨',
        category: 'bonus',
        priority: 0
      }];
    }
    
    return this.generateSuggestions(data, targetPoints);
  }

  /**
   * Get language improvement suggestions
   */
  private static getLanguageSuggestions(data: PointsData, currentTotal: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (!data.japaneseLanguage || data.japaneseLanguage === 'none') {
      const n2Delta = this.simulateChange(data, 'japaneseLanguage', 'n2') - currentTotal;
      suggestions.push({
        key: 'jlpt-n2',
        label: 'suggestions.items.jlptN2',
        pointsDelta: n2Delta,
        difficulty: 2,
        timeframe: '3-6개월',
        category: 'language',
        priority: this.calculatePriority(n2Delta, 2)
      });
      
      const n1Delta = this.simulateChange(data, 'japaneseLanguage', 'n1') - currentTotal;
      suggestions.push({
        key: 'jlpt-n1',
        label: 'suggestions.items.jlptN1',
        pointsDelta: n1Delta,
        difficulty: 3,
        timeframe: '6-12개월',
        category: 'language',
        priority: this.calculatePriority(n1Delta, 3)
      });
    } else if (data.japaneseLanguage === 'n2') {
      const n1Delta = this.simulateChange(data, 'japaneseLanguage', 'n1') - currentTotal;
      suggestions.push({
        key: 'jlpt-n1-upgrade',
        label: 'suggestions.items.jlptN1Upgrade',
        pointsDelta: n1Delta,
        difficulty: 3,
        timeframe: '6-12개월',
        category: 'language',
        priority: this.calculatePriority(n1Delta, 3)
      });
    }
    
    return suggestions;
  }

  /**
   * Get education improvement suggestions
   */
  private static getEducationSuggestions(data: PointsData, currentTotal: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (data.educationLevel === 'bachelors') {
      const mastersDelta = this.simulateChange(data, 'educationLevel', 'masters') - currentTotal;
      suggestions.push({
        key: 'masters-degree',
        label: 'suggestions.items.mastersDegree',
        pointsDelta: mastersDelta,
        difficulty: 4,
        timeframe: '2-3년',
        category: 'education',
        priority: this.calculatePriority(mastersDelta, 4)
      });
      
      const phdDelta = this.simulateChange(data, 'educationLevel', 'doctorate') - currentTotal;
      suggestions.push({
        key: 'phd-degree',
        label: 'suggestions.items.phdDegree',
        pointsDelta: phdDelta,
        difficulty: 4,
        timeframe: '4-6년',
        category: 'education',
        priority: this.calculatePriority(phdDelta, 4)
      });
    }
    
    if (!data.japaneseEducation) {
      const japaneseEduDelta = this.simulateChange(data, 'japaneseEducation', true) - currentTotal;
      suggestions.push({
        key: 'japanese-education',
        label: 'suggestions.items.japaneseEducation',
        pointsDelta: japaneseEduDelta,
        difficulty: 4,
        timeframe: '2-4년',
        category: 'education',
        priority: this.calculatePriority(japaneseEduDelta, 4)
      });
    }
    
    return suggestions;
  }

  /**
   * Get salary improvement suggestions
   */
  private static getSalarySuggestions(data: PointsData, currentTotal: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const availableOptions = PointsCalculationService.getAvailableSalaryOptions(data.age, data.visaType!);
    
    // Find next higher salary tier
    const currentSalaryIndex = availableOptions.indexOf(data.annualSalary);
    if (currentSalaryIndex >= 0 && currentSalaryIndex < availableOptions.length - 1) {
      const nextSalary = availableOptions[currentSalaryIndex + 1];
      const salaryDelta = this.simulateChange(data, 'annualSalary', nextSalary) - currentTotal;
      
      suggestions.push({
        key: `salary-increase-${nextSalary}`,
        label: `suggestions.items.salaryIncrease`,
        pointsDelta: salaryDelta,
        difficulty: 3,
        timeframe: '6개월-2년',
        category: 'salary',
        priority: this.calculatePriority(salaryDelta, 3)
      });
    }
    
    return suggestions;
  }

  /**
   * Get license improvement suggestions
   */
  private static getLicenseSuggestions(data: PointsData, currentTotal: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (!data.licenses.includes('other')) {
      const licenseDelta = this.simulateChange(data, 'licenses', [...data.licenses, 'other']) - currentTotal;
      suggestions.push({
        key: 'foreign-license',
        label: 'suggestions.items.foreignLicense',
        pointsDelta: licenseDelta,
        difficulty: 2,
        timeframe: '3-6개월',
        category: 'license',
        priority: this.calculatePriority(licenseDelta, 2)
      });
    }
    
    if ((data.jpNationalLicenses || 0) < 2) {
      const nextCount = Math.min(2, (data.jpNationalLicenses || 0) + 1);
      const jpLicenseDelta = this.simulateChange(data, 'jpNationalLicenses', nextCount) - currentTotal;
      suggestions.push({
        key: 'japanese-license',
        label: 'suggestions.items.japaneseLicense',
        pointsDelta: jpLicenseDelta,
        difficulty: 3,
        timeframe: '6-12개월',
        category: 'license',
        priority: this.calculatePriority(jpLicenseDelta, 3)
      });
    }
    
    return suggestions;
  }

  /**
   * Get bonus improvement suggestions
   */
  private static getBonusSuggestions(data: PointsData, currentTotal: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (!data.innovationBonus) {
      const innovationDelta = this.simulateChange(data, 'innovationBonus', true) - currentTotal;
      suggestions.push({
        key: 'innovation-bonus',
        label: 'suggestions.items.innovationBonus',
        pointsDelta: innovationDelta,
        difficulty: 4,
        timeframe: '6개월-2년',
        category: 'bonus',
        priority: this.calculatePriority(innovationDelta, 4)
      });
    }
    
    if (!data.researchCostBonus) {
      const researchDelta = this.simulateChange(data, 'researchCostBonus', true) - currentTotal;
      suggestions.push({
        key: 'research-bonus',
        label: 'suggestions.items.researchBonus',
        pointsDelta: researchDelta,
        difficulty: 3,
        timeframe: '6개월-2년',
        category: 'bonus',
        priority: this.calculatePriority(researchDelta, 3)
      });
    }
    
    return suggestions;
  }

  /**
   * Get research improvement suggestions
   */
  private static getResearchSuggestions(data: PointsData, currentTotal: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (data.researchAchievements.length === 0) {
      const researchDelta = this.simulateChange(data, 'researchAchievements', ['patents']) - currentTotal;
      suggestions.push({
        key: 'research-achievement',
        label: 'suggestions.items.researchAchievement',
        pointsDelta: researchDelta,
        difficulty: 3,
        timeframe: '1-2년',
        category: 'research',
        priority: this.calculatePriority(researchDelta, 3)
      });
    }
    
    return suggestions;
  }

  /**
   * Simulate a field change and calculate new total
   */
  private static simulateChange(data: PointsData, field: keyof PointsData, value: any): number {
    const result = PointsCalculationService.calculateFieldImpact(data, field, value);
    return result.newPoints;
  }

  /**
   * Calculate priority score based on points delta and difficulty
   */
  private static calculatePriority(pointsDelta: number, difficulty: number): number {
    // Higher points and lower difficulty = higher priority
    return pointsDelta * 10 - difficulty * 2;
  }
}