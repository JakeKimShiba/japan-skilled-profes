# 🧠 프롬프트 엔지니어링 템플릿 라이브러리

## 📋 목차
1. [기본 템플릿](#기본-템플릿)
2. [단계별 프롬프트 진화](#단계별-프롬프트-진화)
3. [도메인별 특화 템플릿](#도메인별-특화-템플릿)
4. [고급 기법](#고급-기법)
5. [검증 및 최적화](#검증-및-최적화)

---

## 🎯 기본 템플릿

### 📝 **범용 프롬프트 구조**
```
[컨텍스트] + [기술스택] + [요구사항] + [제약사항] + [품질기준]
```

### 🏗️ **컴포넌트 개발 템플릿**
```markdown
프로젝트: {project_name}
기술스택: {tech_stack}
현재 상황: {current_situation}

요구사항:
- {requirement_1}
- {requirement_2} 
- {requirement_3}

제약사항:
- {constraint_1}
- {constraint_2}

품질 기준:
- {quality_standard_1}
- {quality_standard_2}

{specific_request}
```

---

## 🚀 단계별 프롬프트 진화

### 📊 **Level 1 → Level 5 실제 진화 사례**

#### **사례: 대학 선택 컴포넌트 개발**

```markdown
❌ Level 1 (초보):
"대학 선택 컴포넌트 만들어줘"

🔄 Level 2 (컨텍스트 추가):
"React + TypeScript로 대학 선택 드롭다운 컴포넌트 만들어줘"

⚡ Level 3 (구체적 요구사항):
"React + TypeScript로 일본 대학 선택 컴포넌트를 만드는데, 
라디오 버튼 형태로 국기와 대학명을 보여주고 
다국어 지원이 되어야 해"

🎯 Level 4 (완전한 컨텍스트):
"일본 고도인재 비자 계산기 프로젝트에서 
React 19 + TypeScript + Tailwind CSS로 대학 선택 컴포넌트를 개발 중이야.

현재 문제:
- 라디오 버튼을 클릭해도 시각적으로 체크 표시가 안 됨
- 중첩된 button > input 구조로 추정

요구사항:
- 국가별 국기 아이콘과 대학명 표시
- 라디오 버튼 그룹으로 단일 선택
- 5개 언어 다국어 지원 (ko/en/ja/zh-cn/zh-tw)
- 접근성 준수 (WCAG 2.1 AA)
- 모바일 반응형

제약사항:
- 기존 Tailwind 클래스 유지
- react-country-flag 라이브러리 사용
- 커스텀 i18n 시스템 활용

이 조건을 만족하는 해결책을 제시해줘."

🏆 Level 5 (마스터 + 검증):
위 프롬프트 + 
"추가로 생성한 코드를 다음 관점에서 자체 검토해줘:
1. 접근성 준수 여부 (aria 속성, 키보드 네비게이션)
2. 성능 최적화 가능성 (불필요한 리렌더링)
3. 코드 가독성 및 유지보수성
4. 잠재적 버그 가능성

문제가 발견되면 개선 방안도 함께 제시해줘."
```

---

## 🎨 도메인별 특화 템플릿

### 🐛 **버그 수정 템플릿**
```markdown
🚨 버그 리포트:

파일: {file_path}
함수/컴포넌트: {component_name}

문제 상황:
- 예상 동작: {expected_behavior}
- 실제 동작: {actual_behavior}
- 재현 단계: 
  1. {step_1}
  2. {step_2}
  3. {step_3}

환경 정보:
- 브라우저: {browser_version}
- 디바이스: {device_info}
- 화면 크기: {screen_size}

현재 코드:
```{language}
{current_code}
```

관련 로그/에러:
```
{error_logs}
```

이 문제의 근본 원인을 분석하고 단계별 해결 방안을 제시해줘.
가능한 부작용과 대안도 함께 설명해줘.
```

### ⚡ **성능 최적화 템플릿**
```markdown
🔍 성능 분석 요청:

대상: {target_component/feature}

현재 지표:
- 번들 크기: {current_bundle_size}
- 초기 로딩 시간: {loading_time}
- 렌더링 시간: {render_time}
- 메모리 사용량: {memory_usage}

목표:
- {optimization_goal_1}
- {optimization_goal_2}

제약사항:
- 기능 변경 최소화
- 기존 API 호환성 유지
- 코드 복잡도 증가 금지

현재 코드:
```{language}
{current_code}
```

다음 단계로 분석해줘:
1. 성능 병목점 식별
2. 최적화 우선순위 결정  
3. 구체적 개선 방안 제시
4. Before/After 예상 효과
5. 리스크 및 대안책
```

### 🌍 **다국어 번역 템플릿**
```markdown
🌐 번역 요청:

프로젝트: 일본 고도인재 비자 계산기
컨텍스트: {specific_context}
대상 언어: {target_language}
톤앤매너: {tone_and_manner}

전문 용어 가이드:
- 고도인재: Highly Skilled Professional
- 점수: Points (Score 아님)
- 신청: Application  
- 자격: Qualification
- 비자: Visa

번역 대상:
{text_to_translate}

고려사항:
1. 법적 정확성 (일본 입국관리청 공식 용어)
2. 사용자 친화성 (이해하기 쉬운 표현)
3. 문화적 적절성 ({target_culture} 관습 고려)
4. UI 제약 (모바일 화면, 글자수 제한)
5. SEO 고려 (검색 키워드 최적화)

번역과 함께 간단한 설명도 포함해줘.
```

### 🎨 **UI/UX 디자인 템플릿**
```markdown
🎨 UI 디자인 요청:

프로젝트: {project_name}
디자인 시스템: Tailwind CSS 4.0 + Radix UI + shadcn/ui

타겟 유저: {target_user}
사용 시나리오: {use_scenario}

요구사항:
- {design_requirement_1}
- {design_requirement_2}
- {design_requirement_3}

디자인 원칙:
- 접근성 우선 (WCAG 2.1 AA)
- 모바일 퍼스트 반응형
- 미니멀하고 직관적인 인터페이스
- 브랜드 일관성 유지

기술적 제약:
- 현재 컴포넌트 시스템 활용
- 성능 최적화 고려
- 다국어 지원 (텍스트 길이 변화)

현재 상태:
{current_state_description}

이 조건들을 만족하는 UI 설계와 구현 방안을 제시해줘.
가능하다면 Tailwind 클래스도 함께 제공해줘.
```

---

## 🔬 고급 기법

### 🔗 **Chain of Thought (사고 연결)**
```markdown
단계별 분석 템플릿:

문제: {complex_problem}

다음 순서로 단계별 분석해줘:

1단계 - 문제 분해:
- {problem_aspect_1}을 어떻게 해결할 것인가?
- {problem_aspect_2}는 어떤 영향을 미치는가?

2단계 - 원인 분석:
- 근본 원인은 무엇인가?
- 연관된 요소들은?

3단계 - 해결 방안 설계:
- 각 원인별 대응 방안
- 우선순위와 실행 계획

4단계 - 리스크 평가:
- 예상 부작용
- 대안 및 회피 방안

5단계 - 검증 계획:
- 성공 지표
- 모니터링 방법

각 단계별로 상세히 설명해줘.
```

### 🎭 **Role Playing (역할 연기)**
```markdown
역할 설정 템플릿:

당신은 {role_description}입니다.

배경:
- {background_1}
- {background_2}
- {background_3}

현재 상황:
{current_situation}

검토 관점:
1. {perspective_1}
2. {perspective_2}  
3. {perspective_3}

이 역할의 관점에서 {request}를 수행해주세요.
전문가로서의 조언과 구체적인 실행 방안을 제시해주세요.
```

### 📊 **Few-Shot Learning (예시 기반 학습)**
```markdown
예시 기반 학습 템플릿:

다음은 좋은 예시들입니다:

예시 1:
입력: {input_1}
출력: {output_1}
이유: {reason_1}

예시 2:  
입력: {input_2}
출력: {output_2}
이유: {reason_2}

예시 3:
입력: {input_3}
출력: {output_3}
이유: {reason_3}

이제 다음 입력에 대해 같은 패턴으로 처리해주세요:
입력: {new_input}
```

---

## 🛡️ 검증 및 최적화

### 🔍 **자체 검증 프롬프트**
```markdown
🔍 코드 검증 요청:

방금 생성한 코드/솔루션을 다음 체크리스트로 검증해줘:

✅ 기능성 체크:
- [ ] 모든 요구사항 충족
- [ ] 엣지 케이스 처리
- [ ] 에러 핸들링

✅ 품질 체크:
- [ ] 코드 가독성
- [ ] 유지보수 용이성
- [ ] 성능 최적화

✅ 보안 체크:
- [ ] 보안 취약점
- [ ] 입력 검증
- [ ] XSS/CSRF 방어

✅ 접근성 체크:
- [ ] WCAG 준수
- [ ] 키보드 네비게이션
- [ ] 스크린리더 호환

✅ 호환성 체크:
- [ ] 브라우저 호환성
- [ ] 모바일 대응
- [ ] 기존 코드 통합

문제가 발견되면 개선 방안과 함께 수정된 코드를 제시해줘.
```

### 📈 **성능 평가 템플릿**
```markdown
📊 프롬프트 성능 평가:

생성된 결과를 다음 기준으로 평가해줘 (1-10점):

1. 정확성 (__/10): 요구사항 정확한 이해 및 구현
2. 완성도 (__/10): 추가 수정 없이 바로 사용 가능
3. 효율성 (__/10): 최적화되고 성능 좋은 솔루션
4. 창의성 (__/10): 예상치 못한 좋은 아이디어 포함
5. 실용성 (__/10): 실제 프로덕션에서 사용 가능

총점: __/50

개선 포인트:
- {improvement_1}
- {improvement_2}
- {improvement_3}

다음 번 더 나은 결과를 위한 프롬프트 개선 제안:
{prompt_improvement_suggestion}
```

---

## 🎯 실전 활용 가이드

### 📝 **프롬프트 작성 체크리스트**
```markdown
✅ 완벽한 프롬프트 체크리스트:

🎯 컨텍스트 (Context):
- [ ] 프로젝트 배경 설명
- [ ] 현재 상황 명시
- [ ] 기술 스택 정보

🔧 기술 정보 (Technical):
- [ ] 사용 언어/프레임워크
- [ ] 버전 정보
- [ ] 의존성/라이브러리

📋 요구사항 (Requirements):
- [ ] 구체적인 기능 명세
- [ ] 품질 기준
- [ ] 성능 요구사항

🚫 제약사항 (Constraints):
- [ ] 기술적 제약
- [ ] 비즈니스 제약  
- [ ] 시간/리소스 제약

🎨 품질 기준 (Quality):
- [ ] 코드 스타일
- [ ] 접근성 요구사항
- [ ] 보안 고려사항

📤 출력 형식 (Output):
- [ ] 원하는 결과물 형태
- [ ] 설명 수준
- [ ] 추가 문서 필요성
```

### 🔄 **반복 개선 프로세스**
```markdown
🔄 프롬프트 최적화 사이클:

1️⃣ 초안 작성 → 결과 확인
2️⃣ 부족한 부분 식별 → 프롬프트 보완
3️⃣ 새로운 프롬프트 → 결과 비교
4️⃣ 성과 측정 → 패턴 학습
5️⃣ 템플릿 업데이트 → 재사용

📊 개선 지표:
- 원하는 결과까지의 프롬프트 수
- 추가 수정 필요 빈도
- 코드 품질 점수
- 개발 시간 단축 정도
```

---

## 🚀 다음 단계

### 📚 **학습 로드맵**
```markdown
🎯 단계별 학습 계획:

레벨 1 (기초): 1-2주
- [ ] 기본 프롬프트 구조 이해
- [ ] 컨텍스트 제공 연습
- [ ] 간단한 코드 생성 실습

레벨 2 (활용): 3-4주  
- [ ] 도메인별 템플릿 구축
- [ ] 여러 AI 도구 조합 사용
- [ ] 품질 검증 프로세스 구축

레벨 3 (최적화): 5-8주
- [ ] 고급 프롬프트 기법 적용
- [ ] 성능 측정 및 개선
- [ ] 팀 워크플로우 구축

레벨 4 (마스터): 지속적
- [ ] 새로운 AI 도구 탐색
- [ ] 프롬프트 패턴 연구
- [ ] 커뮤니티 기여
```

### 🎁 **유용한 리소스**
```markdown
📚 추천 자료:
- OpenAI Prompt Engineering Guide
- Anthropic Claude Best Practices  
- GitHub Copilot Documentation
- Web Accessibility Guidelines (WCAG)

🛠️ 도구:
- 프롬프트 성능 측정 도구
- 코드 품질 분석 도구
- 접근성 검증 도구
- 번들 크기 분석 도구

🤝 커뮤니티:
- AI 개발 관련 Discord/Slack
- GitHub Discussions
- Reddit r/MachineLearning
- Stack Overflow AI 태그
```

---

*이 템플릿은 실제 프로젝트 경험을 바탕으로 지속적으로 업데이트됩니다.*
*피드백과 개선 사항은 언제든 환영합니다! 🚀*