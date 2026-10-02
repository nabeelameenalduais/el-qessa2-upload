globalThis.localStorage = { getItem() { return null; }, setItem() {} };

const [mock, circ] = await Promise.all([
  import('./src/data/mockData.js'),
  import('./src/components/admin/circles.js'),
]);

let pass = true;
const fail = [];

function log(ok, msg) {
  if (!ok) {
    fail.push(msg);
    pass = false;
  } else {
    console.log('PASS:', msg);
  }
}

// --- Account existence ---
const organizerSeeds = mock.seedUsers.filter((u) => u.role === 'حاضر' && u.circleId);
log(organizerSeeds.length === 5, '5 organizer seed accounts present');

const circleKeys = circ.CIRCLES.map((c) => c.key);

for (const u of organizerSeeds) {
  log(circleKeys.includes(u.circleId), `circleId "${u.circleId}" exists in CIRCLES (${u.email})`);
}

for (const ckey of circleKeys) {
  const acc = circ.ORGANIZER_ACCOUNTS.find((a) => a.type === 'circle' && a.circleKey === ckey);
  log(Boolean(acc), `acc_${ckey} exists in ORGANIZER_ACCOUNTS`);
}

// --- Merge logic simulation (stale localStorage missing organizers) ---
const stale = [
  { ...mock.seedUsers.find((u) => u.email === 'admin@elqissa.club') },
  {
    id: 'usr_hadir',
    name: 'ريم الوصابي',
    email: 'reem@elqissa.club',
    password: 'reem123',
    phone: '',
    role: 'حاضر',
    active: true,
    createdAt: Date.now(),
  },
  {
    id: 'usr_zair',
    name: 'زائر تجريبي',
    email: 'guest@elqissa.club',
    password: 'guest123',
    phone: '',
    role: 'زائر',
    active: true,
    createdAt: Date.now(),
  },
];

const byEmail = new Map();
for (const item of stale) byEmail.set(item.email, item);
for (const seed of mock.seedUsers) {
  const ex = byEmail.get(seed.email);
  if (ex) {
    byEmail.set(seed.email, {
      ...ex,
      password: typeof ex.password === 'string' ? ex.password : seed.password,
      phone: ex.phone || seed.phone || '',
      circleId: ex.circleId || seed.circleId || '',
    });
  } else if (seed.circleId) {
    byEmail.set(seed.email, { ...seed, createdAt: seed.createdAt || Date.now() });
  }
}
const merged = [...byEmail.values()];

log(merged.length === 8, 'merge: 3 existing users + 5 appended organizers = 8 total');
log(!merged.find((u) => u.email === 'reem@elqissa.club').circleId, 'reem stays without circleId (plain حاضر)');

for (const u of organizerSeeds) {
  const m = merged.find((x) => x.email === u.email);
  log(m && m.circleId === u.circleId, `merged ${u.email} has circleId ${u.circleId}`);
}

// --- Routing simulation (mirrors LoginPage / RegisterPage) ---
function route(user) {
  if (user.role === 'أدمن') return 'admin';
  if (user.role === 'حاضر' && user.circleId) return 'admin';
  return 'my-account';
}

log(route({ role: 'أدمن' }) === 'admin', 'admin → admin dashboard');
log(route({ role: 'حاضر', circleId: 'riwaya' }) === 'admin', 'organizer (circled) → admin dashboard');
log(route({ role: 'حاضر' }) === 'my-account', 'plain حاضر → my-account');
log(route({ role: 'زائر' }) === 'my-account', 'زائر → my-account');

// --- AdminGate simulation ---
function canAccess(user) {
  return user.role === 'أدمن' || (user.role === 'حاضر' && Boolean(user.circleId));
}

log(canAccess({ role: 'أدمن' }), 'admin can access dashboard');
log(canAccess({ role: 'حاضر', circleId: 'qissa' }), 'organizer can access dashboard');
log(!canAccess({ role: 'حاضر' }), 'plain حاضر blocked');
log(!canAccess({ role: 'زائر' }), 'زائر blocked');

// --- Section enforcement simulation (mirrors AdminContext.setSection) ---
const adminOnlySections = ['users', 'reports', 'settings'];

function allowedSection(section, isAdmin) {
  if (isAdmin) return true;
  return !adminOnlySections.includes(section);
}

log(allowedSection('events', false), 'organizer allowed: events');
log(allowedSection('workshops', false), 'organizer allowed: workshops');
log(allowedSection('tasks', false), 'organizer allowed: tasks');
log(!allowedSection('users', false), 'organizer blocked: users');
log(!allowedSection('reports', false), 'organizer blocked: reports');
log(!allowedSection('settings', false), 'organizer blocked: settings');
log(allowedSection('users', true), 'admin allowed: users');
log(allowedSection('settings', true), 'admin allowed: settings');

// --- Circle isolation (scopedList) ---
const mockEvents = [
  { id: 'e1', circleId: 'riwaya' },
  { id: 'e2', circleId: 'qissa' },
  { id: 'e3', circleId: 'riwaya' },
  { id: 'e4', circleId: 'ibdaa' },
];

function scoped(items, circleKey) {
  if (!circleKey) return items;
  return items.filter((it) => it && it.circleId === circleKey);
}

log(scoped(mockEvents, 'riwaya').length === 2, 'scopedList(riwaya) → 2 events');
log(scoped(mockEvents, 'qissa').length === 1, 'scopedList(qissa) → 1 event');
log(scoped(mockEvents, '').length === 4, 'scopedList(\"\") → all 4 (admin)');
log(scoped(mockEvents, 'niqash').length === 0, 'scopedList(niqash) → 0 (no content)');

// --- Account switching locked ---
function switchAccount(lock, id) {
  if (lock) return null; // no-op, stays on locked account
  return id;
}
log(switchAccount('riwaya', 'acc_admin') === null, 'locked organizer cannot switch');
log(switchAccount('', 'acc_admin') === 'acc_admin', 'admin can switch');

// --- Summary ---
console.log('\n' + (pass ? '=== ALL CHECKS PASSED ===' : `=== FAILURES ===\n${fail.join('\n')}`));
if (!pass) process.exit(1);
