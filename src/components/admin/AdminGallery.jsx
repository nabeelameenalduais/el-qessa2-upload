import { useState } from 'react';
import { Expand, Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import ImagePicker from './ui/ImagePicker';
import DatePicker from './ui/DatePicker';
import { images } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';

const REQUIRED = ['src', 'caption', 'year'];
const categories = ['فعاليات', 'ورش', 'كتّاب', 'إصدارات'];
const imagePresets = [images.nightLibrary, images.writingDesk, images.booksWarm, images.bookCafe, images.diary];

function emptyForm() {
  return { src: imagePresets[0], caption: '', category: categories[0], year: '' };
}

export default function AdminGallery() {
  const { content, addItem, updateItem, deleteItem, addToast, setLightbox } = useApp();
  const { topSearch } = useAdmin();
  const [year, setYear] = useState('الكل');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const gallery = content.gallery;
  const years = Array.from(new Set(gallery.map((g) => g.year))).sort((a, b) => b - a);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (g) => {
    setEditId(g.id);
    setForm({
      src: g.src || imagePresets[0],
      caption: g.caption || '',
      category: g.category || categories[0],
      year: g.year || '',
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    for (const key of REQUIRED) {
      if (!form[key]?.trim()) errs[key] = 'هذا الحقل مطلوب';
    }
    if (form.year && !/^\d{4}$/.test(form.year.trim())) errs.year = 'أدخل سنة من أربعة أرقام';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      src: form.src.trim(),
      caption: form.caption.trim(),
      category: form.category,
      year: form.year.trim(),
    };

    if (editId) {
      updateItem('gallery', editId, payload);
      addToast('تم تعديل الصورة بنجاح');
    } else {
      addItem('gallery', payload);
      addToast('تمت إضافة الصورة بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('gallery', delTarget.id);
    addToast('تم حذف الصورة');
    setDelTarget(null);
  };

  const filtered = gallery.filter((g) => {
    const matchYear = year === 'الكل' || g.year === year;
    const q = topSearch.trim();
    const matchSearch = !q || g.caption.includes(q);
    return matchYear && matchSearch;
  });

  return (
    <div>
      <PageHead
        eyebrow="لإدارة"
        title="معرض الصور"
        description="صور فعاليات النادي مع فتحها في العارض، قابلة للإضافة والتعديل."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة صورة
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select label="السنة" value={year} onChange={setYear} options={['الكل', ...years]} className="w-36" />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {gallery.length} صورة
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="bg-white border border-ivory-dark py-14 text-center text-sm text-warm-brown">
          لا توجد صور مطابقة للبحث الحالي.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {filtered.map((g) => (
            <div
              key={g.id}
              className="group relative aspect-[4/3] overflow-hidden bg-ivory-dark rounded-sm animate-fade-in"
            >
              <button
                onClick={() => setLightbox({ src: g.src, caption: g.caption })}
                className="absolute inset-0 w-full h-full cursor-pointer"
                aria-label={`عرض صورة: ${g.caption}`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-2.5 start-2.5 text-[10px] bg-ivory/90 text-burgundy px-2 py-1 rounded-sm">
                  {g.year}
                </span>
                <span className="absolute inset-x-2.5 bottom-2.5 text-start text-xs text-ivory opacity-0 group-hover:opacity-100 transition-opacity leading-snug">
                  {g.caption}
                </span>
                <span className="absolute top-2.5 end-2.5 p-1.5 bg-ink/50 text-ivory rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand size={13} />
                </span>
              </button>
              <div className="absolute bottom-2.5 end-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(g)}
                  className="p-1.5 bg-ink/60 text-ivory rounded-sm hover:bg-ink transition-colors"
                  aria-label={`تعديل صورة ${g.caption}`}
                  title="تعديل"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => setDelTarget(g)}
                  className="p-1.5 bg-ink/60 text-ivory rounded-sm hover:bg-red-600 transition-colors"
                  aria-label={`حذف صورة ${g.caption}`}
                  title="حذف"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الصورة' : 'إضافة صورة'}
      >
        <div className="px-6 py-5 space-y-4">
          <Field label="الصورة" required error={errors.src}>
            <ImagePicker value={form.src} onChange={(v) => set('src', v)} />
          </Field>
          <Field label="التعليق" required error={errors.caption}>
            <input
              value={form.caption}
              onChange={(e) => set('caption', e.target.value)}
              className="input"
              placeholder="وصف الصورة"
            />
          </Field>
          <Field label="التصنيف">
            <Select value={form.category} onChange={(v) => set('category', v)} options={categories} />
          </Field>
          <Field label="السنة" required error={errors.year}>
            <DatePicker
              format="year"
              value={form.year}
              onChange={(v) => set('year', v)}
              placeholder="2026"
            />
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-ivory-dark flex items-center justify-end gap-3">
          <button
            onClick={() => setFormOpen(false)}
            className="px-5 py-2.5 text-sm font-medium text-warm-brown hover:text-ink border border-ivory-dark hover:border-warm-brown transition-colors rounded-sm"
          >
            إلغاء
          </button>
          <button
            onClick={submit}
            className="px-5 py-2.5 text-sm font-medium bg-burgundy text-ivory hover:bg-burgundy-light transition-colors rounded-sm"
          >
            {editId ? 'حفظ التعديلات' : 'إضافة الصورة'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الصورة"
        message={`هل أنت متأكد من حذف "${delTarget?.caption}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
      />
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink mb-1.5">
        {label}
        {required && <span className="text-burgundy me-1">*</span>}
      </span>
      {children}
      {error && <span className="block text-[11px] text-red-600 mt-1">{error}</span>}
    </label>
  );
}