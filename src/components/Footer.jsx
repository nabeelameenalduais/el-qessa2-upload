import {
  Globe,
  Camera,
  AtSign,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const footLinks = [
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

export default function Footer() {
  const { go } = useApp();

  return (
    <footer className="bg-ink text-ivory/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-burgundy text-ivory flex items-center justify-center text-xl font-bold rounded-sm">
                ق
              </span>
              <div>
                <p className="text-ivory font-bold text-lg leading-none">
                  نادي القصة
                </p>
                <p className="text-gold text-xs mt-1 tracking-widest">إلمقه</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              مساحة ثقافية تجمع كتّاب القصة والرواية والمهتمين بالسرد، وتحتفي
              بالكلمة والكتاب والفعالية الأدبية.
            </p>
          </div>

          <div>
            <h4 className="text-ivory font-semibold text-sm mb-4">
              روابط الموقع
            </h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-sm">
              {footLinks.map((l) => (
                <li key={l.page}>
                  <button
                    onClick={() => go(l.page)}
                    className="hover:text-gold-light transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-ivory font-semibold text-sm mb-4">
              تواصل معنا
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                صنعاء، اليمن — مقر النادي الثقافي
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold flex-shrink-0" />
                info@algessa.example
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold flex-shrink-0" />
                +967 700 000 000
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-ivory font-semibold text-sm mb-4">
              تابعنا
            </h4>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="#social"
                className="w-10 h-10 border border-ivory/20 flex items-center justify-center rounded-sm hover:bg-burgundy hover:border-burgundy hover:text-ivory transition-colors"
                aria-label="الموقع"
              >
                <Globe size={16} />
              </a>
              <a
                href="#social"
                className="w-10 h-10 border border-ivory/20 flex items-center justify-center rounded-sm hover:bg-burgundy hover:border-burgundy hover:text-ivory transition-colors"
                aria-label="الصور"
              >
                <Camera size={16} />
              </a>
              <a
                href="#social"
                className="w-10 h-10 border border-ivory/20 flex items-center justify-center rounded-sm hover:bg-burgundy hover:border-burgundy hover:text-ivory transition-colors"
                aria-label="المراسلة"
              >
                <AtSign size={16} />
              </a>
            </div>
            <p className="text-xs text-ivory/50 leading-relaxed">
              نموذج أولي لعرض الواجهة — جميع البيانات تجريبية.
            </p>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © 2026 نادي القصة «إلمقه». جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => go('admin')}
              className="flex items-center gap-1.5 text-gold-light hover:text-ivory transition-colors cursor-pointer"
            >
              لوحة الإدارة
            </button>
            <span className="h-3 w-px bg-ivory/20" />
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-ivory/50 hover:text-gold-light transition-colors cursor-pointer"
            >
              العودة إلى الأعلى <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}