import { CalendarClock, MapPin, Clock, Newspaper, CalendarDays, ArrowLeft } from 'lucide-react';
import PageHead from './ui/PageHead';
import StatBand from './ui/StatBand';
import MonthlyActivityChart from './charts/MonthlyActivityChart';
import DonutChart from './charts/DonutChart';
import RegistrationTrendChart from './charts/RegistrationTrendChart';
import ChartPanel from './charts/ChartPanel';
import {
  computeEvents,
  computeWriters,
  computePublications,
  computeWorkshops,
  computeNews,
  computeGallery,
  computeFiles,
  registrationsByEvent,
  recentActivity,
} from './utils/deriveStats';
import { todayArabicDate } from './utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';

export default function AdminOverview() {
  const { addToast, go, registrations, content } = useApp();
  const { scopedList } = useAdmin();

  const viewEvents = scopedList(content.events);
  const viewNews = scopedList(content.news);
  const events = computeEvents(viewEvents);
  const writers = computeWriters(content.writers);
  const pubs = computePublications(content.publications);
  const workshops = computeWorkshops(scopedList(content.workshops));
  const news = computeNews(viewNews);
  const gallery = computeGallery(content.gallery);
  const files = computeFiles(scopedList(content.files));
  const scopeIds = new Set(viewEvents.map((e) => e.id));
  const scopeRegs = registrations.filter((r) => scopeIds.has(r.eventId));
  const byEvent = registrationsByEvent(scopeRegs);
  const activity = recentActivity(viewEvents, viewNews, 5);

  const stats = [
    { label: 'إجمالي الفعاليات', value: events.total, note: `${events.pastCount} فعالية سابقة` },
    { label: 'الفعاليات القادمة', value: events.upcomingCount, note: 'في الأسابيع المقبلة' },
    { label: 'الكتّاب', value: writers.total, note: `${writers.byCity.length} مدن` },
    { label: 'الإصدارات', value: pubs.total, note: `أحدثها ${pubs.byYear[pubs.byYear.length - 1]?.name || ''}` },
    { label: 'الورش', value: workshops.total, note: workshops.byStatus.map((s) => `${s.name} (${s.count})`).join(' · ') },
    { label: 'التسجيلات', value: scopeRegs.length, note: 'من نموذج الموقع' },
  ];

  const distribution = [
    { label: 'الفعاليات', count: events.total, color: 'bg-burgundy' },
    { label: 'الكتّاب', count: writers.total, color: 'bg-burgundy-light' },
    { label: 'الإصدارات', count: pubs.total, color: 'bg-gold' },
    { label: 'الورش', count: workshops.total, color: 'bg-warm-brown' },
    { label: 'الأخبار', count: news.total, color: 'bg-burgundy-dark' },
    { label: 'الأرشيف', count: content.archive.length, color: 'bg-gold-light' },
    { label: 'معرض الصور', count: gallery.total, color: 'bg-ink/60' },
  ];
  const maxDistribution = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <div>
      <PageHead
        eyebrow="لوحة الإدارة"
        title="نظرة عامة"
        description="مؤشرات النادي محسوبة مباشرة من البيانات الفعلية المخزنة في الموقع."
        meta={
          <p className="text-xs text-warm-brown flex items-center gap-2 mt-1">
            <CalendarDays size={14} className="text-gold" />
            {todayArabicDate()}
          </p>
        }
      />

      <div className="space-y-5 lg:space-y-6">
        <StatBand stats={stats} />

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <MonthlyActivityChart data={events.byMonth} />
          </div>
          <DonutChart
            data={pubs.byCategory}
            total={pubs.total}
            centerLabel="إصدار"
            title="توزيع الإصدارات"
            subtitle="حسب نوع المحتوى المنشور من بيانات النادي."
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          <RegistrationTrendChart registrations={scopeRegs} />

          <section className="bg-white border border-ivory-dark">
            <header className="px-5 pt-5 pb-2">
              <h3 className="font-bold text-ink text-base">الفعاليات القادمة</h3>
              <p className="text-xs text-warm-brown mt-1">الأنشطة المجدولة التالية حسب التاريخ.</p>
            </header>
            <div className="p-3">
              {events.upcomingSorted.length === 0 ? (
                <p className="py-10 text-center text-sm text-warm-brown">لا توجد فعاليات قادمة.</p>
              ) : (
                <ul className="divide-y divide-ivory-dark/60">
                  {events.upcomingSorted.slice(0, 5).map((e) => (
                    <li key={e.id}>
                      <button
                        onClick={() => {
                          go('event-detail', { id: e.id });
                          addToast('تم الانتقال إلى صفحة الفعالية', 'info');
                        }}
                        className="w-full flex items-center gap-4 px-3 py-3 text-start hover:bg-ivory-dark/30 transition-colors cursor-pointer group"
                      >
                        <span className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy flex items-center justify-center rounded-sm">
                          <CalendarClock size={18} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-ink truncate group-hover:text-burgundy transition-colors">
                            {e.title}
                          </span>
                          <span className="block text-[11px] text-warm-brown mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-gold" /> {e.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="text-gold" /> {e.time}
                            </span>
                          </span>
                        </span>
                        <ArrowLeft size={15} className="text-gold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <DonutChart
            data={events.byCategory}
            total={events.total}
            centerLabel="فعالية"
            title="الفعاليات حسب الدائرة"
            subtitle="توزيع الفعاليات على دوائر النادي، والدائرة هي تصنيف الفعالية."
          />
          <ChartPanel
            title="التسجيلات حسب الفعالية"
            subtitle="حصر تسجيلات الموقع لكل فعالية على حدة."
          >
            {byEvent.length === 0 ? (
              <p className="py-10 text-center text-sm text-warm-brown">
                لا توجد تسجيلات محسوبة بعد.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {byEvent.slice(0, 6).map((b, i) => {
                  const pct = b.count
                    ? Math.round((b.count / byEvent[0].count) * 100)
                    : 0;
                  return (
                    <li key={b.name} className="text-sm">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-warm-brown truncate">{b.name}</span>
                        <span className="font-semibold text-ink flex-shrink-0">
                          {b.count} تسجيل
                        </span>
                      </div>
                      <div className="h-2 bg-ivory-dark/50 overflow-hidden rounded-sm">
                        <div
                          className="h-full bg-burgundy transition-all"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </ChartPanel>
          <DonutChart
            data={files.byType}
            total={files.total}
            centerLabel="ملف"
            title="الملفات حسب النوع"
            subtitle="عدد الملفات المخزنة والمربوطة بالمحتوى حسب نوعها."
          />
        </div>

        <ChartPanel
          title="توزيع المحتوى"
          subtitle="كيف يتوزع المحتوى على أقسام الموقع حسب البيانات المخزنة."
        >
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {distribution.map((d) => (
              <li key={d.label} className="text-sm">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-warm-brown">{d.label}</span>
                  <span className="font-semibold text-ink">{d.count}</span>
                </div>
                <div className="h-2 bg-ivory-dark/50 overflow-hidden rounded-sm">
                  <div
                    className={`h-full ${d.color} transition-all`}
                    style={{ width: `${(d.count / maxDistribution) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-warm-brown/70 mt-4">
            توزيع واحد لكل قسم. يتحدّث تلقائياً عند إضافة أو تعديل أو حذف أي محتوى.
          </p>
        </ChartPanel>

        <section className="bg-white border border-ivory-dark">
          <header className="px-5 pt-5 pb-2">
            <h3 className="font-bold text-ink text-base">النشاط الأخير</h3>
            <p className="text-xs text-warm-brown mt-1">أحدث الأخبار والفعاليات مرتبة حسب تاريخها.</p>
          </header>
          <div className="p-3">
            <ul className="divide-y divide-ivory-dark/60">
              {activity.map((a) => (
                <li key={`${a.kind}-${a.id}`}>
                  <button
                    onClick={() => {
                      go(a.kind === 'news' ? 'news-detail' : 'event-detail', { id: a.id });
                      addToast('تم الانتقال إلى التفاصيل', 'info');
                    }}
                    className="w-full flex items-center gap-4 px-3 py-3 text-start hover:bg-ivory-dark/30 transition-colors cursor-pointer group"
                  >
                    <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-sm bg-ivory-dark/70 text-warm-brown">
                      <Newspaper size={15} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-ink truncate group-hover:text-burgundy transition-colors">
                        {a.title}
                      </span>
                      <span className="block text-[11px] text-warm-brown mt-0.5">{a.date}</span>
                    </span>
                    <ArrowLeft size={15} className="text-gold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 pb-4">
            <p className="text-[10px] text-warm-brown/70">
              إجمالي المعروض: {news.latestSorted.length} خبر · {gallery.total} صورة في المعرض.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}