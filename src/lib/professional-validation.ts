// 행정서사 관점의 실무 검증 로직
import { PointsData } from './models';

export interface ProfessionalValidation {
  field: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  documentRequired?: string[];
}

export function validateFromProfessionalPerspective(data: PointsData): ProfessionalValidation[] {
  const validations: ProfessionalValidation[] = [];
  
  // 1. 학력과 경력의 논리적 일치성
  if (data.educationLevel === 'doctorate' && data.workExperience === 'less3') {
    validations.push({
      field: 'workExperience',
      message: '박사학위 보유자가 3년 미만 경력인 경우 구체적 사유 설명 필요',
      severity: 'warning',
      documentRequired: ['학위취득증명서', '경력증명서', '사유서']
    });
  }
  
  // 2. 연봉과 경력의 합리성 검토
  if (data.annualSalary === '10m' && data.workExperience === 'less3') {
    validations.push({
      field: 'annualSalary',
      message: '고액 연봉 대비 경력 부족 - 연봉 산정 근거 자료 필수',
      severity: 'critical',
      documentRequired: ['급여명세서', '근로계약서', '회사 인사규정']
    });
  }
  
  // 3. 비자별 특화 검증
  if (data.visaType === 'academic') {
    if (!data.academicResearchBonus && data.educationLevel === 'doctorate') {
      validations.push({
        field: 'academicResearchBonus',
        message: '박사학위자의 연구실적 미보유는 드문 케이스입니다',
        severity: 'info'
      });
    }
    
    if (data.japaneseEducation && !data.academicResearchBonus) {
      validations.push({
        field: 'academicResearchBonus',
        message: '일본 대학 졸업자는 대부분 연구실적을 보유합니다',
        severity: 'warning'
      });
    }
  }
  
  if (data.visaType === 'business') {
    if (data.businessExecutiveBonus === 'none' && data.annualSalary.includes('30m')) {
      validations.push({
        field: 'businessExecutiveBonus',
        message: '고액 연봉자는 대부분 경영진 지위를 보유합니다',
        severity: 'warning'
      });
    }
  }
  
  // 4. 서류 준비 가이드
  if (data.japaneseLanguage === 'major') {
    validations.push({
      field: 'japaneseLanguage',
      message: '일본어 전공 학위 입증서류 준비 필요',
      severity: 'info',
      documentRequired: ['졸업증명서(전공명 명시)', '성적증명서', '교육과정 설명서']
    });
  }
  
  // 5. 점수 최적화 조언
  const currentAge = calculateAge(data.birthDate);
  if (currentAge && currentAge >= 35 && data.age === '40plus') {
    validations.push({
      field: 'strategy',
      message: '나이 점수 감소 구간 - 다른 항목 점수 확보 전략 필요',
      severity: 'info'
    });
  }
  
  return validations;
}

// 실무에서 자주 발생하는 케이스별 조언
export function getProfessionalAdvice(data: PointsData, totalPoints: number): string[] {
  const advice: string[] = [];
  
  if (totalPoints >= 70 && totalPoints < 80) {
    advice.push('✅ 고도인재 기준 충족 - 신청 가능');
    advice.push('📈 80점 달성 시 우대조치 확대 (배우자 취업, 부모 방문 등)');
  }
  
  if (totalPoints < 70) {
    advice.push('⚠️ 고도인재 기준 미달 - 점수 보완 필요');
    advice.push('🎯 부족 점수: ' + (70 - totalPoints) + '점');
  }
  
  if (data.visaType === 'academic' && !data.japaneseEducation) {
    advice.push('💡 일본 대학원 진학 고려 (학위 + 일본교육 가산점)');
  }
  
  if (data.japaneseLanguage === 'none') {
    advice.push('🗾 JLPT N1 취득으로 15점 확보 가능 (1년 내 달성 목표)');
  }
  
  return advice;
}

function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getFullYear() - birth.getFullYear();
}