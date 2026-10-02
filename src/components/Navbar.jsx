import { Menu, X, Globe, Camera, AtSign, LogOut, LayoutDashboard, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { circleName } from './admin/circles';

const navLinks = [
  { label: 'الرئيسية', page: 'home' },
  { label: 'عن النادي', page: 'about' },
  { label: 'الفعاليات', page: 'events' },
  { label: 'الكتّاب', page: 'writers' },
  { label: 'الإصدارات', page: 'publications' },
  { label: 'الورش', page: 'workshops' },
  { label: 'الأخبار', page: 'news' },
  { label: 'الأرشيف', page: 'archive' },
  { label: 'معرض الصور', page: 'gallery' },
  { label: 'تواصل معنا', page: 'contact' },
];

export default function Navbar() {
  const {
    currentPage,
    go,
    mobileMenuOpen,
    toggleMobileMenu,
    isAuthenticated,
    currentUser,
    logout,
    addToast,
  } = useApp();

  const handleLogout = () => {
    logout();
    go('home');
    addToast('تم تسجيل الخروج بنجاح');
  };

  const isAdmin = isAuthenticated && currentUser?.role === 'أدمن';
  const isOrganizer =
    isAuthenticated &&
    currentUser?.role === 'حاضر' &&
    Boolean(currentUser?.circleId);
  const dashboardLabel = isOrganizer
    ? `لوحة دائرة ${circleName(currentUser.circleId) || currentUser.circleId}`
    : 'لوحة الإدارة';

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-ivory-dark shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="border-b border-ivory-dark/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-3 group"
            aria-label="نادي القصة — الرئيسية"
          >
            <img
              src="/assets/logo.png"
              alt="شعار نادي القصة «إلمقه»"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
            />
            <span className="text-lg sm:text-2xl font-bold text-burgundy leading-none whitespace-nowrap">
              نادي القصة «إلمقه»
            </span>
          </button>

          <div className="hidden md:flex items-center gap-3">
            {isAdmin || isOrganizer ? (
              <>
                <span className="text-xs text-warm-brown">
                  أهلًا، {currentUser.name}
                </span>
                <button
                  onClick={() => go('admin')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-burgundy text-ivory px-3 py-1.5 rounded-sm hover:bg-burgundy-light transition-colors cursor-pointer"
                >
                  <LayoutDashboard size={14} />
                  {dashboardLabel}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-5 text-warm-brown">
                <a
                  href="mailto:info@algessa.example"
                  className="text-xs hover:text-burgundy transition-colors"
                >
                  info@algessa.example
                </a>
                <span className="h-4 w-px bg-ivory-dark" />
                <a href="#contact" onClick={() => go('contact')} className="text-xs hover:text-burgundy transition-colors">
                  صنعاء، اليمن
                </a>
                <span className="h-4 w-px bg-ivory-dark" />
                <a href="#social" className="flex items-center gap-1.5 text-burgundy hover:text-burgundy-light transition-colors">
                  <Globe size={15} />
                </a>
                <a href="#social" className="text-burgundy hover:text-burgundy-light transition-colors">
                  <Camera size={15} />
                </a>
                <a href="#social" className="text-burgundy hover:text-burgundy-light transition-colors">
                  <AtSign size={15} />
                </a>
              </div>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            aria-label="القائمة"
            className="md:hidden p-2 text-burgundy hover:bg-ivory-dark rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-12">
            <div className="flex items-center gap-4 flex-shrink-0">
              {isAuthenticated && currentUser ? (
                <>
                  {(isAdmin || isOrganizer) && (
                    <button
                      onClick={() => go('my-account')}
                      title="حسابي"
                      aria-label="حسابي"
                      className="w-9 h-9 rounded-full border border-ivory-dark bg-burgundy text-ivory flex items-center justify-center hover:bg-burgundy-light transition-colors cursor-pointer"
                    >
                      <UserRound size={18} />
                    </button>
                  )}
                  {!isAdmin && !isOrganizer && (
                    <>
                      <button
                        onClick={() => go('my-account')}
                        className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                          currentPage === 'my-account'
                            ? 'text-burgundy'
                            : 'text-warm-brown hover:text-burgundy'
                        }`}
                      >
                        <UserRound size={15} />
                        حسابي
                      </button>
                      <button
                        onClick={handleLogout}
                        title="تسجيل الخروج"
                        aria-label="تسجيل الخروج"
                        className="flex items-center gap-1.5 text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                      </button>
                      <span className="hidden xl:block text-xs text-warm-brown/80 max-w-[140px] truncate" title={currentUser.name}>
                        {currentUser.name}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => go('login')}
                    className={`text-[13px] font-medium transition-colors cursor-pointer ${
                      currentPage === 'login'
                        ? 'text-burgundy'
                        : 'text-warm-brown hover:text-burgundy'
                    }`}
                  >
                    دخول
                  </button>
                  <button
                    onClick={() => go('register')}
                    className={`text-[13px] font-semibold transition-colors cursor-pointer ${
                      currentPage === 'register'
                        ? 'text-burgundy'
                        : 'text-burgundy hover:text-burgundy-light'
                    }`}
                  >
                    حساب جديد
                  </button>
                </>
              )}
              <span className="h-4 w-px bg-ivory-dark" aria-hidden="true" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-0.5">
              {navLinks.map((link) => {
                const active = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => go(link.page)}
                    className={`relative px-3 lg:px-4 py-3 text-[13px] lg:text-sm font-medium transition-colors whitespace-nowrap ${
                      active ? 'text-burgundy' : 'text-warm-brown hover:text-burgundy'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3 lg:inset-x-4 -bottom-px h-[2px] bg-gold transition-opacity ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ivory-dark bg-ivory animate-slide-in-down max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 space-y-1">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-ivory-dark">
                <span className="w-8 h-8 bg-burgundy text-ivory flex items-center justify-center text-sm font-bold rounded-sm flex-shrink-0">
                  {currentUser.name?.charAt(0) || '؟'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-warm-brown">{currentUser.role}</p>
                </div>
              </div>
            ) : null}

            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => go(link.page)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  currentPage === link.page
                    ? 'bg-burgundy text-ivory'
                    : 'text-warm-brown hover:bg-ivory-dark'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-ivory-dark mt-2 pt-3 space-y-1">
              {isAuthenticated && currentUser ? (
                <>
                  <button
                    onClick={() => go('my-account')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      currentPage === 'my-account' ? 'bg-burgundy text-ivory' : 'text-warm-brown hover:bg-ivory-dark'
                    }`}
                  >
                    <UserRound size={16} />
                    حسابي
                  </button>
                  {(isAdmin || isOrganizer) && (
                    <button
                      onClick={() => go('admin')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-burgundy bg-burgundy/5 hover:bg-burgundy/10 rounded-md transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {dashboardLabel}
                    </button>
                  )}
                  {!isAdmin && !isOrganizer && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-warm-brown hover:bg-ivory-dark rounded-md transition-colors"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => go('login')}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold bg-burgundy text-ivory hover:bg-burgundy-light rounded-md transition-colors"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => go('register')}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold border border-burgundy text-burgundy hover:bg-burgundy hover:text-ivory rounded-md transition-colors"
                  >
                    إنشاء حساب جديد
                  </button>
                </>
              )}
            </div>

            {!(isAdmin || isOrganizer) && (
              <div className="flex items-center justify-center gap-4 pt-4 mt-2 border-t border-ivory-dark text-burgundy">
                <Globe size={18} />
                <Camera size={18} />
                <AtSign size={18} />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}