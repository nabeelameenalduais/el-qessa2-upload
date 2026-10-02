import {
  LogOut,
} from 'lucide-react';
import { useAdmin } from './context/AdminContext';
import { useApp } from '../../context/AppContext';
import { adminSections } from './sections';
import { circleName, circleColor } from './circles';

export default function AdminSidebar({ collapsed }) {
  const { section, setSection, account, isAdmin, openAccountSelect, locked } = useAdmin();
  const { go, logout, addToast } = useApp();
  const visibleSections = adminSections.filter(
    (s) => isAdmin || !['users', 'reports', 'settings'].includes(s.key)
  );
  const circleKey = account?.circleKey || '';

  return (
    <div className="flex flex-col h-full bg-ink">
      <div className="flex items-center gap-3 px-5 h-20 border-b border-ivory/10 flex-shrink-0">
        <img
          src="/assets/logo.png"
          alt="شعار نادي القصة «إلمقه»"
          className="w-9 h-9 object-contain flex-shrink-0"
        />
        {!collapsed && (
          <div className="leading-none">
            <p className="text-ivory font-bold text-base">نادي القصة</p>
            <p className="text-gold text-xs mt-1 tracking-widest">إلمقه · لوحة الإدارة</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleSections.map((s) => {
          const active = section === s.key;
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              title={collapsed ? s.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-sm transition-colors cursor-pointer ${
                active
                  ? 'bg-burgundy text-ivory'
                  : 'text-ivory/70 hover:text-gold-light hover:bg-ivory/5'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1 text-start">{s.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-ivory/10 flex-shrink-0 space-y-1">
        {!collapsed && account && !locked && (
          <button
            onClick={openAccountSelect}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm bg-ivory/5 hover:bg-ivory/10 transition-colors cursor-pointer text-start"
            title="تبديل الحساب"
          >
            <span className="w-6 h-6 rounded-[2px] flex-shrink-0 flex items-center justify-center">
              {circleKey ? (
                <span
                  className="w-3.5 h-3.5 rounded-[2px]"
                  style={{ backgroundColor: circleColor(circleKey) }}
                  aria-hidden="true"
                />
              ) : (
                <span className="w-3.5 h-3.5 rounded-[2px] bg-burgundy" aria-hidden="true" />
              )}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-ivory truncate">
                {isAdmin ? 'الإدارة الرئيسية' : `دائرة ${circleName(circleKey)}`}
              </span>
              <span className="block text-[10px] text-ivory/50">تبديل الحساب</span>
            </span>
          </button>
        )}
        <button
          onClick={() => go('home')}
          title={collapsed ? 'العودة إلى الموقع' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-ivory/60 hover:text-gold-light hover:bg-ivory/5 rounded-sm transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-start">العودة إلى الموقع</span>}
        </button>
        <button
          onClick={() => {
            logout();
            go('home');
            addToast('تم تسجيل الخروج بنجاح');
          }}
          title={collapsed ? 'تسجيل الخروج' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-burgundy hover:bg-ivory/5 rounded-sm transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-start">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );
}