import { parseArabicDate, dateKey, monthLabel } from './dateUtils';
import { circleName } from '../circles';

function countBy(items, keyFn) {
  const map = {};
  items.forEach((it) => {
    const k = keyFn(it);
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function sortByDate(items, keyFn, dir = 1) {
  return [...items].sort((a, b) => (dateKey(keyFn(a)) - dateKey(keyFn(b))) * dir);
}

export function computeEvents(events) {
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);

  const parsed = events.map((e) => ({
    ...e,
    _d: parseArabicDate(e.date),
  }));

  const byMonthMap = {};
  parsed.forEach((e) => {
    if (!e._d) return;
    const label = e._d.monthName;
    const key = e._d.year * 100 + e._d.month;
    byMonthMap[key] = byMonthMap[key] || { key, month: label, sort: key, count: 0 };
    byMonthMap[key].count += 1;
  });
  const byMonth = Object.values(byMonthMap).sort((a, b) => a.sort - b.sort);

  return {
    total: events.length,
    upcomingCount: upcoming.length,
    pastCount: past.length,
    byCategory: countBy(events, (e) => circleName(e.circleId) || 'بدون دائرة'),
    byMonth,
    upcomingSorted: sortByDate(upcoming, (e) => parseArabicDate(e.date)),
    pastSorted: sortByDate(past, (e) => parseArabicDate(e.date), -1),
  };
}

export function computePublications(publications) {
  return {
    total: publications.length,
    byCategory: countBy(publications, (p) => p.category || 'غير مصنفة'),
    byYear: countBy(publications, (p) => p.year)
      .slice()
      .sort((a, b) => Number(a.name) - Number(b.name)),
  };
}

export function computeWriters(writers) {
  return {
    total: writers.length,
    byCity: countBy(writers, (w) => w.city),
    byRole: countBy(writers, (w) => w.role),
  };
}

export function computeWorkshops(workshops) {
  return {
    total: workshops.length,
    byStatus: countBy(workshops, (w) => w.status),
  };
}

export function computeNews(news) {
  const parsed = news.map((n) => ({ ...n, _d: parseArabicDate(n.date) }));
  return {
    total: news.length,
    byCategory: countBy(news, (n) => n.category),
    latestSorted: sortByDate(parsed, (n) => n._d, -1),
  };
}

export function computeGallery(galleryImages) {
  return {
    total: galleryImages.length,
    byCategory: countBy(galleryImages, (g) => g.category),
    byYear: countBy(galleryImages, (g) => g.year)
      .slice()
      .sort((a, b) => Number(a.name) - Number(b.name)),
  };
}

export function computeFiles(files) {
  return {
    total: files.length,
    byType: countBy(files, (f) => f.type),
    bySection: countBy(files, (f) => f.relatedSection),
    publicCount: files.filter((f) => f.visibility === 'عام').length,
  };
}

export function computeUsers(users) {
  return {
    total: users.length,
    byRole: countBy(users, (u) => u.role),
    active: users.filter((u) => u.active).length,
    inactive: users.filter((u) => !u.active).length,
  };
}

export function registrationsByEvent(registrations) {
  return countBy(registrations, (r) => r.eventTitle || 'فعالية غير محددة');
}

export function computeArchive(archive) {
  return {
    total: archive.length,
    years: [...archive].sort((a, b) => Number(b.year) - Number(a.year)),
  };
}

export function recentActivity(events, news, count = 6) {
  const items = [];

  news.forEach((n) => {
    const d = parseArabicDate(n.date);
    if (d) items.push({ kind: 'news', id: n.id, title: n.title, date: n.date, sort: dateKey(d) });
  });
  events.forEach((e) => {
    const d = parseArabicDate(e.date);
    if (d) items.push({ kind: 'event', id: e.id, title: e.title, date: e.date, sort: dateKey(d) });
  });

  return items.sort((a, b) => b.sort - a.sort).slice(0, count);
}

export function buildMonthlySeries({ events = [], news = [], costs = [] } = {}) {
  const monthly = {};

  const add = (key, month, deltaActivity = 0, deltaCost = 0) => {
    monthly[key] = monthly[key] || { key, month, activity: 0, cost: 0 };
    monthly[key].activity += deltaActivity;
    monthly[key].cost += deltaCost;
  };

  events.forEach((e) => {
    const d = parseArabicDate(e.date);
    if (d) add(d.year * 100 + d.month, d.monthName, 1, 0);
  });
  news.forEach((n) => {
    const d = parseArabicDate(n.date);
    if (d) add(d.year * 100 + d.month, d.monthName, 1, 0);
  });
  costs.forEach((c) => {
    const m = String(c.date || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      add(y * 100 + mo, monthLabel(mo), 0, Number(c.amount) || 0);
    }
  });

  return Object.values(monthly)
    .map((v) => ({ ...v, activity: Math.round(v.activity), cost: Math.round(v.cost) }))
    .sort((a, b) => a.key - b.key);
}

export function computeCosts(costs = [], budget = 0) {
  const now = new Date();
  const currentMonth = now.getFullYear() * 100 + (now.getMonth() + 1);

  const parseIso = (iso) => {
    if (!iso) return null;
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) } : null;
  };

  let total = 0;
  let monthlyTotal = 0;
  let paidTotal = 0;
  let pendingTotal = 0;
  const byCategory = {};

  costs.forEach((c) => {
    const amt = Number(c.amount) || 0;
    total += amt;
    if (c.status === 'مدفوع') paidTotal += amt;
    else pendingTotal += amt;

    const d = parseIso(c.date);
    if (d && d.year * 100 + d.month === currentMonth) monthlyTotal += amt;

    const cat = c.categoryId || 'غير محددة';
    byCategory[cat] = (byCategory[cat] || 0) + amt;
  });

  const budgetNum = Number(budget) || 0;
  const remaining = budgetNum - monthlyTotal;
  const overBudget = budgetNum > 0 && monthlyTotal > budgetNum;

  return {
    total,
    monthlyTotal,
    paidTotal,
    pendingTotal,
    byCategory: Object.entries(byCategory)
      .map(([id, amount]) => ({ id, amount }))
      .sort((a, b) => b.amount - a.amount),
    budget: budgetNum,
    remaining,
    overBudget,
    overAmount: overBudget ? monthlyTotal - budgetNum : 0,
  };
}

export function registrationStats(registrations) {
  const statusCount = {};
  registrations.forEach((r) => {
    statusCount[r.status] = (statusCount[r.status] || 0) + 1;
  });
  return {
    total: registrations.length,
    pending: statusCount['قيد المراجعة'] || 0,
    confirmed: statusCount['مؤكد'] || 0,
    cancelled: statusCount['ملغي'] || 0,
    byStatus: Object.entries(statusCount).map(([name, count]) => ({ name, count })),
  };
}
