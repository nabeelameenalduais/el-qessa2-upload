export const arabicMonths = {
  'يناير': 1,
  'فبراير': 2,
  'مارس': 3,
  'أبريل': 4,
  'مايو': 5,
  'يونيو': 6,
  'يوليو': 7,
  'أغسطس': 8,
  'سبتمبر': 9,
  'أكتوبر': 10,
  'نوفمبر': 11,
  'ديسمبر': 12,
};

export const monthNames = Object.keys(arabicMonths);

export function parseArabicDate(str) {
  if (!str) return null;
  const monthName = monthNames.find((m) => str.includes(m));
  if (!monthName) return null;
  const yearMatch = str.match(/(\d{4})/);
  const year = yearMatch ? Number(yearMatch[1]) : null;
  if (!year) return null;
  const nums = (str.match(/\d{1,4}/g) || []).map(Number);
  const day = nums.find((n) => n < 32 && n !== year) ?? 1;
  return { year, month: arabicMonths[monthName], day, monthName };
}

export function dateKey(d) {
  if (!d) return 0;
  return d.year * 10000 + d.month * 100 + d.day;
}

export function monthLabel(monthNumber) {
  const m = monthNames.find((name) => arabicMonths[name] === monthNumber);
  return m || '';
}

export function todayArabicDate() {
  try {
    return new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function registrationDayKey(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatFullDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function formatShortDate(input) {
  if (!input) return '';
  try {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return String(input);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return String(input);
  }
}

export function lastDays(n) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    days.push({ key: `${y}-${m}-${day}`, label: `${d.getDate()} ${monthNames[d.getMonth()]}` });
  }
  return days;
}