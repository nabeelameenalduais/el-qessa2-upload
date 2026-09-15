export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  light = false,
  className = '',
}) {
  return (
    <div
      className={`mb-10 md:mb-12 ${center ? 'text-center' : 'text-right'} ${
        light ? 'text-ivory' : 'text-ink'
      } ${className}`}
    >
      {eyebrow && (
        <p
          className={`text-xs md:text-sm font-medium tracking-wide mb-3 ${
            light ? 'text-gold-light' : 'text-gold'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-2xl md:text-4xl font-bold leading-snug ${
          light ? 'text-ivory' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      <div
        className={`editorial-divider mt-5 ${
          center ? 'mx-auto' : 'rtl:mr-0'
        }`}
      />
      {subtitle && (
        <p
          className={`mt-5 max-w-2xl text-sm md:text-base leading-relaxed ${
            center ? 'mx-auto' : ''
          } ${light ? 'text-ivory/70' : 'text-warm-brown'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}