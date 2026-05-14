import type { Guide } from './types';

const today = new Date().toISOString().split("T")[0];

export const guidesKo: Guide[] = [
  {
    slug: "고도인재-비자-완벽-가이드",
    title: "일본 고도인재 비자(高度専門職) 완벽 가이드 2026",
    description:
      "일본 고도인재 비자(HSP)란 무엇인지, 포인트 계산 방법, 비자 유형별 차이, 신청 절차, 영주권 혜택까지 한 페이지에서 모두 확인하세요. 70점·80점 기준과 실제 사례를 포함한 종합 안내서입니다.",
    keywords: ["고도인재 비자", "일본 고도인재", "고도인재비자", "HSP 비자", "고도전문직", "일본 영주권"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "고도인재 비자(高度専門職ビザ)란?",
        content: `
<p><strong>고도인재 비자(高度専門職ビザ)</strong>는 일본 법무성이 운영하는 <strong>포인트제 우대 비자</strong>입니다. 학력, 경력, 연봉, 나이, 자격증, 일본어 능력 등을 합산하여 <strong>70점 이상</strong>이면 취득할 수 있으며, <strong>80점 이상</strong>이면 최단 1년 만에 영주권 신청이 가능합니다.</p>
<p>정식 명칭은 「高度人材に対するポイント制による出入国在留管理上の優遇制度」이며, 2012년에 도입되어 현재까지 운영되고 있습니다.</p>

<div class="guide-stats">
  <div class="guide-stat"><div class="guide-stat-value">70점</div><div class="guide-stat-label">비자 취득 기준</div></div>
  <div class="guide-stat"><div class="guide-stat-value">80점</div><div class="guide-stat-label">1년 영주권 기준</div></div>
  <div class="guide-stat"><div class="guide-stat-value">6개</div><div class="guide-stat-label">평가 카테고리</div></div>
  <div class="guide-stat"><div class="guide-stat-value">7대</div><div class="guide-stat-label">우대 혜택</div></div>
</div>

<table>
  <thead><tr><th>구분</th><th>기준 점수</th><th>영주권 신청</th></tr></thead>
  <tbody>
    <tr><td>일반 고도인재</td><td>70점 이상</td><td>3년 후 가능</td></tr>
    <tr><td>고속 영주권</td><td>80점 이상</td><td><strong>1년 후 가능</strong></td></tr>
  </tbody>
</table>`,
      },
      {
        title: "2025년 경영비자 요건 강화와 고도인재 비자의 가치",
        content: `
<p><strong>2025년 10월 16일</strong>, 일본 정부는 경영·관리 비자(経営・管理ビザ)의 요건을 대폭 강화했습니다. 기존의 「자본금 500만엔으로 1인 창업」이라는 방식은 더 이상 통하지 않게 되었으며, <strong>고도인재 비자(ハ)의 상대적 가치가 크게 높아졌습니다.</strong></p>

<div class="guide-callout guide-callout-warning">2025년 10월 16일부터 경영비자 요건이 대폭 강화되었습니다. 자본금이 <strong>6배</strong> 증가하고, 일본어 능력·직원 고용·사업계획 검증이 모두 필수화되었습니다.</div>

<div class="guide-vs">
  <div class="guide-vs-card old">
    <h4>❌ 이전 경영비자</h4>
    <ul>
      <li>💰 자본금 500만엔</li>
      <li>👤 직원 2인 또는 자본금으로 대체</li>
      <li>📋 경영 경험 불문</li>
      <li>🗣️ 일본어 능력 불문</li>
      <li>📄 사업계획 자체 작성</li>
      <li>🏠 자택 겸용 가능</li>
    </ul>
  </div>
  <div class="guide-vs-divider">→</div>
  <div class="guide-vs-card new">
    <h4>✅ 2025.10~ 신기준</h4>
    <ul>
      <li>💰 자본금 <strong>3,000만엔</strong></li>
      <li>👤 상근직원 <strong>1명 이상 필수</strong></li>
      <li>📋 경영 <strong>3년+</strong> 또는 석·박사</li>
      <li>🗣️ <strong>JLPT N2 이상</strong> 필수</li>
      <li>📄 <strong>외부 전문가</strong> 확인 필수</li>
      <li>🏢 <strong>독립 사무소</strong> 필수</li>
    </ul>
  </div>
</div>

<table>
  <thead><tr><th>항목</th><th>이전 규정</th><th>2025년 10월 이후</th></tr></thead>
  <tbody>
    <tr><td><strong>자본금</strong></td><td>500만엔 이상</td><td><strong>3,000만엔 이상</strong> (6배 증가)</td></tr>
    <tr><td><strong>직원 고용</strong></td><td>2인 이상 또는 자본금 500만엔</td><td><strong>일본 거주 상근직원 1명 이상 필수</strong></td></tr>
    <tr><td><strong>경영 경험</strong></td><td>불문</td><td><strong>3년 이상 경영 경험</strong> 또는 경영계 석·박사 학위</td></tr>
    <tr><td><strong>사업계획 평가</strong></td><td>자체 작성 가능</td><td><strong>외부 전문가</strong>(세무사, 중소기업진단사, 공인회계사) 확인 필수</td></tr>
    <tr><td><strong>일본어 능력</strong></td><td>불문</td><td>신청자 또는 상근직원이 <strong>JLPT N2 이상</strong> (또는 BJT 400점 이상)</td></tr>
    <tr><td><strong>사무실</strong></td><td>자택 겸용 가능</td><td><strong>독립 사무소 필수</strong> (자택 겸용 불가)</td></tr>
  </tbody>
</table>

<p>이번 개정으로 외국인 창업자에게는 「충분한 자금」「인재」「일본어 능력」「검증된 사업 계획」이라는 <strong>극히 높은 종합력</strong>이 요구되게 되었습니다. 1인 스몰 스타트는 사실상 불가능해졌습니다.</p>

<p><strong>경과 조치:</strong> 시행일(2025.10.16)부터 <strong>3년간(~2028년 10월 16일)</strong> 기존 재류자는 '개선계획서'와 '충족예정' 증빙을 제시하면 갱신이 가능합니다. 단, 2028년 10월 이후에는 신기준을 완전히 충족해야 합니다.</p>

<div class="guide-callout guide-callout-tip">경영비자 대신 <strong>고도인재 비자(ハ)</strong>를 추천하는 이유: 자본금 3,000만엔 요건 없음, 포인트제 기반 종합 평가, 영주권 최단 1년, 배우자 취업·부모 초청 혜택까지!</div>

<p><strong>고도인재 비자(ハ)가 대안인 이유:</strong></p>
<ul>
  <li><strong>자본금 3,000만엔 요건 없음</strong> — 포인트제 기반으로 학력·경력·연봉 등 복합 평가</li>
  <li><strong>영주권 최단 1년</strong> — 80점 이상 시 1년 후 영주권 신청 가능 (경영비자는 일반적으로 10년)</li>
  <li><strong>배우자 취업 허가, 부모 초청</strong> 등 경영비자에 없는 추가 혜택</li>
  <li><strong>고도전문직 2호</strong> 전환 시 활동 제한 없는 무기한 체류 가능</li>
</ul>

<p>일본에서 사업을 시작하려는 분이라면, 경영비자보다 <strong>고도인재 비자(ハ) → 영주권 취득</strong> 루트가 훨씬 현실적인 선택지가 되었습니다.</p>`,
      },
      {
        title: "비자 3가지 유형과 차이점",
        content: `
<p>고도인재 비자는 활동 내용에 따라 3가지 유형으로 나뉩니다. <strong>각 유형별로 포인트 배점이 다르므로</strong> 자신에게 유리한 유형을 선택하는 것이 중요합니다.</p>
<table>
  <thead><tr><th>유형</th><th>일본어 명칭</th><th>대상</th><th>연봉 최소 요건</th></tr></thead>
  <tbody>
    <tr><td><strong>학술연구</strong></td><td>高度学術研究活動 (イ)</td><td>대학 교수, 연구원</td><td>없음</td></tr>
    <tr><td><strong>기술·인문</strong></td><td>高度専門・技術活動 (ロ)</td><td>엔지니어, 통번역, 디자이너</td><td>300만엔 이상</td></tr>
    <tr><td><strong>경영·관리</strong></td><td>高度経営・管理活動 (ハ)</td><td>기업 임원, 경영자</td><td>1,000만엔 이상</td></tr>
  </tbody>
</table>
<p>대부분의 한국인 직장인은 <strong>기술·인문(ロ)</strong> 유형에 해당합니다. IT 엔지니어, 마케터, 통번역사, 디자이너 등이 이 유형입니다.</p>`,
      },
      {
        title: "포인트 계산 항목별 상세 배점",
        content: `
<p>포인트는 크게 <strong>6개 카테고리</strong>로 나뉘며, 각 항목의 최고점을 합산합니다.</p>

<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">학력</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:75%;background:oklch(0.55 0.2 262)">30점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">경력</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:62.5%;background:oklch(0.55 0.18 200)">25점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">연봉</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:100%;background:oklch(0.55 0.18 155)">40점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">나이</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:37.5%;background:oklch(0.6 0.15 55)">15점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">일본어</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:37.5%;background:oklch(0.55 0.2 300)">15점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">특별가산</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:62.5%;background:oklch(0.5 0.15 15)">10~25점</div></div></div>
</div>

<p><strong>① 학력 (최대 30점)</strong></p>
<table>
  <thead><tr><th>학력</th><th>학술연구·기술인문</th><th>경영관리</th></tr></thead>
  <tbody>
    <tr><td>박사</td><td>30점</td><td>20점</td></tr>
    <tr><td>석사</td><td>20점</td><td>20점</td></tr>
    <tr><td>MBA/MOT</td><td>25점</td><td>25점</td></tr>
    <tr><td>학사</td><td>10점</td><td>10점</td></tr>
    <tr><td>복수 학위 가산</td><td>+5점</td><td>+5점</td></tr>
  </tbody>
</table>

<p><strong>② 경력 (최대 20점 / 경영관리: 25점)</strong></p>
<table>
  <thead><tr><th>경력 연수</th><th>학술·기술</th><th>경영관리</th></tr></thead>
  <tbody>
    <tr><td>10년 이상</td><td>20점</td><td>25점</td></tr>
    <tr><td>7~9년</td><td>15점</td><td>20점</td></tr>
    <tr><td>5~6년</td><td>10점</td><td>15점</td></tr>
    <tr><td>3~4년</td><td>5점</td><td>10점</td></tr>
  </tbody>
</table>

<p><strong>③ 연봉 (최대 40점)</strong></p>
<ul>
  <li>1,000만엔 이상: 40점</li>
  <li>900만엔~: 35점</li>
  <li>800만엔~: 30점</li>
  <li>700만엔~: 25점</li>
  <li>600만엔~: 20점</li>
  <li>500만엔~: 15점</li>
  <li>400만엔~: 10점</li>
  <li>300만엔~ (기술·인문만): 5점</li>
</ul>

<p><strong>④ 나이 (최대 15점 / 기술·인문만)</strong></p>
<ul>
  <li>29세 이하: 15점</li>
  <li>30~34세: 10점</li>
  <li>35~39세: 5점</li>
  <li>40세 이상: 0점</li>
</ul>

<p><strong>⑤ 일본어 능력 (최대 15점)</strong></p>
<ul>
  <li>JLPT N1 또는 BJT 480점 이상: 15점</li>
  <li>JLPT N2 또는 BJT 400점 이상: 10점</li>
</ul>

<p><strong>⑥ 특별 가산 항목</strong></p>
<ul>
  <li>일본 대학 졸업: +10점</li>
  <li>Top 300 대학 졸업: +10점</li>
  <li>이노베이션 촉진 기업 소속: +10점</li>
  <li>일본 국가 자격증 보유: +5~10점</li>
</ul>

<div class="guide-callout guide-callout-info">정확한 포인트는 <a href="/">kodocalc.com 무료 계산기</a>로 즉시 확인할 수 있습니다. 항목별 점수와 부족한 점수를 자동으로 분석해 드립니다.</div>`,
      },
      {
        title: "70점 달성을 위한 현실적인 전략",
        content: `
<p>가장 일반적인 한국인 직장인의 <strong>70점 달성 시나리오</strong>를 소개합니다.</p>

<p><strong>시나리오 1: 석사 + 5년 경력 + 500만엔 연봉 (20대)</strong></p>
<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">학력</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:66%;background:oklch(0.55 0.2 262)">석사 20</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">경력</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.18 200)">5년 10</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">연봉</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:50%;background:oklch(0.55 0.18 155)">500만 15</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">나이</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:50%;background:oklch(0.6 0.15 55)">29↓ 15</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">일본어</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.2 300)">N2 10</div></div></div>
</div>
<div class="guide-stats" style="max-width:200px;margin:0.5rem auto">
  <div class="guide-stat"><div class="guide-stat-value">70점 ✅</div><div class="guide-stat-label">합계</div></div>
</div>

<p><strong>시나리오 2: 학사 + 10년 경력 + 700만엔 연봉 (30대)</strong></p>
<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">학력</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.2 262)">학사 10</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">경력</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:66%;background:oklch(0.55 0.18 200)">10년 20</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">연봉</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:83%;background:oklch(0.55 0.18 155)">700만 25</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">나이</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.6 0.15 55)">30대 10</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">일본어</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.2 300)">N2 10</div></div></div>
</div>
<div class="guide-stats" style="max-width:200px;margin:0.5rem auto">
  <div class="guide-stat"><div class="guide-stat-value">75점 ✅</div><div class="guide-stat-label">합계</div></div>
</div>

<div class="guide-callout guide-callout-tip"><strong>포인트를 올리는 핵심 팁:</strong> ① JLPT N1 취득 (+5점) ② 연봉 100만엔↑ (+5점) ③ 일본 국가자격증 (+5점) ④ 이노베이션 기업 이직 (+10점)</div>`,
      },
      {
        title: "고도인재 비자의 7대 혜택",
        content: `
<p>고도인재 비자로 인정받으면 다음과 같은 우대 조치를 받을 수 있습니다.</p>
<ol>
  <li><strong>복합적 활동 허가</strong> — 한 가지 비자로 여러 활동 가능 (예: 엔지니어이면서 강의)</li>
  <li><strong>5년 체류 기간</strong> — 최장 5년의 체류 기간 부여</li>
  <li><strong>배우자 취업 허가</strong> — 배우자가 별도 취업 비자 없이도 일할 수 있음</li>
  <li><strong>부모 초청</strong> — 일정 조건 하에 본국 부모를 일본으로 초청 가능</li>
  <li><strong>가사 도우미 고용</strong> — 외국인 가사 도우미 고용 허가</li>
  <li><strong>영주권 신청 단축</strong> — 70점: 3년, <strong>80점: 1년</strong></li>
  <li><strong>입국 심사 우대</strong> — 심사 처리 기간 단축</li>
</ol>`,
      },
      {
        title: "신청 절차와 필요 서류",
        content: `
<p>고도인재 비자는 <strong>출입국재류관리청(入管)</strong>에 신청합니다.</p>

<div class="guide-flow">
  <div class="guide-flow-step secondary">📋 서류 준비</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step secondary">📊 포인트 계산</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step primary">🏛️ 입관 신청</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step secondary">⏳ 심사 (2주~1개월)</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step accent">✅ 비자 취득</div>
</div>

<p><strong>기본 필요 서류:</strong></p>
<ul>
  <li>재류자격인정증명서 교부신청서 또는 재류자격변경허가신청서</li>
  <li>포인트 계산표 (法務省 양식)</li>
  <li>학위증명서 (학력 포인트 증빙)</li>
  <li>재직증명서 및 경력증명서</li>
  <li>원천징수표 또는 급여명세서 (연봉 증빙)</li>
  <li>JLPT/BJT 합격증 (일본어 능력 증빙)</li>
  <li>여권 사본</li>
  <li>증명 사진 (4cm × 3cm)</li>
</ul>

<p><strong>신청 방법:</strong></p>
<div class="guide-timeline">
  <div class="guide-timeline-item"><div class="step-title">1. 포인트 자가 진단</div><div class="step-desc">kodocalc.com에서 현재 점수 확인 및 부족 항목 파악</div></div>
  <div class="guide-timeline-item"><div class="step-title">2. 증빙 서류 수집</div><div class="step-desc">학위증명서, 재직증명서, 원천징수표, JLPT 합격증 등</div></div>
  <div class="guide-timeline-item"><div class="step-title">3. 포인트 계산표 작성</div><div class="step-desc">법무성 양식에 맞춰 항목별 점수 기재 및 증빙 첨부</div></div>
  <div class="guide-timeline-item"><div class="step-title">4. 입관 신청</div><div class="step-desc">본인 방문, 행정서사 대리, 또는 소속 기관을 통해 제출</div></div>
  <div class="guide-timeline-item"><div class="step-title">5. 심사 및 결과</div><div class="step-desc">통상 2주~1개월. 고도인재는 우선 처리됩니다</div></div>
</div>`,
      },
    ],
    faq: [
      {
        question: "고도인재 비자와 일반 취업비자(기술·인문·국제업무)의 차이는?",
        answer:
          "일반 취업비자는 하나의 활동만 허가되고 체류 기간이 1~5년이지만, 고도인재 비자는 복합 활동이 가능하고 배우자 취업, 부모 초청 등 특별 혜택이 있습니다. 가장 큰 차이는 영주권 신청 단축(일반 10년 → 고도인재 1~3년)입니다.",
      },
      {
        question: "포인트가 70점 미만이면 어떻게 해야 하나요?",
        answer:
          "JLPT N1 취득(+5~15점), 연봉 인상 협상, 일본 국가자격증 취득, 이노베이션 촉진 기업 이직 등을 통해 점수를 올릴 수 있습니다. kodocalc.com 계산기의 '제안' 기능을 활용하면 가장 효율적인 점수 올리기 방법을 확인할 수 있습니다.",
      },
      {
        question: "고도인재 비자로 전직(이직)이 가능한가요?",
        answer:
          "고도인재 비자 1호는 소속 기관에 종속됩니다. 이직 시 재류자격 변경 신청이 필요합니다. 고도인재 비자 2호(무기한)는 소속 기관에 관계없이 활동 가능합니다.",
      },
      {
        question: "한국 대학 졸업도 학력 포인트를 받을 수 있나요?",
        answer:
          "네. 한국을 포함한 해외 대학 졸업도 학력 포인트 대상입니다. 또한 QS, THE, ARWU 세계 대학 랭킹 Top 300 이내 대학 졸업자는 +10점 보너스를 받을 수 있습니다.",
      },
      {
        question: "영주권 신청 시 주의사항은?",
        answer:
          "세금 체납이 없어야 하고, 이직 시 14일 이내에 입관 신고 의무를 이행해야 합니다. 또한 건강보험·연금 납부 기록도 심사됩니다. 경미한 문제는 행정서사를 통해 이유서를 작성하면 해결되는 경우가 많습니다.",
      },
    ],
  },
  {
    slug: "포인트-올리는-방법",
    title: "고도인재 포인트를 올리는 6가지 현실적인 방법",
    description:
      "고도인재 비자 70점·80점에 도달하기 위한 실전 전략. JLPT, 연봉 협상, 자격증, 대학 보너스 등 가장 효과적인 포인트 향상 방법을 정리했습니다.",
    keywords: ["고도인재 포인트", "포인트 올리기", "JLPT N1", "일본 자격증", "고도인재 70점"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "현재 점수 진단하기",
        content: `
<p>포인트를 올리려면 먼저 <strong>현재 몇 점인지 정확히 파악</strong>하는 것이 중요합니다. <a href="/">kodocalc.com 계산기</a>에서 현재 조건을 입력하면 항목별 점수와 부족한 점수를 즉시 확인할 수 있습니다.</p>

<div class="guide-callout guide-callout-info">보통 <strong>5~15점 부족</strong>한 경우가 많으며, 아래 6가지 방법 중 2~3가지를 조합하면 충분히 달성 가능합니다.</div>

<div class="guide-stats">
  <div class="guide-stat"><div class="guide-stat-value">+15</div><div class="guide-stat-label">JLPT N1 취득</div></div>
  <div class="guide-stat"><div class="guide-stat-value">+10</div><div class="guide-stat-label">Top300 대학</div></div>
  <div class="guide-stat"><div class="guide-stat-value">+10</div><div class="guide-stat-label">이노베이션 기업</div></div>
  <div class="guide-stat"><div class="guide-stat-value">+5~15</div><div class="guide-stat-label">연봉 인상</div></div>
</div>`,
      },
      {
        title: "방법 1: JLPT N1 취득 (+5~15점)",
        content: `
<p>가장 확실하고 본인 노력으로 달성 가능한 방법입니다.</p>
<table>
  <thead><tr><th>자격</th><th>점수</th><th>비고</th></tr></thead>
  <tbody>
    <tr><td>JLPT N1 / BJT 480+</td><td><strong>15점</strong></td><td>일본어 대학 졸업도 동일</td></tr>
    <tr><td>JLPT N2 / BJT 400+</td><td>10점</td><td>N1 대비 5점 낮음</td></tr>
    <tr><td>없음</td><td>0점</td><td>—</td></tr>
  </tbody>
</table>
<p>현재 N2라면 N1 취득으로 <strong>+5점</strong>, 일본어 자격이 없다면 N2로 <strong>+10점</strong>, N1으로 <strong>+15점</strong>을 올릴 수 있습니다.</p>`,
      },
      {
        title: "방법 2: 연봉 협상 또는 이직 (+5~15점)",
        content: `
<p>연봉 구간마다 5점 단위로 포인트가 올라갑니다. <strong>100만엔만 올려도 +5점</strong>이 가능합니다.</p>
<p>이직 시에는 반드시 새 회사의 <strong>고용계약서상 연봉</strong>을 기준으로 합니다. 보너스는 계약에 명시된 경우에만 포함됩니다.</p>`,
      },
      {
        title: "방법 3: 일본 국가자격증 취득 (+5~10점)",
        content: `
<p>IT 업종이라면 일본 IPA(情報処理推進機構)의 국가자격증이 가장 접근하기 쉽습니다.</p>
<ul>
  <li><strong>基本情報技術者</strong> (기본정보기술자) — 입문 레벨</li>
  <li><strong>応用情報技術者</strong> (응용정보기술자) — 중급</li>
  <li><strong>データベーススペシャリスト</strong> 등 고도시험 — 상급</li>
</ul>
<p>보유 자격증 수에 따라 1개 +5점, 2개 이상 +10점입니다.</p>`,
      },
      {
        title: "방법 4: Top 300 대학 보너스 확인 (+10점)",
        content: `
<p>QS, THE, ARWU 세계 대학 랭킹 <strong>Top 300위 이내</strong> 대학을 졸업했다면 +10점을 받을 수 있습니다. 한국 주요 대학들이 포함되어 있으니 반드시 확인하세요.</p>
<p>서울대, KAIST, 연세대, 고려대, 성균관대, 포항공대, 한양대 등 다수의 한국 대학이 해당됩니다.</p>`,
      },
      {
        title: "방법 5: 이노베이션 촉진 기업 소속 (+10점)",
        content: `
<p>일본 정부가 지정한 이노베이션 촉진 기업에 소속되어 있으면 <strong>+10점</strong>을 받습니다. 대기업뿐 아니라 스타트업, 중소기업도 포함될 수 있습니다.</p>
<p>해당 여부는 회사의 HR 부서에 확인하거나, 법무성 고시를 참조하세요.</p>`,
      },
      {
        title: "방법 6: 경력 쌓기 (시간 투자)",
        content: `
<p>경력 연수가 늘어나면 자연스럽게 포인트가 올라갑니다. 특히 <strong>3년 → 5년, 7년 → 10년</strong> 경계에서 큰 폭으로 상승하므로, 해당 시점까지 기다리는 것도 전략입니다.</p>
<p>다만, 나이 포인트는 반대로 줄어드므로 <strong>가능하면 빨리 신청하는 것이 유리</strong>합니다.</p>`,
      },
    ],
    faq: [
      {
        question: "70점과 80점의 차이는 무엇인가요?",
        answer:
          "70점 이상이면 고도인재 비자를 받을 수 있고 3년 후 영주권 신청이 가능합니다. 80점 이상이면 1년 후 영주권 신청이 가능하여 영주권 취득 시간이 크게 단축됩니다.",
      },
      {
        question: "포인트 계산은 신청 시점 기준인가요?",
        answer:
          "네. 포인트는 비자 신청 시점의 조건을 기준으로 계산합니다. 따라서 JLPT 합격, 연봉 인상 등이 확정된 후에 신청하는 것이 유리합니다.",
      },
    ],
  },
  {
    slug: "jlpt-일본어-고도인재-비자",
    title: "JLPT N1/N2와 고도인재 비자: 일본어 능력별 포인트 완벽 정리",
    description:
      "JLPT N1, N2, BJT가 고도인재 비자 포인트에 미치는 영향을 상세히 정리합니다. 일본어 능력 시험별 점수 차이, 시험 준비 전략, N2에서 N1 올리는 팁까지 한눈에 확인하세요.",
    keywords: ["JLPT N1", "JLPT N2", "일본 비자 n2", "BJT", "일본어 능력시험", "고도인재 일본어", "jlpt 점수 계산"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "일본어 능력과 고도인재 포인트",
        content: `
<p>고도인재 비자 포인트 제도에서 <strong>일본어 능력</strong>은 최대 <strong>15점</strong>을 획득할 수 있는 중요한 항목입니다. 특히 다른 조건(학력, 경력)은 단기간에 바꾸기 어렵지만, 일본어 시험은 <strong>본인의 노력으로 확실하게 올릴 수 있는 포인트</strong>입니다.</p>

<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">N1/BJT480</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:100%;background:oklch(0.55 0.18 155)">15점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">N2/BJT400</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:66%;background:oklch(0.55 0.2 262)">10점</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">없음</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:3%;background:oklch(0.7 0.05 15)"></div></div></div>
</div>

<table>
  <thead><tr><th>자격/시험</th><th>포인트</th><th>난이도</th></tr></thead>
  <tbody>
    <tr><td><strong>JLPT N1</strong> 합격</td><td><strong>15점</strong></td><td>최상</td></tr>
    <tr><td><strong>BJT 480점</strong> 이상</td><td><strong>15점</strong></td><td>상</td></tr>
    <tr><td>일본어 전공 대학 졸업</td><td><strong>15점</strong></td><td>—</td></tr>
    <tr><td><strong>JLPT N2</strong> 합격</td><td><strong>10점</strong></td><td>중상</td></tr>
    <tr><td><strong>BJT 400점</strong> 이상</td><td><strong>10점</strong></td><td>중</td></tr>
    <tr><td>해당 없음</td><td>0점</td><td>—</td></tr>
  </tbody>
</table>

<div class="guide-callout guide-callout-tip"><strong>핵심:</strong> JLPT N2 → N1으로 올리면 <strong>+5점</strong>, 일본어 자격이 없는 상태에서 N1을 취득하면 <strong>+15점</strong>입니다. 70점에 5~15점 부족한 사람에게 가장 현실적인 해결책입니다.</div>`,
      },
      {
        title: "JLPT N1 vs N2: 어떤 것을 목표로 해야 할까?",
        content: `
<p>결론부터 말하면, <strong>시간이 있다면 반드시 N1을 목표</strong>로 하세요.</p>

<table>
  <thead><tr><th>비교 항목</th><th>JLPT N2</th><th>JLPT N1</th></tr></thead>
  <tbody>
    <tr><td>고도인재 포인트</td><td>10점</td><td><strong>15점</strong></td></tr>
    <tr><td>준비 기간 (독학 기준)</td><td>6~12개월</td><td>12~24개월</td></tr>
    <tr><td>합격률 (2024년 기준)</td><td>약 40%</td><td>약 30%</td></tr>
    <tr><td>일본 취업 시장 평가</td><td>기본 요건</td><td><strong>우대 조건</strong></td></tr>
    <tr><td>시험 횟수/년</td><td>7월, 12월</td><td>7월, 12월</td></tr>
  </tbody>
</table>

<p>현재 N2라면 N1까지 추가로 6~12개월 정도 필요합니다. 비자 신청 시점까지 시간적 여유가 있다면 N1을 도전하세요.</p>`,
      },
      {
        title: "BJT(비즈니스 일본어능력시험)도 인정됩니다",
        content: `
<p><strong>BJT(ビジネス日本語能力テスト)</strong>는 일본어 비즈니스 능력을 측정하는 시험으로, 고도인재 포인트에서 JLPT와 동등하게 인정됩니다.</p>

<ul>
  <li><strong>BJT 480점 이상</strong> = JLPT N1과 동일 (15점)</li>
  <li><strong>BJT 400점 이상</strong> = JLPT N2와 동일 (10점)</li>
</ul>

<p><strong>BJT의 장점:</strong></p>
<ul>
  <li>CBT(컴퓨터) 방식으로 <strong>거의 매일 응시 가능</strong></li>
  <li>결과가 즉시 나옴 (JLPT는 2~3개월 대기)</li>
  <li>비즈니스 일본어에 익숙한 직장인에게 유리</li>
</ul>

<p>JLPT 시험일까지 기다리기 어렵다면 BJT를 먼저 응시하는 것도 전략입니다.</p>`,
      },
      {
        title: "일본어 전공자 특별 조건",
        content: `
<p>해외 대학에서 <strong>일본어를 전공</strong>하고 졸업한 경우, 별도의 시험 없이도 <strong>15점</strong>을 받을 수 있습니다.</p>
<p>이 경우 JLPT나 BJT 점수와 중복으로 받을 수는 없으며, 가장 높은 점수 하나만 적용됩니다.</p>
<p><strong>증빙 서류:</strong> 대학 졸업증명서 + 성적증명서 (일본어 전공 확인 가능한 것)</p>`,
      },
      {
        title: "효율적인 JLPT 준비 전략",
        content: `
<p><strong>N2 목표 (6~12개월):</strong></p>
<ol>
  <li>기초 한자 1,000자 + 어휘 6,000개 암기</li>
  <li>문법 교재 1권 완독 (예: 新完全マスター N2)</li>
  <li>독해 연습 — NHK NEWS WEB EASY 매일 1기사</li>
  <li>청해 — 일본 팟캐스트/유튜브 매일 30분</li>
  <li>모의시험 3회 이상</li>
</ol>

<p><strong>N1 목표 (N2 합격 후 6~12개월):</strong></p>
<ol>
  <li>한자 2,000자 + 어휘 10,000개</li>
  <li>N1 전용 문법 (약 200개 문형 추가)</li>
  <li>신문/소설 독해로 독해력 강화</li>
  <li>일본 뉴스 청취 (NHK, TBS)</li>
  <li>과거 문제집 반복 풀이</li>
</ol>

<p><strong>팁:</strong> 일본에 거주 중이라면 일상 생활 자체가 최고의 학습 환경입니다. 직장에서 일본어를 사용하면 N1 준비가 훨씬 수월합니다.</p>`,
      },
    ],
    faq: [
      {
        question: "JLPT N2만으로도 고도인재 비자를 받을 수 있나요?",
        answer:
          "네, 가능합니다. N2는 10점이며 다른 항목(학력, 경력, 연봉 등)에서 60점 이상을 확보하면 됩니다. 다만 N1이면 5점 더 받을 수 있어 70점 달성이 훨씬 쉬워집니다.",
      },
      {
        question: "JLPT와 BJT를 둘 다 가지고 있으면 점수가 합산되나요?",
        answer:
          "아니요. 일본어 능력 항목에서 가장 높은 점수 하나만 인정됩니다. JLPT N1(15점)과 BJT 480+(15점)을 모두 가지고 있어도 15점입니다.",
      },
      {
        question: "JLPT 시험은 언제 볼 수 있나요?",
        answer:
          "매년 7월과 12월 총 2회 실시됩니다. 한국에서는 약 3~4개월 전에 접수가 시작됩니다. 일본에서는 일부 지역에서 추가 시행될 수 있으니 공식 사이트를 확인하세요.",
      },
    ],
  },
  {
    slug: "고도인재-비자-영주권-가이드",
    title: "고도인재 비자로 일본 영주권 받기: 1년·3년 최단 루트 완벽 가이드",
    description:
      "고도인재 비자를 통한 일본 영주권 취득 방법을 상세히 안내합니다. 70점·80점별 영주권 신청 시기, 필요 서류, 심사 기간, 주의사항까지 단계별로 정리했습니다.",
    keywords: ["일본 영주권", "고도인재 영주권", "일본 영주권 고도인재", "일본 영주권 취득", "고도인재 비자 영주권", "일본 정주"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "고도인재 비자의 영주권 혜택",
        content: `
<p>일본에서 영주권을 취득하는 일반적인 루트는 <strong>10년 이상 일본에 계속 거주</strong>하는 것입니다. 하지만 고도인재 비자를 통하면 이 기간을 대폭 단축할 수 있습니다.</p>

<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">80점+</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:10%;background:oklch(0.55 0.18 155)">1년</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">70점+</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:30%;background:oklch(0.55 0.2 262)">3년</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">일반비자</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:100%;background:oklch(0.6 0.08 15)">10년</div></div></div>
</div>

<div class="guide-stats">
  <div class="guide-stat"><div class="guide-stat-value" style="color:oklch(0.55 0.18 155)">9년</div><div class="guide-stat-label">80점 단축</div></div>
  <div class="guide-stat"><div class="guide-stat-value" style="color:oklch(0.55 0.2 262)">7년</div><div class="guide-stat-label">70점 단축</div></div>
</div>

<table>
  <thead><tr><th>포인트</th><th>영주권 신청 가능 시점</th><th>단축 기간</th></tr></thead>
  <tbody>
    <tr><td><strong>80점 이상</strong></td><td><strong>1년 후</strong></td><td>9년 단축</td></tr>
    <tr><td><strong>70점 이상</strong></td><td><strong>3년 후</strong></td><td>7년 단축</td></tr>
    <tr><td>일반 취업비자</td><td>10년 후</td><td>—</td></tr>
  </tbody>
</table>

<p>이것이 고도인재 비자가 <strong>일본 영주권의 최단 루트</strong>로 불리는 이유입니다.</p>`,
      },
      {
        title: "영주권 신청 조건",
        content: `
<p>고도인재 비자로 영주권을 신청하려면 다음 조건을 충족해야 합니다.</p>

<ol>
  <li><strong>포인트 유지</strong> — 신청 시점에서도 70점(또는 80점) 이상이어야 합니다</li>
  <li><strong>거주 기간</strong> — 70점: 3년, 80점: 1년 이상 일본에 계속 거주</li>
  <li><strong>세금·연금·보험 납부</strong> — 체납 없이 정상 납부</li>
  <li><strong>법규 준수</strong> — 범법 행위 없음</li>
  <li><strong>경제적 안정</strong> — 독립 생계 유지 능력</li>
  <li><strong>신원 보증인</strong> — 일본인 또는 영주자 1명</li>
</ol>

<div class="guide-callout guide-callout-warning"><strong>주의:</strong> "계속 거주"란 중간에 장기간 출국하지 않는 것을 의미합니다. 1회 출국 시 <strong>3개월 이상</strong>, 연간 합계 <strong>100일 이상</strong> 출국하면 "계속 거주"로 인정되지 않을 수 있습니다.</div>`,
      },
      {
        title: "80점 최단 1년 루트 상세",
        content: `
<p><strong>80점 이상</strong>으로 고도인재 비자를 취득하면, 입국(또는 자격 변경) 후 <strong>1년이 경과한 시점</strong>에서 영주권을 신청할 수 있습니다.</p>

<div class="guide-callout guide-callout-info">80점 기준 신청 후, 도쿄에서는 최근 심사에 <strong>약 1년 6개월 이상</strong> 소요되어 총 <strong>약 2년 반~3년</strong>이 걸릴 수 있습니다. 지방 입관은 비교적 빠른 편입니다.</div>

<p><strong>타임라인:</strong></p>
<div class="guide-timeline">
  <div class="guide-timeline-item"><div class="step-title">0개월 — 비자 취득</div><div class="step-desc">고도인재 비자(80점 이상)로 입국 또는 자격 변경</div></div>
  <div class="guide-timeline-item"><div class="step-title">6개월 — 중간 점검</div><div class="step-desc">세금, 연금, 보험 납부 기록 확인 (체납 없는지)</div></div>
  <div class="guide-timeline-item"><div class="step-title">10개월 — 서류 준비</div><div class="step-desc">영주권 신청 서류 준비 시작 (증빙 수집)</div></div>
  <div class="guide-timeline-item"><div class="step-title">12개월 — 영주권 신청</div><div class="step-desc">입관에 영주허가 신청서 접수</div></div>
  <div class="guide-timeline-item"><div class="step-title">24~30개월 — 영주권 허가 🎉</div><div class="step-desc">도쿄 기준 최근 심사 1년 6개월 이상 소요. 지역에 따라 편차 있음</div></div>
</div>`,
      },
      {
        title: "영주권 신청 필요 서류",
        content: `
<p>고도인재 비자를 통한 영주권 신청 시 필요한 주요 서류입니다.</p>

<ul>
  <li><strong>영주허가신청서</strong> (入管 양식)</li>
  <li><strong>포인트 계산표</strong> + 증빙 서류 일체</li>
  <li><strong>이유서</strong> — 영주를 희망하는 이유 (A4 1장 정도)</li>
  <li><strong>재직증명서</strong> — 현재 소속 확인</li>
  <li><strong>과세·납세 증명서</strong> — 시구정촌 발행 (3년분 또는 1년분)</li>
  <li><strong>건강보험·연금 납부 증명</strong></li>
  <li><strong>주민세 납세 증명서</strong></li>
  <li><strong>신원보증서</strong> + 보증인 서류</li>
  <li><strong>여권 및 재류카드 사본</strong></li>
  <li><strong>증명 사진</strong> (4cm × 3cm)</li>
</ul>

<p><strong>팁:</strong> 행정서사(行政書士)에게 의뢰하면 서류 준비부터 제출까지 대행해줍니다. 비용은 10~30만엔 정도이며, 복잡한 경우(이직 이력, 출국 기록 등)에는 전문가 도움을 받는 것이 안전합니다.</p>`,
      },
      {
        title: "영주권 심사 기간과 결과",
        content: `
<p>영주권 심사는 공식적으로는 약 4개월로 안내되고 있으나, <strong>도쿄 기준 최근에는 1년 6개월 이상</strong> 소요되는 경우가 늘고 있습니다. 지역과 시기에 따라 편차가 큽니다.</p>

<div class="guide-callout guide-callout-warning"><strong>최신 정보:</strong> 도쿄 입관은 신청 건수 증가로 심사가 크게 지연되고 있습니다. 여유를 갖고 <strong>1년 이상의 대기 기간</strong>을 감안하세요.</div>

<p><strong>심사 중 주의사항:</strong></p>
<ul>
  <li>심사 중 이직하면 불리할 수 있음 → 결과가 나올 때까지 대기 권장</li>
  <li>추가 서류 요청(資料提出通知)이 올 수 있음 → 기한 내 제출</li>
  <li>장기 출국 자제 → 심사에 영향</li>
</ul>

<p><strong>허가된 경우:</strong> 입관에서 통지 → 방문하여 재류카드를 영주자 카드로 교체</p>
<p><strong>불허된 경우:</strong> 이유를 확인 후 재신청 가능 (보통 세금/연금 문제, 출국 일수 초과 등)</p>`,
      },
      {
        title: "영주권 취득 후 주의사항",
        content: `
<p>영주권을 취득하면 체류 기간 제한 없이 일본에 거주할 수 있지만, 몇 가지 주의할 점이 있습니다.</p>

<ul>
  <li><strong>재입국 허가</strong> — 1년 이상 출국 시 재입국 허가 필요 (최대 5년)</li>
  <li><strong>재류카드 갱신</strong> — 7년마다 재류카드 갱신 필요 (영주권 자체는 영구)</li>
  <li><strong>장기 해외 체류</strong> — 일본을 생활 기반으로 하지 않으면 취소될 수 있음</li>
  <li><strong>범죄</strong> — 강제퇴거 사유에 해당하면 영주권 취소 가능</li>
</ul>

<p><strong>영주권의 장점:</strong></p>
<ul>
  <li>직종·업종 제한 없이 자유롭게 일할 수 있음</li>
  <li>주택 대출(住宅ローン) 심사에서 유리</li>
  <li>비자 갱신 걱정 없음</li>
  <li>배우자·자녀도 안정적 체류 가능</li>
</ul>`,
      },
    ],
    faq: [
      {
        question: "영주권 신청 시점에서도 70점/80점 이상이어야 하나요?",
        answer:
          "네. 고도인재 비자 취득 시점과 영주권 신청 시점 모두에서 해당 포인트를 충족해야 합니다. 예를 들어 입국 시 80점이었지만 이직으로 연봉이 줄어 70점이 된 경우, 1년 루트는 사용할 수 없고 3년 루트를 이용해야 합니다.",
      },
      {
        question: "이직하면 영주권 신청에 불리한가요?",
        answer:
          "이직 자체가 불리하진 않지만, 이직 시 14일 이내에 입관에 신고해야 하며, 포인트가 70점/80점 이상 유지되어야 합니다. 또한 영주권 심사 중 이직하면 추가 서류가 필요할 수 있어 가능하면 결과가 나온 후에 이직하는 것이 좋습니다.",
      },
      {
        question: "가족도 영주권을 받을 수 있나요?",
        answer:
          "배우자는 별도로 영주권을 신청해야 합니다. 다만 '영주자의 배우자'로서 일반 영주 신청보다 요건이 완화됩니다. 자녀는 일본에서 출생한 경우 출생신고와 함께 영주 자격을 신청할 수 있습니다.",
      },
    ],
  },
];
