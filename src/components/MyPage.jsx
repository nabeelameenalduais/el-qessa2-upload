import { useState } from 'react';
import { Search, CalendarDays, UserRound } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import Btn from './ui/Btn';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';

const statusStyles = {
  'قيد المراجعة': 'bg-burgundy/10 text-burgundy',
  'مؤكد': 'bg-gold/20 text-ink',
  'ملغي': 'bg-ivory-dark text-warm-brown',
};

export default function MyPage() {
  const { registrations } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  const lookup = (e) => {
    e.preventDefault();
    const nameKey = name.trim().toLowerCase();
    const emailKey = email.trim().toLowerCase();
    const matches = registrations.filter((r) => {
      const rName = (r.name || '').toLowerCase();
      const rEmail = (r.email || '').toLowerCase();
      if (emailKey) return rEmail === emailKey && (!nameKey || rName.includes(nameKey));
      return nameKey && rName.includes(nameKey);
    });
    setResults(matches);
    setSearched(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="حسابي"
        title="تسجيلاتي"
        description="أدخل اسمك وبريدك لعرض تسجيلاتك في فعاليات النادي وحالة تأكيدها."
        image={images.writingDesk}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <form
          onSubmit={lookup}
          className="bg-white border border-ivory-dark p-6 md:p-8 mb-10"
        >
          <h2 className="font-bold text-xl text-ink mb-6">البحث في تسجيلاتك</h2>
          <div className="editorial-divider mb-6" />
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1.5">
                <UserRound size={13} className="text-gold" /> الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم المستخدم في التسجيل"
                className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-sm text-sm text-start focus:outline-none focus:border-burgundy transition-colors"
              />
            </div>
          </div>
          <Btn type="submit" className="w-full md:w-auto">
            <Search size={15} />
            عرض تسجيلاتي
          </Btn>
        </form>

        {!searched ? (
          <p className="text-sm text-warm-brown text-center">
            إذا سجّلت حضورك في أي فعالية من نموذج الموقع، ستظهر تسجيلاتك هنا بحالة تأكيدها.
          </p>
        ) : results.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-ivory-dark bg-ivory/40">
            <p className="text-warm-brown text-sm">
              لم نعثر على تسجيلات تطابق هذه البيانات.
            </p>
            <p className="text-xs text-warm-brown/70 mt-2">
              تأكد من كتابة نفس الاسم أو البريد المستخدم عند التسجيل.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ivory-dark/60 bg-white border border-ivory-dark">
            {results.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink leading-snug">{r.eventTitle}</p>
                    <p className="text-xs text-warm-brown mt-1 flex items-center gap-1.5">
                      <CalendarDays size={12} className="text-gold" />
                      {r.eventDate || 'موعد غير محدد'}
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

        <p className="text-[11px] text-warm-brown/70 text-center mt-8">
          هذه الصفحة تجريبية: البيانات محفوظة محلياً في متصفحك ولا تتم معالجتها على أي خادم.
        </p>
      </section>
    </div>
  );
}