import { useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from './ui/PageHeader';
import WriterCard from './ui/WriterCard';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function WritersPage() {
  const { content } = useApp();
  const { writers } = content;
  const [search, setSearch] = useState('');

  const filteredWriters = writers.filter(
    (w) =>
      !search ||
      w.name.includes(search) ||
      w.role.includes(search) ||
      w.tagline.includes(search)
  );

  return (
    <div>
      <PageHeader
        eyebrow="الكتّاب"
        title="كتّاب في المشهد"
        description="قاصّون وروائيون ونقّاد يصنعون نبض النادي، ويحملون صوته إلى جمهور أوسع."
        image={images.writingDesk}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-md mx-auto mb-12 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن كاتب..."
            className="w-full pr-10 pl-4 py-3 bg-white border border-ivory-dark rounded-sm text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-brown/60"
          />
        </div>

        {filteredWriters.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-brown text-lg">لا يوجد كتّاب يطابقون البحث.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredWriters.map((w) => (
              <WriterCard key={w.id} writer={w} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}