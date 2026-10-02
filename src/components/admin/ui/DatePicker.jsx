import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { arabicMonths, monthNames } from '../utils/dateUtils';

const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function todayYmd() {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
}

function parseIso(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null;
}

function parseArabic(value) {
  const month = monthNames.find((name) => (value || '').includes(name));
  if (!month) return null;
  const yearMatch = /(\d{4})/.exec(value);
  const year = yearMatch ? Number(yearMatch[1]) : null;
  if (!year) return null;
  const nums = (value.match(/\d{1,4}/g) || []).map(Number);
  const day = nums.find((n) => n < 32 && n !== year) ?? 1;
  return { y: year, m: arabicMonths[month] - 1, d: day };
}

function toIso(ymd) {
  return `${ymd.y}-${pad(ymd.m + 1)}-${pad(ymd.d)}`;
}

function toArabic(ymd) {
  return `${ymd.d} ${monthNames[ymd.m]} ${ymd.y}`;
}

function formatOutput(ymd, format) {
  if (format === 'iso') return toIso(ymd);
  if (format === 'year') return String(ymd.y);
  return toArabic(ymd);
}

function DayGrid({ view, selected, onPick }) {
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const today = todayYmd();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(<span key={`b${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.d && view.m === today.m && view.y === today.y;
    const isSelected =
      selected && d === selected.d && view.m === selected.m && view.y === selected.y;
    cells.push(
      <button
        key={d}
        type="button"
        onClick={() => onPick({ y: view.y, m: view.m, d })}
        aria-label={`${d} ${monthNames[view.m]} ${view.y}`}
        className={`h-8 w-8 mx-auto text-xs rounded-sm transition-colors cursor-pointer ${
          isSelected
            ? 'bg-burgundy text-ivory font-semibold'
            : isToday
              ? 'text-burgundy font-bold hover:bg-burgundy/10'
              : 'text-ink hover:bg-ivory-dark'
        }`}
      >
        {d}
      </button>
    );
  }
  return (
    <div className="grid grid-cols-7 gap-y-0.5 text-center">
      {WEEKDAYS.map((w) => (
        <span key={w} className="text-[11px] font-semibold text-warm-brown py-1">
          {w}
        </span>
      ))}
      {cells}
    </div>
  );
}

function YearGrid({ view, selected, onPick }) {
  const startYear = Math.floor(view.y / 12) * 12;
  const cells = [];
  for (let i = 0; i < 12; i++) {
    const y = startYear + i;
    const isSelected = selected && y === selected.y;
    cells.push(
      <button
        key={y}
        type="button"
        onClick={() => onPick({ y, m: 0, d: 1 })}
        aria-label={`السنة ${y}`}
        className={`h-9 w-full text-xs rounded-sm transition-colors cursor-pointer ${
          isSelected
            ? 'bg-burgundy text-ivory font-semibold'
            : 'text-ink hover:bg-ivory-dark'
        }`}
      >
        {y}
      </button>
    );
  }
  return <div className="grid grid-cols-4 gap-1.5 py-2">{cells}</div>;
}

export default function DatePicker({
  value,
  onChange,
  format = 'iso',
  placeholder = 'اختر التاريخ',
  allowClear = false,
}) {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(todayYmd);

  const parsed = useMemo(() => {
    if (format === 'year') {
      const m = /^(\d{4})$/.exec(value || '');
      return m ? { y: Number(m[1]), m: 0, d: 1 } : null;
    }
    if (format === 'iso') return parseIso(value);
    return parseArabic(value);
  }, [value, format]);

  const display = parsed ? (format === 'year' ? String(parsed.y) : toArabic(parsed)) : '';

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openPicker = () => {
    setView(parsed ? { y: parsed.y, m: parsed.m } : todayYmd);
    setOpen(true);
  };

  const pick = (ymd) => {
    onChange(formatOutput(ymd, format));
    setOpen(false);
  };

  const isYearMode = format === 'year';
  const startYear = Math.floor(view.y / 12) * 12;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={openPicker}
          className={`flex-1 flex items-center gap-2 px-4 py-2.5 text-start bg-white border rounded-sm text-sm transition-colors cursor-pointer ${
            open ? 'border-burgundy' : 'border-ivory-dark hover:border-warm-brown'
          }`}
        >
          <CalendarDays size={16} className="text-warm-brown flex-shrink-0" />
          <span className={`whitespace-nowrap ${display ? 'text-ink' : 'text-warm-brown'}`}>
            {display || placeholder}
          </span>
        </button>
        {allowClear && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="مسح التاريخ"
            className="flex items-center justify-center px-2.5 bg-white border border-ivory-dark rounded-sm text-warm-brown hover:text-burgundy hover:border-burgundy transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute start-0 top-full mt-1.5 w-72 p-3 bg-white border border-ivory-dark rounded-sm shadow-lg z-30">
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() =>
                setView((v) => ({
                  y: isYearMode ? startYear - 12 : v.y,
                  m: isYearMode ? 0 : (v.m + 11) % 12,
                }))
              }
              aria-label="السابق"
              className="p-1 text-warm-brown hover:text-burgundy rounded-sm transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-sm font-bold text-ink">
              {isYearMode ? `${startYear} - ${startYear + 11}` : `${monthNames[view.m]} ${view.y}`}
            </span>
            <button
              type="button"
              onClick={() =>
                setView((v) => ({
                  y: isYearMode ? startYear + 12 : v.y,
                  m: isYearMode ? 0 : (v.m + 1) % 12,
                }))
              }
              aria-label="التالي"
              className="p-1 text-warm-brown hover:text-burgundy rounded-sm transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          {isYearMode ? (
            <YearGrid view={view} selected={parsed} onPick={pick} />
          ) : (
            <DayGrid view={view} selected={parsed} onPick={pick} />
          )}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-ivory-dark">
            {!isYearMode && (
              <button
                type="button"
                onClick={() => pick(todayYmd())}
                className="text-[11px] font-semibold text-burgundy hover:text-burgundy-light transition-colors cursor-pointer"
              >
                اليوم
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}