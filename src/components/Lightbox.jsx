import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Lightbox() {
  const { lightboxImage, setLightbox } = useApp();

  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxImage, setLightbox]);

  if (!lightboxImage) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-ink/95 flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setLightbox(null)}
    >
      <button
        className="absolute top-5 left-5 text-ivory hover:text-gold-light transition-colors"
        aria-label="إغلاق"
      >
        <X size={28} />
      </button>
      <figure className="max-w-4xl w-full">
        <div
          className="overflow-hidden bg-ivory/10 rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={lightboxImage.src}
            alt={lightboxImage.caption || ''}
            className="w-full max-h-[75vh] object-contain"
          />
        </div>
        <figcaption className="text-center text-ivory/80 text-sm mt-4">
          {lightboxImage.caption}
        </figcaption>
      </figure>
    </div>
  );
}