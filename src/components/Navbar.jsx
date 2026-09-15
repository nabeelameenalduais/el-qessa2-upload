import { Menu, X, Globe, Camera, AtSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
  { label: 'حسابي', page: 'my-account' },
  { label: 'تواصل معنا', page: 'contact' },
];

export default function Navbar() {
  const { currentPage, go, mobileMenuOpen, toggleMobileMenu } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-ivory-dark shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      {/* Masthead row */}
      <div className="border-b border-ivory-dark/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-3 group"
            aria-label="نادي القصة — الرئيسية"
          >
            <span className="w-10 h-10 sm:w-11 sm:h-11 bg-burgundy text-ivory flex items-center justify-center text-xl sm:text-2xl font-bold rounded-sm shadow-sm">
              ق
            </span>
            <span className="text-right">
              <span className="block text-lg sm:text-2xl font-bold text-burgundy leading-none">
                نادي القصة
              </span>
              <span className="block text-[10px] sm:text-xs text-gold mt-1 tracking-widest">
                إلمقه
              </span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-5 text-warm-brown">
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

          <button
            onClick={toggleMobileMenu}
            aria-label="القائمة"
            className="md:hidden p-2 text-burgundy hover:bg-ivory-dark rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-0.5 h-12">
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
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-ivory-dark bg-ivory animate-slide-in-down max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4 space-y-1">
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
            <div className="flex items-center justify-center gap-4 pt-4 mt-2 border-t border-ivory-dark text-burgundy">
              <Globe size={18} />
              <Camera size={18} />
              <AtSign size={18} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}