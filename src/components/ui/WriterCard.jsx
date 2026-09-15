import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WriterCard({ writer }) {
  const { go } = useApp();
  return (
    <article
      onClick={() => go('writer-detail', { id: writer.id })}
      className="group bg-white border border-ivory-dark cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-burgundy/5"
    >
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={writer.portrait}
          alt={writer.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 inset-x-0 p-4">
          <p className="text-gold-light text-xs font-medium mb-1">{writer.role}</p>
          <h3 className="text-ivory font-bold text-lg">{writer.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-warm-brown leading-relaxed line-clamp-3 mb-4">
          {writer.tagline}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gold">{writer.city}</span>
          <span className="inline-flex items-center gap-1.5 text-burgundy text-sm font-semibold">
            عرض الملف
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}