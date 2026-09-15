import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PageHeader from './ui/PageHeader';
import BookCover from './ui/BookCover';
import { images, publicationTypes } from '../data/mockData';

export default function PublicationsPage() {
  const { go, content } = useApp();
  const { publications } = content;
  const [activeType, setActiveType] = useState('الكل');

  const chips = ['الكل', ...publicationTypes];

  const filtered =
    activeType === 'الكل'
      ? publications
      : publications.filter((p) => p.category === activeType);

  return (
    <div>
      <PageHeader
        eyebrow="الإصدارات"
        title="إصدارات النادي"
        description="كتب صدرت بعلامة نادي القصة، تحمل صوت كتّابها إلى كل من يقرأ."
        image={images.booksWarm}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {chips.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 text-xs md:text-sm font-medium border transition-colors rounded-sm ${
                activeType === type
                  ? 'bg-burgundy border-burgundy text-ivory'
                  : 'border-ivory-dark text-warm-brown hover:border-burgundy/40 hover:text-burgundy'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((p) => (
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
                <h3 className="font-bold text-ink text-sm md:text-base leading-snug group-hover:text-burgundy transition-colors">
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
      </section>
    </div>
  );
}