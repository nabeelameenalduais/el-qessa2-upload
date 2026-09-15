import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, CheckCircle2, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';

function RegistrationForm({ event, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const { addRegistration } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addRegistration({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: 'قيد المراجعة',
      createdAt: Date.now(),
    });
    setSubmitted(true);
  };

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
          سنتواصل معك عبر البريد الإلكتروني لتأكيد الحضور. شكراً لانضمامك.
        </p>
        <Btn className="mt-6" onClick={onClose}>
          إغلاق
        </Btn>
      </div>
    );
  }

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
          <label className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5">
            <User size={13} className="text-gold" /> الاسم الكامل
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="الاسم الكامل"
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm focus:outline-none focus:border-burgundy transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            رقم الهاتف (اختياري)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="07xxxxxxxx"
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div className="pt-1">
          <Btn type="submit" className="w-full">
            تأكيد التسجيل
          </Btn>
        </div>
      </form>
      <p className="text-[11px] text-warm-brown/70 text-center mt-4">
        هذا النموذج تجريبي لأغراض العرض فقط — لا تتم أي معالجة فعلية للبيانات.
      </p>
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