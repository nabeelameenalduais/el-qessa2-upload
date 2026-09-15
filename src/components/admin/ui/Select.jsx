import { ChevronDown } from 'lucide-react';

export default function Select({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-semibold text-ink mb-1.5">{label}</span>
      )}
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pe-9 bg-white border border-ivory-dark rounded-sm text-sm text-ink focus:outline-none focus:border-burgundy transition-colors cursor-pointer"
        >
          {options.map((opt) => {
            const [val, labelText] = Array.isArray(opt) ? opt : [opt, opt];
            return (
              <option key={val} value={val}>
                {labelText}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          className="absolute top-1/2 -translate-y-1/2 end-3 text-warm-brown pointer-events-none"
        />
      </span>
    </label>
  );
}