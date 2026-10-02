import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import StatusBadge from './ui/StatusBadge';
import { ViewButton } from './ui/ActionBtns';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import ImagePicker from './ui/ImagePicker';
import DatePicker from './ui/DatePicker';
import { images } from '../../data/mockData';
import { parseArabicDate } from './utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import { circleName } from './circles';
import CircleBadge from './ui/CircleBadge';

const REQUIRED = ['title', 'circleId', 'date', 'time', 'location'];
const imagePresets = [
  images.nightLibrary,
  images.libraryHall,
  images.writing,
  images.darkBooks,
  images.bookshelf,
];

function emptyForm() {
  return {
    title: '',
    date: '',
    time: '',
    location: '',
    upcoming: true,
    image: imagePresets[0],
    excerpt: '',
    description: '',
    circleId: '',
  };
}

export default function AdminEvents() {
  const { go, content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList, circles } = useAdmin();
  const [circle, setCircle] = useState('الكل');
  const [status, setStatus] = useState('الكل');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const events = scopedList(content.events);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm(), circleId: effectiveCircle || '' });
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (e) => {
    setEditId(e.id);
    setForm({
      title: e.title || '',
      date: e.date || '',
      time: e.time || '',
      location: e.location || '',
      upcoming: !!e.upcoming,
      image: e.image || imagePresets[0],
      excerpt: e.excerpt || '',
      description: e.description || '',
      circleId: e.circleId || effectiveCircle || '',
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    for (const key of REQUIRED) {
      if (!form[key]?.trim()) errs[key] = 'هذا الحقل مطلوب';
    }
    if (isAdmin && !form.circleId) errs.circleId = 'اختر دائرة الفعالية';
    if (form.date && !parseArabicDate(form.date)) errs.date = 'صيغة التاريخ غير صحيحة (مثال: 18 سبتمبر 2026)';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      ...form,
      title: form.title.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      location: form.location.trim(),
      excerpt: form.excerpt.trim(),
      description: form.description.trim(),
      circleId: isAdmin ? form.circleId : effectiveCircle,
    };

    if (editId) {
      updateItem('events', editId, payload);
      addToast('تم تعديل الفعالية بنجاح');
    } else {
      addItem('events', { ...payload, speakers: [], schedule: [] });
      addToast('تمت إضافة الفعالية بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('events', delTarget.id);
    addToast('تم حذف الفعالية');
    setDelTarget(null);
  };

  const filtered = events.filter((e) => {
    const matchCircle = circle === 'الكل' || e.circleId === circle;
    const matchStatus =
      status === 'الكل' || (status === 'قادمة' ? e.upcoming : !e.upcoming);
    const q = topSearch.trim();
    const matchSearch =
      !q ||
      e.title.includes(q) ||
      e.location.includes(q) ||
      circleName(e.circleId).includes(q) ||
      (e.excerpt || '').includes(q);
    return matchCircle && matchStatus && matchSearch;
  });

  const columns = [
    {
      key: 'title',
      label: 'الفعالية',
      sortable: true,
      render: (e) => (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={e.image}
            alt=""
            className="w-14 h-10 object-cover rounded-sm border border-ivory-dark flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{e.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'circleId',
      label: 'الدائرة',
      sortable: true,
      render: (e) => <CircleBadge circleKey={e.circleId} />,
    },
    {
      key: 'date',
      label: 'التاريخ',
      sortable: true,
      sortValue: (e) => {
        const d = parseArabicDate(e.date);
        return d ? d.year * 10000 + d.month * 100 : 0;
      },
      render: (e) => <span className="text-sm text-ink whitespace-nowrap">{e.date}</span>,
    },
    { key: 'time', label: 'الوقت', render: (e) => <span className="text-sm text-warm-brown">{e.time}</span> },
    { key: 'location', label: 'المكان', render: (e) => <span className="text-sm text-warm-brown">{e.location}</span> },
    {
      key: 'status',
      label: 'الحالة',
      render: (e) =>
        e.upcoming ? <StatusBadge status="قادمة" tone="gold" /> : <StatusBadge status="سابقة" tone="slate" />,
    },
    {
      key: 'actions',
      label: '',
      render: (e) => (
        <div className="flex items-center gap-1">
          <ViewButton onClick={() => go('event-detail', { id: e.id })} />
          <button
            onClick={() => openEdit(e)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label="تعديل الفعالية"
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(e)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label="حذف الفعالية"
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
        title="إدارة الفعاليات"
        description="تصفح وفهرسة وتعديل فعاليات النادي."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة فعالية
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        {isAdmin && (
          <Select
            label="الدائرة"
            value={circle}
            onChange={setCircle}
            options={['الكل', ...circles.map((c) => [c.key, c.name])]}
            className="w-44"
          />
        )}
        <Select
          label="الحالة"
          value={status}
          onChange={setStatus}
          options={[
            ['الكل', 'الكل'],
            ['قادمة', 'قادمة'],
            ['سابقة', 'سابقة'],
          ]}
          className="w-36"
        />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {events.length} نتائج
        </p>
      </div>

      <DataTable columns={isAdmin ? columns : columns.filter((c) => c.key !== 'circleId')} rows={filtered} pageSize={settings.pageSize} />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الفعالية' : 'إضافة فعالية'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="العنوان" required error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="input"
                placeholder="عنوان الفعالية"
              />
            </Field>
            <Field label="التاريخ" required error={errors.date}>
              <DatePicker
                format="arabic"
                value={form.date}
                onChange={(v) => set('date', v)}
                placeholder="18 سبتمبر 2026"
              />
            </Field>
            <Field label="الوقت" required error={errors.time}>
              <input
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
                className="input"
                placeholder="7:00 مساءً"
              />
            </Field>
            <Field label="المكان" required error={errors.location}>
              <input
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="input"
                placeholder="صنعاء — مقر النادي الثقافي"
              />
            </Field>
            <Field label="الحالة">
              <Select
                value={form.upcoming ? 'قادمة' : 'سابقة'}
                onChange={(v) => set('upcoming', v === 'قادمة')}
                options={[['قادمة', 'قادمة'], ['سابقة', 'سابقة']]}
              />
            </Field>
            {isAdmin && (
              <Field label="الدائرة" required error={errors.circleId}>
                <Select
                  value={form.circleId}
                  onChange={(v) => set('circleId', v)}
                  options={circles.map((c) => [c.key, `دائرة ${c.name}`])}
                />
              </Field>
            )}
          </div>
          <Field label="الصورة">
            <ImagePicker value={form.image} onChange={(v) => set('image', v)} />
          </Field>
          <Field label="المقتطف">
            <textarea
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="مقتطف قصير عن الفعالية"
            />
          </Field>
          <Field label="الوصف">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              className="input resize-y"
              placeholder="وصف تفصيلي"
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
            {editId ? 'حفظ التعديلات' : 'إضافة الفعالية'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الفعالية"
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
