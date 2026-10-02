import { UsersRound } from 'lucide-react';
import { CIRCLES, ORGANIZER_ACCOUNTS, circleColor } from './circles';
import { useAdmin } from './context/AdminContext';
import { useApp } from '../../context/AppContext';

export default function AccountSelect() {
  const { switchAccount } = useAdmin();
  const { go } = useApp();
  const adminAcc = ORGANIZER_ACCOUNTS.find((a) => a.type === 'admin');

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink text-ivory">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-burgundy text-ivory flex items-center justify-center text-xl font-bold rounded-sm">
            ق
          </span>
          <div className="leading-none">
            <p className="font-bold text-lg">نادي القصة</p>
            <p className="text-gold text-xs mt-1 tracking-widest">إلمقه · لوحة الإدارة</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
        <p className="text-xs text-gold font-medium tracking-wide mb-2">حسابات المنظمين</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink leading-snug">اختيار حساب</h1>
        <div className="editorial-divider mt-3" />
        <p className="mt-4 text-sm text-warm-brown leading-relaxed max-w-2xl">
          اختر الحساب الذي ستدير به اللوحة. حساب الدائرة يقتصر على بيانات دائرته، والحساب
          الرئيسي يطّلع على كل الدوائر. منسّق كل دائرة يدخل دائرته تلقائيًا بعد تسجيل
          دخوله، ولا يمكنه تبديل الحساب أو الاطلاع على دوائر أخرى.
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-bold text-ink mb-3">الإدارة</h2>
          <button
            onClick={() => switchAccount(adminAcc.id)}
            className="w-full flex items-center gap-4 bg-burgundy text-ivory px-5 py-4 rounded-sm text-start hover:bg-burgundy-light transition-colors cursor-pointer"
          >
            <span className="w-10 h-10 bg-ivory/15 text-ivory flex items-center justify-center rounded-sm flex-shrink-0">
              <UsersRound size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-base">{adminAcc.label}</span>
              <span className="block text-xs text-ivory/80 mt-0.5">{adminAcc.sub}</span>
            </span>
            <span className="text-[11px] text-ivory/90 border border-ivory/30 px-2 py-1 rounded-sm flex-shrink-0">
              التقارير والإعدادات والميزانية
            </span>
          </button>
        </section>

        <section className="mt-7">
          <h2 className="text-sm font-bold text-ink mb-3">دوائر النادي</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CIRCLES.map((circle) => (
              <button
                key={circle.key}
                onClick={() => switchAccount(`acc_${circle.key}`)}
                className="flex flex-col items-center gap-3 bg-white border border-ivory-dark px-4 py-6 rounded-sm text-center hover:border-warm-brown hover:bg-ivory-dark/25 transition-colors cursor-pointer"
              >
                <img
                  src="/assets/logo.png"
                  alt=""
                  className="w-14 h-14 object-contain flex-shrink-0"
                />
                <span className="min-w-0">
                  <span className="flex items-center justify-center gap-2 font-semibold text-sm text-ink">
                    <span
                      className="w-3 h-3 rounded-[2px] flex-shrink-0"
                      style={{ backgroundColor: circleColor(circle.key) }}
                      aria-hidden="true"
                    />
                    دائرة {circle.name}
                  </span>
                  <span className="block text-[11px] text-warm-brown mt-1.5">
                    {ORGANIZER_ACCOUNTS.find((a) => a.id === `acc_${circle.key}`)?.sub}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => go('home')}
          className="mt-10 text-xs text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
        >
          العودة إلى الموقع العام
        </button>
      </main>
    </div>
  );
}