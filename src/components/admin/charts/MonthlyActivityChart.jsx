import { useState } from 'react';
import ChartPanel from './ChartPanel';
import ChartTooltip from './ChartTooltip';

const W = 560;
const H = 230;
const TOP = 22;
const BASELINE = 176;
const PLOT = BASELINE - TOP;

export default function MonthlyActivityChart({ data, format = (n) => `${n} ${n > 1 ? 'فعاليات' : 'فعالية'}` }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return (
      <ChartPanel title="نشاط الفعاليات حسب الشهر" subtitle="عدد الفعاليات المسجلة في النادي لكل شهر.">
        <p className="py-10 text-center text-sm text-warm-brown">لا توجد بيانات لعرضها.</p>
      </ChartPanel>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);
  const n = data.length;
  const slot = W / n;
  const barW = Math.min(slot * 0.46, 44);

  return (
    <ChartPanel
      title="فعاليات النادي حسب الشهر"
      subtitle="كم فعالية سُجّلت في كل شهر من بيانات الفعاليات الفعلية."
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="رسم بياني لعدد الفعاليات حسب الشهر"
        >
          {[0.5, 1].map((f) => {
            const y = BASELINE - PLOT * f;
            return (
              <line
                key={f}
                x1={0}
                x2={W}
                y1={y}
                y2={y}
                stroke="#EDE7D9"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            );
          })}
          {data.map((d, i) => {
            const cx = slot * i + slot / 2;
            const h = Math.round((d.count / max) * PLOT);
            const y = BASELINE - h;
            const isMax = d.count === max;
            const isHovered = hovered === i;
            return (
              <g
                key={d.month}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <rect
                  x={cx - barW / 2}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={isMax ? '#B08A52' : '#7a2e38'}
                  opacity={isHovered ? 0.85 : 1}
                />
                {h > 0 && (
                  <text
                    x={cx}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#211D1A"
                  >
                    {d.count}
                  </text>
                )}
                <text
                  x={cx}
                  y={BASELINE + 22}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#795548"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
          <line x1={0} x2={W} y1={BASELINE} y2={BASELINE} stroke="#EDE7D9" strokeWidth="1" />
        </svg>
        {hovered !== null && (
          <ChartTooltip left={`${(slot * hovered + slot / 2) * (100 / W)}%`} top={TOP * (100 / H)}>
            {data[hovered].month}: {format(data[hovered].count)}
          </ChartTooltip>
        )}
      </div>
    </ChartPanel>
  );
}