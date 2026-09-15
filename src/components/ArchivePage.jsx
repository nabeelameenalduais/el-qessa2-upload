import { useState } from 'react';
import { Calendar } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import EventCard from './ui/EventCard';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function ArchivePage() {
  const { content } = useApp();
  const { archive, events } = content;
  const [activeYear, setActiveYear] = useState('2026');

  const yearEvents = events.filter((e) => {
    const year = e.date.split(' ').pop();
    return year === activeYear;
  });

  return (
    <div>
      <PageHeader
        eyebrow="الأرشيف"
        title="أرشيف نادي القصة"
        description="ذاكرة النادي الممتدة عبر السنوات — فعاليات، ورش، وإصدارات."
        image={images.oldBooks}
      />

      {/* Timeline of years */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-wrap gap-3 mb-12">
          {archive.map((a) => (
            <button
              key={a.year}
              onClick={() => setActiveYear(a.year)}
              className={`flex-1 min-w-[140px] text-center border p-5 transition-all ${
                activeYear === a.year
                  ? 'bg-burgundy border-burgundy text-ivory shadow-md'
                  : 'bg-white border-ivory-dark text-ink hover:border-burgundy/40'
              }`}
            >
              <p className="text-2xl md:text-3xl font-bold">{a.year}</p>
              <p
                className={`text-xs mt-1 ${
                  activeYear === a.year ? 'text-ivory/80' : 'text-gold'
                }`}
              >
                {a.count}
              </p>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Year overview */}
          <div className="lg:col-span-1">
            {archive
              .filter((a) => a.year === activeYear)
              .map((a) => (
                <div key={a.year} className="bg-white border border-ivory-dark p-7 sticky top-24">
                  <p className="text-sm text-gold mb-2">{a.count}</p>
                  <h2 className="text-2xl font-bold text-ink mb-4">عام {a.year}</h2>
                  <div className="editorial-divider mb-4" />
                  <p className="text-warm-brown text-sm leading-loose mb-6 font-serif">
                    {a.description}
                  </p>
                  <ul className="space-y-2.5">
                    {a.events.map((ev, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-ink">
                        <Calendar size={14} className="text-gold flex-shrink-0" />
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {/* Year events */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg text-ink mb-5">
              فعاليات عام {activeYear}
            </h3>
            <div className="editorial-divider mb-6" />
            {yearEvents.length === 0 ? (
              <div className="bg-white border border-ivory-dark p-10 text-center">
                <p className="text-warm-brown text-sm">
                  لا توجد فعاليات مفصلة في هذا العام ضمن بيان النموذج الأولي.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {yearEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}