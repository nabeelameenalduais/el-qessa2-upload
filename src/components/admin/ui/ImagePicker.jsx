import { useRef, useState } from 'react';
import { ImagePlus, Link2, Trash2 } from 'lucide-react';

export default function ImagePicker({
  value,
  onChange,
  placeholder = 'اختيار صورة',
  previewClass = '',
}) {
  const inputRef = useRef(null);
  const [showUrl, setShowUrl] = useState(false);
  const [urlText, setUrlText] = useState('');

  const toggleUrl = () => {
    if (!showUrl && value && !value.startsWith('data:')) setUrlText(value);
    setShowUrl((s) => !s);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setUrlText('');
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const remove = () => {
    onChange('');
    setUrlText('');
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="space-y-2">
          <img
            src={value}
            alt="معاينة الصورة"
            className={`${previewClass || 'w-full h-40'} object-cover rounded-sm border border-ivory-dark`}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-burgundy text-ivory rounded-sm hover:bg-burgundy-light transition-colors"
            >
              <ImagePlus size={14} />
              تغيير الصورة
            </button>
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-warm-brown border border-ivory-dark rounded-sm hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <Trash2 size={14} />
              إزالة
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1.5 px-4 py-7 border border-dashed border-ivory-dark rounded-sm text-warm-brown hover:border-burgundy hover:text-burgundy transition-colors cursor-pointer"
        >
          <ImagePlus size={20} />
          <span className="text-xs font-semibold">{placeholder}</span>
        </button>
      )}
      {value?.startsWith('data:') && (
        <p className="text-[11px] text-warm-brown">تُخزَّن الصورة محلياً في المتصفح (دون خادم).</p>
      )}
      <div>
        <button
          type="button"
          onClick={toggleUrl}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-warm-brown hover:text-burgundy transition-colors"
        >
          <Link2 size={12} />
          {showUrl ? 'إخفاء حقل الرابط' : 'أو لصق رابط صورة'}
        </button>
        {showUrl && (
          <input
            value={urlText}
            onChange={(e) => {
              setUrlText(e.target.value);
              onChange(e.target.value);
            }}
            dir="ltr"
            className="input mt-1.5"
            placeholder="https://example.com/image.jpg"
          />
        )}
      </div>
    </div>
  );
}