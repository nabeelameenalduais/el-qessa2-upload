import { ArrowRight, Calendar, Clock, MapPin, Paperclip, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { circleName } from './admin/circles';
import Btn from './ui/Btn';

export default function EventDetailPage() {
  const { detailId, go, openRegistration, content } = useApp();
  const { events, files } = content;
  const event = events.find((e) => e.id === detailId);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-brown text-lg">الفعالية غير موجودة.</p>
        <Btn className="mt-6" onClick={() => go('events')}>
          <ArrowRight size={16} /> العودة إلى الفعاليات
        </Btn>
      </div>
    );
  }

  const attachments = files.filter(
    (f) =>
      f.relatedSection === 'events' &&
      f.relatedId === event.id &&
      f.visibility === 'عام' &&
      (f.dataUrl || f.url)
  );

  return (
    <div>
      {/* Cover */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden bg-ink">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-40 w-full">
          <span className="bg-burgundy/90 text-ivory text-xs px-3 py-1.5 font-medium mb-4 inline-block backdrop-blur-sm">
            {circleName(event.circleId)}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ivory leading-tight mt-4">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Info bar */}
      <div className="bg-white border-b border-ivory-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-warm-brown">
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-gold flex-shrink-0" />
            {event.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-gold flex-shrink-0" />
            {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-gold flex-shrink-0" />
            {event.location}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-bold text-xl text-ink mb-4">عن الفعالية</h2>
              <div className="editorial-divider mb-5" />
              <div className="text-warm-brown leading-loose text-sm md:text-base font-serif space-y-4">
                {event.description.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {event.speakers.length > 0 && (
              <div>
                <h2 className="font-bold text-xl text-ink mb-4">المشاركون</h2>
                <div className="editorial-divider mb-5" />
                <div className="space-y-3">
                  {event.speakers.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white border border-ivory-dark px-5 py-4"
                    >
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="text-warm-brown text-sm mt-1">{s.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-ivory-dark p-6 sticky top-24">
              <h3 className="font-bold text-ink mb-4">برنامج الفعالية</h3>
              <div className="editorial-divider mb-5" />
              <ul className="space-y-4">
                {event.schedule.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-gold font-semibold whitespace-nowrap w-24">
                      {s.time}
                    </span>
                    <span className="text-warm-brown leading-relaxed">
                      {s.title}
                    </span>
                  </li>
                ))}
              </ul>
              {event.upcoming && (
                <Btn
                  className="w-full mt-6"
                  onClick={() => openRegistration(event)}
                >
                  سجّل حضورك الآن
                </Btn>
              )}
            </div>
          </aside>
        </div>

        {attachments.length > 0 && (
          <section className="mt-12">
            <h2 className="font-bold text-xl text-ink mb-4">مرفقات الفعالية</h2>
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
          <Btn variant="ghost" onClick={() => go('events')}>
            <ArrowRight size={16} /> العودة إلى جميع الفعاليات
          </Btn>
        </div>
      </div>
    </div>
  );
}