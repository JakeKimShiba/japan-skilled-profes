export function calculateAge(birthDate: string, today = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(today.getTime())) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime()) || birth.toISOString().slice(0, 10) !== birthDate) return null;

  let age = today.getFullYear() - birth.getUTCFullYear();
  const monthDifference = today.getMonth() - birth.getUTCMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getUTCDate())) age--;
  return age < 0 ? null : age;
}

export function getAgeCategoryFromBirthDate(birthDate: string, today = new Date()): string | null {
  const age = calculateAge(birthDate, today);
  if (age === null) return null;
  if (age <= 29) return '29under';
  if (age <= 34) return '30to34';
  if (age <= 39) return '35to39';
  return '40plus';
}
