import { useState } from 'react';
import { CalendarDays, Pencil, Check, X, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import Btn from './ui/Btn';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { circleName } from './admin/circles';

const statusStyles = {
  'قيد المراجعة': 'bg-burgundy/10 text-burgundy',
  'مؤكد': 'bg-gold/20 text-ink',
  'ملغي': 'bg-ivory-dark text-warm-brown',
};

const roleLabel = {
  'أدمن': 'أدمن',
  'حاضر': 'حاضر',
  'زائر': 'زائر',
};

export default function MyPage() {
  const {
    isAuthenticated,
    currentUser,
    content,
    registrations,
    go,
    updateProfile,
    addToast,
    logout,
  } = useApp();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  if (!isAuthenticated || !currentUser) {
    return (
      <div>
        <PageHeader
          eyebrow="حسابي"
          title="مرحبًا بك"
          description="سجّل الدخول للاطلاع على حسابك وتسجيلاتك في فعاليات النادي."
          image={images.writingDesk}
        />
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <p className="text-sm text-warm-brown mb-8">
            تحتاج إلى حساب لتتمكن من رؤية تسجيلاتك ومتابعة حالة الحضور.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Btn onClick={() => go('login')}>
              <LogIn size={16} />
              تسجيل الدخول
            </Btn>
            <Btn variant="outline" onClick={() => go('register')}>
              <UserPlus size={16} />
              إنشاء حساب جديد
            </Btn>
          </div>
        </section>
      </div>
    );
  }

  const userRegistrations = registrations.filter(
    (r) => r.userId === currentUser.id || (r.email || '').toLowerCase() === currentUser.email
  );

  const startEdit = () => {
    setForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
    });
    setErrors({});
    setEditing(true);
  };

  const saveProfile = () => {
    const errs = {};
    const name = form.name.trim();
    if (!name) errs.name = 'الاسم مطلوب';
    else if (name.length < 3) errs.name = 'الاسم قصير جدًا';

    const email = form.email.trim().toLowerCase();
    if (!email) errs.email = 'البريد الإلكتروني مطلوب';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'صيغة البريد غير صحيحة';
    else if (
      content.users.some(
        (u) => u.email === email && u.id !== currentUser.id
      )
    ) {
      errs.email = 'يوجد مستخدم بهذا البريد بالفعل';
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    updateProfile({ name, email, phone: form.phone.trim() });
    addToast('تم تحديث بياناتك بنجاح');
    setEditing(false);
  };

  const fieldClass =
    'w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors';

  const createdAt = currentUser.createdAt;

  return (
    <div>
      <PageHeader
        eyebrow="حسابي"
        title="حسابي"
        description="ملفك الشخصي وسجل تسجيلاتك في فعاليات النادي."
        image={images.writingDesk}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
        <div className="bg-white border border-ivory-dark">
          <header className="px-6 md:px-8 py-6 flex flex-wrap items-center gap-5">
            <span className="w-16 h-16 bg-burgundy text-ivory flex items-center justify-center text-2xl font-bold rounded-sm flex-shrink-0">
              {currentUser.name?.charAt(0) || '؟'}
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-ink leading-snug">{currentUser.name}</h2>
              <p className="text-sm text-warm-brown mt-0.5" dir="ltr" style={{ textAlign: 'right' }}>
                {currentUser.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-sm bg-gold/20 text-ink">
                  {roleLabel[currentUser.role] || currentUser.role}
                </span>
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-sm bg-ivory-dark/70 text-warm-brown">
                  {currentUser.active === false ? 'موقوف' : 'عضو'} منذ{' '}
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString('ar-YE', { year: 'numeric', month: 'numeric', day: 'numeric' })
                    : 'غير محدد'}
                </span>
              </div>
            </div>
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-ivory-dark text-warm-brown hover:text-burgundy hover:border-burgundy rounded-sm transition-colors cursor-pointer"
            >
              <Pencil size={14} />
              تعديل الملف
            </button>
          </header>

          <div className="px-6 md:px-8 pb-6 -mt-1">
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-warm-brown">
              <li className="flex items-center justify-between gap-3">
                <span className="text-xs text-warm-brown/80">رقم الهاتف</span>
                <span className="text-ink font-medium">
                  {currentUser.phone || 'غير محدد'}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-xs text-warm-brown/80">عدد التسجيلات</span>
                <span className="text-ink font-medium">{userRegistrations.length}</span>
              </li>
              {currentUser.circleId && (
                <li className="flex items-center justify-between gap-3">
                  <span className="text-xs text-warm-brown/80">الدائرة</span>
                  <span className="text-ink font-medium">
                    دائرة {circleName(currentUser.circleId) || currentUser.circleId}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {(currentUser.role === 'أدمن' ||
            (currentUser.role === 'حاضر' && currentUser.circleId)) && (
            <div className="px-6 md:px-8 pb-6">
              <button
                onClick={() => go('admin')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:text-burgundy-light transition-colors cursor-pointer"
              >
                <LayoutDashboard size={16} />
                {currentUser.role === 'أدمن'
                  ? 'الانتقال إلى لوحة الإدارة'
                  : `الانتقال إلى لوحة دائرة ${
                      circleName(currentUser.circleId) || currentUser.circleId
                    }`}
              </button>
            </div>
          )}

          <div className="px-6 md:px-8 pb-6 border-t border-ivory-dark pt-5">
            <button
              onClick={() => {
                logout();
                go('home');
                addToast('تم تسجيل الخروج بنجاح');
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {editing && (
          <div className="bg-white border border-ivory-dark p-6 md:p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-ink">تعديل الملف الشخصي</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="profile-name" className="block text-xs font-semibold text-ink mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={fieldClass}
                  placeholder="الاسم الكامل"
                />
                {errors.name && (
                  <span role="alert" className="block text-[11px] text-red-600 mt-1">
                    {errors.name}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-xs font-semibold text-ink mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  id="profile-email"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`${fieldClass} text-start`}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <span role="alert" className="block text-[11px] text-red-600 mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="profile-phone" className="block text-xs font-semibold text-ink mb-1.5">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={fieldClass}
                  placeholder="07xxxxxxxx"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveProfile}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold bg-burgundy text-ivory hover:bg-burgundy-light rounded-sm transition-colors cursor-pointer"
              >
                <Check size={15} />
                حفظ التعديلات
              </button>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-warm-brown hover:text-ink border border-ivory-dark hover:border-warm-brown rounded-sm transition-colors cursor-pointer"
              >
                <X size={15} />
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-bold text-xl text-ink mb-1">تسجيلاتي</h3>
          <div className="editorial-divider mb-6" />

          {userRegistrations.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-ivory-dark bg-ivory/40">
              <p className="text-warm-brown text-sm">
                لم تسجّل حضورك في أي فعالية بعد.
              </p>
              <p className="text-xs text-warm-brown/70 mt-2">
                تصفّح فعاليات النادي وسجّل حضورك لتظهر هنا.
              </p>
              <div className="mt-6">
                <Btn variant="outline" onClick={() => go('events')}>
                  تصفح الفعاليات
                </Btn>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-ivory-dark/60 bg-white border border-ivory-dark">
              {userRegistrations.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink leading-snug">{r.eventTitle}</p>
                      <p className="text-xs text-warm-brown mt-1 flex items-center gap-1.5">
                        <CalendarDays size={12} className="text-gold" />
                        {r.eventDate || 'موعد غير محدد'}
                      </p>
                      <p className="text-[11px] text-warm-brown/70 mt-0.5">
                        سُجّل بتاريخ{' '}
{r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString('ar-YE', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                          })
                        : 'غير محدد'}
                      </p>
                    </div>
                    <span
                      className={`inline-block whitespace-nowrap px-2.5 py-1 text-[11px] font-medium rounded-sm ${
                        statusStyles[r.status] || statusStyles['قيد المراجعة']
                      }`}
                    >
                      {r.status || 'قيد المراجعة'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-[11px] text-warm-brown/70 text-center">
          هذه الصفحة تجريبية: الحساب والتسجيلات محفوظة محليًا في متصفحك ولا تُعالج على أي خادم.
        </p>
      </section>
    </div>
  );
}