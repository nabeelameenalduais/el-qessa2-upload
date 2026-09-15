import { useState } from 'react';
import ChartPanel from './ChartPanel';
import ChartTooltip from './ChartTooltip';

const W = 560;
const H = 240;
const TOP = 32;
const BASELINE = 180;
const PLOT = BASELINE - TOP;

const ACTIVITY_COLOR = '#7a2e38';
const COST_COLOR = '#B08A52';

export default function CostActivityChart({ data, formatCost = (n) => n.toLocaleString('en-US') }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return (
      <ChartPanel title="النشاط مقابل المصروفات" subtitle="مقارنة النشاط (فعاليات + أخبار) بالمصروفات الشهرية.">
        <p className="py-10 text-center text-sm text-warm-brown">لا توجد بيانات لعرضها.</p>
      </ChartPanel>
    );
  }

  const maxActivity = Math.max(...data.map((d) => d.activity), 1);
  const maxCost = Math.max(...data.map((d) => d.cost), 1);
  const n = data.length;
  const slot = W / n;
  const barW = Math.min(slot * 0.22, 20);

  return (
    <ChartPanel
      title="النشاط مقابل المصروفات"
      subtitle="عدد الفعاليات والأخبار في كل شهر مقارنة بمصروفات النادي المسجلة."
    >
      <div className="flex items-center gap-5 mb-4 text-xs text-warm-brown">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 inline-block" style={{ backgroundColor: ACTIVITY_COLOR }} />
          النشاط (فعاليات + أخبار)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 inline-block" style={{ backgroundColor: COST_COLOR }} />
          المصروفات
        </span>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="رسم بياني لمقارنة النشاط والمصروفات حسب الشهر"
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
            const hA = Math.round((d.activity / maxActivity) * PLOT);
            const hC = Math.round((d.cost / maxCost) * PLOT);
            const yA = BASELINE - hA;
            const yC = BASELINE - hC;
            const isHovered = hovered === i;
            return (
              <g
                key={d.key ?? d.month}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <rect
                  x={cx - barW - 2}
                  y={yA}
                  width={barW}
                  height={hA || 1}
                  rx={3}
                  fill={ACTIVITY_COLOR}
                  opacity={isHovered ? 0.85 : 1}
                />
                <rect
                  x={cx + 2}
                  y={yC}
                  width={barW}
                  height={hC || 1}
                  rx={3}
                  fill={COST_COLOR}
                  opacity={isHovered ? 0.85 : 1}
                />
                {d.activity > 0 && (
                  <text x={cx - barW / 2 - 2} y={yA - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill={ACTIVITY_COLOR}>
                    {d.activity}
                  </text>
                )}
                {d.cost > 0 && (
                  <text x={cx + barW / 2 + 2} y={yC - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill={COST_COLOR}>
                    {d.cost}
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
            {data[hovered].month}: نشاط {data[hovered].activity} · مصروفات {formatCost(data[hovered].cost)}
          </ChartTooltip>
        )}
      </div>
    </ChartPanel>
  );
}