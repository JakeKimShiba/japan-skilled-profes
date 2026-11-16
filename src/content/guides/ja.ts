import type { Guide } from './types';

const today = new Date().toISOString().split("T")[0];

export const guidesJa: Guide[] = [
  {
    slug: "고도인재-비자-완벽-가이드",
    title: "日本 高度専門職ビザ（HSP）完全ガイド 2026",
    description:
      "日本の高度専門職ビザ（HSP）とは何か、ポイント計算方法、ビザ類型別の違い、申請手続き、永住権の特典まで1ページですべて確認できます。70点・80点基準と実例を含む総合ガイドです。",
    keywords: ["高度専門職ビザ", "日本 高度人材", "高度人材ビザ", "HSP ビザ", "高度専門職", "日本 永住権"],
    datePublished: "2026-05-14",
    dateModified: "2026-11-16",
    sections: [
      {
        title: "高度専門職ビザとは？",
        content: `
<p><strong>高度専門職ビザ</strong>は、日本の法務省が運営する<strong>ポイント制優遇ビザ</strong>です。<strong>70点以上</strong>に加えて活動内容・報酬・所属機関等の許可要件も満たす必要があります。<strong>80点以上</strong>は永住申請の在留期間短縮に関する点数基準であり、過去時点の点数・在留期間等の条件も別途確認されます。</p>
<p>正式名称は「高度人材に対するポイント制による出入国在留管理上の優遇制度」であり、2012年に導入されて現在まで運用されています。</p>

<div class="guide-stats">
  <div class="guide-stat"><div class="guide-stat-value">70点</div><div class="guide-stat-label">ビザ取得基準</div></div>
  <div class="guide-stat"><div class="guide-stat-value">80点</div><div class="guide-stat-label">1年永住権基準</div></div>
  <div class="guide-stat"><div class="guide-stat-value">6つ</div><div class="guide-stat-label">評価カテゴリ</div></div>
  <div class="guide-stat"><div class="guide-stat-value">7大</div><div class="guide-stat-label">優遇特典</div></div>
</div>

<table>
  <thead><tr><th>区分</th><th>基準点数</th><th>永住権申請</th></tr></thead>
  <tbody>
    <tr><td>一般高度人材</td><td>70点以上</td><td>3年後に可能</td></tr>
    <tr><td>高速永住権</td><td>80点以上</td><td><strong>1年後に可能</strong></td></tr>
  </tbody>
</table>`,
      },
      {
        title: "2025年の経営・管理基準改正と高度専門職1号ハ",
        content: `
<p><strong>2025年10月16日</strong>施行の経営・管理の許可基準改正は、<strong>「経営・管理」活動を行う高度専門職1号ハにも適用</strong>されます。高いポイントでこの基準を回避することはできません。</p>
<div class="guide-callout guide-callout-warning">ポイント基準と経営・管理の許可基準は別です。この計算機は資本金・雇用・事業計画等の要件を判定しません。</div>
<ul>
  <li><strong>事業規模：</strong>資本金等3,000万円以上。法人は資本金又は出資総額、個人事業は事業の用に供される財産の総額で判断されます。</li>
  <li><strong>常勤職員：</strong>日本人・特別永住者又は永住者等の対象となる身分系在留資格の職員1人以上の雇用が必要です。</li>
  <li><strong>日本語：</strong>申請者又は常勤職員にB2相当以上の能力が必要です。JLPT N2・BJT 400点以外の確認方法も公式案内に示されています。</li>
  <li><strong>学歴・職歴：</strong>経営管理又は事業に必要な技術・知識の分野の博士・修士・専門職学位、又は3年以上の経営・管理経験が必要です。</li>
  <li><strong>事業計画・事業所：</strong>対象の申請では専門家による事業計画の確認が必要です。自宅兼用の事業所は原則として認められません。</li>
</ul>
<p><strong>既存在留者の更新：</strong>2028年10月16日までは経営状況や新基準を満たす見込み等を踏まえて判断されます。その後は原則として新基準が適用されますが、公式案内は経営・納税状況と次回更新までの適合見込みによる個別判断も示しています。自動的な更新や一律の不許可を意味しません。</p>
<p><strong>永住・高度専門職2号：</strong>経営・管理活動を前提とする場合、改正後の基準に適合しなければ、対象の永住許可や1号ハから2号への変更は認められません。70点・80点だけでは許可は保証されません。</p>
<p>出典：<a href="https://www.moj.go.jp/isa/applications/resources/10_00237.html" target="_blank" rel="noopener noreferrer">出入国在留管理庁の経営・管理基準改正案内</a>（確認日：2026年11月16日）。</p>`,
      },
      {
        title: "ビザ3つの類型と違い",
        content: `
<p>高度専門職ビザは活動内容に応じて3つの類型に分かれます。<strong>各類型でポイント配点が異なるため</strong>、自分に有利な類型を選ぶことが重要です。</p>
<table class="guide-visa-comparison" tabindex="0" aria-describedby="comparison-table-help">
  <caption class="sr-only">ビザ類型の比較</caption>
  <thead><tr><th>類型</th><th>日本語名称</th><th>対象</th><th>年収最低要件</th></tr></thead>
  <tbody>
    <tr><td><strong>学術研究</strong></td><td>高度学術研究活動（イ）</td><td>大学教授、研究員</td><td>なし</td></tr>
    <tr><td><strong>技術・人文</strong></td><td>高度専門・技術活動（ロ）</td><td>エンジニア、通訳翻訳、デザイナー</td><td>300万円以上</td></tr>
    <tr><td><strong>経営・管理</strong></td><td>高度経営・管理活動（ハ）</td><td>企業役員、経営者</td><td>300万円以上（年収加点は1,000万円から）</td></tr>
  </tbody>
</table>
<p>多くの外国人会社員は<strong>技術・人文（ロ）</strong>類型に該当します。ITエンジニア、マーケター、通訳翻訳者、デザイナーなどがこの類型です。</p>`,
      },
      {
        title: "ポイント計算項目別の詳細配点",
        content: `
<p>ポイントは大きく<strong>6つのカテゴリ</strong>に分かれ、各項目の最高点を合算します。</p>

<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">学歴</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:75%;background:oklch(0.55 0.2 262)">30点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">職歴</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:62.5%;background:oklch(0.48 0.18 200)">25点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">年収</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:100%;background:oklch(0.48 0.18 155)">40点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">年齢</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:37.5%;background:oklch(0.52 0.15 55)">15点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">日本語</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:37.5%;background:oklch(0.55 0.2 300)">15点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">特別加算</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:62.5%;background:oklch(0.5 0.15 15)">10〜25点</div></div></div>
</div>

<p><strong>① 学歴（最大30点）</strong></p>
<table>
  <thead><tr><th>学歴</th><th>学術研究・技術人文</th><th>経営管理</th></tr></thead>
  <tbody>
    <tr><td>博士</td><td>30点</td><td>20点</td></tr>
    <tr><td>修士</td><td>20点</td><td>20点</td></tr>
    <tr><td>MBA/MOT</td><td>25点</td><td>25点</td></tr>
    <tr><td>学士</td><td>10点</td><td>10点</td></tr>
    <tr><td>複数学位加算</td><td>+5点</td><td>+5点</td></tr>
  </tbody>
</table>

<p><strong>② 職歴（最大20点 / 経営管理：25点）</strong></p>
<table>
  <thead><tr><th>職歴年数</th><th>学術・技術</th><th>経営管理</th></tr></thead>
  <tbody>
    <tr><td>10年以上</td><td>20点</td><td>25点</td></tr>
    <tr><td>7〜9年</td><td>15点</td><td>20点</td></tr>
    <tr><td>5〜6年</td><td>10点</td><td>15点</td></tr>
    <tr><td>3〜4年</td><td>5点</td><td>10点</td></tr>
  </tbody>
</table>

<p><strong>③ 年収（最大40点）</strong></p>
<ul>
  <li>1,000万円以上：40点</li>
  <li>900万円〜：35点</li>
  <li>800万円〜：30点</li>
  <li>700万円〜：25点</li>
  <li>600万円〜：20点</li>
  <li>500万円〜：15点</li>
  <li>400万円〜：10点</li>
  <li>最初の年収加点区分未満は0点です。技術・経営活動には別途年収300万円以上が必要です。</li>
</ul>

<p><strong>④ 年齢（最大15点 / 技術・人文のみ）</strong></p>
<ul>
  <li>29歳以下：15点</li>
  <li>30〜34歳：10点</li>
  <li>35〜39歳：5点</li>
  <li>40歳以上：0点</li>
</ul>

<p><strong>⑤ 日本語能力（最大15点）</strong></p>
<ul>
  <li>JLPT N1またはBJT 480点以上：15点</li>
  <li>JLPT N2またはBJT 400点以上：10点</li>
</ul>

<p><strong>⑥ 特別加算項目</strong></p>
<ul>
  <li>日本の大学卒業：+10点</li>
  <li>Top 300大学卒業：+10点</li>
  <li>イノベーション促進企業所属：+10点</li>
  <li>日本の国家資格保有：+5〜10点</li>
</ul>

<div class="guide-callout guide-callout-info">正確なポイントは<a href="/">kodocalc.com 無料計算機</a>で即座に確認できます。項目別スコアと不足ポイントを自動で分析します。</div>`,
      },
      {
        title: "70点達成のための現実的な戦略",
        content: `
<p>最も一般的な外国人会社員の<strong>70点達成シナリオ</strong>を紹介します。</p>

<p><strong>シナリオ1：修士 + 5年職歴 + 500万円年収（20代）</strong></p>
<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">学歴</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:66%;background:oklch(0.55 0.2 262)">修士 20</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">職歴</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.48 0.18 200)">5年 10</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">年収</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:50%;background:oklch(0.48 0.18 155)">500万 15</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">年齢</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:50%;background:oklch(0.52 0.15 55)">29↓ 15</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">日本語</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.2 300)">N2 10</div></div></div>
</div>
<div class="guide-stats" style="max-width:200px;margin:0.5rem auto">
  <div class="guide-stat"><div class="guide-stat-value">70点 ✅</div><div class="guide-stat-label">合計</div></div>
</div>

<p><strong>シナリオ2：学士 + 10年職歴 + 700万円年収（30代）</strong></p>
<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">学歴</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.2 262)">学士 10</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">職歴</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:66%;background:oklch(0.48 0.18 200)">10年 20</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">年収</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:83%;background:oklch(0.48 0.18 155)">700万 25</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">年齢</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.52 0.15 55)">30代 10</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">日本語</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:33%;background:oklch(0.55 0.2 300)">N2 10</div></div></div>
</div>
<div class="guide-stats" style="max-width:200px;margin:0.5rem auto">
  <div class="guide-stat"><div class="guide-stat-value">75点 ✅</div><div class="guide-stat-label">合計</div></div>
</div>

<div class="guide-callout guide-callout-tip"><strong>ポイントを上げる核心ヒント：</strong> ① JLPT N1取得（+5点） ② 年収100万円↑（+5点） ③ 日本国家資格（+5点） ④ イノベーション企業への転職（+10点）</div>`,
      },
      {
        title: "高度専門職ビザの7大特典",
        content: `
<p>高度専門職ビザとして認定されると、以下の優遇措置を受けることができます。</p>
<ol>
  <li><strong>複合的活動許可</strong> — 1つのビザで複数の活動が可能（例：エンジニアでありながら講義）</li>
  <li><strong>5年の在留期間</strong> — 最長5年の在留期間付与</li>
  <li><strong>配偶者の就労許可</strong> — 配偶者が別途就労ビザなしで働ける</li>
  <li><strong>親の招聘</strong> — 一定条件下で本国の親を日本に招聘可能</li>
  <li><strong>家事使用人の雇用</strong> — 外国人家事使用人の雇用許可</li>
  <li><strong>永住権申請短縮</strong> — 70点：3年、<strong>80点：1年</strong></li>
  <li><strong>入国審査優遇</strong> — 審査処理期間の短縮</li>
</ol>`,
      },
      {
        title: "申請手続きと必要書類",
        content: `
<p>高度専門職ビザは<strong>出入国在留管理庁（入管）</strong>に申請します。</p>

<div class="guide-flow">
  <div class="guide-flow-step secondary">📋 書類準備</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step secondary">📊 ポイント計算</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step primary">🏛️ 入管申請</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step secondary">⏳ 審査（2週間〜1ヶ月）</div>
  <div class="guide-flow-arrow">→</div>
  <div class="guide-flow-step accent">✅ ビザ取得</div>
</div>

<p><strong>基本必要書類：</strong></p>
<ul>
  <li>在留資格認定証明書交付申請書または在留資格変更許可申請書</li>
  <li>ポイント計算表（法務省様式）</li>
  <li>学位証明書（学歴ポイント証明）</li>
  <li>在職証明書及び経歴証明書</li>
  <li>源泉徴収票または給与明細書（年収証明）</li>
  <li>JLPT/BJT合格証（日本語能力証明）</li>
  <li>パスポートの写し</li>
  <li>証明写真（4cm × 3cm）</li>
</ul>

<p><strong>申請方法：</strong></p>
<div class="guide-timeline">
  <div class="guide-timeline-item"><div class="step-title">1. ポイント自己診断</div><div class="step-desc">kodocalc.comで現在のスコアを確認し不足項目を把握</div></div>
  <div class="guide-timeline-item"><div class="step-title">2. 証明書類の収集</div><div class="step-desc">学位証明書、在職証明書、源泉徴収票、JLPT合格証など</div></div>
  <div class="guide-timeline-item"><div class="step-title">3. ポイント計算表の作成</div><div class="step-desc">法務省様式に沿って項目別スコアを記載し証明書類を添付</div></div>
  <div class="guide-timeline-item"><div class="step-title">4. 入管申請</div><div class="step-desc">本人来庁、行政書士による代理、または所属機関を通じて提出</div></div>
  <div class="guide-timeline-item"><div class="step-title">5. 審査及び結果</div><div class="step-desc">通常2週間〜1ヶ月。高度人材は優先処理されます</div></div>
</div>`,
      },
    ],
    faq: [
      {
        question: "高度専門職ビザと一般就労ビザ（技術・人文知識・国際業務）の違いは？",
        answer:
          "一般就労ビザは1つの活動のみ許可され在留期間が1〜5年ですが、高度専門職ビザは複合活動が可能で配偶者就労、親の招聘など特別な特典があります。最大の違いは永住権申請の短縮（一般10年→高度人材1〜3年）です。",
      },
      {
        question: "ポイントが70点未満の場合はどうすればよいですか？",
        answer:
          "JLPT N1取得（+5〜15点）、年収アップの交渉、日本の国家資格取得、イノベーション促進企業への転職などでスコアを上げることができます。kodocalc.com計算機の「提案」機能を活用すると、最も効率的なスコアアップ方法を確認できます。",
      },
      {
        question: "高度専門職ビザで転職は可能ですか？",
        answer:
          "高度専門職ビザ1号は所属機関に紐づいています。転職時には在留資格変更申請が必要です。高度専門職ビザ2号（無期限）は所属機関に関係なく活動可能です。",
      },
      {
        question: "海外の大学卒業でも学歴ポイントは得られますか？",
        answer:
          "はい。海外を含むすべての大学卒業が学歴ポイントの対象です。また、QS、THE、ARWU世界大学ランキングTop 300以内の大学卒業者は+10点のボーナスを受けることができます。",
      },
      {
        question: "永住権申請時の注意事項は？",
        answer:
          "税金の滞納がないこと、転職時に14日以内に入管への届出義務を履行していること。また健康保険・年金の納付記録も審査されます。軽微な問題は行政書士を通じて理由書を作成すれば解決する場合が多いです。",
      },
    ],
  },
  {
    slug: "포인트-올리는-방법",
    title: "高度専門職ポイントを上げる6つの現実的な方法",
    description:
      "高度専門職ビザ70点・80点に到達するための実践戦略。JLPT、年収交渉、資格、大学ボーナスなど最も効果的なポイント向上方法をまとめました。",
    keywords: ["高度人材 ポイント", "ポイント 上げる", "JLPT N1", "日本 資格", "高度人材 70点"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "現在のスコアを診断する",
        content: `
<p>ポイントを上げるには、まず<strong>現在何点なのかを正確に把握</strong>することが重要です。<a href="/">kodocalc.com計算機</a>で現在の条件を入力すると、項目別スコアと不足ポイントを即座に確認できます。</p>

<div class="guide-callout guide-callout-info">通常<strong>5〜15点不足</strong>している場合が多く、以下の6つの方法のうち2〜3つを組み合わせれば十分に達成可能です。</div>

<div class="guide-stats">
  <div class="guide-stat"><div class="guide-stat-value">+15</div><div class="guide-stat-label">JLPT N1取得</div></div>
  <div class="guide-stat"><div class="guide-stat-value">+10</div><div class="guide-stat-label">Top300大学</div></div>
  <div class="guide-stat"><div class="guide-stat-value">+10</div><div class="guide-stat-label">イノベーション企業</div></div>
  <div class="guide-stat"><div class="guide-stat-value">+5~15</div><div class="guide-stat-label">年収アップ</div></div>
</div>`,
      },
      {
        title: "方法1：JLPT N1取得（+5〜15点）",
        content: `
<p>最も確実で、自分の努力で達成できる方法です。</p>
<table>
  <thead><tr><th>資格</th><th>点数</th><th>備考</th></tr></thead>
  <tbody>
    <tr><td>JLPT N1 / BJT 480+</td><td><strong>15点</strong></td><td>日本語専攻大学卒業も同等</td></tr>
    <tr><td>JLPT N2 / BJT 400+</td><td>10点</td><td>N1に比べ5点低い</td></tr>
    <tr><td>なし</td><td>0点</td><td>—</td></tr>
  </tbody>
</table>
<p>現在N2であればN1取得で<strong>+5点</strong>、日本語資格がなければN2で<strong>+10点</strong>、N1で<strong>+15点</strong>上げることができます。</p>`,
      },
      {
        title: "方法2：年収交渉または転職（+5〜15点）",
        content: `
<p>年収帯ごとに5点単位でポイントが上がります。<strong>100万円上げるだけで+5点</strong>が可能です。</p>
<p>転職の場合は、必ず新しい会社の<strong>雇用契約書上の年収</strong>を基準とします。ボーナスは契約に明記されている場合のみ含まれます。</p>`,
      },
      {
        title: "方法3：日本の国家資格取得（+5〜10点）",
        content: `
<p>IT業界であれば、日本のIPA（情報処理推進機構）の国家資格が最もアクセスしやすいです。</p>
<ul>
  <li><strong>基本情報技術者</strong> — 入門レベル</li>
  <li><strong>応用情報技術者</strong> — 中級</li>
  <li><strong>データベーススペシャリスト</strong>等の高度試験 — 上級</li>
</ul>
<p>保有資格数に応じて1つで+5点、2つ以上で+10点です。</p>`,
      },
      {
        title: "方法4：Top 300大学ボーナスの確認（+10点）",
        content: `
<p>QS、THE、ARWU世界大学ランキング<strong>Top 300位以内</strong>の大学を卒業していれば+10点を得ることができます。多くの有名大学が含まれているので必ず確認してください。</p>
<p>東京大学、京都大学、大阪大学、東北大学、早稲田大学、慶應義塾大学をはじめ、海外の主要大学も多数該当します。</p>`,
      },
      {
        title: "方法5：イノベーション促進企業への所属（+10点）",
        content: `
<p>日本政府が指定したイノベーション促進企業に所属していれば<strong>+10点</strong>を得られます。大企業だけでなく、スタートアップや中小企業も含まれる可能性があります。</p>
<p>該当するかどうかは会社のHR部門に確認するか、法務省告示を参照してください。</p>`,
      },
      {
        title: "方法6：職歴を積む（時間投資）",
        content: `
<p>職歴年数が増えると自然にポイントが上がります。特に<strong>3年→5年、7年→10年</strong>の境界で大幅に上昇するため、そのタイミングまで待つことも戦略です。</p>
<p>ただし、年齢ポイントは逆に減少するため、<strong>できるだけ早く申請することが有利</strong>です。</p>`,
      },
    ],
    faq: [
      {
        question: "70点と80点の違いは何ですか？",
        answer:
          "70点以上であれば高度専門職ビザを取得でき、3年後に永住権申請が可能です。80点以上であれば1年後に永住権申請が可能となり、永住権取得までの期間が大幅に短縮されます。",
      },
      {
        question: "ポイント計算は申請時点を基準としますか？",
        answer:
          "はい。ポイントはビザ申請時点の条件を基準に計算します。そのため、JLPT合格や年収アップなどが確定した後に申請するのが有利です。",
      },
    ],
  },
  {
    slug: "jlpt-일본어-고도인재-비자",
    title: "JLPT N1/N2と高度専門職ビザ：日本語能力別ポイント完全ガイド",
    description:
      "JLPT N1、N2、BJTが高度専門職ビザポイントに与える影響を詳しく解説します。日本語能力試験別のスコア差、試験準備戦略、N2からN1に上げるコツまで一目で確認できます。",
    keywords: ["JLPT N1", "JLPT N2", "日本 ビザ N2", "BJT", "日本語能力試験", "高度人材 日本語", "JLPT スコア 計算"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "日本語能力と高度専門職ポイント",
        content: `
<p>高度専門職ビザポイント制度において<strong>日本語能力</strong>は最大<strong>15点</strong>を獲得できる重要な項目です。特に他の条件（学歴、職歴）は短期間で変えにくいですが、日本語試験は<strong>自分の努力で確実に上げられるポイント</strong>です。</p>

<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">N1/BJT480</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:100%;background:oklch(0.48 0.18 155)">15点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">N2/BJT400</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:66%;background:oklch(0.55 0.2 262)">10点</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">なし</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:3%;background:oklch(0.7 0.05 15)"></div></div></div>
</div>

<table>
  <thead><tr><th>資格／試験</th><th>ポイント</th><th>難易度</th></tr></thead>
  <tbody>
    <tr><td><strong>JLPT N1</strong>合格</td><td><strong>15点</strong></td><td>最上級</td></tr>
    <tr><td><strong>BJT 480点</strong>以上</td><td><strong>15点</strong></td><td>上級</td></tr>
    <tr><td>日本語専攻大学卒業</td><td><strong>15点</strong></td><td>—</td></tr>
    <tr><td><strong>JLPT N2</strong>合格</td><td><strong>10点</strong></td><td>中上級</td></tr>
    <tr><td><strong>BJT 400点</strong>以上</td><td><strong>10点</strong></td><td>中級</td></tr>
    <tr><td>該当なし</td><td>0点</td><td>—</td></tr>
  </tbody>
</table>

<div class="guide-callout guide-callout-tip"><strong>ポイント：</strong> JLPT N2 → N1に上げると<strong>+5点</strong>、日本語資格がない状態からN1を取得すると<strong>+15点</strong>です。70点に5〜15点不足している方にとって最も現実的な解決策です。</div>`,
      },
      {
        title: "JLPT N1 vs N2：どちらを目標にすべきか？",
        content: `
<p>結論から言うと、<strong>時間があるなら必ずN1を目標</strong>にしてください。</p>

<table>
  <thead><tr><th>比較項目</th><th>JLPT N2</th><th>JLPT N1</th></tr></thead>
  <tbody>
    <tr><td>高度人材ポイント</td><td>10点</td><td><strong>15点</strong></td></tr>
    <tr><td>準備期間（独学基準）</td><td>6〜12ヶ月</td><td>12〜24ヶ月</td></tr>
    <tr><td>合格率（2024年基準）</td><td>約40%</td><td>約30%</td></tr>
    <tr><td>日本就職市場での評価</td><td>基本要件</td><td><strong>優遇条件</strong></td></tr>
    <tr><td>試験回数／年</td><td>7月、12月</td><td>7月、12月</td></tr>
  </tbody>
</table>

<p>現在N2であれば、N1まで追加で6〜12ヶ月ほど必要です。ビザ申請時点まで時間的余裕があればN1に挑戦してください。</p>`,
      },
      {
        title: "BJT（ビジネス日本語能力テスト）も認められます",
        content: `
<p><strong>BJT（ビジネス日本語能力テスト）</strong>はビジネス日本語能力を測定する試験で、高度人材ポイントにおいてJLPTと同等に認められています。</p>

<ul>
  <li><strong>BJT 480点以上</strong> = JLPT N1と同等（15点）</li>
  <li><strong>BJT 400点以上</strong> = JLPT N2と同等（10点）</li>
</ul>

<p><strong>BJTの利点：</strong></p>
<ul>
  <li>CBT（コンピュータ）方式で<strong>ほぼ毎日受験可能</strong></li>
  <li>結果が即時判明（JLPTは2〜3ヶ月待ち）</li>
  <li>ビジネス日本語に慣れた会社員に有利</li>
</ul>

<p>JLPT試験日まで待てない場合は、BJTを先に受験するのも戦略です。</p>`,
      },
      {
        title: "日本語専攻者の特別条件",
        content: `
<p>海外の大学で<strong>日本語を専攻</strong>して卒業した場合、別途の試験なしでも<strong>15点</strong>を得ることができます。</p>
<p>この場合、JLPTやBJTのスコアと重複して加算されることはなく、最も高いスコア1つのみが適用されます。</p>
<p><strong>証明書類：</strong>大学卒業証明書 + 成績証明書（日本語専攻が確認できるもの）</p>`,
      },
      {
        title: "効率的なJLPT準備戦略",
        content: `
<p><strong>N2目標（6〜12ヶ月）：</strong></p>
<ol>
  <li>基礎漢字1,000字 + 語彙6,000語の暗記</li>
  <li>文法教材1冊を完読（例：新完全マスター N2）</li>
  <li>読解練習 — NHK NEWS WEB EASY 毎日1記事</li>
  <li>聴解 — 日本のポッドキャスト/YouTube 毎日30分</li>
  <li>模擬試験3回以上</li>
</ol>

<p><strong>N1目標（N2合格後6〜12ヶ月）：</strong></p>
<ol>
  <li>漢字2,000字 + 語彙10,000語</li>
  <li>N1専用文法（約200の文型を追加）</li>
  <li>新聞・小説の読解で読解力を強化</li>
  <li>日本のニュース聴取（NHK、TBS）</li>
  <li>過去問題集の繰り返し演習</li>
</ol>

<p><strong>ヒント：</strong>日本に在住中であれば日常生活そのものが最高の学習環境です。職場で日本語を使用していればN1の準備がはるかに楽になります。</p>`,
      },
    ],
    faq: [
      {
        question: "JLPT N2だけでも高度専門職ビザを取得できますか？",
        answer:
          "はい、可能です。N2は10点で、他の項目（学歴、職歴、年収等）で60点以上を確保すれば取得できます。ただしN1であれば5点多く得られるため、70点達成がはるかに容易になります。",
      },
      {
        question: "JLPTとBJTの両方を持っている場合、スコアは合算されますか？",
        answer:
          "いいえ。日本語能力の項目では最も高いスコア1つのみが認められます。JLPT N1（15点）とBJT 480+（15点）の両方を持っていても15点です。",
      },
      {
        question: "JLPT試験はいつ受けられますか？",
        answer:
          "毎年7月と12月の計2回実施されます。海外では約3〜4ヶ月前に申込が開始されます。日本国内では一部地域で追加実施されることがありますので、公式サイトをご確認ください。",
      },
    ],
  },
  {
    slug: "고도인재-비자-영주권-가이드",
    title: "高度専門職ビザで日本の永住権を取得：1年・3年最短ルート完全ガイド",
    description:
      "高度専門職ビザを通じた日本の永住権取得方法を詳しく案内します。70点・80点別の永住権申請時期、必要書類、審査期間、注意事項までステップごとに整理しました。",
    keywords: ["日本 永住権", "高度人材 永住権", "日本 永住権 高度人材", "日本 永住権 取得", "高度専門職ビザ 永住権", "日本 定住"],
    datePublished: "2026-05-14",
    dateModified: today,
    sections: [
      {
        title: "高度専門職ビザの永住権特典",
        content: `
<p>日本で永住権を取得する一般的なルートは<strong>10年以上日本に継続して居住</strong>することです。しかし高度専門職ビザを通じればこの期間を大幅に短縮できます。</p>

<div class="guide-bars">
  <div class="guide-bar-row"><span class="guide-bar-label">80点+</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:10%;background:oklch(0.48 0.18 155)">1年</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">70点+</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:30%;background:oklch(0.55 0.2 262)">3年</div></div></div>
  <div class="guide-bar-row"><span class="guide-bar-label">一般ビザ</span><div class="guide-bar-track"><div class="guide-bar-fill" style="width:100%;background:oklch(0.6 0.08 15)">10年</div></div></div>
</div>

<div class="guide-stats">
  <div class="guide-stat"><div class="guide-stat-value" style="color:oklch(0.55 0.18 155)">9年</div><div class="guide-stat-label">80点短縮</div></div>
  <div class="guide-stat"><div class="guide-stat-value" style="color:oklch(0.55 0.2 262)">7年</div><div class="guide-stat-label">70点短縮</div></div>
</div>

<table>
  <thead><tr><th>ポイント</th><th>永住権申請可能時点</th><th>短縮期間</th></tr></thead>
  <tbody>
    <tr><td><strong>80点以上</strong></td><td><strong>1年後</strong></td><td>9年短縮</td></tr>
    <tr><td><strong>70点以上</strong></td><td><strong>3年後</strong></td><td>7年短縮</td></tr>
    <tr><td>一般就労ビザ</td><td>10年後</td><td>—</td></tr>
  </tbody>
</table>

<p>これが高度専門職ビザが<strong>日本永住権の最短ルート</strong>と呼ばれる理由です。</p>`,
      },
      {
        title: "永住権申請条件",
        content: `
<p>高度専門職ビザで永住権を申請するには、以下の条件を満たす必要があります。</p>

<ol>
  <li><strong>ポイント維持</strong> — 申請時点でも70点（または80点）以上であること</li>
  <li><strong>居住期間</strong> — 70点：3年、80点：1年以上日本に継続居住</li>
  <li><strong>税金・年金・保険の納付</strong> — 滞納なく正常に納付</li>
  <li><strong>法規遵守</strong> — 犯罪行為がないこと</li>
  <li><strong>経済的安定</strong> — 独立した生計維持能力</li>
  <li><strong>身元保証人</strong> — 日本人または永住者1名</li>
</ol>

<div class="guide-callout guide-callout-warning"><strong>注意：</strong>「継続居住」とは、途中で長期間出国しないことを意味します。1回の出国で<strong>3ヶ月以上</strong>、年間合計<strong>100日以上</strong>出国すると「継続居住」と認められない可能性があります。</div>`,
      },
      {
        title: "80点 最短1年ルートの詳細",
        content: `
<p><strong>80点以上</strong>で高度専門職ビザを取得すれば、入国（または資格変更）後<strong>1年が経過した時点</strong>で永住権を申請できます。</p>

<div class="guide-callout guide-callout-info">80点基準で申請後、東京では最近の審査に<strong>約1年6ヶ月以上</strong>かかっており、合計<strong>約2年半〜3年</strong>を要する可能性があります。地方の入管は比較的早い傾向です。</div>

<p><strong>タイムライン：</strong></p>
<div class="guide-timeline">
  <div class="guide-timeline-item"><div class="step-title">0ヶ月 — ビザ取得</div><div class="step-desc">高度専門職ビザ（80点以上）で入国または資格変更</div></div>
  <div class="guide-timeline-item"><div class="step-title">6ヶ月 — 中間チェック</div><div class="step-desc">税金、年金、保険の納付記録を確認（滞納がないか）</div></div>
  <div class="guide-timeline-item"><div class="step-title">10ヶ月 — 書類準備</div><div class="step-desc">永住権申請書類の準備開始（証明書類の収集）</div></div>
  <div class="guide-timeline-item"><div class="step-title">12ヶ月 — 永住権申請</div><div class="step-desc">入管に永住許可申請書を提出</div></div>
  <div class="guide-timeline-item"><div class="step-title">24〜30ヶ月 — 永住権許可 🎉</div><div class="step-desc">東京基準で最近の審査は1年6ヶ月以上所要。地域により差異あり</div></div>
</div>`,
      },
      {
        title: "永住権申請の必要書類",
        content: `
<p>高度専門職ビザを通じた永住権申請時に必要な主要書類です。</p>

<ul>
  <li><strong>永住許可申請書</strong>（入管様式）</li>
  <li><strong>ポイント計算表</strong> + 証明書類一式</li>
  <li><strong>理由書</strong> — 永住を希望する理由（A4用紙1枚程度）</li>
  <li><strong>在職証明書</strong> — 現在の所属確認</li>
  <li><strong>課税・納税証明書</strong> — 市区町村発行（3年分または1年分）</li>
  <li><strong>健康保険・年金納付証明</strong></li>
  <li><strong>住民税納税証明書</strong></li>
  <li><strong>身元保証書</strong> + 保証人書類</li>
  <li><strong>パスポート及び在留カードの写し</strong></li>
  <li><strong>証明写真</strong>（4cm × 3cm）</li>
</ul>

<p><strong>ヒント：</strong>行政書士に依頼すれば書類準備から提出まで代行してもらえます。費用は10〜30万円程度で、複雑な場合（転職履歴、出国記録等）は専門家の助けを借りることをおすすめします。</p>`,
      },
      {
        title: "永住権審査期間と結果",
        content: `
<p>永住権の審査は公式には約4ヶ月と案内されていますが、<strong>東京基準で最近は1年6ヶ月以上</strong>かかるケースが増えています。地域や時期により差異が大きいです。</p>

<div class="guide-callout guide-callout-warning"><strong>最新情報：</strong>東京入管は申請件数の増加により審査が大幅に遅延しています。余裕を持って<strong>1年以上の待機期間</strong>を見込んでください。</div>

<p><strong>審査中の注意事項：</strong></p>
<ul>
  <li>審査中に転職すると不利になる可能性あり → 結果が出るまで待機推奨</li>
  <li>追加書類の提出要請（資料提出通知）が届く場合あり → 期限内に提出</li>
  <li>長期出国を控える → 審査に影響</li>
</ul>

<p><strong>許可された場合：</strong>入管から通知 → 来庁して在留カードを永住者カードに交換</p>
<p><strong>不許可の場合：</strong>理由を確認後、再申請可能（主に税金/年金の問題、出国日数超過など）</p>`,
      },
      {
        title: "永住権取得後の注意事項",
        content: `
<p>永住権を取得すれば在留期間の制限なく日本に居住できますが、いくつか注意すべき点があります。</p>

<ul>
  <li><strong>再入国許可</strong> — 1年以上出国する場合は再入国許可が必要（最大5年）</li>
  <li><strong>在留カードの更新</strong> — 7年ごとに在留カードの更新が必要（永住権自体は永久）</li>
  <li><strong>長期海外滞在</strong> — 日本を生活基盤としていないと取り消される可能性あり</li>
  <li><strong>犯罪</strong> — 強制退去事由に該当すれば永住権取消の可能性あり</li>
</ul>

<p><strong>永住権の利点：</strong></p>
<ul>
  <li>職種・業種の制限なく自由に働ける</li>
  <li>住宅ローンの審査で有利</li>
  <li>ビザ更新の心配なし</li>
  <li>配偶者・子どもも安定した在留が可能</li>
</ul>`,
      },
    ],
    faq: [
      {
        question: "永住権申請時点でも70点/80点以上が必要ですか？",
        answer:
          "はい。高度専門職ビザ取得時点と永住権申請時点の両方で該当ポイントを満たしている必要があります。例えば入国時に80点だったが転職で年収が下がり70点になった場合、1年ルートは利用できず3年ルートを利用する必要があります。",
      },
      {
        question: "転職すると永住権申請に不利ですか？",
        answer:
          "転職自体が不利になるわけではありませんが、転職時に14日以内に入管へ届出が必要であり、ポイントが70点/80点以上を維持している必要があります。また永住権審査中に転職すると追加書類が必要になる場合があるため、可能であれば結果が出た後に転職することをおすすめします。",
      },
      {
        question: "家族も永住権を取得できますか？",
        answer:
          "配偶者は別途永住権を申請する必要があります。ただし「永住者の配偶者」として一般の永住申請より要件が緩和されます。子どもは日本で出生した場合、出生届とともに永住資格を申請することができます。",
      },
    ],
  },
];
