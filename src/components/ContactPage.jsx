import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import Btn from './ui/Btn';
import { useApp } from '../context/AppContext';
import { images } from '../data/mockData';

const infoCards = [
  {
    icon: MapPin,
    title: 'العنوان',
    lines: ['صنعاء، اليمن', 'مقر النادي الثقافي'],
  },
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    lines: ['info@algessa.example'],
  },
  {
    icon: Phone,
    title: 'الهاتف',
    lines: ['+967 700 000 000'],
  },
  {
    icon: Clock,
    title: 'أوقات الزيارة',
    lines: ['السبت — الخميس', '4:00 عصراً — 9:00 مساءً'],
  },
];

export default function ContactPage() {
  const { addToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    addToast('تم إرسال رسالتك بنجاح — سنرد عليك قريباً');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <PageHeader
        eyebrow="تواصل معنا"
        title="بيننا وبينك كلمة"
        description="نرحب باستفساراتكم ومقترحاتكم ومشاركاتكم — راسلونا وكونوا جزءاً من الحكاية."
        image={images.quill}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {infoCards.map((c, i) => (
              <div key={i} className="bg-white border border-ivory-dark p-6 flex gap-4">
                <c.icon size={22} className="text-burgundy flex-shrink-0" />
                <div>
                  <p className="font-bold text-ink mb-1.5">{c.title}</p>
                  {c.lines.map((l, j) => (
                    <p key={j} className="text-warm-brown text-sm">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-ink p-6 text-ivory/80">
              <p className="font-bold text-ivory mb-2">تابع فعالياتنا</p>
              <p className="text-sm leading-relaxed">
                اشترك في قائمتنا البريدية لتصلك دعوات الأمسيات والورش أولاً بأول —
                هذه نسخة تجريبية لأغراض العرض.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-ivory-dark p-7 md:p-9"
            >
              <h2 className="font-bold text-xl text-ink mb-2">أرسل رسالتك</h2>
              <div className="editorial-divider mb-7" />
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="اسمك الكريم"
                    className="w-full px-4 py-2.5 bg-ivory border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
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
                    className="w-full px-4 py-2.5 bg-ivory border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  الموضوع
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="موضوع الرسالة"
                  className="w-full px-4 py-2.5 bg-ivory border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  الرسالة
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="اكتب رسالتك هنا..."
                  rows={6}
                  className="w-full px-4 py-2.5 bg-ivory border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
                  required
                />
              </div>
              <Btn type="submit">
                إرسال الرسالة
                <Send size={16} />
              </Btn>
              <p className="text-[11px] text-warm-brown/70 mt-4">
                نموذج تجريبي — لا يتم إرسال أي رسالة فعلية.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}