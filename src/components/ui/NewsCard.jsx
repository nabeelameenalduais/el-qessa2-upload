import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NewsCard({ news }) {
  const { go } = useApp();
  return (
    <article
      onClick={() => go('news-detail', { id: news.id })}
      className="group bg-white border border-ivory-dark cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-burgundy/5"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={news.image}
          alt={news.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 bg-ink/80 text-gold-light text-[11px] px-3 py-1 font-medium backdrop-blur-sm">
          {news.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs text-gold mb-2">{news.date}</p>
        <h3 className="font-bold text-ink text-base md:text-lg leading-snug mb-2 group-hover:text-burgundy transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="text-sm text-warm-brown leading-relaxed line-clamp-2 mb-4">
          {news.excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 text-burgundy text-sm font-semibold">
          قراءة المقال
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
        </span>
      </div>
    </article>
  );
}