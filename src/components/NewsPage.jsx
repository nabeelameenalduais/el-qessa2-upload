import PageHeader from './ui/PageHeader';
import NewsCard from './ui/NewsCard';
import { images } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function NewsPage() {
  const { content } = useApp();
  const { news } = content;
  return (
    <div>
      <PageHeader
        eyebrow="الأخبار"
        title="آخر أخبار النادي"
        description="آخر أخبار النادي — تطورات، مشاركات، وإصدارات جديدة."
        image={images.booksWarm}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {news.map((n) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
      </section>
    </div>
  );
}