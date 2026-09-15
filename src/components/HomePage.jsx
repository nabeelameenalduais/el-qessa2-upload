import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  BookOpen,
  Users,
  Quote,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { circleName } from './admin/circles';
import { images } from '../data/mockData';
import Btn from './ui/Btn';
import SectionHeading from './ui/SectionHeading';
import EventCard from './ui/EventCard';
import WriterCard from './ui/WriterCard';
import NewsCard from './ui/NewsCard';
import BookCover from './ui/BookCover';

export default function HomePage() {
  const { go, setLightbox, openRegistration, content } = useApp();
  const { events, writers, publications, news, archive, gallery: galleryImages } = content;

  const upcomingEvent = events.find((e) => e.upcoming);
  const featuredEvents = events.filter((e) => e.upcoming).slice(0, 4);
  const featuredWriters = writers.slice(0, 4);
  const featuredPublications = publications.slice(0, 4);
  const featuredNews = news.slice(0, 3);
  const galleryPreview = galleryImages.slice(0, 6);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-ink">
        <img
          src={images.heroLibrary}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 w-full">
          <div className="max-w-3xl animate-fade-slide-up">
            <p className="text-gold-light text-sm md:text-base tracking-[0.3em] mb-5">
              نادي القصة «إلمقه»
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-ivory leading-tight mb-6">
              نادي القصة
            </h1>
            <div className="editorial-divider mb-6" />
            <p className="text-ivory/85 text-base sm:text-xl leading-relaxed mb-10 max-w-xl font-serif">
              مساحة تجمع كتاب القصة والرواية والمهتمين بالسرد، وتحتفي بالكلمة
              والكتاب والفعالية الثقافية.
            </p>
            <div className="flex flex-wrap gap-4">
              <Btn onClick={() => go('events')}>
                استكشف الفعاليات
                <ArrowLeft size={16} />
              </Btn>
              <Btn variant="light" onClick={() => go('about')}>
                عن النادي
              </Btn>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* ============ UPCOMING EVENT ============ */}
      {upcomingEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <SectionHeading
            eyebrow="تعالَ إلينا"
            title="الفعالية القادمة"
            subtitle="مساحة مفتوحة للجميع — الحضور مجاني والدعوة عامة."
          />
          <div className="grid lg:grid-cols-2 gap-8 border border-ivory-dark bg-white overflow-hidden transition-shadow hover:shadow-xl hover:shadow-burgundy/5">
            <div className="relative overflow-hidden min-h-[280px] lg:min-h-[360px]">
              <img
                src={upcomingEvent.image}
                alt={upcomingEvent.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-burgundy text-ivory text-xs px-3 py-1.5 font-medium">
                {circleName(upcomingEvent.circleId)}
              </span>
            </div>
            <div className="p-7 md:p-10 flex flex-col justify-center">
              <p className="text-gold text-xs tracking-widest mb-2">الأمسية المقبلة</p>
              <h3 className="text-2xl md:text-3xl font-bold text-ink mb-6">
                {upcomingEvent.title}
              </h3>
              <div className="space-y-3 text-warm-brown text-sm md:text-base mb-8">
                <p className="flex items-center gap-3">
                  <Calendar size={18} className="text-gold flex-shrink-0" />
                  {upcomingEvent.date}
                </p>
                <p className="flex items-center gap-3">
                  <Clock size={18} className="text-gold flex-shrink-0" />
                  {upcomingEvent.time}
                </p>
                <p className="flex items-center gap-3">
                  <MapPin size={18} className="text-gold flex-shrink-0" />
                  {upcomingEvent.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Btn onClick={() => go('event-detail', { id: upcomingEvent.id })}>
                  التفاصيل
                </Btn>
                <Btn
                  variant="outline"
                  onClick={() => openRegistration(upcomingEvent)}
                >
                  سجل حضورك
                </Btn>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ ABOUT ============ */}
      <section className="relative bg-burgundy overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-light text-xs md:text-sm tracking-widest mb-3">
              عن النادي
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-ivory leading-tight mb-6">
              الحكاية مستمرة
            </h2>
            <div className="editorial-divider mb-6" />
            <p className="text-ivory/80 font-serif text-base md:text-lg leading-loose mb-8 max-w-xl">
              منذ انطلاقته، ينهض نادي القصة على إيمان بسيط: أن الحكاية كائن حي
              يحتاج إلى مساحة تنفّس، وإلى جمهور يصغي، وإلى عين ناقدة ترعاه.
              من أمسيات القراءة إلى الورش والجلسات النقدية، يصنع النادي جسراً
              بين الكلمة وقارئها، وبين الموهبة الصاعدة والتجربة المعمّقة.
            </p>
            <Btn onClick={() => go('about')} variant="light">
              اكتشف النادي
              <ArrowLeft size={16} />
            </Btn>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-ivory/10 border border-ivory/15 p-6 h-full">
              <BookOpen size={26} className="text-gold-light mb-4" />
              <p className="text-ivory font-bold text-xl mb-1">إصدارات</p>
              <p className="text-ivory/65 text-sm leading-relaxed">
                كتب تحمل علامة النادي ونبض كتابه.
              </p>
            </div>
            <div className="bg-ivory/10 border border-ivory/15 p-6 h-full md:mt-8">
              <Users size={26} className="text-gold-light mb-4" />
              <p className="text-ivory font-bold text-xl mb-1">ورش وجلسات</p>
              <p className="text-ivory/65 text-sm leading-relaxed">
                مساحات تعلمّ ونقاش لصقل صوت الجيل الجديد.
              </p>
            </div>
            <div className="bg-ivory/10 border border-ivory/15 p-6 h-full md:-mt-4">
              <Quote size={26} className="text-gold-light mb-4" />
              <p className="text-ivory font-bold text-xl mb-1">أمسيات</p>
              <p className="text-ivory/65 text-sm leading-relaxed">
                ليالٍ يلتقي فيها النص بالجمهور وجهاً لوجه.
              </p>
            </div>
            <div className="bg-ivory/10 border border-ivory/15 p-6 h-full md:mt-8">
              <BookOpen size={26} className="text-gold-light mb-4" />
              <p className="text-ivory font-bold text-xl mb-1">أرشيف</p>
              <p className="text-ivory/65 text-sm leading-relaxed">
                ذاكرة النادي المحفوظة منذ بداياته.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EVENTS PREVIEW ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="مواسم وأمسيات"
          title="فعاليات النادي"
          subtitle="أمسيات قصصية، ندوات، جلسات نقدية وورش كتابة تحتفي بالسرد."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((e) => (
            <EventCard key={e.id} event={e} compact />
          ))}
        </div>
        <div className="text-center mt-10">
          <Btn variant="outline" onClick={() => go('events')}>
            جميع الفعاليات
            <ArrowLeft size={16} />
          </Btn>
        </div>
      </section>

      {/* ============ WRITERS PREVIEW ============ */}
      <section className="bg-ivory-dark/40 border-y border-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <SectionHeading
            eyebrow="أصوات النادي"
            title="كتّاب في المشهد"
            subtitle="قاصّون وروائيون ونقّاد يمنحون النادي نبضه، ويحملون صوته إلى جمهور أوسع."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWriters.map((w) => (
              <WriterCard key={w.id} writer={w} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Btn onClick={() => go('writers')}>
              جميع الكتّاب
              <ArrowLeft size={16} />
            </Btn>
          </div>
        </div>
      </section>

      {/* ============ PUBLICATIONS PREVIEW ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="من إصدارات النادي"
          title="إصدارات مختارة"
          subtitle="كتب صدرت بعلامة نادي القصة، من القصة إلى الرواية إلى الدراسات النقدية."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {featuredPublications.map((p) => (
            <div
              key={p.id}
              onClick={() => go('publication-detail', { id: p.id })}
              className="group cursor-pointer"
            >
              <BookCover
                pub={p}
                className="transition-transform duration-300 group-hover:-translate-y-1.5 shadow-md group-hover:shadow-xl"
              />
              <div className="mt-4 text-center">
                <h3 className="font-bold text-ink text-sm md:text-base leading-snug">
                  {p.title}
                </h3>
                <p className="text-warm-brown text-xs md:text-sm mt-0.5">
                  {p.author}
                </p>
                <p className="text-gold text-xs mt-0.5">{p.year}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Btn variant="outline" onClick={() => go('publications')}>
            جميع الإصدارات
            <ArrowLeft size={16} />
          </Btn>
        </div>
      </section>

      {/* ============ NEWS PREVIEW ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
        <SectionHeading
          eyebrow="من أخبار النادي"
          title="آخر الأخبار"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNews.map((n) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Btn variant="outline" onClick={() => go('news')}>
            كل الأخبار
            <ArrowLeft size={16} />
          </Btn>
        </div>
      </section>

      {/* ============ ARCHIVE PREVIEW ============ */}
      <section className="bg-ink text-ivory/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <SectionHeading
            eyebrow="ذاكرة الثقافة"
            title="من أرشيف النادي"
            subtitle="سنوات من السرد والأمسيات والندوات، في سجل يمتد من الفكرة الأولى حتى اليوم."
            light
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {archive.map((a) => (
              <button
                key={a.year}
                onClick={() => go('archive')}
                className="group border border-ivory/15 p-6 md:p-8 text-right hover:border-gold/60 hover:bg-ivory/5 transition-colors"
              >
                <p className="text-4xl md:text-5xl font-bold text-ivory group-hover:text-gold-light transition-colors">
                  {a.year}
                </p>
                <div className="editorial-divider my-3" />
                <p className="text-sm text-ivory/60">{a.count}</p>
                <p className="text-xs text-gold-light mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  تصفح الأرشيف ←
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY PREVIEW ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="صور تروي"
          title="من معرض الصور"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryPreview.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setLightbox(g)}
              className={`group relative overflow-hidden ${
                i === 0 || i === 3 ? 'md:row-span-2' : ''
              }`}
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3] md:aspect-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-end">
                <p className="text-ivory text-xs md:text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity text-right w-full">
                  {g.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-10">
          <Btn onClick={() => go('gallery')}>
            معرض الصور الكامل
            <ArrowLeft size={16} />
          </Btn>
        </div>
      </section>
    </div>
  );
}