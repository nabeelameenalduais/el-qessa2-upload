import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import DataTable from './ui/DataTable';
import { SiteButton } from './ui/ActionBtns';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import DatePicker from './ui/DatePicker';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';

const REQUIRED = ['year', 'description'];

function emptyForm() {
  return { year: '', count: '', description: '', eventsText: '' };
}

function countLabel(n) {
  return n === 1 ? 'فعالية واحدة' : n === 2 ? 'فعاليتان' : n <= 10 ? `${n} فعاليات` : `${n} فعالية`;
}

function parseEvents(text) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminArchive() {
  const { go, content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings } = useAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const archive = content.archive;
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (a) => {
    setEditId(a.id);
    setForm({
      year: a.year || '',
      count: a.count || '',
      description: a.description || '',
      eventsText: (a.events || []).join('\n'),
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    for (const key of REQUIRED) {
      if (!form[key]?.trim()) errs[key] = 'هذا الحقل مطلوب';
    }
    if (form.year && !/^\d{4}$/.test(form.year.trim())) errs.year = 'أدخل سنة من أربعة أرقام (مثال: 2026)';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const events = parseEvents(form.eventsText);
    const payload = {
      year: form.year.trim(),
      count: form.count.trim() || (events.length ? countLabel(events.length) : ''),
      description: form.description.trim(),
      events,
    };

    if (editId) {
      updateItem('archive', editId, payload);
      addToast('تم تعديل السنة بنجاح');
    } else {
      addItem('archive', payload);
      addToast('تمت إضافة سنة جديدة إلى الأرشيف');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('archive', delTarget.id);
    addToast('تم حذف سنة من الأرشيف');
    setDelTarget(null);
  };

  const filtered = archive.filter((a) => {
    const q = topSearch.trim();
    return !q || a.year.includes(q) || a.description.includes(q);
  });

  const columns = [
    {
      key: 'year',
      label: 'السنة',
      sortable: true,
      sortValue: (a) => Number(a.year),
      render: (a) => <span className="font-bold text-burgundy text-sm">{a.year}</span>,
    },
    { key: 'count', label: 'الحاصل', render: (a) => <span className="text-sm text-ink">{a.count}</span> },
    {
      key: 'description',
      label: 'نبذة',
      render: (a) => (
        <span className="text-sm text-warm-brown leading-relaxed line-clamp-2 max-w-md">{a.description}</span>
      ),
    },
    {
      key: 'events',
      label: 'أبرز المناسبات',
      render: (a) => (
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {(a.events || []).map((e) => (
            <span key={e} className="text-[10px] bg-ivory-dark/70 text-warm-brown px-2 py-1 rounded-sm">
              {e}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (a) => (
        <div className="flex items-center gap-1">
          <SiteButton onClick={() => go('archive')} />
          <button
            onClick={() => openEdit(a)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label={`تعديل سنة ${a.year}`}
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(a)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label={`حذف سنة ${a.year}`}
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
        title="الأرشيف السنوي"
        description="سجل سنوات النادي، قابل للإضافة والتعديل."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة سنة
          </button>
        }
      />

      <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل سنة في الأرشيف' : 'إضافة سنة إلى الأرشيف'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="السنة" required error={errors.year}>
              <DatePicker
                format="year"
                value={form.year}
                onChange={(v) => set('year', v)}
                placeholder="2026"
              />
            </Field>
            <Field label="الحاصل" hint="اختياري — يُحتسب تلقائياً من المناسبات إن تُرك فارغاً">
              <input
                value={form.count}
                onChange={(e) => set('count', e.target.value)}
                className="input"
                placeholder="18 فعالية"
              />
            </Field>
          </div>
          <Field label="نبذة" required error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="input resize-y"
              placeholder="لمحة عن عام النادي"
            />
          </Field>
          <Field label="أبرز المناسبات" hint="اختياري — مناسبة في كل سطر">
            <textarea
              value={form.eventsText}
              onChange={(e) => set('eventsText', e.target.value)}
              rows={4}
              className="input resize-y"
              placeholder={'الأمسيات القصصية الشهرية\nورشتا كتابة'}
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
            {editId ? 'حفظ التعديلات' : 'إضافة السنة'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف سنة من الأرشيف"
        message={`هل أنت متأكد من حذف سنة ${delTarget?.year} من الأرشيف؟ لا يمكن التراجع عن هذا الإجراء.`}
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