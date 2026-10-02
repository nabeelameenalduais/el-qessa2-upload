import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import {
  events as seedEvents,
  writers as seedWriters,
  publications as seedPublications,
  workshops as seedWorkshops,
  news as seedNews,
  archive as seedArchive,
  galleryImages as seedGallery,
  seedUsers,
  seedCostCategories,
  seedCosts,
  seedFiles,
  seedTasks,
  seedCircleMap,
} from '../data/mockData';

const AppContext = createContext(null);

let toastId = 0;
let recordId = 0;

const REGISTRATION_KEY = 'elqissa_registrations';
const AUDIT_KEY = 'elqissa_auditLog';
const SESSION_KEY = 'elqissa_session';
const SECTION_LABELS = {
  events: 'الفعاليات',
  writers: 'الكتّاب',
  publications: 'الإصدارات',
  workshops: 'الورش',
  news: 'الأخبار',
  archive: 'الأرشيف',
  gallery: 'معرض الصور',
  files: 'الملفات',
  users: 'المستخدمون',
  costCategories: 'فئات التكاليف',
  costs: 'التكاليف',
  tasks: 'المهام',
  registrations: 'التسجيلات',
};

const CONTENT_SECTIONS = [
  'events',
  'writers',
  'publications',
  'workshops',
  'news',
  'archive',
  'gallery',
  'files',
  'users',
  'costCategories',
  'costs',
  'tasks',
];
const SECTION_PREFIXES = {
  events: 'evt',
  writers: 'wrt',
  publications: 'pub',
  workshops: 'wrk',
  news: 'nws',
  archive: 'arc',
  gallery: 'gal',
  files: 'fl',
  users: 'usr',
  costCategories: 'cstc',
  costs: 'cst',
  tasks: 'tsk',
};

const seeds = {
  events: seedEvents,
  writers: seedWriters,
  publications: seedPublications,
  workshops: seedWorkshops,
  news: seedNews,
  archive: seedArchive,
  gallery: seedGallery,
  files: seedFiles,
  users: seedUsers,
  costCategories: seedCostCategories,
  costs: seedCosts,
  tasks: seedTasks,
};

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch {
    /* corrupt or unavailable */
  }
  return null;
}

function loadSection(section) {
  const stored = loadJson(`elqissa_${section}`);
  if (stored) return stored;
  return JSON.parse(JSON.stringify(seeds[section]));
}

function loadContent() {
  const content = {};
  for (const section of CONTENT_SECTIONS) {
    let items = loadSection(section);
    if (section === 'archive') {
      items = items.map((item, i) =>
        item.id ? item : { ...item, id: `arc_${item.year || i}_${Date.now()}` }
      );
    }
    if (section === 'users') {
      const byEmail = new Map();
      for (const item of items) byEmail.set(item.email, item);
      for (const seed of seedUsers) {
        const existing = byEmail.get(seed.email);
        if (existing) {
          byEmail.set(seed.email, {
            ...existing,
            password: typeof existing.password === 'string'
              ? existing.password
              : seed.password,
            phone: existing.phone || seed.phone || '',
            circleId: existing.circleId || seed.circleId || '',
          });
        } else if (seed.circleId) {
          byEmail.set(seed.email, {
            ...seed,
            createdAt: seed.createdAt || Date.now(),
          });
        }
      }
      items = [...byEmail.values()];
    }
    content[section] = items;
  }

  for (const [section, map] of Object.entries(seedCircleMap)) {
    if (!Array.isArray(content[section]) || !map) continue;
    content[section] = content[section].map((item) =>
      map[item.id] ? { ...item, circleId: map[item.id] } : item
    );
  }

  return content;
}

function loadRegistrations() {
  return loadJson(REGISTRATION_KEY) || [];
}

function loadAudit() {
  return loadJson(AUDIT_KEY) || [];
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && typeof parsed.email === 'string') return parsed;
    }
  } catch {
    /* corrupt or unavailable */
  }
  return null;
}

function pushAudit(state, action, section, detail, circleKey = null) {
  const entry = {
    id: `aud_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    actor: state.auditActor || 'الإدارة',
    action,
    section: SECTION_LABELS[section] || section,
    detail: detail || '',
    circleKey: circleKey || null,
    ts: Date.now(),
  };
  return [entry, ...state.auditLog].slice(0, 300);
}

function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const savedSession = loadSession();

export const initialState = {
  currentPage: 'home',
  detailId: null,
  mobileMenuOpen: false,
  searchQuery: '',
  activeCategory: 'الكل',
  activeTab: 'upcoming',
  activeYear: '2026',
  lightboxImage: null,
  registrationEvent: null,
  toasts: [],
  registrations: loadRegistrations(),
  auditLog: loadAudit(),
  auditActor: 'الإدارة',
  content: loadContent(),
  currentUser: null,
  isAuthenticated: false,
  pendingSession: savedSession,
  rememberMe: true,
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'GO':
      return {
        ...state,
        currentPage: action.page,
        detailId: action.id ?? null,
        mobileMenuOpen: false,
      };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.value };
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.value };
    case 'SET_TAB':
      return { ...state, activeTab: action.value };
    case 'SET_YEAR':
      return { ...state, activeYear: action.value };
    case 'SET_LIGHTBOX':
      return { ...state, lightboxImage: action.value };
    case 'OPEN_REGISTRATION':
      return { ...state, registrationEvent: action.event };
    case 'CLOSE_REGISTRATION':
      return { ...state, registrationEvent: null };
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { id: ++toastId, type: action.toastType || 'success', message: action.message },
        ],
      };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'ADD_REGISTRATION':
      return {
        ...state,
        registrations: [
          { id: `reg_${++recordId}_${Date.now()}`, ...action.registration },
          ...state.registrations,
        ],
        auditLog: pushAudit(
          state,
          'إضافة تسجيل',
          'registrations',
          action.registration?.name ||
            action.registration?.eventTitle ||
            'تسجيل جديد',
          state.content.events.find((e) => e.id === action.registration?.eventId)
            ?.circleId || null
        ),
      };
    case 'UPDATE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.map((r) =>
          r.id === action.id ? { ...r, ...action.patch } : r
        ),
        auditLog: pushAudit(
          state,
          'تعديل تسجيل',
          'registrations',
          state.registrations.find((r) => r.id === action.id)?.name ||
            state.registrations.find((r) => r.id === action.id)?.eventTitle ||
            action.id,
          state.content.events.find(
            (e) =>
              e.id ===
              (state.registrations.find((r) => r.id === action.id)?.eventId ||
                action.patch?.eventId)
          )?.circleId || null
        ),
      };
    case 'DELETE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.filter((r) => r.id !== action.id),
        auditLog: pushAudit(
          state,
          'حذف تسجيل',
          'registrations',
          state.registrations.find((r) => r.id === action.id)?.name ||
            state.registrations.find((r) => r.id === action.id)?.eventTitle ||
            action.id,
          state.content.events.find(
            (e) => e.id === state.registrations.find((r) => r.id === action.id)?.eventId
          )?.circleId || null
        ),
      };
    case 'CLEAR_REGISTRATIONS':
      return {
        ...state,
        registrations: [],
        auditLog: pushAudit(state, 'مسح جميع التسجيلات', 'registrations', '', null),
      };
    case 'ADD_ITEM':
      return {
        ...state,
        content: {
          ...state.content,
          [action.section]: [
            { ...action.item, id: action.item.id || generateId(action.prefix || action.section.slice(0, 3)) },
            ...state.content[action.section],
          ],
        },
        auditLog: pushAudit(
          state,
          'إضافة',
          action.section,
          action.item?.title || action.item?.name || '',
          action.item?.circleId || null
        ),
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        content: {
          ...state.content,
          [action.section]: state.content[action.section].map((item) =>
            item.id === action.id ? { ...item, ...action.patch } : item
          ),
        },
        auditLog: pushAudit(
          state,
          'تعديل',
          action.section,
          state.content[action.section].find((item) => item.id === action.id)?.title ||
            state.content[action.section].find((item) => item.id === action.id)?.name ||
            action.id,
          state.content[action.section].find((item) => item.id === action.id)
            ?.circleId || null
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        content: {
          ...state.content,
          [action.section]: state.content[action.section].filter(
            (item) => item.id !== action.id
          ),
        },
        auditLog: pushAudit(
          state,
          'حذف',
          action.section,
          state.content[action.section].find((item) => item.id === action.id)?.title ||
            state.content[action.section].find((item) => item.id === action.id)?.name ||
            action.id,
          state.content[action.section].find((item) => item.id === action.id)
            ?.circleId || null
        ),
      };
    case 'CASCADE_DELETE':
      return {
        ...state,
        content: {
          ...state.content,
          [action.section]: state.content[action.section].filter((item) => item.id !== action.id),
          files: state.content.files.filter(
            (f) => !(f.relatedSection === action.section && f.relatedId === action.id)
          ),
        },
        registrations:
          action.section === 'events'
            ? state.registrations.filter((r) => r.eventId !== action.id)
            : state.registrations,
        auditLog: pushAudit(
          state,
          'حذف متسلسل',
          action.section,
          state.content[action.section].find((item) => item.id === action.id)?.title ||
            state.content[action.section].find((item) => item.id === action.id)?.name ||
            action.id,
          state.content[action.section].find((item) => item.id === action.id)
            ?.circleId || null
        ),
      };
    case 'SET_AUDIT_ACTOR':
      return { ...state, auditActor: action.actor };
    case 'CLEAR_AUDIT':
      return { ...state, auditLog: [] };
    case 'LOGIN': {
      const user = action.user;
      const { password: _pw, ...safe } = user;
      return {
        ...state,
        currentUser: safe,
        isAuthenticated: true,
        pendingSession: null,
      };
    }
    case 'REGISTER': {
      const newUser = action.user;
      const { password: _pw, ...safe } = newUser;
      return {
        ...state,
        content: {
          ...state.content,
          users: [{ ...newUser, createdAt: Date.now() }, ...state.content.users],
        },
        currentUser: safe,
        isAuthenticated: true,
        pendingSession: null,
        auditLog: pushAudit(state, 'تسجيل مستخدم جديد', 'users', newUser.name || ''),
      };
    }
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        pendingSession: null,
      };
    case 'SET_REMEMBER_ME':
      return { ...state, rememberMe: !!action.value };
    case 'UPDATE_PROFILE': {
      const patch = action.patch;
      const updated = state.currentUser
        ? { ...state.currentUser, ...patch }
        : null;
      return {
        ...state,
        currentUser: updated,
        content: updated
          ? {
              ...state.content,
              users: state.content.users.map((u) =>
                u.id === updated.id ? { ...u, ...patch } : u
              ),
            }
          : state.content,
      };
    }
    case 'RESOLVE_SESSION': {
      const user = action.user;
      if (!user || !user.active) {
        return {
          ...state,
          currentUser: null,
          isAuthenticated: false,
          pendingSession: null,
        };
      }
      const { password: _pw, ...safe } = user;
      return {
        ...state,
        currentUser: safe,
        isAuthenticated: true,
        pendingSession: null,
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(REGISTRATION_KEY, JSON.stringify(state.registrations));
    } catch {
      /* storage unavailable */
    }
  }, [state.registrations]);

  useEffect(() => {
    try {
      for (const section of CONTENT_SECTIONS) {
        localStorage.setItem(`elqissa_${section}`, JSON.stringify(state.content[section]));
      }
    } catch {
      /* storage unavailable */
    }
  }, [state.content]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_KEY, JSON.stringify(state.auditLog));
    } catch {
      /* storage unavailable */
    }
  }, [state.auditLog]);

  useEffect(() => {
    if (state.pendingSession && !state.isAuthenticated) {
      const match = state.content.users.find(
        (u) => u.email === state.pendingSession.email && u.active
      );
      dispatch({ type: 'RESOLVE_SESSION', user: match || null });
    }
  }, [state.pendingSession, state.isAuthenticated, state.content.users]);

  useEffect(() => {
    if (!state.isAuthenticated || !state.currentUser) return;
    const match = state.content.users.find((u) => u.id === state.currentUser.id);
    if (!match || !match.active) {
      dispatch({ type: 'LOGOUT' });
    } else if (match.role !== state.currentUser.role) {
      dispatch({ type: 'LOGIN', user: match });
    }
  }, [state.content.users, state.isAuthenticated, state.currentUser]);

  useEffect(() => {
    try {
      if (state.currentUser && state.rememberMe) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ email: state.currentUser.email })
        );
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      /* storage unavailable */
    }
  }, [state.currentUser, state.rememberMe]);

  const value = useMemo(
    () => ({
      ...state,
      go: (page, opts = {}) => {
        dispatch({ type: 'GO', page, id: opts.id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      toggleMobileMenu: () => dispatch({ type: 'TOGGLE_MOBILE_MENU' }),
      setSearchQuery: (value) => dispatch({ type: 'SET_SEARCH', value }),
      setCategory: (value) => dispatch({ type: 'SET_CATEGORY', value }),
      setTab: (value) => dispatch({ type: 'SET_TAB', value }),
      setYear: (value) => dispatch({ type: 'SET_YEAR', value }),
      setLightbox: (value) => dispatch({ type: 'SET_LIGHTBOX', value }),
      openRegistration: (event) => dispatch({ type: 'OPEN_REGISTRATION', event }),
      closeRegistration: () => dispatch({ type: 'CLOSE_REGISTRATION' }),
      addToast: (message, toastType = 'success') =>
        dispatch({ type: 'ADD_TOAST', message, toastType }),
      removeToast: (id) => dispatch({ type: 'REMOVE_TOAST', id }),
      addRegistration: (registration) =>
        dispatch({ type: 'ADD_REGISTRATION', registration }),
      updateRegistration: (id, patch) =>
        dispatch({ type: 'UPDATE_REGISTRATION', id, patch }),
      deleteRegistration: (id) => dispatch({ type: 'DELETE_REGISTRATION', id }),
      clearRegistrations: () => dispatch({ type: 'CLEAR_REGISTRATIONS' }),
      addItem: (section, item) =>
        dispatch({
          type: 'ADD_ITEM',
          section,
          prefix: SECTION_PREFIXES[section] || section.slice(0, 3),
          item,
        }),
      updateItem: (section, id, patch) =>
        dispatch({ type: 'UPDATE_ITEM', section, id, patch }),
      deleteItem: (section, id) =>
        dispatch({ type: 'DELETE_ITEM', section, id }),
      deleteItemCascade: (section, id) =>
        dispatch({ type: 'CASCADE_DELETE', section, id }),
      setAuditActor: (actor) => dispatch({ type: 'SET_AUDIT_ACTOR', actor }),
      clearAuditLog: () => dispatch({ type: 'CLEAR_AUDIT' }),
      login: (email, password) => {
        const key = String(email).trim().toLowerCase();
        const user = state.content.users.find(
          (u) => u.email === key && u.password === password && u.active
        );
        if (!user) return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        if (user.role === 'زائر') {
          return { error: 'حساب الزائر لا يدعم تسجيل الدخول، سجّل عضويتك أولًا' };
        }
        dispatch({ type: 'LOGIN', user });
        return { ok: true };
      },
      register: (formData) => {
        const name = formData.name.trim();
        const email = String(formData.email).trim().toLowerCase();
        const phone = (formData.phone || '').trim();
        const password = formData.password;
        const exists = state.content.users.some((u) => u.email === email);
        if (exists) return { error: 'يوجد مستخدم بهذا البريد الإلكتروني بالفعل' };
        const newUser = {
          id: `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          name,
          email,
          phone,
          password,
          role: 'حاضر',
          active: true,
          createdAt: Date.now(),
        };
        dispatch({ type: 'REGISTER', user: newUser });
        return { ok: true };
      },
      logout: () => {
        dispatch({ type: 'LOGOUT' });
      },
      setRememberMe: (value) => dispatch({ type: 'SET_REMEMBER_ME', value }),
      updateProfile: (patch) => {
        dispatch({ type: 'UPDATE_PROFILE', patch });
      },
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
