import { ArrowRight, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Btn from './ui/Btn';

export default function NewsDetailPage() {
  const { detailId, go, content } = useApp();
  const { news } = content;
  const article = news.find((n) => n.id === detailId);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-brown text-lg">الخبر غير موجود.</p>
        <Btn className="mt-6" onClick={() => go('news')}>
          <ArrowRight size={16} /> العودة إلى الأخبار
        </Btn>
      </div>
    );
  }

  const others = news.filter((n) => n.id !== article.id).slice(0, 2);

  return (
    <div>
      <section className="relative bg-ink overflow-hidden">
        <img
          src={article.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <p className="text-gold-light text-xs font-medium tracking-widest mb-4">
            {article.category}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-ivory leading-snug">
            {article.title}
          </h1>
          <div className="editorial-divider mx-auto mt-6 mb-6" />
          <div className="flex items-center justify-center gap-5 text-ivory/70 text-sm">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {article.date}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <article className="text-warm-brown leading-loose text-base md:text-lg font-serif space-y-6">
          {article.content.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        <div className="mt-14">
          <h3 className="font-bold text-lg text-ink mb-5">مقالات ذات صلة</h3>
          <div className="editorial-divider mb-6" />
          <div className="grid sm:grid-cols-2 gap-6">
            {others.map((o) => (
              <article
                key={o.id}
                onClick={() => go('news-detail', { id: o.id })}
                className="group bg-white border border-ivory-dark p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <p className="text-xs text-gold mb-2">{o.date}</p>
                <h4 className="font-bold text-ink leading-snug group-hover:text-burgundy transition-colors line-clamp-2">
                  {o.title}
                </h4>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ivory-dark">
          <Btn variant="ghost" onClick={() => go('news')}>
            <ArrowRight size={16} /> العودة إلى جميع الأخبار
          </Btn>
        </div>
      </div>
    </div>
  );
}