import { useState } from 'react';
import { Plus, Pencil, Trash2, ListChecks } from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import StatusBadge from './ui/StatusBadge';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import EmptyState from './ui/EmptyState';
import CircleBadge from './ui/CircleBadge';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import { formatShortDate } from './utils/dateUtils';

const TASK_STATUSES = ['معلقة', 'جارية', 'منجزة'];
const STATUS_TONES = { 'معلقة': 'amber', 'جارية': 'burgundy', 'منجزة': 'green' };

function emptyForm(circleId) {
  return {
    title: '',
    description: '',
    circleId: circleId || '',
    assignee: '',
    due: '',
    status: 'معلقة',
  };
}

export default function AdminTasks() {
  const { content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList, circles } = useAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(() => emptyForm(effectiveCircle));
  const [errors, setErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [delTarget, setDelTarget] = useState(null);

  const tasks = scopedList(content.tasks);
  const isCircleLocked = !isAdmin && !!effectiveCircle;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(isCircleLocked ? effectiveCircle : ''));
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({
      title: t.title || '',
      description: t.description || '',
      circleId: t.circleId || effectiveCircle || '',
      assignee: t.assignee || '',
      due: t.due || '',
      status: t.status || 'معلقة',
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'عنوان المهمة مطلوب';
    if (!form.circleId) errs.circleId = 'اختر الدائرة المسؤولة';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      circleId: form.circleId,
      assignee: form.assignee.trim(),
      due: form.due.trim(),
      status: form.status,
    };
    if (editId) {
      updateItem('tasks', editId, payload);
      addToast('تم تعديل المهمة بنجاح');
    } else {
      addItem('tasks', { ...payload, createdAt: Date.now() });
      addToast('تمت إضافة المهمة بنجاح');
    }
    setFormOpen(false);
  };

  const changeStatus = (t, next) => {
    updateItem('tasks', t.id, { status: next });
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('tasks', delTarget.id);
    addToast('تم حذف المهمة');
    setDelTarget(null);
  };

  const q = topSearch.trim();
  const filtered = tasks.filter((t) => {
    const matchStatus = statusFilter === 'الكل' || t.status === statusFilter;
    const matchSearch =
      !q ||
      t.title.includes(q) ||
      (t.description || '').includes(q) ||
      (t.assignee || '').includes(q);
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      key: 'title',
      label: 'المهمة',
      sortable: true,
      render: (t) => (
        <div className="min-w-0">
          <p className="font-semibold text-ink text-sm">{t.title}</p>
          {t.description && (
            <p className="text-[11px] text-warm-brown mt-0.5 line-clamp-2">{t.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'circleId',
      label: 'الدائرة',
      sortable: true,
      render: (t) => <CircleBadge circleKey={t.circleId} />,
    },
    {
      key: 'assignee',
      label: 'المسؤول',
      sortable: true,
      render: (t) => <span className="text-sm text-ink">{t.assignee || 'غير محدّد'}</span>,
    },
    {
      key: 'due',
      label: 'الموعد',
      sortable: true,
      sortValue: (t) => (t.due ? new Date(t.due).getTime() || 0 : 0),
      render: (t) => (
        <span className="text-sm text-warm-brown whitespace-nowrap">
          {t.due ? formatShortDate(t.due) : 'غير محدّد'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (t) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={t.status} tone={STATUS_TONES[t.status]} />
          <select
            value={t.status}
            onChange={(e) => changeStatus(t, e.target.value)}
            aria-label="تغيير حالة المهمة"
            className="text-[11px] bg-transparent border border-ivory-dark rounded-sm px-1.5 py-1 text-warm-brown focus:outline-none focus:border-burgundy transition-colors cursor-pointer"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (t) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(t)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label="تعديل المهمة"
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(t)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label="حذف المهمة"
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
        eyebrow="للمنظمين"
        title="المهام"
        description={
          isAdmin
            ? 'متابعة المهام الموزعة على دوائر النادي، وسيرها من المعلقة إلى المنجزة.'
            : 'مهام دائرتك فقط. غيّر الحالة من القائمة داخل الجدول عند إنجاز أي عمل.'
        }
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة مهمة
          </button>
        }
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select
          label="الحالة"
          value={statusFilter}
          onChange={setStatusFilter}
          options={['الكل', ...TASK_STATUSES]}
          className="w-36"
        />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {tasks.length} مهمة
        </p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="لا توجد مهام بعد"
          message="أضف أول مهمة لتوزيع العمل على الدوائر ومتابعة إنجازه من مكان واحد."
          icon={<ListChecks size={24} />}
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
            >
              <Plus size={16} />
              إضافة مهمة
            </button>
          }
        />
      ) : (
        <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل المهمة' : 'إضافة مهمة'}
        titleIcon={<ListChecks size={18} className="text-gold-light" />}
        wide
      >
        <div className="px-6 py-5 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">
              عنوان المهمة <span className="text-burgundy">*</span>
            </span>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input"
              placeholder="مثال: تجهيز برنامج الأمسية الشهرية"
            />
            {errors.title && (
              <span className="block text-[11px] text-red-600 mt-1">{errors.title}</span>
            )}
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">وصف المهمة</span>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="تفاصيل مختصرة توضح المطلوب"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            {isCircleLocked ? (
              <div>
                <span className="block text-xs font-semibold text-ink mb-1.5">الدائرة</span>
                <div className="border border-ivory-dark bg-ivory-dark/30 px-4 py-2.5 rounded-sm text-sm text-warm-brown">
                  <CircleBadge circleKey={effectiveCircle} />
                </div>
              </div>
            ) : (
              <label className="block">
                <span className="block text-xs font-semibold text-ink mb-1.5">
                  الدائرة <span className="text-burgundy">*</span>
                </span>
                <Select
                  value={form.circleId}
                  onChange={(v) => set('circleId', v)}
                  options={circles.map((c) => [c.key, `دائرة ${c.name}`])}
                />
                {errors.circleId && (
                  <span className="block text-[11px] text-red-600 mt-1">{errors.circleId}</span>
                )}
              </label>
            )}

            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">المسؤول</span>
              <input
                value={form.assignee}
                onChange={(e) => set('assignee', e.target.value)}
                className="input"
                placeholder="اسم المسؤول"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">الموعد</span>
              <input
                type="date"
                value={form.due}
                onChange={(e) => set('due', e.target.value)}
                className="input"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">الحالة</span>
              <Select
                value={form.status}
                onChange={(v) => set('status', v)}
                options={TASK_STATUSES}
              />
            </label>
          </div>
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
            {editId ? 'حفظ التعديلات' : 'إضافة المهمة'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف المهمة"
        message={`هل أنت متأكد من حذف مهمة "${delTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
      />
    </div>
  );
}