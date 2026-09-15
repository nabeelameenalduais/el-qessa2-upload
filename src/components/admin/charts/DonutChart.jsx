import { useState } from 'react';
import ChartPanel from './ChartPanel';

const SIZE = 190;
const R = 66;
const THICKNESS = 30;
const CENTER = SIZE / 2;
const C = 2 * Math.PI * R;

const palette = ['#5B2028', '#B08A52', '#3d151b', '#795548', '#7a2e38', '#211D1A'];

export default function DonutChart({ data, total, centerLabel, title, subtitle, format }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return (
      <ChartPanel title={title} subtitle={subtitle}>
        <p className="py-10 text-center text-sm text-warm-brown">لا توجد بيانات لعرضها.</p>
      </ChartPanel>
    );
  }

  const sum = total || data.reduce((acc, d) => acc + d.count, 0);

  const segments = data.map((d, i) => {
    const fraction = sum ? d.count / sum : 0;
    const dash = Math.max(fraction * C - 2, 0);
    const prior = data.slice(0, i).reduce((a, x) => a + (sum ? x.count / sum : 0), 0);
    return {
      ...d,
      dash,
      offset: -(prior * C),
      color: palette[i % palette.length],
    };
  });

  return (
    <ChartPanel title={title} subtitle={subtitle}>
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-44 h-44 flex-shrink-0" role="img" aria-label={title}>
          {segments.map((d, i) => (
              <circle
                key={d.name}
                cx={CENTER}
                cy={CENTER}
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth={THICKNESS}
                strokeDasharray={`${d.dash} ${C - d.dash}`}
                strokeDashoffset={d.offset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                style={{ opacity: hovered === null || hovered === i ? 1 : 0.35, transition: 'opacity .2s' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          <text x={CENTER} y={CENTER - 6} textAnchor="middle" fontSize="26" fontWeight="800" fill="#5B2028">
            {sum}
          </text>
          <text x={CENTER} y={CENTER + 16} textAnchor="middle" fontSize="11" fill="#795548">
            {centerLabel}
          </text>
        </svg>

        <ul className="flex-1 w-full space-y-2.5 text-sm">
          {data.map((d, i) => {
            const pct = sum ? Math.round((d.count / sum) * 100) : 0;
            const active = hovered === i;
            return (
              <li
                key={d.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-3 px-2 py-1.5 transition-colors ${
                  active ? 'bg-ivory-dark/50' : ''
                }`}
              >
                <span
                  className="w-3 h-3 flex-shrink-0"
                  style={{ backgroundColor: palette[i % palette.length] }}
                />
                <span className="flex-1 text-warm-brown">{d.name}</span>
                <span className="font-semibold text-ink">
                  {format ? format(d.count) : d.count}
                </span>
                <span className="text-xs text-gold w-10 text-end">{pct}٪</span>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartPanel>
  );
}