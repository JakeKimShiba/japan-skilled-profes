# 🇯🇵 일본 고도인재 비자 계산기 완전 재현 프롬프트

## 🎯 **전체 서비스 재현을 위한 마스터 프롬프트**

```markdown
프로젝트 재현 요청: 일본 고도인재(Highly Skilled Professional) 비자 점수 계산기

## 📋 서비스 개요
일본 입국관리청의 고도인재 포인트 제도를 기반으로 한 비자 자격 계산 웹 애플리케이션을 구축해주세요.
사용자가 학력, 경력, 연봉 등의 정보를 입력하면 실시간으로 비자 자격 점수를 계산하고 결과를 제공합니다.

## 🛠️ 기술 스택 (정확히 동일하게 구현)
- **Frontend**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 6.3 + SWC 컴파일러  
- **Styling**: Tailwind CSS 4.0 + Container Queries
- **UI Components**: Radix UI + shadcn/ui 디자인 시스템
- **Form Management**: React Hook Form + Zod 스키마 검증
- **Charts**: Recharts 2.x
- **Icons**: Phosphor Icons React
- **PDF Generation**: jsPDF + html2canvas
- **Flags**: react-country-flag
- **Multi-language**: 커스텀 i18n 시스템 (5개 언어)
- **Deployment**: GitHub Pages + Vite base URL 설정

## 🌍 다국어 지원 구조
5개 언어 완전 지원: 한국어(기본), 영어, 일본어, 중국어(간체), 중국어(번체)

언어별 번역 키 구조:
- URL 파라미터 기반 언어 전환 (?lang=ko|en|ja|zh-cn|zh-tw)
- 로컬 스토리지 기본 언어 저장
- React Context + useState 기반 상태 관리
- 각 언어별 JSON 파일 (282개 번역 키)

## 📊 비자 점수 계산 시스템

### 비자 유형 (3가지)
1. **학술연구활동** (Academic Research Activities)
2. **고도 전문/기술 활동** (Advanced Specialized/Technical Activities) - 기본값
3. **고도 경영/관리 활동** (Advanced Business/Management Activities)

### 점수 계산 카테고리

#### 1️⃣ 학력 (Education Level)
- 박사: 30점
- 석사/전문직대학원: 20점  
- 학사: 10점
- 전문학사: 5점

#### 2️⃣ 직무경력 (Work Experience)
- 10년 이상: 25점
- 7-10년 미만: 20점
- 5-7년 미만: 15점
- 3-5년 미만: 10점
- 1-3년 미만: 5점

#### 3️⃣ 연령 (Age Groups)
- 29세 이하: 15점
- 30-34세: 10점  
- 35-39세: 5점
- 40세 이상: 0점

#### 4️⃣ 연수입 (Annual Salary in Japanese Yen)
**고도전문/기술 활동 기준**:
- 1000만엔 이상: 40점
- 900-1000만엔 미만: 35점
- 800-900만엔 미만: 30점
- 700-800만엔 미만: 25점
- 600-700만엔 미만: 20점
- 500-600만엔 미만: 15점
- 400-500만엔 미만: 10점
- 300-400만엔 미만: 5점
- 300만엔 미만: 0점

#### 5️⃣ 연구업적/자격 (Research & Qualifications)
- 발명특허: 15점 (복수 선택 가능)
- 논문/저서: 5-15점 (복수 선택 가능)
- 일본 국가자격: 1개당 5점 (최대 2개, 10점)
- 외국 자격증: 5점

#### 6️⃣ 일본어 능력 (Japanese Language Proficiency)
- JLPT N1 또는 BJT 480점 이상: 15점
- JLPT N2 또는 BJT 400점 이상: 10점
- 일본 대학 졸업: 10점
- 기타: 0점

#### 7️⃣ 특별가산 (Special Bonuses)
- 혁신사업 지원조치: 10점
- 중소기업 R&D 비용 3% 초과: 5점
- 학술연구 실적 (학술 비자): 25점
- 임원급 지위 (경영 비자): 5-10점

#### 8️⃣ 대학 가산점 (University Bonus)
세계 대학 랭킹 대상 대학교 졸업 시 +10점
- 총 389개 대학 목록 (CSV 파일 관리)
- 국가별 코드 포함 (예: US, JP, GB, KR 등)
- 실시간 검색 기능 (영문명 기준)

## 🎨 UI/UX 설계 요구사항

### 레이아웃 구조
```
Header (언어 선택, 제목)
├── Main Container
│   ├── Tabs (계산기 | 제도안내)
│   ├── Visa Type Selection (3가지 비자 유형)
│   ├── Multi-Step Form (5단계)
│   │   ├── 1. 학력 & 대학 선택
│   │   ├── 2. 경력
│   │   ├── 3. 나이 & 연수입
│   │   ├── 4. 연구업적 & 자격
│   │   └── 5. 언어 & 특별가산
│   └── Results Panel (실시간 계산)
└── Footer
```

### 반응형 디자인
- **모바일 우선**: 320px부터 시작
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **컴포넌트별 최적화**:
  - 연수입 선택: 모바일에서 1열, 데스크톱 2열 그리드
  - 대학 검색: 모바일 친화적 드롭다운
  - 결과 패널: 모바일에서 요약 형태

### 접근성 (WCAG 2.1 AA 준수)
- 모든 interactive 요소에 적절한 ARIA 레이블
- 키보드 네비게이션 완전 지원  
- 색상 대비비 4.5:1 이상
- 스크린 리더 호환
- 포커스 표시 명확화

## 🔧 핵심 기능 구현 사항

### 1. 실시간 점수 계산
- 모든 입력 변경 시 즉시 점수 재계산
- React 상태 관리로 실시간 업데이트
- 비자 유형별 다른 계산 로직 적용

### 2. 대학 검색 시스템  
```typescript
// 대학 데이터 구조
interface University {
  name: string;
  country: string;  // 2자리 국가 코드
}

// 검색 기능
- 실시간 필터링 (영문명 기준)
- 국가별 국기 표시 (react-country-flag)
- 선택 시 +10점 자동 적용
- "목록에 포함되어 있습니다" 확인 체크박스
```

### 3. 다단계 폼 관리
```typescript
// 폼 데이터 타입
interface PointsData {
  visaType: 'academic' | 'technical' | 'business' | null;
  educationLevel: string;
  workExperience: string;
  age: string;
  annualSalary: string;
  researchAchievements: string[];  // 다중 선택
  licenses: string[];              // 다중 선택  
  jpNationalLicenses: number;      // 0-2개
  japaneseLanguage: string;
  japaneseEducation: boolean;
  university?: string;
  universityEligible?: boolean;
  // ... 기타 보너스 필드들
}
```

### 4. PDF 결과 다운로드
- jsPDF + html2canvas로 결과표 생성
- 한글/일본어/중국어 폰트 지원
- 로고, 헤더, 카테고리별 점수 breakdown 포함
- 파일명: "일본_고도인재_비자_점수표.pdf"

### 5. 상태 관리 최적화
```typescript
// 배치 업데이트로 React 렌더링 최적화
const handleBatchChange = (updates: Partial<PointsData>) => {
  setPointsData(prev => ({ ...prev, ...updates }));
};

// 대학 선택 시 university + eligibility 동시 업데이트
onBatchChange({ 
  university: selectedUniversity, 
  universityEligible: true 
});
```

## 🎯 자격 기준 및 결과 표시

### 합격 기준
- **70점 이상**: 자격 충족 ✅
- **70점 미만**: 자격 미충족 ❌ (부족 점수 표시)

### 결과 UI 구성
```typescript
// 결과 표시 구조
interface ResultDisplay {
  totalScore: number;
  qualified: boolean;
  gap?: number;  // 70점까지 부족한 점수
  breakdown: {
    education: { score: number; detail: string };
    experience: { score: number; detail: string };
    age: { score: number; detail: string };
    salary: { score: number; detail: string };
    research: { score: number; detail: string };
    language: { score: number; detail: string };
    university: { score: number; detail: string };
    special: { score: number; detail: string };
  };
  suggestions: string[];  // 점수 개선 제안
}
```

### 모바일 결과 요약
```jsx
// 모바일에서 간단한 요약 표시
<div className="mobile-summary">
  총 {totalScore}점 
  {qualified ? "(자격 충족)" : `(부족 ${gap}점)`}
</div>
```

## 🌐 국제화(i18n) 세부 구현

### 번역 키 구조 (282개)
```json
{
  "app.title": "일본 고도인재 포인트 계산기",
  "visa.academic": "고도 학술 연구 활동",
  "visa.technical": "고도 전문・기술 활동", 
  "visa.business": "고도 경영・관리 활동",
  "education.bachelor": "학사",
  "education.master": "석사",
  "education.phd": "박사",
  "age.under30": "29세 이하",
  "salary.over10m": "1000만 엔 이상",
  "university.eligible": "목록에 포함되어 있습니다 (+10점)",
  "result.qualified": "자격 요건을 충족합니다",
  "result.needMore": "추가 {gap}점이 필요합니다"
  // ... 278개 더
}
```

### 언어별 특수 처리
- **일본어**: 공식 입국관리청 용어 사용
- **중국어**: 간체/번체 구분
- **한국어**: 높임말 일관성
- **영어**: 공식 비자 용어 정확성

## 📁 프로젝트 구조
```
src/
├── components/
│   ├── Header.tsx              # 언어선택, 제목
│   ├── PointsForm.tsx          # 메인 폼 컨테이너
│   ├── PointsResult.tsx        # 결과 표시
│   ├── InfoPanel.tsx           # 제도 안내
│   ├── UniversitySelector.tsx  # 대학 검색 컴포넌트
│   ├── form/                   # 단계별 폼 컴포넌트들
│   │   ├── EducationStep.tsx
│   │   ├── ExperienceStep.tsx
│   │   ├── AgeIncomeStep.tsx
│   │   ├── ResearchStep.tsx
│   │   └── LanguageStep.tsx
│   └── ui/                     # shadcn/ui 컴포넌트들 (30+개)
├── lib/
│   ├── models.ts               # 타입 정의
│   ├── calculator.ts           # 점수 계산 로직
│   ├── validation.ts           # Zod 스키마
│   └── utils.ts                # 유틸 함수
├── i18n/
│   ├── index.tsx               # i18n 컨텍스트
│   └── locales/                # 언어별 JSON 파일
│       ├── ko.json
│       ├── en.json  
│       ├── ja.json
│       ├── zh-cn.json
│       └── zh-tw.json
└── styles/
    └── theme.css               # 커스텀 테마
```

## 🚀 배포 설정
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/japan-skilled-profes/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': './src/' }
  },
  build: {
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000
  }
}));
```

GitHub Pages 배포:
- `npm run build && gh-pages -d dist`
- CNAME 파일로 커스텀 도메인 설정
- robots.txt, sitemap.xml SEO 최적화

## ✅ 품질 보증 요구사항

### 성능
- Lighthouse 점수 90+ (모든 항목)
- 번들 크기 2MB 이하
- 초기 로딩 2초 이내

### 접근성  
- WCAG 2.1 AA 100% 준수
- 키보드 네비게이션 완전 지원
- 스크린 리더 테스트 통과

### 브라우저 호환성
- Chrome 90+, Firefox 88+, Safari 14+
- 모바일: iOS Safari, Chrome Mobile
- IE는 지원하지 않음

### 코드 품질
- TypeScript strict 모드
- ESLint + Prettier 적용
- 100% 타입 안전성
- 컴포넌트 재사용성 90%+

## 🎯 핵심 차별점

1. **실시간 계산**: 입력 즉시 점수 업데이트
2. **완전한 다국어**: 5개 언어 완벽 지원  
3. **대학 검색**: 389개 대학 실시간 검색
4. **모바일 최적화**: 터치 친화적 UX
5. **접근성 완벽**: 스크린 리더 100% 호환
6. **PDF 다운로드**: 다국어 지원 결과표
7. **최신 기술**: React 19, Vite 6, Tailwind 4

## 📋 구현 단계 제안

### Phase 1: 기본 구조 (1-2일)
- [ ] Vite + React + TypeScript 프로젝트 셋업
- [ ] Tailwind CSS + shadcn/ui 설치
- [ ] 기본 라우팅 및 레이아웃

### Phase 2: 핵심 기능 (3-4일) 
- [ ] 점수 계산 로직 구현
- [ ] 폼 컴포넌트 개발
- [ ] 실시간 결과 표시

### Phase 3: 고급 기능 (2-3일)
- [ ] 대학 검색 시스템
- [ ] PDF 다운로드 기능
- [ ] 다국어 시스템 구축

### Phase 4: 최적화 (1-2일)
- [ ] 성능 최적화
- [ ] 접근성 개선
- [ ] 모바일 반응형 완성

### Phase 5: 배포 (1일)
- [ ] GitHub Pages 배포 설정
- [ ] SEO 최적화
- [ ] 최종 테스트

이 프롬프트를 사용해서 정확히 동일한 기능을 가진 일본 고도인재 비자 계산기를 완전히 재현해주세요.
```

---

## 🎯 추가 구현 팁

### 대학 CSV 파일 처리
```typescript
// public/resources/universities_english.csv (389개 대학)
// 형식: University Name, Country Code
// 예시: "Tokyo University,JP"
//      "Harvard University,US" 
//      "Oxford University,GB"

// 실시간 검색 구현
const searchUniversities = (query: string) => {
  return universities.filter(uni => 
    uni.name.toLowerCase().includes(query.toLowerCase())
  );
};
```

### 상태 관리 최적화
```typescript
// 배치 업데이트로 React 렌더링 최적화
const handleBatchChange = useCallback((updates: Partial<PointsData>) => {
  setPointsData(prev => ({ ...prev, ...updates }));
}, []);

// 대학 선택 시 university + universityEligible 동시 업데이트
const handleUniversitySelect = (university: string) => {
  handleBatchChange({ 
    university, 
    universityEligible: true 
  });
};
```

이 프롬프트면 현재 서비스와 100% 동일한 기능을 가진 일본 고도인재 비자 계산기를 완전히 재현할 수 있습니다! 🚀