export const CIRCLES = [
  { key: 'riwaya', name: 'رواية', color: '#5B2028' },
  { key: 'qissa', name: 'قصة', color: '#B08A52' },
  { key: 'ibdaa', name: 'إبداع متجدد', color: '#7a2e38' },
  { key: 'liqa', name: 'لقاء عن بعد', color: '#795548' },
  { key: 'niqash', name: 'نقاش', color: '#3d151b' },
];

export const ORGANIZER_ACCOUNTS = [
  { id: 'acc_admin', type: 'admin', label: 'الإدارة الرئيسية', sub: 'تطّلع على جميع الدوائر والبيانات' },
  ...CIRCLES.map((circle) => ({
    id: `acc_${circle.key}`,
    type: 'circle',
    circleKey: circle.key,
    label: `دائرة ${circle.name}`,
    sub: `بيانات دائمة خاصة بدائرة ${circle.name}`,
  })),
];

function loadStoredCircles() {
  try {
    const raw = localStorage.getItem('elqissa_admin_circles');
    if (raw) {
      const custom = JSON.parse(raw);
      if (Array.isArray(custom) && custom.length) {
        const merged = [...CIRCLES];
        for (const c of custom) {
          if (!c || !c.key || !c.name) continue;
          const idx = merged.findIndex((m) => m.key === c.key);
          if (idx >= 0) merged[idx] = { ...merged[idx], ...c };
          else merged.push(c);
        }
        return merged;
      }
    }
  } catch {
    /* ignore */
  }
  return [...CIRCLES];
}

let circleRegistry = loadStoredCircles();

export function setCircleRegistry(list) {
  circleRegistry = Array.isArray(list) && list.length ? list : [...CIRCLES];
}

export function getCircleRegistry() {
  return circleRegistry;
}

export function circleName(key) {
  return circleRegistry.find((c) => c.key === key)?.name || '';
}

export function circleColor(key) {
  return circleRegistry.find((c) => c.key === key)?.color || '#5B2028';
}

export function hasCircle(key) {
  return circleRegistry.some((c) => c.key === key);
}

export function scoped(items, circleKey) {
  if (!circleKey) return items;
  return items.filter((it) => it && it.circleId === circleKey);
}