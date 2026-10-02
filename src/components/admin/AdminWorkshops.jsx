import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import StatusBadge from './ui/StatusBadge';
import { SiteButton } from './ui/ActionBtns';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import ImagePicker from './ui/ImagePicker';
import DatePicker from './ui/DatePicker';
import { images } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import CircleBadge from './ui/CircleBadge';

const REQUIRED = ['title', 'date', 'status'];
const statusOptions = ['التسجيل مفتوح', 'قريباً', 'انتهت'];
const imagePresets = [images.writing, images.libraryHall, images.notebook, images.writingDesk, images.bookshelf];

function emptyForm(circleId) {
  return {
    title: '',
    instructor: '',
    date: '',
    duration: '',
    status: statusOptions[0],
    image: imagePresets[0],
    description: '',
    circleId: circleId || '',
  };
}

export default function AdminWorkshops() {
  const { go, content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList, circles } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(() => emptyForm(effectiveCircle));
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const workshops = scopedList(content.workshops);
  const statuses = Array.from(new Set(workshops.map((w) => w.status)));
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(isAdmin ? '' : effectiveCircle));
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (w) => {
    setEditId(w.id);
    setForm({
      title: w.title || '',
      instructor: w.instructor || '',
      date: w.date || '',
      duration: w.duration || '',
      status: w.status || statusOptions[0],
      image: w.image || imagePresets[0],
      description: w.description || '',
      circleId: w.circleId || '',
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
      instructor: form.instructor.trim(),
      date: form.date.trim(),
      duration: form.duration.trim(),
      status: form.status,
      image: form.image.trim(),
      description: form.description.trim(),
      circleId: effectiveCircle || form.circleId || '',
    };

    if (editId) {
      updateItem('workshops', editId, payload);
      addToast('تم تعديل الورشة بنجاح');
    } else {
      addItem('workshops', payload);
      addToast('تمت إضافة الورشة بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('workshops', delTarget.id);
    addToast('تم حذف الورشة');
    setDelTarget(null);
  };

  const filtered = workshops.filter((w) => {
    const matchStatus = statusFilter === 'الكل' || w.status === statusFilter;
    const q = topSearch.trim();
    const matchSearch = !q || w.title.includes(q) || (w.instructor || '').includes(q);
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      key: 'title',
      label: 'الورشة',
      sortable: true,
      render: (w) => (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={w.image}
            alt=""
            className="w-14 h-10 object-cover rounded-sm border border-ivory-dark flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{w.title}</p>
            <p className="text-[11px] text-warm-brown">{w.instructor}</p>
          </div>
        </div>
      ),
    },
    { key: 'date', label: 'الموعد', render: (w) => <span className="text-sm text-warm-brown">{w.date}</span> },
    { key: 'duration', label: 'المدة', render: (w) => <span className="text-sm text-warm-brown">{w.duration}</span> },
    {
      key: 'circleId',
      label: 'الدائرة',
      sortable: true,
      render: (w) => <CircleBadge circleKey={w.circleId} />,
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (w) => <StatusBadge status={w.status} />,
    },
    {
      key: 'actions',
      label: '',
      render: (w) => (
        <div className="flex items-center gap-1">
          <SiteButton onClick={() => go('workshops')} />
          <button
            onClick={() => openEdit(w)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label={`تعديل ${w.title}`}
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(w)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label={`حذف ${w.title}`}
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
        title="إدارة الورش"
        description="ورش الكتابة في النادي وحالتها."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة ورشة
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select label="الحالة" value={statusFilter} onChange={setStatusFilter} options={['الكل', ...statuses]} className="w-44" />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {workshops.length} نتائج
        </p>
      </div>

      <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الورشة' : 'إضافة ورشة'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="العنوان" required error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="input"
                placeholder="عنوان الورشة"
              />
            </Field>
            <Field label="المدرب">
              <input
                value={form.instructor}
                onChange={(e) => set('instructor', e.target.value)}
                className="input"
                placeholder="اسم المدرب"
              />
            </Field>
            <Field label="الموعد" required error={errors.date}>
              <DatePicker
                format="arabic"
                value={form.date}
                onChange={(v) => set('date', v)}
                placeholder="21 سبتمبر 2026"
              />
            </Field>
            <Field label="المدة">
              <input
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                className="input"
                placeholder="6 أسابيع"
              />
            </Field>
            <Field label="الحالة" required error={errors.status}>
              <Select value={form.status} onChange={(v) => set('status', v)} options={statusOptions} />
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
            <ImagePicker value={form.image} onChange={(v) => set('image', v)} />
          </Field>
          <Field label="الوصف">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="input resize-y"
              placeholder="وصف الورشة ومحتواها"
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
            {editId ? 'حفظ التعديلات' : 'إضافة الورشة'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الورشة"
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