import { ArrowRight, Paperclip, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';
import BookCover from './ui/BookCover';
import EventCard from './ui/EventCard';

export default function PublicationDetailPage() {
  const { detailId, go, content } = useApp();
  const { publications, writers, events, files } = content;
  const pub = publications.find((p) => p.id === detailId);

  if (!pub) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-brown text-lg">الإصدار غير موجود.</p>
        <Btn className="mt-6" onClick={() => go('publications')}>
          <ArrowRight size={16} /> العودة إلى الإصدارات
        </Btn>
      </div>
    );
  }

  const author = writers.find((w) => w.id === pub.authorId);
  const relatedEvents = events.filter(
    (e) => author?.relatedEventIds?.includes(e.id)
  );
  const attachments = files.filter(
    (f) =>
      f.relatedSection === 'publications' &&
      f.relatedId === pub.id &&
      f.visibility === 'عام' &&
      (f.dataUrl || f.url)
  );

  return (
    <div>
      <section className="relative bg-ink">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 sm:w-56 md:w-64 flex-shrink-0">
            <BookCover pub={pub} className="shadow-2xl w-full" />
          </div>
          <div className="text-center md:text-right">
            <p className="text-gold-light text-sm tracking-widest mb-2">
              {pub.category || 'إصدار نادي القصة'}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ivory leading-tight mb-4">
              {pub.title}
            </h1>
            <div className="editorial-divider mx-auto md:mr-0 mb-5 bg-gold-light/70" />
            <p className="text-ivory/80 text-lg mb-2">{pub.author}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-ivory/50 text-sm">
              <span>{pub.year}</span>
              <span className="h-1 w-1 bg-gold rounded-full" />
              <span>{pub.pages} صفحة</span>
              <span className="h-1 w-1 bg-gold rounded-full" />
              <span>{pub.publisher}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-bold text-xl text-ink mb-4">عن الإصدار</h2>
              <div className="editorial-divider mb-5" />
              <p className="text-warm-brown leading-loose text-base md:text-lg font-serif">
                {pub.description}
              </p>
            </div>

            {author && (
              <div>
                <h2 className="font-bold text-xl text-ink mb-4">عن الكاتب</h2>
                <div className="editorial-divider mb-5" />
                <div className="flex items-start gap-5 bg-white border border-ivory-dark p-6">
                  <img
                    src={author.portrait}
                    alt={author.name}
                    className="w-16 h-16 object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-ink mb-1">{author.name}</p>
                    <p className="text-warm-brown text-sm">{author.role}</p>
                    <button
                      onClick={() => go('writer-detail', { id: author.id })}
                      className="text-burgundy text-sm font-semibold mt-2 hover:underline"
                    >
                      عرض الملف ←
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="bg-white border border-ivory-dark p-6 h-fit sticky top-24">
            <h3 className="font-bold text-ink text-sm mb-3">تفاصيل الإصدار</h3>
            <div className="editorial-divider mb-4" />
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-warm-brown">العنوان</dt>
                <dd className="font-medium text-ink">{pub.title}</dd>
              </div>
              <div>
                <dt className="text-warm-brown">المؤلف</dt>
                <dd className="font-medium text-ink">{pub.author}</dd>
              </div>
              <div>
                <dt className="text-warm-brown">النوع</dt>
                <dd className="font-medium text-ink">{pub.category || 'إصدار نادي القصة'}</dd>
              </div>
              <div>
                <dt className="text-warm-brown">السنة</dt>
                <dd className="font-medium text-ink">{pub.year}</dd>
              </div>
              <div>
                <dt className="text-warm-brown">عدد الصفحات</dt>
                <dd className="font-medium text-ink">{pub.pages}</dd>
              </div>
              <div>
                <dt className="text-warm-brown">الناشر</dt>
                <dd className="font-medium text-ink">{pub.publisher}</dd>
              </div>
            </dl>
          </aside>
        </div>

        {relatedEvents.length > 0 && (
          <section className="mt-14">
            <h2 className="font-bold text-xl text-ink mb-5">فعاليات مرتبطة</h2>
            <div className="editorial-divider mb-6" />
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        {attachments.length > 0 && (
          <section className="mt-12">
            <h2 className="font-bold text-xl text-ink mb-4">مرفقات الإصدار</h2>
            <div className="editorial-divider mb-5" />
            <ul className="divide-y divide-ivory-dark/60 bg-white border border-ivory-dark">
              {attachments.map((f) => (
                <li key={f.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-10 h-10 bg-burgundy/10 text-burgundy flex items-center justify-center rounded-sm flex-shrink-0">
                    <Paperclip size={17} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{f.name}</p>
                    <p className="text-[11px] text-warm-brown mt-0.5">
                      {f.type}
                      {f.sizeLabel ? ` · ${f.sizeLabel}` : ''}
                      {f.description ? ` · ${f.description}` : ''}
                    </p>
                  </div>
                  <a
                    href={f.dataUrl || f.url}
                    download={f.dataUrl ? f.name : undefined}
                    target={f.url ? '_blank' : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-ivory-dark px-3.5 py-2 text-xs font-semibold text-burgundy hover:bg-ivory-dark/40 rounded-sm transition-colors"
                  >
                    تحميل
                    <Download size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 pt-8 border-t border-ivory-dark">
          <Btn variant="ghost" onClick={() => go('publications')}>
            <ArrowRight size={16} /> العودة إلى جميع الإصدارات
          </Btn>
        </div>
      </div>
    </div>
  );
}