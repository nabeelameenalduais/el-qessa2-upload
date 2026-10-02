import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';
import AuthLayout from './AuthLayout';

const DEMO_ACCOUNTS = [
  { label: 'أدمن', email: 'admin@elqissa.club', password: 'admin123' },
  { label: 'حاضر', email: 'reem@elqissa.club', password: 'reem123' },
];

export default function LoginPage() {
  const { go, isAuthenticated, currentUser, login, addToast, setRememberMe, rememberMe } =
    useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'أدمن') go('admin');
      else if (currentUser.role === 'حاضر' && currentUser.circleId) go('admin');
      else go('my-account');
    }
  }, [isAuthenticated, currentUser, go]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    const errs = {};
    if (!email.trim()) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    if (!password) errs.password = 'كلمة المرور مطلوبة';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setAuthError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      setLoading(false);
      if (result.ok) {
        addToast('تم تسجيل الدخول بنجاح');
      } else {
        setAuthError(result.error);
      }
    }, 500);
  };

  const fieldClass =
    'w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors pe-10';
  const emailFieldClass =
    'w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors';

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

        <p className="text-xs text-gold font-medium tracking-wide mb-1">حسابك</p>
        <h2 className="text-2xl font-bold text-ink leading-snug">مرحبًا بك من جديد</h2>
        <p className="text-sm text-warm-brown mt-1.5">سجّل الدخول للمتابعة إلى حسابك</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <Mail size={13} className="text-gold flex-shrink-0" /> البريد الإلكتروني
            </label>
            <input
              ref={emailRef}
              id="login-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (authError) setAuthError('');
              }}
              className={`${emailFieldClass} text-start`}
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
              htmlFor="login-password"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5"
            >
              <Lock size={13} className="text-gold flex-shrink-0" /> كلمة المرور
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                className={fieldClass}
                placeholder="••••••••"
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

          {authError && (
            <div
              role="alert"
              className="border border-burgundy/30 bg-burgundy/5 px-4 py-3 text-xs text-burgundy leading-relaxed"
            >
              {authError}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs text-warm-brown cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-burgundy"
              />
              تذكّرني
            </label>
            <button
              type="button"
              onClick={() => addToast('للاستعادة، تواصل مع إدارة النادي عبر بريد الموقع', 'info')}
              className="text-xs text-burgundy hover:text-burgundy-light transition-colors cursor-pointer"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <Btn type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
                جارٍ تسجيل الدخول
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </Btn>
        </form>

        <div className="mt-6 text-center text-sm text-warm-brown">
          ليس لديك حساب بعد؟
          <button
            onClick={() => go('register')}
            className="text-burgundy font-semibold hover:text-burgundy-light transition-colors cursor-pointer me-1"
          >
            سجّل الآن
          </button>
        </div>

        <div className="mt-8 border border-ivory-dark bg-white px-4 py-3">
          <p className="text-[11px] font-semibold text-ink mb-2">حسابات تجريبية للدخول</p>
          <ul className="space-y-1 text-[11px] text-warm-brown">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email} className="flex items-center justify-between gap-2">
                <span className="font-medium text-ink">{a.label}</span>
                <span dir="ltr" className="truncate">
                  {a.email}
                </span>
                <span dir="ltr" className="text-gold">
                  {a.password}
                </span>
              </li>
            ))}
          </ul>
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