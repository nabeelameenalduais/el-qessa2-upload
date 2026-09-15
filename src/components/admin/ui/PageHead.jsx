export default function PageHead({ eyebrow, title, description, meta }) {
  return (
    <div className="mb-6 lg:mb-8">
      <p className="text-xs text-gold font-medium tracking-wide mb-2">{eyebrow}</p>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink leading-snug">{title}</h1>
        {meta}
      </div>
      <div className="editorial-divider mt-3" />
      {description && (
        <p className="mt-4 text-sm text-warm-brown leading-relaxed max-w-2xl">{description}</p>
      )}
    </div>
  );
}