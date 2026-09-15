export default function StatBand({ stats = [] }) {
  return (
    <div className="bg-white border border-ivory-dark">
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {stats.map((s, i) => (
          <div key={`${s.label}-${i}`} className="px-5 py-6 2xl:py-7">
            <p className="text-[11px] text-gold font-medium tracking-wide mb-2">{s.label}</p>
            <p className="text-3xl 2xl:text-4xl font-bold text-burgundy leading-none tracking-tight">
              {s.value}
            </p>
            <div className="w-8 h-0.5 bg-gold/70 my-3" />
            {s.note && <p className="text-[11px] text-warm-brown leading-relaxed">{s.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}