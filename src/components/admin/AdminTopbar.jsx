import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  CalendarClock,
  GraduationCap,
  Newspaper,
  Receipt,
  LogOut,
  UsersRound,
} from 'lucide-react';
import { useAdmin } from './context/AdminContext';
import { useApp } from '../../context/AppContext';
import { adminSections } from './sections';
import { computeEvents, computeWorkshops, computeNews, computeCosts } from './utils/deriveStats';
import { circleName, circleColor } from './circles';

const listSections = ['events', 'writers', 'publications', 'workshops', 'news', 'archive', 'gallery', 'files', 'users', 'registrations', 'costs', 'reports', 'tasks'];
const scopedSections = ['events', 'workshops', 'news', 'files', 'registrations', 'costs', 'reports', 'tasks'];

function useClickOutside(onOutside) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}

export default function AdminTopbar() {
  const {
    section,
    topSearch,
    setTopSearch,
    toggleSidebarOpen,
    settings,
    setSetting,
    setNotifRead,
    notifRead,
    isAdmin,
    fullCircle,
    effectiveCircle,
    setViewCircle,
    openAccountSelect,
    locked,
    circles,
    scopedList,
  } = useAdmin();
  const { go, content, setAuditActor, currentUser } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const viewEvents = scopedList(content.events);
  const viewWorkshops = scopedList(content.workshops);
  const viewNews = scopedList(content.news);
  const viewCosts = scopedList(content.costs || []);
  const eventsStats = computeEvents(viewEvents);
  const workshopsStats = computeWorkshops(viewWorkshops);
  const newsStats = computeNews(viewNews);
  const operator =
    currentUser?.active === false
      ? undefined
      : currentUser ||
        content.users.find((u) => u.role === 'أدمن' && u.active) ||
        content.users.find((u) => u.role === 'أدمن');

  useEffect(() => {
    setAuditActor(isAdmin ? operator?.name || 'إدارة النادي' : operator?.name || `دائرة ${circleName(fullCircle)}`);
  }, [operator, setAuditActor, isAdmin, fullCircle]);
  const openWorkshops = workshopsStats.byStatus
    .filter((s) => s.name === 'التسجيل مفتوح' || s.name === 'قريباً')
    .reduce((acc, s) => acc + s.count, 0);

  const notifications = [
    { icon: CalendarClock, title: `${eventsStats.upcomingCount} فعالية قادمة في الموعد` },
    { icon: GraduationCap, title: `${openWorkshops} ورشة مفتوح باب التسجيل فيها` },
  ];
  if (newsStats.latestSorted[0]) {
    notifications.push({ icon: Newspaper, title: `خبر جديد: ${newsStats.latestSorted[0].title}` });
  }

  if (isAdmin) {
    const costStats = computeCosts(viewCosts, settings.monthlyBudget);
    if (costStats.overBudget) {
      notifications.push({
        icon: Receipt,
        title: `تجاوز الميزانية الشهرية بمبلغ ${costStats.overAmount.toLocaleString('en-US')}`,
      });
    }
  }

  const activeSection = adminSections.find((s) => s.key === section);
  const showSearch = listSections.includes(section);
  const notifRef = useClickOutside(() => setNotifOpen(false));
  const profileRef = useClickOutside(() => setProfileOpen(false));

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-ivory-dark">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
        <button
          onClick={toggleSidebarOpen}
          className="lg:hidden p-2 text-burgundy hover:bg-ivory-dark rounded-md transition-colors"
          aria-label="فتح القائمة"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!isAdmin && fullCircle && (
            <img
              src="/assets/logo.png"
              alt=""
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <h1 className="text-base lg:text-xl font-bold text-ink leading-tight truncate">
              {activeSection?.title}
            </h1>
            {!showSearch && (
              <p className="text-[11px] text-warm-brown mt-0.5 hidden sm:block">
                {isAdmin
                  ? (effectiveCircle ? `عرض دائرة ${circleName(effectiveCircle)} · لوحة الإدارة` : 'نادي القصة «إلمقه» · لوحة إدارة المحتوى')
                  : `دائرة ${circleName(fullCircle)} · لوحة إدارة المحتوى`}
              </p>
            )}
          </div>
        </div>

        {showSearch && (
          <div className="relative hidden sm:block w-56 lg:w-72">
            <input
              type="text"
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              placeholder="ابحث في هذا القسم..."
              className="w-full ps-9 pe-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 start-3 text-warm-brown/60"
            />
          </div>
        )}

        {isAdmin && scopedSections.includes(section) && (
          <label className="relative hidden lg:block w-44 flex-shrink-0" aria-label="فلترة دورة العرض">
            <select
              value={effectiveCircle}
              onChange={(e) => setViewCircle(e.target.value)}
              className="w-full appearance-none ps-4 pe-9 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm text-ink focus:outline-none focus:border-burgundy transition-colors cursor-pointer"
            >
              <option value="">كل الدوائر</option>
              {circles.map((c) => (
                <option key={c.key} value={c.key}>
                  دائرة {c.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
              <span
                className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: effectiveCircle ? circleColor(effectiveCircle) : 'var(--color-ivory-dark)' }}
                aria-hidden="true"
              />
            </div>
          </label>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSetting('collapsedSidebar', !settings.collapsedSidebar)}
            className="hidden lg:flex p-2 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-md transition-colors"
            aria-label="طي القائمة الجانبية"
          >
            {settings.collapsedSidebar ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>

          {settings.notifications && (
            <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((o) => !o);
                setNotifRead(true);
              }}
              className="relative p-2 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-md transition-colors"
              aria-label="الإشعارات"
            >
              <Bell size={20} />
              {settings.notifications && !notifRead && notifications.length > 0 && (
                <span className="absolute top-1 end-1 w-2 h-2 bg-burgundy rounded-full" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute end-0 top-full mt-2 w-80 bg-white border border-ivory-dark shadow-xl rounded-sm overflow-hidden animate-slide-in-down">
                <div className="px-4 py-3 border-b border-ivory-dark bg-ivory/50">
                  <p className="text-xs font-bold text-ink">الإشعارات</p>
                </div>
                <ul className="py-1">
                  {notifications.map((n) => (
                    <li key={n.title}>
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-start hover:bg-ivory-dark/30 transition-colors cursor-pointer"
                      >
                        <n.icon size={16} className="text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-ink leading-relaxed">{n.title}</span>
                      </button>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="px-4 py-6 text-center text-xs text-warm-brown">لا إشعارات جديدة.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          )}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 p-1.5 hover:bg-ivory-dark rounded-md transition-colors cursor-pointer"
              aria-label="حساب الدخول"
            >
              {isAdmin ? (
                <span
                  className="w-9 h-9 text-ivory flex items-center justify-center text-base font-bold rounded-sm"
                  style={{ backgroundColor: fullCircle ? circleColor(fullCircle) : undefined }}
                >
                  ق
                </span>
              ) : (
                <img
                  src="/assets/logo.png"
                  alt=""
                  className="w-9 h-9 object-contain rounded-sm flex-shrink-0"
                />
              )}
              <span className="hidden md:block text-start leading-tight">
                <span className="block text-xs font-bold text-ink">
                  {isAdmin ? 'الإدارة الرئيسية' : `دائرة ${circleName(fullCircle)}`}
                </span>
                <span className="block text-[10px] text-warm-brown">
                  {isAdmin ? (operator?.name || 'مدير المحتوى') : (operator?.name || 'منظم الدائرة')}
                </span>
              </span>
              <ChevronDown size={14} className="hidden md:block text-warm-brown" />
            </button>
            {profileOpen && (
              <div className="absolute end-0 top-full mt-2 w-60 bg-white border border-ivory-dark shadow-xl rounded-sm overflow-hidden animate-slide-in-down">
                <div className="px-4 py-3 border-b border-ivory-dark bg-ivory/50">
                  <div className="flex items-center gap-2.5">
                    {isAdmin ? (
                      <span
                        className="w-7 h-7 text-ivory flex items-center justify-center text-sm font-bold rounded-sm flex-shrink-0"
                        style={{ backgroundColor: fullCircle ? circleColor(fullCircle) : undefined }}
                      >
                        ق
                      </span>
                    ) : (
                      <img
                        src="/assets/logo.png"
                        alt=""
                        className="w-7 h-7 object-contain rounded-sm flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">
                        {isAdmin ? 'الإدارة الرئيسية' : `دائرة ${circleName(fullCircle)}`}
                      </p>
                      <p className="text-[10px] text-warm-brown truncate">
                        {operator?.name || 'نادي القصة «إلمقه»'}
                      </p>
                    </div>
                  </div>
                </div>
                {!locked && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      openAccountSelect();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-ink hover:bg-ivory-dark/30 transition-colors cursor-pointer"
                  >
                    <UsersRound size={14} className="text-gold" />
                    تبديل الحساب
                  </button>
                )}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    go('home');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-ink hover:bg-ivory-dark/30 transition-colors cursor-pointer"
                >
                  <LogOut size={14} className="text-gold" />
                  العودة إلى الموقع
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setTopSearch('')}
          className="sm:hidden p-2 text-warm-brown hover:bg-ivory-dark rounded-md transition-colors"
          aria-label="بحث"
        >
          {topSearch ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>
    </header>
  );
}