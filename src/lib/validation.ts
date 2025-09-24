// 입력 검증 및 에러 처리 유틸리티
import { PointsData } from './models';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function validatePointsData(data: PointsData): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // 1. 나이와 경력의 논리적 일치성 검사
  if (data.birthDate && data.workExperience) {
    const birthYear = new Date(data.birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    const minWorkStartAge = 22; // 최소 취업 가능 나이
    const maxPossibleExperience = age - minWorkStartAge;
    
    if (data.workExperience === '10plus' && maxPossibleExperience < 10) {
      errors.push({
        field: 'workExperience',
        message: `현재 나이(${age}세)로는 10년 이상 경력이 불가능합니다.`,
        severity: 'error'
      });
    }
    
    if (data.workExperience === '7to10' && maxPossibleExperience < 7) {
      errors.push({
        field: 'workExperience', 
        message: `현재 나이(${age}세)로는 7년 이상 경력이 어려울 수 있습니다.`,
        severity: 'warning'
      });
    }
  }
  
  // 2. 비자별 필수 필드 검사
  if (data.visaType === 'academic' && data.educationLevel === 'none') {
    errors.push({
      field: 'educationLevel',
      message: '학술연구 비자는 최소 석사학위가 필요합니다.',
      severity: 'error'
    });
  }
  
  // 3. 점수 최적화 제안
  if (data.japaneseLanguage === 'none') {
    errors.push({
      field: 'japaneseLanguage',
      message: '일본어 능력 증명으로 추가 점수를 얻을 수 있습니다.',
      severity: 'info'
    });
  }
  
  return errors;
}

export function getImprovementSuggestions(data: PointsData, currentPoints: number): string[] {
  const suggestions: string[] = [];
  const target = 70;
  const gap = target - currentPoints;
  
  if (gap <= 0) return suggestions;
  
  // 점수 향상 제안
  if (!data.japaneseEducation && gap <= 10) {
    suggestions.push("일본 대학 졸업 시 10점 추가 가능");
  }
  
  if (data.visaType === 'academic' && !data.academicResearchBonus && gap <= 25) {
    suggestions.push("연구실적(논문/특허) 보유 시 25점 추가 가능");
  }
  
  if (data.visaType === 'business' && data.businessExecutiveBonus === 'none' && gap <= 10) {
    suggestions.push("경영진 지위 시 5-10점 추가 가능");
  }
  
  return suggestions;
}