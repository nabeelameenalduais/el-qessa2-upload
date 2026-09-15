import { useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import EventCard from './ui/EventCard';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { getCircleRegistry } from './admin/circles';

export default function EventsPage() {
  const { content } = useApp();
  const { events } = content;
  const [search, setSearch] = useState('');
  const [activeCircle, setActiveCircle] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const circles = getCircleRegistry();

  const filteredEvents = events.filter((e) => {
    const matchCircle = activeCircle === '' || e.circleId === activeCircle;
    const matchTab =
      activeTab === 'upcoming' ? e.upcoming : !e.upcoming;
    const matchSearch =
      !search || e.title.includes(search) || e.excerpt.includes(search);
    return matchCircle && matchTab && matchSearch;
  });

  return (
    <div>
      <PageHeader
        eyebrow="الفعاليات"
        title="فعاليات النادي"
        description="أمسيات قصصية وندوات وورش ولقاءات، فعاليات مفتوحة للجميع."
        image={images.darkBooks}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 text-sm font-medium transition-colors rounded-sm ${
              activeTab === 'upcoming'
                ? 'bg-burgundy text-ivory'
                : 'bg-ivory-dark text-warm-brown hover:text-ink'
            }`}
          >
            الفعاليات القادمة
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 text-sm font-medium transition-colors rounded-sm ${
              activeTab === 'past'
                ? 'bg-burgundy text-ivory'
                : 'bg-ivory-dark text-warm-brown hover:text-ink'
            }`}
          >
            الفعاليات السابقة
          </button>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن فعالية..."
            className="w-full pr-10 pl-4 py-3 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-brown/60"
          />
        </div>

        {/* Circle filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCircle('')}
            className={`px-4 py-1.5 text-xs md:text-sm font-medium border transition-colors rounded-sm ${
              activeCircle === ''
                ? 'bg-burgundy border-burgundy text-ivory'
                : 'border-ivory-dark text-warm-brown hover:border-burgundy/40 hover:text-burgundy'
            }`}
          >
            جميع الفعاليات
          </button>
          {circles.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCircle(c.key)}
              className={`px-4 py-1.5 text-xs md:text-sm font-medium border transition-colors rounded-sm ${
                activeCircle === c.key
                  ? 'bg-burgundy border-burgundy text-ivory'
                  : 'border-ivory-dark text-warm-brown hover:border-burgundy/40 hover:text-burgundy'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-brown text-lg">لا توجد فعاليات تطابق البحث.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}