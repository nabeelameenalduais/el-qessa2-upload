export default function PageHeader({
  eyebrow,
  title,
  description,
  image,
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ivory" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
        {eyebrow && (
          <p className="text-gold-light text-xs md:text-sm font-medium tracking-widest mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ivory leading-tight">
          {title}
        </h1>
        <div className="editorial-divider mx-auto mt-6" />
        {description && (
          <p className="mt-6 max-w-2xl mx-auto text-ivory/80 text-sm md:text-lg leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}