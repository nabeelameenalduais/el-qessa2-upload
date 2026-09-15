import { useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Download, Paperclip, Upload } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import StatusBadge from './ui/StatusBadge';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import EmptyState from './ui/EmptyState';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import { formatFullDate } from './utils/dateUtils';
import CircleBadge from './ui/CircleBadge';

const FILE_TYPES = ['برنامج', 'ملصق', 'تقرير', 'صورة', 'مستند', 'أخرى'];
const STORAGE_CAP = 300 * 1024;
const RELATED_SECTIONS = [
  ['events', 'فعالية'],
  ['publications', 'إصدار'],
  ['workshops', 'ورشة'],
  ['news', 'خبر'],
];
const CIRCLED_RELATED = new Set(['events', 'workshops', 'news']);

function formatSize(bytes) {
  if (!bytes || bytes <= 0) return 'غير معروف';
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function guessType(file) {
  if (file.type.startsWith('image/')) return 'صورة';
  if (file.type === 'application/pdf') return 'مستند';
  return 'أخرى';
}

function emptyForm(circleId) {
  return {
    name: '',
    type: 'مستند',
    visibility: 'عام',
    relatedSection: 'events',
    relatedId: '',
    description: '',
    dataUrl: '',
    url: '',
    circleId: circleId || '',
  };
}

export default function AdminFiles() {
  const { content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList, circles } = useAdmin();
  const fileInputRef = useRef(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(() => emptyForm());
  const [pickedName, setPickedName] = useState('');
  const [pickedSize, setPickedSize] = useState(0);
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sectionFilter, setSectionFilter] = useState('الكل');
  const [visFilter, setVisFilter] = useState('الكل');

  const files = scopedList(content.files);
  const relatedItems = CIRCLED_RELATED.has(form.relatedSection)
    ? scopedList(content[form.relatedSection] || [])
    : content[form.relatedSection] || [];

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(isAdmin ? '' : effectiveCircle));
    setPickedName('');
    setPickedSize(0);
    setErrors({});
    setFormOpen(true);
    window.setTimeout(() => {
      // focus the file picker flow via the upload button
    }, 0);
  };

  const openEdit = (f) => {
    setEditId(f.id);
    setForm({
      name: f.name || '',
      type: f.type || 'مستند',
      visibility: f.visibility || 'عام',
      relatedSection: f.relatedSection || 'events',
      relatedId: f.relatedId || '',
      description: f.description || '',
      dataUrl: f.dataUrl || '',
      url: f.url || '',
      circleId: f.circleId || '',
      _size: f.size || 0,
      _sizeLabel: f.sizeLabel || '',
    });
    setPickedName('');
    setPickedSize(0);
    setErrors({});
    setFormOpen(true);
  };

  const handleFile = (file) => {
    if (!file) return;
    setPickedName(file.name);
    setPickedSize(file.size);
    const type = guessType(file);
    set('name', file.name);
    set('type', type);
    const sizeOk = file.size <= STORAGE_CAP;
    if (sizeOk) {
      const reader = new FileReader();
      reader.onload = () => set('dataUrl', reader.result);
      reader.readAsDataURL(file);
    } else {
      set('dataUrl', '');
    }
  };

  const submit = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'اسم الملف مطلوب';
    if (!form.relatedId) errs.relatedId = 'اختر المحتوى المرتبط بالملف';
    if (!form.dataUrl && !form.url.trim()) {
      errs.source = 'اختر ملفاً من جهازك أو أضف رابطاً خارجياً';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const related = relatedItems.find((it) => it.id === form.relatedId);
    const payload = {
      name: form.name.trim(),
      type: form.type,
      visibility: form.visibility,
      relatedSection: form.relatedSection,
      relatedId: form.relatedId,
      relatedTitle: related?.title || '',
      description: form.description.trim(),
      dataUrl: form.dataUrl || '',
      url: form.url.trim(),
      stored: !!form.dataUrl,
      size: form.dataUrl ? (pickedSize || form._size || 0) : 0,
      sizeLabel: pickedSize ? formatSize(pickedSize) : form._sizeLabel || formatSize(form._size),
      circleId: effectiveCircle || form.circleId || '',
    };
    if (editId) {
      updateItem('files', editId, payload);
      addToast('تم تعديل الملف بنجاح');
    } else {
      addItem('files', { ...payload, createdAt: Date.now() });
      addToast('تمت إضافة الملف بنجاح');
    }
    setFormOpen(false);
    setPickedName('');
    setPickedSize(0);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('files', delTarget.id);
    addToast('تم حذف الملف');
    setDelTarget(null);
  };

  const q = topSearch.trim();
  const filtered = files.filter((f) => {
    const matchSection = sectionFilter === 'الكل' || f.relatedSection === sectionFilter;
    const matchVis = visFilter === 'الكل' || f.visibility === visFilter;
    const matchSearch =
      !q ||
      f.name.includes(q) ||
      (f.relatedTitle || '').includes(q) ||
      (f.description || '').includes(q);
    return matchSection && matchVis && matchSearch;
  });

  const hasContent = (f) => !!f.dataUrl || !!f.url;

  const columns = [
    {
      key: 'name',
      label: 'الملف',
      sortable: true,
      render: (f) => (
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 bg-burgundy/10 text-burgundy flex items-center justify-center rounded-sm flex-shrink-0">
            <Paperclip size={15} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{f.name}</p>
            <p className="text-[11px] text-warm-brown">
              {f.type} · {f.sizeLabel || 'غير معروف'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'relatedTitle',
      label: 'المحتوى المرتبط',
      sortable: true,
      render: (f) => (
        <div className="min-w-0">
          <p className="text-sm text-ink truncate">{f.relatedTitle || 'غير مرتبط'}</p>
          <p className="text-[11px] text-warm-brown">
            {RELATED_SECTIONS.find(([k]) => k === f.relatedSection)?.[1] || 'محتوى'}
          </p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاريخ الرفع',
      sortable: true,
      sortValue: (f) => f.createdAt || 0,
      render: (f) => (
        <span className="text-sm text-warm-brown whitespace-nowrap">
          {formatFullDate(f.createdAt)}
        </span>
      ),
    },
    {
      key: 'circleId',
      label: 'الدائرة',
      sortable: true,
      render: (f) => <CircleBadge circleKey={f.circleId} />,
    },
    {
      key: 'visibility',
      label: 'الرؤية',
      render: (f) =>
        f.visibility === 'عام' ? (
          <StatusBadge status="عام" tone="gold" />
        ) : (
          <StatusBadge status="خاص" tone="slate" />
        ),
    },
    {
      key: 'actions',
      label: '',
      render: (f) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPreview(f)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label="معاينة الملف"
            title="معاينة"
          >
            <Eye size={14} />
          </button>
          {hasContent(f) && (
            <a
              href={f.dataUrl || f.url}
              download={f.dataUrl ? f.name : undefined}
              target={f.url ? '_blank' : undefined}
              rel="noreferrer"
              className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors inline-flex"
              aria-label="تحميل الملف"
              title="تحميل"
            >
              <Download size={14} />
            </a>
          )}
          <button
            onClick={() => openEdit(f)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label="تعديل الملف"
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(f)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label="حذف الملف"
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
        title="إدارة الملفات"
        description="اربط الملفات بالمحتوى، وحدد رؤيتها. المشروع بدون خادم حتى الآن، لذا تُخزَّن الملفات الصغيرة محلياً في المتصفح."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة ملف
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select
          label="المحتوى"
          value={sectionFilter}
          onChange={setSectionFilter}
          options={['الكل', ...RELATED_SECTIONS]}
          className="w-40"
        />
        <Select
          label="الرؤية"
          value={visFilter}
          onChange={setVisFilter}
          options={['الكل', 'عام', 'خاص']}
          className="w-32"
        />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {files.length} ملف
        </p>
      </div>

      {files.length === 0 ? (
        <EmptyState
          title="لا توجد ملفات بعد"
          message="أضف الملفات واربطها بالفعالية أو الإصدار التي تخصها. الملفات العامة تظهر للزوار في صفحة المحتوى نفسه."
          icon={<Paperclip size={24} />}
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
            >
              <Plus size={16} />
              إضافة ملف
            </button>
          }
        />
      ) : (
        <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل الملف' : 'إضافة ملف'}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">
                اسم الملف <span className="text-burgundy">*</span>
              </span>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input"
                placeholder="مثال: برنامج الفعالية.pdf"
              />
              {errors.name && (
                <span className="block text-[11px] text-red-600 mt-1">{errors.name}</span>
              )}
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">نوع الملف</span>
              <Select value={form.type} onChange={(v) => set('type', v)} options={FILE_TYPES} />
            </label>
          </div>

          <div>
            <span className="block text-xs font-semibold text-ink mb-1.5">مصدر الملف</span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 border border-burgundy/40 text-burgundy px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-burgundy/5 transition-colors"
              >
                <Upload size={15} />
                {pickedName || 'اختيار ملف من الجهاز'}
              </button>
              {pickedName && (
                <span className="text-xs text-warm-brown">
                  {pickedName} ({formatSize(pickedSize)})
                  {pickedSize > STORAGE_CAP && (
                    <span className="text-burgundy"> · أكبر من حد التخزين المحلي، سيُحفظ الاسم والبيانات فقط</span>
                  )}
                </span>
              )}
              <span className="text-[11px] text-warm-brown">أو</span>
              <input
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                className="input flex-1 min-w-[200px]"
                placeholder="رابط خارجي للملف"
                dir="ltr"
              />
            </div>
            {errors.source && (
              <span className="block text-[11px] text-red-600 mt-1">{errors.source}</span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">نوع المحتوى</span>
              <Select
                value={form.relatedSection}
                onChange={(v) =>
                  setForm((f) => ({ ...f, relatedSection: v, relatedId: '' }))
                }
                options={RELATED_SECTIONS}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">
                المحتوى المرتبط <span className="text-burgundy">*</span>
              </span>
              {relatedItems.length === 0 ? (
                <p className="text-xs text-warm-brown border border-dashed border-ivory-dark px-4 py-2.5 rounded-sm">
                  لا توجد عناصر في هذا القسم بعد.
                </p>
              ) : (
                <Select
                  value={form.relatedId}
                  onChange={(v) => set('relatedId', v)}
                  options={relatedItems.map((it) => [it.id, it.title])}
                />
              )}
              {errors.relatedId && (
                <span className="block text-[11px] text-red-600 mt-1">{errors.relatedId}</span>
              )}
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">الرؤية</span>
            <Select
              value={form.visibility}
              onChange={(v) => set('visibility', v)}
              options={[
                ['عام', 'عام (تظهر للزوار في صفحة المحتوى)'],
                ['خاص', 'خاص (للوحة الإدارة فقط)'],
              ]}
            />
          </label>

          <div>
            <span className="block text-xs font-semibold text-ink mb-1.5">الدائرة</span>
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
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">وصف الملف</span>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="وصف مختصر يوضح محتوى الملف"
            />
          </label>
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
            {editId ? 'حفظ التعديلات' : 'إضافة الملف'}
          </button>
        </div>
      </Modal>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.name || 'معاينة الملف'}
        titleIcon={<Eye size={18} className="text-gold-light" />}
      >
        {preview && (
          <div className="px-6 py-6">
            {preview.type === 'صورة' && (preview.dataUrl || preview.url) ? (
              <img
                src={preview.dataUrl || preview.url}
                alt={preview.name}
                className="w-full max-h-[60vh] object-contain rounded-sm border border-ivory-dark"
              />
            ) : preview.dataUrl && preview.type === 'مستند' ? (
              <div className="text-center py-10">
                <p className="text-sm text-warm-brown mb-4">
                  ملف {preview.type} محفوظ محلياً. يمكن تحميله أو فتحه من المتصفح.
                </p>
                <a
                  href={preview.dataUrl}
                  download={preview.name}
                  className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors"
                >
                  <Download size={15} />
                  تحميل الملف
                </a>
              </div>
            ) : (
              <p className="text-sm text-warm-brown py-10 text-center">
                لا يمكن عرض هذا النوع في المعاينة. حمّله للاطلاع عليه.
              </p>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف الملف"
        message={`هل أنت متأكد من حذف "${delTarget?.name}" المرتبط بـ "${delTarget?.relatedTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
      />
    </div>
  );
}