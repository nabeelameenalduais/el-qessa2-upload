import { useState } from 'react';
import { Expand } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from './ui/PageHeader';
import { images } from '../data/mockData';

const categories = ['الكل', 'فعاليات', 'ورش', 'كتّاب', 'إصدارات'];

export default function GalleryPage() {
  const { setLightbox, content } = useApp();
  const { gallery: galleryImages } = content;
  const [activeCategory, setActiveCategory] = useState('الكل');

  const filtered =
    activeCategory === 'الكل'
      ? galleryImages
      : galleryImages.filter((g) => g.category === activeCategory);

  return (
    <div>
      <PageHeader
        eyebrow="معرض الصور"
        title="صور تروي الحكاية"
        description="لقطات من أمسياتنا وورشنا ولقاءاتنا، ومن إصداراتنا التي تحبس الكلمات."
        image={images.bookCafe}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs md:text-sm font-medium border transition-colors rounded-sm ${
                activeCategory === cat
                  ? 'bg-burgundy border-burgundy text-ivory'
                  : 'border-ivory-dark text-warm-brown hover:border-burgundy/40 hover:text-burgundy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-ish grid */}
        <div className="columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {filtered.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setLightbox(g)}
              className="group relative mb-4 break-inside-avoid w-full overflow-hidden cursor-zoom-in"
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="w-full p-4 text-right">
                  <p className="text-ivory text-sm font-medium mb-0.5">
                    {g.caption}
                  </p>
                  <p className="text-gold-light text-xs">
                    {g.category} — {g.year}
                  </p>
                </div>
              </div>
              <span className="absolute top-3 left-3 bg-ink/60 text-ivory p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand size={13} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}