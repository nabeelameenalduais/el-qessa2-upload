import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { circleName } from '../admin/circles';

export default function EventCard({ event, compact = false }) {
  const { go } = useApp();
  return (
    <article
      onClick={() => go('event-detail', { id: event.id })}
      className="group bg-white border border-ivory-dark cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-burgundy/5"
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 bg-burgundy/90 text-ivory text-[11px] px-3 py-1 font-medium backdrop-blur-sm">
          {circleName(event.circleId)}
        </span>
        {event.upcoming && (
          <span className="absolute top-3 left-3 bg-gold text-ivory text-[11px] px-2.5 py-1 font-medium">
            قادمة
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-brown mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-gold" /> {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-gold" /> {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-gold" /> {event.location}
          </span>
        </div>
        <h3 className="font-bold text-ink text-base md:text-lg leading-snug mb-2 group-hover:text-burgundy transition-colors line-clamp-2">
          {event.title}
        </h3>
        {!compact && (
          <p className="text-sm text-warm-brown leading-relaxed line-clamp-2 mb-4">
            {event.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-burgundy text-sm font-semibold mt-1">
          التفاصيل
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
        </span>
      </div>
    </article>
  );
}