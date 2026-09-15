import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import { ViewButton } from './ui/ActionBtns';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { images } from '../../data/mockData';
import { parseArabicDate } from './utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import CircleBadge from './ui/CircleBadge';

const REQUIRED = ['title', 'date'];
const imagePresets = [images.libraryHall, images.booksWarm, images.reading, images.writingDesk, images.oldBooks];

function emptyForm(circleId) {
  return {
    title: '',
    date: '',
    category: 'أخبار النادي',
    author: 'إدارة النادي',
    image: imagePresets[0],
    excerpt: '',
    content: '',
    circleId: circleId || '',
  };
}

export default function AdminNews() {
  const { go, content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList, circles } = useAdmin();
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(() => emptyForm(effectiveCircle));
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const news = scopedList(content.news);
  const categories = Array.from(new Set(news.map((n) => n.category)));
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(isAdmin ? '' : effectiveCircle));
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (n) => {
    setEditId(n.id);
    setForm({
      title: n.title || '',
      date: n.date || '',
      category: n.category || 'أخبار النادي',
      author: n.author || 'إدارة النادي',
      image: n.image || imagePresets[0],
      excerpt: n.excerpt || '',
      content: n.content || '',
      circleId: n.circleId || '',
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    for (const key of REQUIRED) {
      if (!form[key]?.trim()) errs[key] = 'هذا الحقل مطلوب';
    }
    if (form.date && !parseArabicDate(form.date)) errs.date = 'صيغة التاريخ غير صحيحة (مثال: 7 سبتمبر 2026)';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      title: form.title.trim(),
      date: form.date.trim(),
      category: form.category.trim(),
      author: form.author.trim(),
      image: form.image.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      circleId: effectiveCircle || form.circleId || '',
    };

    if (editId) {
      updateItem('news', editId, payload);
      addToast('تم تعديل الخبر بنجاح');
    } else {
      addItem('news', payload);
      addToast('تمت إضافة الخبر بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('news', delTarget.id);
    addToast('تم حذف الخبر');
    setDelTarget(null);
  };

  const filtered = news.filter((n) => {
    const matchCat = categoryFilter === 'الكل' || n.category === categoryFilter;
    const q = topSearch.trim();
    const matchSearch =
      !q || n.title.includes(q) || (n.excerpt || '').includes(q) || (n.author || '').includes(q);
    return matchCat && matchSearch;
  });

  const columns = [
    {
      key: 'title',
      label: 'الخبر',
      sortable: true,
      render: (n) => (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={n.image}
            alt=""
            className="w-14 h-10 object-cover rounded-sm border border-ivory-dark flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{n.title}</p>
            <p className="text-[11px] text-warm-brown">{n.category}</p>
          </div>
        </div>
      ),
    },
    { key: 'date', label: 'التاريخ', sortable: true, render: (n) => <span className="text-sm text-warm-brown whitespace-nowrap">{n.date}</span> },
    { key: 'author', label: 'المصدر', render: (n) => <span className="text-sm text-warm-brown">{n.author}</span> },
    {
      key: 'circleId',
      label: 'الدائرة',
      sortable: true,
      render: (n) => <CircleBadge circleKey={n.circleId} />,
    },
    {
      key: 'actions',
      label: '',
      render: (n) => (
        <div className="flex items-center gap-1">
          <ViewButton onClick={() => go('news-detail', { id: n.id })} />
          <button
            onClick={() => openEdit(n)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label={`تعديل ${n.title}`}
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(n)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label={`حذف ${n.title}`}
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
        title="إدارة الأخبار"
        description="أخبار النادي وتصنيفاتها."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة خبر
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select label="التصنيف" value={categoryFilter} onChange={setCategoryFilter} options={['الكل', ...categories]} className="w-44" />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {news.length} نتائج
        </p>
      </div>

      <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الخبر' : 'إضافة خبر'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="العنوان" required error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="input"
                placeholder="عنوان الخبر"
              />
            </Field>
            <Field label="التاريخ" required error={errors.date}>
              <input
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="input"
                placeholder="7 سبتمبر 2026"
              />
            </Field>
            <Field label="التصنيف">
              <input
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="input"
                placeholder="أخبار النادي"
              />
            </Field>
            <Field label="المصدر">
              <input
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                className="input"
                placeholder="إدارة النادي"
              />
            </Field>
            <Field label="الدائرة" required={isAdmin}>
              {!isAdmin && effectiveCircle ? (
                <div className="border border-ivory-dark bg-ivory-dark/30 px-4 py-2.5 rounded-sm text-warm-brown">
                  <CircleBadge circleKey={effectiveCircle} />
                </div>
              ) : (
                <Select
                  value={form.circleId}
                  onChange={(v) => set('circleId', v)}
                  options={circles.map((c) => [c.key, `دائرة ${c.name}`])}
                />
              )}
            </Field>
          </div>
          <Field label="الصورة">
            <input
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              className="input"
              placeholder="رابط الصورة"
            />
            {form.image && (
              <img
                src={form.image}
                alt="معاينة"
                className="mt-2 w-full h-32 object-cover rounded-sm border border-ivory-dark"
              />
            )}
          </Field>
          <Field label="المقتطف">
            <textarea
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="سطر يلخص الخبر"
            />
          </Field>
          <Field label="المحتوى">
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={6}
              className="input resize-y"
              placeholder="نص الخبر كاملاً"
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
            {editId ? 'حفظ التعديلات' : 'إضافة الخبر'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الخبر"
        message={`هل أنت متأكد من حذف "${delTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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