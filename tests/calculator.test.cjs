const assert = require('node:assert/strict');
const { test } = require('node:test');
const { base } = require('./fixtures.cjs');
const { VisaCalculatorService } = require('../src/services/VisaCalculatorService.ts');
const { PointsCalculationService } = require('../src/services/PointsCalculationService.ts');
const { calculateTotalPoints, getCategoryPoints } = require('../src/lib/calculator.ts');
const { decodePointsData } = require('../src/lib/urlShare.ts');

const calculate = data => VisaCalculatorService.calculatePoints({ ...base, ...data });
const high = {
  ...base, educationLevel: 'doctorate', workExperience: '10plus',
  annualSalary: '8m', japaneseLanguage: 'n1', universityEligible: true,
};

test('Unselected activity has zero points and no qualification', () => {
  const result = calculate({ visaType: null });
  assert.equal(result.totalPoints, 0);
  assert.equal(result.isQualified, false);
  assert.equal(Object.values(result.categoryPoints).reduce((a, b) => a + b, 0), 0);
});

test('Ordinary technical profile totals 50 with matching categories', () => {
  const result = calculate({});
  assert.equal(result.totalPoints, 50);
  assert.equal(Object.values(result.categoryPoints).reduce((a, b) => a + b, 0), 50);
  assert.equal(result.isQualified, false);
});

test('Complete valid 70 and 80 point profiles have the correct status', () => {
  for (const [count, score] of [[0, 70], [2, 80]]) {
    const result = calculate({ japaneseLanguage: 'n1', licenses: ['other'], jpNationalLicenses: count });
    assert.equal(result.totalPoints, score);
    assert.equal(result.isValid, true);
    assert.equal(result.isQualified, true);
    assert.equal(result.isPremium, score === 80);
  }
});

test('Academic research counts unique valid achievements and ignores none', () => {
  const profile = { ...base, visaType: 'academic' };
  assert.equal(getCategoryPoints({ ...profile, researchAchievements: ['patent_invention'] }).research, 20);
  assert.equal(getCategoryPoints({ ...profile, researchAchievements: ['patent_invention', 'academic_database'] }).research, 25);
  assert.equal(getCategoryPoints({ ...profile, researchAchievements: ['none'] }).research, 0);
  assert.equal(getCategoryPoints({ ...profile, researchAchievements: ['unknown'] }).research, 0);
  assert.equal(getCategoryPoints({ ...profile, researchAchievements: ['patent_invention', 'patent_invention'] }).research, 20);
});

for (const visaType of ['academic', 'technical']) {
  test(`${visaType} offers 6M and 7M to both younger age bands`, () => {
    for (const age of ['29under', '30to34']) {
      const options = PointsCalculationService.getAvailableSalaryOptions(age, visaType);
      assert.ok(options.includes('6m'));
      assert.ok(options.includes('7m'));
      assert.equal(calculate({ visaType, age, annualSalary: '6m' }).categoryPoints.salary, 20);
      assert.equal(calculate({ visaType, age, annualSalary: '7m' }).categoryPoints.salary, 25);
    }
  });
}

test('Below-minimum technical income cannot qualify even with 90 points', () => {
  const result = calculate({ ...high, annualSalary: 'under3m' });
  assert.equal(result.totalPoints, 90);
  assert.equal(result.isQualified, false);
  assert.equal(result.isPremium, false);
  assert.deepEqual(result.qualificationStatus.benefits, []);
  assert.deepEqual(result.suggestions, []);
});

test('Incomplete high-score profiles remain provisional for each required field', () => {
  for (const field of ['educationLevel', 'workExperience', 'age', 'annualSalary']) {
    const result = calculate({ ...high, [field]: '' });
    assert.ok(result.totalPoints >= 80, field);
    assert.equal(result.isComplete, false, field);
    assert.equal(result.isQualified, false, field);
    assert.equal(result.isPremium, false, field);
    assert.deepEqual(result.suggestions, [], field);
  }
});

test('Business minimum is 3M, while salary points start at 10M', () => {
  const profile = {
    ...high, visaType: 'business', annualSalary: '3to10m', businessExecutiveBonus: 'executive_senior',
  };
  assert.equal(calculate(profile).totalPoints, 80);
  assert.equal(calculate(profile).categoryPoints.salary, 0);
  assert.equal(calculate(profile).isQualified, true);
  assert.equal(calculate({ ...profile, annualSalary: 'under3m' }).isQualified, false);
  assert.equal(calculate({ ...profile, annualSalary: '10m' }).categoryPoints.salary, 10);
});

test('Ambiguous legacy salary ranges cannot bypass the minimum-income check', () => {
  for (const [visaType, ranges] of [
    ['technical', ['under5m', 'under6m', 'under8m']], ['business', ['under10m']],
  ]) {
    for (const annualSalary of ranges) {
      const result = calculate({ ...high, visaType, annualSalary });
      assert.equal(result.isQualified, false);
      assert.ok(result.validation.errors.some(error => error.code === 'AMBIGUOUS_SALARY'));
    }
  }
});

test('Valid zero-point salary ranges satisfy the technical 3M minimum', () => {
  for (const [age, annualSalary] of [
    ['29under', '3to4m'], ['30to34', '3to5m'], ['35to39', '3to6m'], ['40plus', '3to8m'],
  ]) {
    const result = calculate({ age, annualSalary });
    assert.equal(result.isValid, true);
    assert.equal(result.categoryPoints.salary, 0);
  }
});

test('Academic profiles can qualify below 3M', () => {
  const result = calculate({ ...high, visaType: 'academic', workExperience: '7plus', annualSalary: 'under3m' });
  assert.equal(result.totalPoints, 85);
  assert.equal(result.isValid, true);
  assert.equal(result.isQualified, true);
});

test('Salary choices must match both activity and age', () => {
  for (const data of [{ annualSalary: '30m' }, { age: '40plus', annualSalary: '4m' }]) {
    const result = calculate({ ...high, ...data });
    assert.equal(result.isValid, false);
    assert.ok(result.validation.errors.some(error => error.code === 'INVALID_SALARY_OPTION'));
  }
});

test('BJT 400 earns ten points and shares the N2 education restriction', () => {
  assert.equal(calculateTotalPoints({ ...base, japaneseLanguage: 'bjt400' }), 60);
  for (const japaneseLanguage of ['n2', 'bjt400']) {
    const result = calculate({ ...high, japaneseLanguage, japaneseEducation: true });
    assert.equal(result.isQualified, false);
    assert.ok(result.validation.errors.some(error => error.code === 'JAPANESE_EDUCATION_N2_CONFLICT'));
  }
});

test('Unscored legacy academic bonuses never inflate a category total', () => {
  const data = { ...base, visaType: 'academic', contractResearchBonus: true, innovativeFieldBonus: true };
  assert.equal(calculateTotalPoints(data), calculateTotalPoints({ ...base, visaType: 'academic' }));
  assert.equal(calculateTotalPoints(data), Object.values(getCategoryPoints(data)).reduce((a, b) => a + b, 0));
});

test('Unsupported restored enum values never qualify or produce nonnumeric points', () => {
  for (const field of ['visaType', 'educationLevel', 'workExperience', 'age', 'japaneseLanguage', 'businessExecutiveBonus']) {
    for (const value of ['outdated-value', 'constructor', '__proto__']) {
      const result = calculate({ ...high, [field]: value });
      assert.equal(result.isValid, false, `${field}/${value}`);
      assert.equal(result.isQualified, false, `${field}/${value}`);
      assert.equal(Number.isFinite(result.totalPoints), true);
    }
  }
  const restored = decodePointsData('?v=technical&e=outdated-degree&w=10plus&a=29under&s=8m&j=n1&ue=1');
  assert.equal(calculate(restored).isQualified, false);
});

test('Unsupported license counts cannot inflate points or qualify', () => {
  for (const jpNationalLicenses of [-1, 3, 99, 1.5, NaN, Infinity]) {
    const result = calculate({ ...high, jpNationalLicenses });
    assert.equal(result.isValid, false);
    assert.equal(result.isQualified, false);
    assert.equal(result.categoryPoints.license, 0);
  }
});

test('Unknown and duplicate research/license choices are invalid and cannot multiply points', () => {
  for (const data of [
    { visaType: 'academic', workExperience: '7plus', researchAchievements: ['unknown'] },
    { visaType: 'academic', workExperience: '7plus', researchAchievements: ['patent_invention', 'patent_invention'] },
    { researchAchievements: ['none', 'patent_invention'] },
    { licenses: ['other', 'other'] },
    { licenses: ['jp_national_per_license'] },
  ]) {
    const result = calculate({ ...high, ...data });
    assert.equal(result.isValid, false);
    assert.equal(result.isQualified, false);
  }
});

test('Technical patent recommendation uses the supported research key', () => {
  assert.ok(calculate({}).suggestions.some(suggestion => suggestion.key === 'research-achievement' && suggestion.pointsDelta === 15));
});
