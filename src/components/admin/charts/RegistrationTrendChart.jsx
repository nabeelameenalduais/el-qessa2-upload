import { useState } from 'react';
import ChartPanel from './ChartPanel';
import ChartTooltip from './ChartTooltip';
import EmptyState from '../ui/EmptyState';
import { lastDays, registrationDayKey } from '../utils/dateUtils';
import { Inbox } from 'lucide-react';

const W = 560;
const H = 220;
const TOP = 18;
const BASELINE = 176;
const PLOT = BASELINE - TOP;

export default function RegistrationTrendChart({ registrations }) {
  const [hovered, setHovered] = useState(null);

  if (!registrations.length) {
    return (
      <ChartPanel
        title="اتجاه التسجيلات"
        subtitle="عدد طلبات الحضور المسجلة خلال الأيام الأخيرة."
      >
        <EmptyState
          title="لا توجد تسجيلات بعد"
          message="تُرسم هنا طلبات الحضور التي يرسلها الزوار من نموذج التسجيل في الموقع."
          icon={<Inbox size={20} />}
        />
      </ChartPanel>
    );
  }

  const days = lastDays(14);
  const daily = {};
  registrations.forEach((r) => {
    const k = registrationDayKey(r.createdAt);
    daily[k] = (daily[k] || 0) + 1;
  });
  const data = days.map((d) => ({ ...d, count: daily[d.key] || 0 }));
  const max = Math.max(...data.map((d) => d.count), 1);
  const n = data.length;
  const slot = W / n;

  const points = data.map((d, i) => ({
    x: slot * i + slot / 2,
    y: BASELINE - (d.count / max) * PLOT,
    ...d,
  }));
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${BASELINE} L ${points[0].x} ${BASELINE} Z`;

  const showLabelFor = (i) => i % 2 === 0 || i === n - 1;

  return (
    <ChartPanel
      title="اتجاه التسجيلات"
      subtitle="عدد طلبات الحضور المسجلة خلال آخر 14 يوماً، من بيانات حقيقية في النظام."
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="منحنى اتجاه التسجيلات خلال آخر 14 يوماً"
        >
          {[0.5, 1].map((f) => {
            const y = BASELINE - PLOT * f;
            return (
              <line key={f} x1={0} x2={W} y1={y} y2={y} stroke="#EDE7D9" strokeWidth="1" strokeDasharray="3 5" />
            );
          })}
          <path d={area} fill="#B08A52" fillOpacity="0.1" />
          <path d={line} fill="none" stroke="#5B2028" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) =>
            p.count > 0 ? (
              <circle
                key={p.key}
                cx={p.x}
                cy={p.y}
                r={hovered === i ? 5 : 3.5}
                fill="#B08A52"
                stroke="#211D1A"
                strokeWidth="1.5"
                style={{ transition: 'r .15s' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ) : null
          )}
          {points.map((p, i) =>
            showLabelFor(i) ? (
              <text key={p.key} x={p.x} y={BASELINE + 22} textAnchor="middle" fontSize="11" fill="#795548">
                {p.label}
              </text>
            ) : null
          )}
          <line x1={0} x2={W} y1={BASELINE} y2={BASELINE} stroke="#EDE7D9" strokeWidth="1" />
        </svg>
        {hovered !== null && (
          <ChartTooltip left={`${points[hovered].x * (100 / W)}%`} top={TOP * (100 / H)}>
            {points[hovered].label}: {points[hovered].count}{' '}
            {points[hovered].count > 1 ? 'تسجيلات' : 'تسجيل'}
          </ChartTooltip>
        )}
      </div>
    </ChartPanel>
  );
}