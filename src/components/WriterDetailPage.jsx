import { ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';
import EventCard from './ui/EventCard';
import BookCover from './ui/BookCover';

export default function WriterDetailPage() {
  const { detailId, go, content } = useApp();
  const { writers, events, publications } = content;
  const writer = writers.find((w) => w.id === detailId);

  if (!writer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-brown text-lg">الكاتب غير موجود.</p>
        <Btn className="mt-6" onClick={() => go('writers')}>
          <ArrowRight size={16} /> العودة إلى الكتّاب
        </Btn>
      </div>
    );
  }

  const writerPublications = publications.filter((p) => p.authorId === writer.id);
  const writerEvents = events.filter((e) =>
    writer.relatedEventIds?.includes(e.id)
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden bg-ink">
        <img
          src={writer.portrait}
          alt={writer.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-40 w-full">
          <p className="text-gold-light text-sm mb-3">{writer.role}</p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ivory leading-tight">
            {writer.name}
          </h1>
          <div className="flex items-center gap-2 mt-4 text-ivory/70 text-sm">
            <MapPin size={15} />
            {writer.city}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-bold text-xl text-ink mb-4">نبذة</h2>
              <div className="editorial-divider mb-5" />
              <p className="text-warm-brown leading-loose text-sm md:text-base font-serif">
                {writer.bio}
              </p>
            </div>

            {writer.works.length > 0 && (
              <div>
                <h2 className="font-bold text-xl text-ink mb-4">الأعمال الأدبية</h2>
                <div className="editorial-divider mb-5" />
                <ul className="space-y-3">
                  {writer.works.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-3 bg-white border border-ivory-dark px-5 py-3"
                    >
                      <span className="text-gold text-sm">{w.year}</span>
                      <span className="font-semibold text-ink text-sm">
                        {w.title}
                      </span>
                      <span className="text-warm-brown text-xs">— {w.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-ivory-dark p-6">
              <h3 className="font-bold text-ink text-sm mb-3">ملخص سريع</h3>
              <div className="editorial-divider mb-4" />
              <dl className="space-y-3 text-sm">
                <dt className="text-warm-brown">المدينة</dt>
                <dd className="font-medium text-ink">{writer.city}</dd>
                <dt className="text-warm-brown">النوعية</dt>
                <dd className="font-medium text-ink">{writer.role}</dd>
                <dt className="text-warm-brown">عدد الأعمال</dt>
                <dd className="font-medium text-ink">
                  {writer.works.length} أعمال
                </dd>
              </dl>
            </div>
          </aside>
        </div>

        {writerPublications.length > 0 && (
          <section className="mt-14">
            <h2 className="font-bold text-xl text-ink mb-5">إصداراته</h2>
            <div className="editorial-divider mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {writerPublications.map((p) => (
                <div key={p.id} onClick={() => go('publication-detail', { id: p.id })} className="cursor-pointer">
                  <BookCover pub={p} className="shadow-sm" />
                  <p className="mt-3 text-sm font-semibold text-ink">{p.title}</p>
                  <p className="text-xs text-warm-brown">{p.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {writerEvents.length > 0 && (
          <section className="mt-14">
            <h2 className="font-bold text-xl text-ink mb-5">فعاليات مرتبطة</h2>
            <div className="editorial-divider mb-6" />
            <div className="grid sm:grid-cols-2 gap-6">
              {writerEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 pt-8 border-t border-ivory-dark">
          <Btn variant="ghost" onClick={() => go('writers')}>
            <ArrowRight size={16} /> العودة إلى جميع الكتّاب
          </Btn>
        </div>
      </div>
    </div>
  );
}