import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import { ViewButton } from './ui/ActionBtns';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import { publicationTypes } from '../../data/mockData';

const REQUIRED = ['title', 'author', 'year', 'category'];
const palette = [
  { name: 'خمري', value: '#5B2028' },
  { name: 'داكن', value: '#211D1A' },
  { name: 'بني', value: '#795548' },
  { name: 'خمري غامق', value: '#3d151b' },
  { name: 'ذهبي', value: '#B08A52' },
];

function emptyForm() {
  return {
    title: '',
    author: '',
    year: '',
    category: '',
    pages: '',
    publisher: 'إصدارات نادي القصة',
    color: palette[0].value,
    description: '',
  };
}

export default function AdminPublications() {
  const { go, content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings } = useAdmin();
  const [year, setYear] = useState('الكل');
  const [category, setCategory] = useState('الكل');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const publications = content.publications;
  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      title: p.title || '',
      author: p.author || '',
      authorId: p.authorId || '',
      year: p.year || '',
      category: p.category || '',
      pages: p.pages || '',
      publisher: p.publisher || 'إصدارات نادي القصة',
      color: p.color || palette[0].value,
      description: p.description || '',
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    for (const key of REQUIRED) {
      if (!form[key]?.trim()) errs[key] = 'هذا الحقل مطلوب';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      authorId: form.authorId?.trim() || '',
      year: form.year.trim(),
      category: form.category.trim(),
      pages: form.pages.trim(),
      publisher: form.publisher.trim(),
      color: form.color,
      description: form.description.trim(),
    };

    if (editId) {
      updateItem('publications', editId, payload);
      addToast('تم تعديل الإصدار بنجاح');
    } else {
      addItem('publications', payload);
      addToast('تمت إضافة الإصدار بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('publications', delTarget.id);
    addToast('تم حذف الإصدار');
    setDelTarget(null);
  };

  const filtered = publications.filter((p) => {
    const matchYear = year === 'الكل' || p.year === year;
    const matchCat = category === 'الكل' || p.category === category;
    const q = topSearch.trim();
    const matchSearch =
      !q || p.title.includes(q) || p.author.includes(q) || p.publisher.includes(q);
    return matchYear && matchCat && matchSearch;
  });

  const columns = [
    {
      key: 'title',
      label: 'الإصدار',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-9 h-12 rounded-sm border border-ivory-dark flex-shrink-0"
            style={{ backgroundColor: p.color }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{p.title}</p>
            <p className="text-[11px] text-warm-brown">{p.author}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'النوع', sortable: true, render: (p) => <span className="text-sm text-warm-brown">{p.category}</span> },
    {
      key: 'year',
      label: 'السنة',
      sortable: true,
      sortValue: (p) => Number(p.year),
      render: (p) => <span className="text-sm text-ink">{p.year}</span>,
    },
    { key: 'pages', label: 'الصفحات', render: (p) => <span className="text-sm text-warm-brown">{p.pages}</span> },
    { key: 'publisher', label: 'الناشر', render: (p) => <span className="text-sm text-warm-brown">{p.publisher}</span> },
    {
      key: 'actions',
      label: '',
      render: (p) => (
        <div className="flex items-center gap-1">
          <ViewButton onClick={() => go('publication-detail', { id: p.id })} />
          <button
            onClick={() => openEdit(p)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label={`تعديل ${p.title}`}
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(p)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label={`حذف ${p.title}`}
            title="حذف"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHead
        eyebrow="لإدارة"
        title="إدارة الإصدارات"
        description="إصدارات نادي القصة مرتبة حسب النوع والسنة."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة إصدار
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select label="السنة" value={year} onChange={setYear} options={['الكل', ...years]} className="w-36" />
        <Select label="النوع" value={category} onChange={setCategory} options={['الكل', ...publicationTypes]} className="w-44" />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {publications.length} نتائج
        </p>
      </div>

      <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الإصدار' : 'إضافة إصدار'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="العنوان" required error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="input"
                placeholder="عنوان الإصدار"
              />
            </Field>
            <Field label="المؤلف" required error={errors.author}>
              <input
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                className="input"
                placeholder="اسم المؤلف"
              />
            </Field>
            <Field label="السنة" required error={errors.year}>
              <input
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                className="input"
                placeholder="2026"
              />
            </Field>
            <Field label="النوع" required error={errors.category}>
              <Select
                value={form.category}
                onChange={(v) => set('category', v)}
                options={publicationTypes}
              />
            </Field>
            <Field label="الصفحات">
              <input
                value={form.pages}
                onChange={(e) => set('pages', e.target.value)}
                className="input"
                placeholder="162"
              />
            </Field>
            <Field label="الناشر">
              <input
                value={form.publisher}
                onChange={(e) => set('publisher', e.target.value)}
                className="input"
                placeholder="إصدارات نادي القصة"
              />
            </Field>
          </div>
          <Field label="النوع من حيث الشكل" hint="لون غلاف الإصدار في الموقع">
            <div className="flex items-center gap-2 pt-1">
              {palette.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set('color', c.value)}
                  className={`w-9 h-11 rounded-sm border transition-transform ${
                    form.color === c.value
                      ? 'border-ink scale-110 shadow-md'
                      : 'border-ivory-dark'
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={`لون ${c.name}`}
                  title={c.name}
                />
              ))}
            </div>
          </Field>
          <Field label="الوصف">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              className="input resize-y"
              placeholder="نبذة عن الإصدار"
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
            {editId ? 'حفظ التعديلات' : 'إضافة الإصدار'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الإصدار"
        message={`هل أنت متأكد من حذف "${delTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
      />
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink mb-1.5">
        {label}
        {required && <span className="text-burgundy me-1">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-warm-brown mt-1">{hint}</span>}
      {error && <span className="block text-[11px] text-red-600 mt-1">{error}</span>}
    </label>
  );
}