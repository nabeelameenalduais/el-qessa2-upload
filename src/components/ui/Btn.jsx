const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] select-none cursor-pointer';

const variants = {
  solid: 'bg-burgundy text-ivory hover:bg-burgundy-light shadow-sm',
  outline: 'border border-burgundy text-burgundy hover:bg-burgundy hover:text-ivory',
  gold: 'bg-gold text-ivory hover:bg-gold-light',
  light: 'border border-ivory/40 text-ivory hover:bg-ivory hover:text-burgundy',
  ghost: 'text-burgundy hover:bg-burgundy/5',
  ink: 'bg-ink text-ivory hover:bg-ink/85',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export default function Btn({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}