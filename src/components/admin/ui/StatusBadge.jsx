const styles = {
  burgundy: 'bg-burgundy text-ivory',
  gold: 'bg-gold text-ink',
  ivory: 'bg-ivory-dark text-ink',
  green: 'bg-ink/5 text-ink border border-ink/15',
  amber: 'bg-gold/15 text-warm-brown',
  slate: 'bg-ivory/60 text-warm-brown border border-ivory-dark',
};

const statusMap = {
  'قيد المراجعة': 'amber',
  'مؤكد': 'gold',
  'ملغي': 'slate',
  'التسجيل مفتوح': 'gold',
  'قريباً': 'amber',
  'انتهت': 'slate',
  'true': 'gold',
  'false': 'slate',
};

export default function StatusBadge({ status, tone, className = '' }) {
  const resolved = tone || statusMap[String(status)] || 'slate';
  const cls = styles[resolved] || styles.slate;
  return (
    <span
      className={`inline-block whitespace-nowrap px-2.5 py-1 text-[11px] font-medium rounded-sm ${cls} ${className}`}
    >
      {status}
    </span>
  );
}