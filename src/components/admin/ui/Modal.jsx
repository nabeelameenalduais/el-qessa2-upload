import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  titleIcon,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-ink/70 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${
          wide ? 'max-w-2xl' : 'max-w-lg'
        } bg-ivory rounded-sm shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-burgundy px-6 py-5 flex items-center justify-between flex-shrink-0">
          <h3 className="text-ivory font-bold text-lg flex items-center gap-2">
            {titleIcon}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-ivory/70 hover:text-ivory transition-colors"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}