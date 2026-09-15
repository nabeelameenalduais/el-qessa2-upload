export default function EmptyState({ title, message, action, icon }) {
  return (
    <div className="border border-dashed border-ivory-dark bg-ivory/40 px-6 py-14 text-center">
      {icon && <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center text-warm-brown">{icon}</div>}
      <p className="text-base font-bold text-ink mb-2">{title}</p>
      {message && <p className="text-sm text-warm-brown leading-relaxed mx-auto max-w-md mb-5">{message}</p>}
      {action}
    </div>
  );
}