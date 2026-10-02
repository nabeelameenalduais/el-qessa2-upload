import { useEffect, useRef, useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';
import AuthLayout from './AuthLayout';

const fieldClass =
  'w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors pe-10';

export default function RegisterPage() {
  const { go, isAuthenticated, currentUser, register, addToast } = useApp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'أدمن') go('admin');
      else if (currentUser.role === 'حاضر' && currentUser.circleId) go('admin');
      else go('my-account');
    }
  }, [isAuthenticated, currentUser, go]);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const set = (key, value) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'email' || key === 'name' || key === 'password' || key === 'confirm') {
        setAuthError('');
      }
      return next;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    const errs = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    else if (form.name.trim().length < 3) errs.name = 'الاسم قصير جدًا';

    const email = form.email.trim();
    if (!email) errs.email = 'البريد الإلكتروني مطلوب';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'صيغة البريد الإلكتروني غير صحيحة';

    if (form.phone.trim()) {
      if (!/^[0-9+\s-]{7,}$/.test(form.phone.trim())) {
        errs.phone = 'رقم الهاتف غير صحيح';
      }
    }

    if (!form.password) errs.password = 'كلمة المرور مطلوبة';
    else if (form.password.length < 6) errs.password = 'كلمة المرور يجب ألا تقل عن 6 أحرف';

    if (!form.confirm) errs.confirm = 'أعد إدخال كلمة المرور';
    else if (form.confirm !== form.password) errs.confirm = 'كلمتا المرور غير متطابقتين';

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setAuthError('');
    setLoading(true);
    setTimeout(() => {
      const result = register({
        name: form.name.trim(),
        email,
        phone: form.phone.trim(),
        password: form.password,
      });
      setLoading(false);
      if (result.ok) {
        addToast('تم إنشاء حسابك بنجاح');
      } else {
        setAuthError(result.error);
      }
    }, 600);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-slide-up">
        <div className="hidden lg:flex flex-col items-center text-center mb-9">
          <img
            src="/assets/logo.png"
            alt="شعار نادي القصة «إلمقه»"
            className="w-24 h-24 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-burgundy">نادي القصة «إلمقه»</h1>
          <div className="editorial-divider mt-4" />
        </div>

        <p className="text-xs text-gold font-medium tracking-wide mb-1">عضو جديد</p>
        <h2 className="text-2xl font-bold text-ink leading-snug">انضم إلى النادي</h2>
        <p className="text-sm text-warm-brown mt-1.5">
          أنشئ حسابك لتسجيل حضورك في الفعاليات ومتابعة تسجيلاتك.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="reg-name"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <User size={13} className="text-gold flex-shrink-0" />
              الاسم الكامل
            </label>
            <input
              ref={nameRef}
              id="reg-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
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
            <label
              htmlFor="reg-email"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <Mail size={13} className="text-gold flex-shrink-0" /> البريد الإلكتروني
            </label>
            <input
              id="reg-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors text-start"
              placeholder="name@example.com"
            />
            {errors.email && (
              <span role="alert" className="block text-[11px] text-red-600 mt-1">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="reg-phone"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <Phone size={13} className="text-gold flex-shrink-0" /> رقم الهاتف (اختياري)
            </label>
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={fieldClass}
              placeholder="07xxxxxxxx"
            />
            {errors.phone && (
              <span role="alert" className="block text-[11px] text-red-600 mt-1">
                {errors.phone}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <Lock size={13} className="text-gold flex-shrink-0" /> كلمة المرور
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className={fieldClass}
                placeholder="٦ أحرف على الأقل"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span role="alert" className="block text-[11px] text-red-600 mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="reg-confirm"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <Lock size={13} className="text-gold flex-shrink-0" /> تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                className={fieldClass}
                placeholder="أعد إدخال كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm && (
              <span role="alert" className="block text-[11px] text-red-600 mt-1">
                {errors.confirm}
              </span>
            )}
          </div>

          {authError && (
            <div
              role="alert"
              className="border border-burgundy/30 bg-burgundy/5 px-4 py-3 text-xs text-burgundy leading-relaxed"
            >
              {authError}
            </div>
          )}

          <div className="pt-1">
            <Btn type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
                  جارٍ إنشاء الحساب
                </>
              ) : (
                'إنشاء الحساب'
              )}
            </Btn>
          </div>
          <p className="text-[11px] text-warm-brown/70 leading-relaxed">
            بإنشاء الحساب تبدأ عضويتك بدور «حاضر». أدوار «أدمن» لا تُمنح إلا من قبل
            إدارة النادي، ولا يمكن التسجيل بها مباشرة.
          </p>
        </form>

        <div className="mt-6 text-center text-sm text-warm-brown">
          لديك حساب بالفعل؟
          <button
            onClick={() => go('login')}
            className="text-burgundy font-semibold hover:text-burgundy-light transition-colors cursor-pointer me-1"
          >
            سجّل الدخول
          </button>
        </div>

        <button
          onClick={() => go('home')}
          className="mt-6 mx-auto flex items-center gap-1.5 text-xs text-warm-brown hover:text-burgundy transition-colors cursor-pointer"
        >
          <ArrowRight size={14} />
          العودة إلى الموقع
        </button>
      </div>
    </AuthLayout>
  );
}