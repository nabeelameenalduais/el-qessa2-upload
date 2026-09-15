import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import { ViewButton } from './ui/ActionBtns';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { writerPortraits } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';

const REQUIRED = ['name', 'role', 'city'];

function emptyForm() {
  return {
    name: '',
    role: '',
    city: '',
    tagline: '',
    bio: '',
    portrait: writerPortraits.assma,
    worksText: '',
    relatedEventIds: '',
  };
}

function parseWorks(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = '', type = '', year = ''] = line
        .split('|')
        .map((s) => s.trim());
      return title ? { title, type, year } : null;
    })
    .filter(Boolean);
}

function parseIds(text) {
  return text
    .split(/[,\s،]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminWriters() {
  const { go, content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings } = useAdmin();
  const [city, setCity] = useState('الكل');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const writers = content.writers;
  const cities = Array.from(new Set(writers.map((w) => w.city)));

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (w) => {
    setEditId(w.id);
    setForm({
      name: w.name || '',
      role: w.role || '',
      city: w.city || '',
      tagline: w.tagline || '',
      bio: w.bio || '',
      portrait: w.portrait || writerPortraits.assma,
      worksText: (w.works || []).map((x) => [x.title, x.type, x.year].join(' | ')).join('\n'),
      relatedEventIds: (w.relatedEventIds || []).join('، '),
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
      name: form.name.trim(),
      role: form.role.trim(),
      city: form.city.trim(),
      tagline: form.tagline.trim(),
      bio: form.bio.trim(),
      portrait: form.portrait.trim(),
      works: parseWorks(form.worksText),
      publications: [],
      relatedEventIds: parseIds(form.relatedEventIds),
    };

    if (editId) {
      updateItem('writers', editId, payload);
      addToast('تم تعديل الكاتب بنجاح');
    } else {
      addItem('writers', payload);
      addToast('تمت إضافة الكاتب بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('writers', delTarget.id);
    addToast('تم حذف الكاتب');
    setDelTarget(null);
  };

  const filtered = writers.filter((w) => {
    const matchCity = city === 'الكل' || w.city === city;
    const q = topSearch.trim();
    const matchSearch =
      !q ||
      w.name.includes(q) ||
      w.tagline?.includes(q) ||
      w.city.includes(q) ||
      w.role.includes(q);
    return matchCity && matchSearch;
  });

  const columns = [
    {
      key: 'name',
      label: 'الكاتب',
      sortable: true,
      render: (w) => (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={w.portrait}
            alt={w.name}
            className="w-11 h-11 object-cover rounded-sm border border-ivory-dark flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm">{w.name}</p>
            <p className="text-[11px] text-warm-brown">{w.role}</p>
          </div>
        </div>
      ),
    },
    { key: 'city', label: 'المدينة', sortable: true, render: (w) => <span className="text-sm text-warm-brown">{w.city}</span> },
    {
      key: 'works',
      label: 'الأعمال',
      sortable: true,
      sortValue: (w) => w.works.length,
      render: (w) => <span className="text-sm text-ink">{w.works.length}</span>,
    },
    {
      key: 'events',
      label: 'الفعاليات',
      sortable: true,
      sortValue: (w) => w.relatedEventIds?.length || 0,
      render: (w) => <span className="text-sm text-warm-brown">{w.relatedEventIds?.length || 0}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (w) => (
        <div className="flex items-center gap-1">
          <ViewButton onClick={() => go('writer-detail', { id: w.id })} />
          <button
            onClick={() => openEdit(w)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label={`تعديل ${w.name}`}
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(w)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label={`حذف ${w.name}`}
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
        title="إدارة الكتّاب"
        description="كتّاب النادي بأعمالهم وفعالياتهم المرتبطة."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة كاتب
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select
          label="المدينة"
          value={city}
          onChange={setCity}
          options={['الكل', ...cities]}
          className="w-44"
        />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {writers.length} نتائج
        </p>
      </div>

      <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الكاتب' : 'إضافة كاتب'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="الاسم" required error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input"
                placeholder="اسم الكاتب"
              />
            </Field>
            <Field label="الدور" required error={errors.role}>
              <input
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                className="input"
                placeholder="قاص، روائي، ناقد..."
              />
            </Field>
            <Field label="المدينة" required error={errors.city}>
              <input
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="input"
                placeholder="صنعاء"
              />
            </Field>
            <Field label="النبذة المختصرة">
              <input
                value={form.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                className="input"
                placeholder="سطر موجز عن الكاتب"
              />
            </Field>
          </div>
          <Field label="سيرة مختصرة">
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              rows={4}
              className="input resize-y"
              placeholder="نبذة عن الكاتب وتجربته"
            />
          </Field>
          <Field label="الصورة">
            <input
              value={form.portrait}
              onChange={(e) => set('portrait', e.target.value)}
              className="input"
              placeholder="رابط الصورة"
            />
            {form.portrait && (
              <img
                src={form.portrait}
                alt="معاينة"
                className="mt-2 w-24 h-24 object-cover rounded-sm border border-ivory-dark"
              />
            )}
          </Field>
          <Field label="الأعمال" hint="سطر لكل عمل، بفصل بين العنوان والنوع والسنة بعلامة |">
            <textarea
              value={form.worksText}
              onChange={(e) => set('worksText', e.target.value)}
              rows={3}
              className="input resize-y"
              placeholder="عنوان العمل | نوعه | السنة"
            />
          </Field>
          <Field label="معرّفات الفعاليات المرتبطة" hint="اختياري — معرّفات مفصولة بفواصل">
            <input
              value={form.relatedEventIds}
              onChange={(e) => set('relatedEventIds', e.target.value)}
              className="input"
              placeholder="evt_001، evt_002"
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
            {editId ? 'حفظ التعديلات' : 'إضافة الكاتب'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الكاتب"
        message={`هل أنت متأكد من حذف "${delTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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