export interface GuideSection {
  title: string;
  content: string; // HTML string
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  faq: GuideFAQ[];
}

const today = new Date().toISOString().split("T")[0];

export const guides: Guide[] = [
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
<table>
  <thead><tr><th>구분</th><th>기준 점수</th><th>영주권 신청</th></tr></thead>
  <tbody>
    <tr><td>일반 고도인재</td><td>70점 이상</td><td>3년 후 가능</td></tr>
    <tr><td>고속 영주권</td><td>80점 이상</td><td><strong>1년 후 가능</strong></td></tr>
  </tbody>
</table>`,
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

<p>정확한 포인트는 <a href="https://kodocalc.com">kodocalc.com 무료 계산기</a>로 즉시 확인할 수 있습니다.</p>`,
      },
      {
        title: "70점 달성을 위한 현실적인 전략",
        content: `
<p>가장 일반적인 한국인 직장인의 <strong>70점 달성 시나리오</strong>를 소개합니다.</p>

<p><strong>시나리오 1: 석사 + 5년 경력 + 500만엔 연봉 (20대)</strong></p>
<ul>
  <li>학력: 석사 20점</li>
  <li>경력: 5년 10점</li>
  <li>연봉: 500만엔 15점</li>
  <li>나이: 29세 이하 15점</li>
  <li>일본어: JLPT N2 10점</li>
  <li><strong>합계: 70점 ✅</strong></li>
</ul>

<p><strong>시나리오 2: 학사 + 10년 경력 + 700만엔 연봉 (30대)</strong></p>
<ul>
  <li>학력: 학사 10점</li>
  <li>경력: 10년 20점</li>
  <li>연봉: 700만엔 25점</li>
  <li>나이: 30~34세 10점</li>
  <li>일본어: JLPT N2 10점</li>
  <li><strong>합계: 75점 ✅</strong></li>
</ul>

<p><strong>포인트를 올리는 핵심 팁:</strong></p>
<ol>
  <li><strong>JLPT N1 취득</strong> — N2 대비 +5점, 가장 확실한 방법</li>
  <li><strong>연봉 협상</strong> — 100만엔 올리면 +5점 가능</li>
  <li><strong>일본 국가자격증</strong> — IT 관련 자격증 취득으로 +5점</li>
  <li><strong>이노베이션 기업 이직</strong> — 해당 기업 소속 시 +10점</li>
</ol>`,
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
<ol>
  <li>본인이 직접 입관에 방문하여 신청</li>
  <li>행정서사(行政書士)에게 위탁하여 대리 신청</li>
  <li>소속 기관을 통한 신청</li>
</ol>
<p>처리 기간은 통상 <strong>2주~1개월</strong>이며, 고도인재는 우선 처리됩니다.</p>`,
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
<p>포인트를 올리려면 먼저 <strong>현재 몇 점인지 정확히 파악</strong>하는 것이 중요합니다. <a href="https://kodocalc.com">kodocalc.com 계산기</a>에서 현재 조건을 입력하면 항목별 점수와 부족한 점수를 즉시 확인할 수 있습니다.</p>
<p>보통 <strong>5~15점 부족</strong>한 경우가 많으며, 아래 6가지 방법 중 2~3가지를 조합하면 충분히 달성 가능합니다.</p>`,
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
];
