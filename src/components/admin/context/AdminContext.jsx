import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { CIRCLES, ORGANIZER_ACCOUNTS, scoped, setCircleRegistry } from '../circles';

const AdminContext = createContext(null);

const SETTINGS_KEY = 'elqissa_admin_settings';
const ACCOUNT_KEY = 'elqissa_admin_account';
const VIEW_CIRCLE_KEY = 'elqissa_admin_viewcircle';
const CIRCLES_KEY = 'elqissa_admin_circles';

function loadCircles() {
  let merged = [...CIRCLES];
  try {
    const raw = localStorage.getItem(CIRCLES_KEY);
    if (raw) {
      const custom = JSON.parse(raw);
      if (Array.isArray(custom)) {
        for (const c of custom) {
          if (!c || !c.key || !c.name) continue;
          const existing = merged.findIndex((m) => m.key === c.key);
          if (existing >= 0) {
            merged[existing] = { ...merged[existing], ...c };
          } else {
            merged.push(c);
          }
        }
      }
    }
  } catch {
    /* corrupt or unavailable */
  }
  setCircleRegistry(merged);
  return merged;
}

const defaultSettings = {
  pageSize: 8,
  collapsedSidebar: false,
  notifications: true,
  monthlyBudget: 0,
};

function sanitizeSettings(raw) {
  const parsed = { ...defaultSettings };
  if (raw && typeof raw === 'object') {
    const sizes = [5, 8, 10];
    parsed.pageSize = sizes.includes(Number(raw.pageSize))
      ? Number(raw.pageSize)
      : defaultSettings.pageSize;
    parsed.collapsedSidebar =
      typeof raw.collapsedSidebar === 'boolean'
        ? raw.collapsedSidebar
        : defaultSettings.collapsedSidebar;
    parsed.notifications =
      typeof raw.notifications === 'boolean'
        ? raw.notifications
        : defaultSettings.notifications;
    parsed.monthlyBudget =
      Number.isFinite(Number(raw.monthlyBudget)) && Number(raw.monthlyBudget) >= 0
        ? Number(raw.monthlyBudget)
        : defaultSettings.monthlyBudget;
  }
  return parsed;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return sanitizeSettings(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return { ...defaultSettings };
}

function loadAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (raw) {
      const acc = JSON.parse(raw);
      if (acc && acc.id && ORGANIZER_ACCOUNTS.some((a) => a.id === acc.id)) return acc;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function loadViewCircle() {
  try {
    const raw = localStorage.getItem(VIEW_CIRCLE_KEY);
    if (raw && typeof raw === 'string') return raw;
  } catch {
    /* ignore */
  }
  return '';
}

const initialSection = 'overview';

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, section: action.section, sidebarOpen: false, topSearch: '' };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.open };
    case 'TOGGLE_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SEARCH':
      return { ...state, topSearch: action.value };
    case 'SET_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };
    case 'RESET_SETTINGS':
      return { ...state, settings: { ...defaultSettings } };
    case 'SET_NOTIF_READ':
      return { ...state, notifRead: true };
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.account || null,
        viewCircle: '',
        section: initialSection,
        sidebarOpen: false,
        topSearch: '',
        accountSelectOpen: false,
      };
    case 'SET_VIEW_CIRCLE':
      return { ...state, viewCircle: action.viewCircle || '' };
    case 'SET_ACCOUNT_SELECT':
      return { ...state, accountSelectOpen: !!action.open };
    case 'ADD_CIRCLE':
      return { ...state, circles: [...state.circles, action.circle] };
    case 'UPDATE_CIRCLE':
      return {
        ...state,
        circles: state.circles.map((c) =>
          c.key === action.key ? { ...c, ...action.patch } : c
        ),
      };
    case 'DELETE_CIRCLE':
      return { ...state, circles: state.circles.filter((c) => c.key !== action.key) };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, {
    section: initialSection,
    sidebarOpen: false,
    topSearch: '',
    notifRead: false,
    settings: loadSettings(),
    account: loadAccount(),
    viewCircle: loadViewCircle(),
    circles: loadCircles(),
    accountSelectOpen: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    } catch {
      /* ignore */
    }
  }, [state.settings]);

  useEffect(() => {
    try {
      if (state.account) {
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(state.account));
      } else {
        localStorage.removeItem(ACCOUNT_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [state.account]);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_CIRCLE_KEY, state.viewCircle);
    } catch {
      /* ignore */
    }
  }, [state.viewCircle]);

  useEffect(() => {
    setCircleRegistry(state.circles);
    try {
      localStorage.setItem(CIRCLES_KEY, JSON.stringify(state.circles));
    } catch {
      /* ignore */
    }
  }, [state.circles]);

  const value = useMemo(() => {
    const isAdmin = state.account?.type === 'admin';
    const fullCircle = state.account?.circleKey || '';
    const effectiveCircle = isAdmin ? state.viewCircle : fullCircle;
    return {
      ...state,
      isAdmin,
      fullCircle,
      effectiveCircle,
      scopedList: (items) => scoped(items || [], effectiveCircle),
      setSection: (section) => dispatch({ type: 'SET_SECTION', section }),
      setSidebarOpen: (open) => dispatch({ type: 'SET_SIDEBAR_OPEN', open }),
      toggleSidebarOpen: () => dispatch({ type: 'TOGGLE_SIDEBAR_OPEN' }),
      setTopSearch: (value) => dispatch({ type: 'SET_SEARCH', value }),
      setSetting: (key, value) => dispatch({ type: 'SET_SETTING', key, value }),
      resetSettings: () => {
        try {
          localStorage.removeItem(SETTINGS_KEY);
        } catch {
          /* ignore */
        }
        dispatch({ type: 'RESET_SETTINGS' });
      },
      setNotifRead: () => dispatch({ type: 'SET_NOTIF_READ' }),
      setAccount: (account) => dispatch({ type: 'SET_ACCOUNT', account }),
      setViewCircle: (viewCircle) => dispatch({ type: 'SET_VIEW_CIRCLE', viewCircle }),
      switchAccount: (id) => {
        const acc = ORGANIZER_ACCOUNTS.find((a) => a.id === id) || null;
        dispatch({ type: 'SET_ACCOUNT', account: acc });
      },
      logoutAccount: () => dispatch({ type: 'SET_ACCOUNT', account: null }),
      openAccountSelect: () => dispatch({ type: 'SET_ACCOUNT_SELECT', open: true }),
      closeAccountSelect: () => dispatch({ type: 'SET_ACCOUNT_SELECT', open: false }),
      addCircle: (circle) => dispatch({ type: 'ADD_CIRCLE', circle }),
      updateCircle: (key, patch) => dispatch({ type: 'UPDATE_CIRCLE', key, patch }),
      deleteCircle: (key) => dispatch({ type: 'DELETE_CIRCLE', key }),
    };
  }, [state]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}