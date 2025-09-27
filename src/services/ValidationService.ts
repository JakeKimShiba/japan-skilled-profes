import { PointsData, VisaType } from "@/lib/models";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: keyof PointsData;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: keyof PointsData;
  message: string;
  code: string;
  suggestion?: string;
}

/**
 * Validation service for form data and business rules
 */
export class ValidationService {
  /**
   * Comprehensive validation of points data
   */
  static validatePointsData(data: PointsData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic field validation
    errors.push(...this.validateRequiredFields(data));
    
    // Business rule validation
    errors.push(...this.validateBusinessRules(data));
    
    // Logic consistency validation
    warnings.push(...this.validateLogicalConsistency(data));
    
    // Optimization warnings
    warnings.push(...this.getOptimizationWarnings(data));

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate required fields
   */
  private static validateRequiredFields(data: PointsData): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.visaType) {
      errors.push({
        field: 'visaType',
        message: '비자 타입을 선택해주세요.',
        code: 'REQUIRED_VISA_TYPE'
      });
    }

    if (!data.educationLevel) {
      errors.push({
        field: 'educationLevel',
        message: '학력을 선택해주세요.',
        code: 'REQUIRED_EDUCATION'
      });
    }

    if (!data.workExperience) {
      errors.push({
        field: 'workExperience',
        message: '경력을 선택해주세요.',
        code: 'REQUIRED_EXPERIENCE'
      });
    }

    if (!data.age) {
      errors.push({
        field: 'age',
        message: '연령대를 선택해주세요.',
        code: 'REQUIRED_AGE'
      });
    }

    if (!data.annualSalary) {
      errors.push({
        field: 'annualSalary',
        message: '연봉을 선택해주세요.',
        code: 'REQUIRED_SALARY'
      });
    }

    return errors;
  }

  /**
   * Validate business rules
   */
  private static validateBusinessRules(data: PointsData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Minimum salary requirements
    if (data.visaType === 'technical' || data.visaType === 'academic') {
      if (data.annualSalary === 'under3m') {
        errors.push({
          field: 'annualSalary',
          message: '고도전문직/학술연구 비자는 최소 연봉 300만엔이 필요합니다.',
          code: 'MINIMUM_SALARY_TECHNICAL'
        });
      }
    } else if (data.visaType === 'business') {
      if (data.annualSalary === 'under10m') {
        errors.push({
          field: 'annualSalary',
          message: '고도경영관리 비자는 최소 연봉 1000만엔이 필요합니다.',
          code: 'MINIMUM_SALARY_BUSINESS'
        });
      }
    }

    // Japanese education restrictions
    if (data.japaneseEducation && data.japaneseLanguage === 'n2') {
      errors.push({
        field: 'japaneseLanguage',
        message: '일본 대학 졸업자는 JLPT N2를 선택할 수 없습니다.',
        code: 'JAPANESE_EDUCATION_N2_CONFLICT'
      });
    }

    // Birth date validation
    if (data.birthDate) {
      const birthYear = new Date(data.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;

      if (calculatedAge < 18) {
        errors.push({
          field: 'birthDate',
          message: '만 18세 미만은 신청할 수 없습니다.',
          code: 'MIN_AGE_REQUIREMENT'
        });
      }

      if (calculatedAge > 80) {
        errors.push({
          field: 'birthDate',
          message: '생년월일을 확인해주세요.',
          code: 'INVALID_BIRTH_DATE'
        });
      }
    }

    return errors;
  }

  /**
   * Check logical consistency between fields
   */
  private static validateLogicalConsistency(data: PointsData): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Age vs experience consistency
    const ageWarning = this.checkAgeExperienceConsistency(data);
    if (ageWarning) warnings.push(ageWarning);

    // Education vs experience consistency
    const eduWarning = this.checkEducationExperienceConsistency(data);
    if (eduWarning) warnings.push(eduWarning);

    // Salary vs experience consistency
    const salaryWarning = this.checkSalaryExperienceConsistency(data);
    if (salaryWarning) warnings.push(salaryWarning);

    return warnings;
  }

  /**
   * Check age vs experience consistency
   */
  private static checkAgeExperienceConsistency(data: PointsData): ValidationWarning | null {
    const ageNum = this.getApproximateAge(data.age);
    const minExperienceYears = this.getMinimumExperienceYears(data.workExperience);
    
    if (!ageNum || !minExperienceYears) return null;

    // Assuming minimum working age of 22 (university graduate)
    const maxPossibleExperience = ageNum - 22;
    
    if (maxPossibleExperience < minExperienceYears) {
      return {
        field: 'workExperience',
        message: '선택한 연령대에 비해 경력이 많아 보입니다.',
        code: 'AGE_EXPERIENCE_INCONSISTENCY',
        suggestion: '연령대 또는 경력을 다시 확인해주세요.'
      };
    }

    return null;
  }

  /**
   * Check education vs experience consistency
   */
  private static checkEducationExperienceConsistency(data: PointsData): ValidationWarning | null {
    const minGraduationAge = this.getMinimumGraduationAge(data.educationLevel);
    const minExperienceYears = this.getMinimumExperienceYears(data.workExperience);
    const currentAge = this.getApproximateAge(data.age);
    
    if (!minGraduationAge || !minExperienceYears || !currentAge) return null;

    const maxPossibleExperience = currentAge - minGraduationAge;
    
    if (maxPossibleExperience < minExperienceYears) {
      return {
        field: 'workExperience',
        message: '학력에 비해 경력이 많아 보입니다.',
        code: 'EDUCATION_EXPERIENCE_INCONSISTENCY',
        suggestion: '대학원 재학 중 경력이 있다면 문제없습니다.'
      };
    }

    return null;
  }

  /**
   * Check salary vs experience consistency  
   */
  private static checkSalaryExperienceConsistency(data: PointsData): ValidationWarning | null {
    const experienceYears = this.getMinimumExperienceYears(data.workExperience);
    const salaryLevel = this.getSalaryLevel(data.annualSalary);
    
    if (!experienceYears || !salaryLevel) return null;

    // Very basic heuristic: high salary with low experience might be unusual
    if (experienceYears < 3 && salaryLevel > 1000) {
      return {
        field: 'annualSalary',
        message: '경력에 비해 높은 연봉입니다.',
        code: 'SALARY_EXPERIENCE_INCONSISTENCY',
        suggestion: '특별한 기술이나 학력이 있다면 정당합니다.'
      };
    }

    return null;
  }

  /**
   * Get optimization warnings
   */
  private static getOptimizationWarnings(data: PointsData): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Missing Japanese language
    if (!data.japaneseLanguage || data.japaneseLanguage === 'none') {
      warnings.push({
        field: 'japaneseLanguage',
        message: '일본어 능력 추가로 점수를 크게 높일 수 있습니다.',
        code: 'MISSING_JAPANESE_LANGUAGE',
        suggestion: 'JLPT N2 이상 취득을 권장합니다.'
      });
    }

    // No research achievements for academic visa
    if (data.visaType === 'academic' && data.researchAchievements.length === 0) {
      warnings.push({
        field: 'researchAchievements',
        message: '학술연구 비자는 연구실적이 중요합니다.',
        code: 'MISSING_RESEARCH_ACHIEVEMENTS',
        suggestion: '논문이나 특허 등의 연구실적을 추가하세요.'
      });
    }

    return warnings;
  }

  /**
   * Get approximate age from age category
   */
  private static getApproximateAge(ageCategory: string): number | null {
    switch (ageCategory) {
      case '29under': return 25;
      case '30to34': return 32;
      case '35to39': return 37;
      case '40plus': return 45;
      default: return null;
    }
  }

  /**
   * Get minimum experience years from category
   */
  private static getMinimumExperienceYears(experience: string): number | null {
    switch (experience) {
      case 'less3': return 1;
      case '3to5': return 3;
      case '5to7': return 5;
      case '7to10': return 7;
      case '10plus': return 10;
      default: return null;
    }
  }

  /**
   * Get minimum graduation age for education level
   */
  private static getMinimumGraduationAge(education: string): number | null {
    switch (education) {
      case 'highschool': return 18;
      case 'associate': return 20;
      case 'bachelors': return 22;
      case 'masters': return 24;
      case 'doctorate': return 27;
      default: return null;
    }
  }

  /**
   * Get salary level in 10k JPY units
   */
  private static getSalaryLevel(salary: string): number | null {
    switch (salary) {
      case 'under3m': return 250;
      case '3to5m': return 400;
      case '4m': return 400;
      case '5m': return 500;
      case '6m': return 600;
      case '7m': return 700;
      case '8m': return 800;
      case '9m': return 900;
      case '10m': return 1000;
      case '15m': return 1500;
      case '20m': return 2000;
      case '25m': return 2500;
      case '30m': return 3000;
      default: return null;
    }
  }
}