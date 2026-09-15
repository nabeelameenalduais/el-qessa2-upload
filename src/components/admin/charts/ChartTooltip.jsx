export default function ChartTooltip({ left, top, children }) {
  return (
    <div
      style={{ left, top }}
      className="absolute z-10 -translate-x-1/2 -translate-y-full bg-ink text-ivory text-xs px-3 py-1.5 rounded-sm shadow-lg whitespace-nowrap pointer-events-none"
    >
      {children}
    </div>
  );
}