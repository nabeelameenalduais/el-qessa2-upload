export default function BookCover({ pub, className = '' }) {
  const color = pub.color || '#5B2028';
  return (
    <div
      dir="rtl"
      className={`relative aspect-[2/3] w-full overflow-hidden select-none ${className}`}
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-2 sm:inset-3 border border-gold/60" />
      <div className="absolute inset-3 sm:inset-4 flex flex-col items-center justify-between py-3 sm:py-5 text-center px-2">
        <p className="text-gold-light text-[9px] sm:text-[10px] tracking-wide">
          نادي القصة «إلمقه»
        </p>
        <div className="space-y-2">
          <div className="mx-auto h-px w-8 sm:w-10 bg-gold/60" />
          <h3
            className="text-ivory font-bold leading-snug text-sm sm:text-lg md:text-xl"
            style={{ lineHeight: 1.7 }}
          >
            {pub.title}
          </h3>
          <div className="mx-auto h-px w-8 sm:w-10 bg-gold/60" />
        </div>
        <div>
          <p className="text-ivory/90 text-xs sm:text-sm">{pub.author}</p>
          <p className="text-gold-light text-[10px] sm:text-xs mt-1">
            {pub.year}
          </p>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-1 bg-gold/40" />
    </div>
  );
}