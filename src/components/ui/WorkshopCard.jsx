import { Calendar, Clock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const statusStyles = {
  'التسجيل مفتوح': 'bg-emerald-100 text-emerald-700',
  'قريباً': 'bg-gold/20 text-gold-light',
  'انتهت': 'bg-warm-brown/10 text-warm-brown',
};

export default function WorkshopCard({ workshop }) {
  const { go } = useApp();
  return (
    <article
      className="group bg-white border border-ivory-dark cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-burgundy/5"
      onClick={() => go('events', {})}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-bold text-ink text-lg leading-snug group-hover:text-burgundy transition-colors">
            {workshop.title}
          </h3>
          <span
            className={`text-[11px] font-medium px-2.5 py-1 whitespace-nowrap ${statusStyles[workshop.status] || 'bg-warm-brown/10 text-warm-brown'}`}
          >
            {workshop.status}
          </span>
        </div>
        <div className="space-y-2.5 text-sm text-warm-brown">
          <p className="flex items-center gap-2">
            <User size={15} className="text-gold flex-shrink-0" />
            مقدّم الورشة: <span className="font-medium text-ink">{workshop.instructor}</span>
          </p>
          <p className="flex items-center gap-2">
            <Calendar size={15} className="text-gold flex-shrink-0" />
            {workshop.date}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={15} className="text-gold flex-shrink-0" />
            المدة: {workshop.duration}
          </p>
        </div>
        <p className="text-sm text-warm-brown leading-relaxed mt-4 mb-5 line-clamp-2">
          {workshop.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-burgundy text-sm font-semibold">
          التفاصيل
        </span>
      </div>
    </article>
  );
}