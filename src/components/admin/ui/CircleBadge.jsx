import { circleName, circleColor } from '../circles';

export default function CircleBadge({ circleKey, showName = true, className = '' }) {
  if (!circleKey) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="w-3 h-3 rounded-[2px] flex-shrink-0"
        style={{ backgroundColor: circleColor(circleKey) }}
        aria-hidden="true"
      />
      {showName && (
        <span className="text-[11px] text-warm-brown whitespace-nowrap">
          {circleName(circleKey)}
        </span>
      )}
    </span>
  );
}