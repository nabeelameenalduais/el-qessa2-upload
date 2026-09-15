import { Eye, ExternalLink } from 'lucide-react';

export function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-burgundy text-xs font-semibold hover:text-burgundy-light transition-colors cursor-pointer border border-burgundy/20 hover:border-burgundy/40 rounded-sm px-2.5 py-1.5"
    >
      <Eye size={13} />
      عرض
    </button>
  );
}

export function SiteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-burgundy text-xs font-semibold hover:text-burgundy-light transition-colors cursor-pointer border border-burgundy/20 hover:border-burgundy/40 rounded-sm px-2.5 py-1.5"
    >
      <ExternalLink size={13} />
      صفحة الموقع
    </button>
  );
}