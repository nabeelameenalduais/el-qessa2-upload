import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, CheckCircle2, LogIn, UserPlus, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';

function RegistrationForm({ event, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const { currentUser, isAuthenticated, addRegistration } = useApp();
  const { closeRegistration, go } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    addRegistration({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '',
      status: 'قيد المراجعة',
      createdAt: Date.now(),
    });
    setSubmitted(true);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="px-6 py-10 text-center">
        <UserRound size={40} className="mx-auto text-burgundy mb-4" />
        <h4 className="text-xl font-bold text-ink mb-2">سجّل الدخول أولًا</h4>
        <p className="text-warm-brown text-sm leading-relaxed mb-6">
          تحتاج إلى حساب نشط في النادي لتتمكن من تسجيل حضورك في هذه الفعالية.
        </p>
        <div className="flex flex-col gap-2.5">
          <Btn
            onClick={() => {
              closeRegistration();
              go('login');
            }}
          >
            <LogIn size={16} />
            تسجيل الدخول
          </Btn>
          <button
            onClick={() => {
              closeRegistration();
              go('register');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold border border-burgundy text-burgundy hover:bg-burgundy hover:text-ivory rounded-sm transition-colors cursor-pointer"
          >
            <UserPlus size={16} />
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="px-6 py-12 text-center">
        <CheckCircle2 size={48} className="mx-auto text-burgundy mb-4" />
        <h4 className="text-xl font-bold text-ink mb-2">
          تم تسجيل حضورك بنجاح
        </h4>
        <p className="text-warm-brown text-sm leading-relaxed mb-1">
          {event.title}
        </p>
        <p className="text-warm-brown text-sm">
          سنتواصل معك عبر بريدك الإلكتروني لتأكيد الحضور. شكراً لانضمامك.
        </p>
        <p className="text-xs text-warm-brown/70 mt-3">
          يمكنك متابعة حالة تسجيلك من صفحة «حسابي».
        </p>
        <Btn className="mt-6" onClick={onClose}>
          إغلاق
        </Btn>
      </div>
    );
  }

  const fieldClass =
    'w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors';

  return (
    <div className="px-6 py-6">
      <div className="bg-ivory-dark/60 rounded-md px-4 py-3 mb-6">
        <p className="font-bold text-ink text-sm mb-1">{event.title}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-warm-brown">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {event.location}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            الاسم الكامل
          </label>
          <input
            type="text"
            value={currentUser.name}
            readOnly
            tabIndex={-1}
            className={`${fieldClass} bg-ivory-dark/40 cursor-not-allowed`}
          />
          <p className="text-[11px] text-warm-brown/70 mt-1">
            سيُسجَّل الحضور باسم حسابك في النادي.
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            dir="ltr"
            value={currentUser.email}
            readOnly
            tabIndex={-1}
            className={`${fieldClass} text-start bg-ivory-dark/40 cursor-not-allowed`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            رقم الهاتف (اختياري)
          </label>
          <input
            type="tel"
            value={currentUser.phone || ''}
            readOnly
            tabIndex={-1}
            placeholder="07xxxxxxxx"
            className={`${fieldClass} bg-ivory-dark/40 cursor-not-allowed`}
          />
          <p className="text-[11px] text-warm-brown/70 mt-1">
            يمكنك تحديث رقم هاتفك من صفحة «حسابي».
          </p>
        </div>
        <div className="pt-1">
          <Btn type="submit" className="w-full">
            تأكيد التسجيل
          </Btn>
        </div>
      </form>
    </div>
  );
}

export default function RegistrationModal() {
  const { registrationEvent, closeRegistration } = useApp();

  useEffect(() => {
    if (!registrationEvent) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeRegistration();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [registrationEvent, closeRegistration]);

  if (!registrationEvent) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-ink/70 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="w-full max-w-lg bg-ivory rounded-sm shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-burgundy px-6 py-5 flex items-center justify-between">
          <h3 className="text-ivory font-bold text-lg">التسجيل في الفعالية</h3>
          <button
            onClick={closeRegistration}
            className="text-ivory/70 hover:text-ivory transition-colors"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>
        <RegistrationForm
          key={registrationEvent.id}
          event={registrationEvent}
          onClose={closeRegistration}
        />
      </div>
    </div>
  );
}