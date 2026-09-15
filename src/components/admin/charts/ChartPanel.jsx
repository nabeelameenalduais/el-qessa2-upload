export default function ChartPanel({ title, subtitle, children, className = '' }) {
  return (
    <section className={`bg-white border border-ivory-dark ${className}`}>
      <header className="px-5 pt-5 pb-2">
        <h3 className="font-bold text-ink text-base leading-snug">{title}</h3>
        {subtitle && <p className="text-xs text-warm-brown mt-1 leading-relaxed">{subtitle}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}