const assert = require('node:assert/strict');
const { test } = require('node:test');
const { calculateAge } = require('../src/lib/age.ts');

test('Age changes on the local calendar birthday, including leap-day birthdays', () => {
  for (const [birthDate, today, expected] of [
    ['1997-01-01', new Date(2026, 11, 31, 23, 59), 29],
    ['1997-01-01', new Date(2027, 0, 1, 0, 0), 30],
    ['1996-02-29', new Date(2026, 1, 28), 29],
    ['1996-02-29', new Date(2026, 2, 1), 30],
    ['1996-02-29', new Date(2024, 1, 29), 28],
    ['2026-11-16', new Date(2026, 10, 16, 0, 0), 0],
  ]) {
    assert.equal(calculateAge(birthDate, today), expected);
  }
});

test('Malformed, impossible and future birth dates cannot generate an age', () => {
  for (const birthDate of ['invalid', '1997-1-1', '1997-02-29', '1997-02-30', '2026-11-17', '9999-01-01']) {
    assert.equal(calculateAge(birthDate, new Date(2026, 10, 16)), null, birthDate);
  }
});
