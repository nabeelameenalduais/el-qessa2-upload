import { useState } from 'react';
import { Plus, Pencil, Trash2, UserPlus, Eye } from 'lucide-react';
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

const statusOptions = ['قيد المراجعة', 'مؤكد', 'ملغي'];

function RegistrationFormModal({ initial, onClose, eventsList }) {
  const { addRegistration, updateRegistration, addToast } = useApp();
  const [form, setForm] = useState({
    eventId: initial?.eventId || eventsList[0]?.id || '',
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    status: initial?.status || 'قيد المراجعة',
  });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.eventId) return;
    const event = eventsList.find((x) => x.id === form.eventId);
    if (initial) {
      updateRegistration(initial.id, {
        ...form,
        eventTitle: event?.title || initial.eventTitle,
        eventDate: event?.date || initial.eventDate,
      });
      addToast('تم تحديث التسجيل', 'success');
    } else {
      addRegistration({
        ...form,
        eventTitle: event?.title || '',
        eventDate: event?.date || '',
        createdAt: Date.now(),
      });
      addToast('تمت إضافة التسجيل', 'success');
    }
    onClose();
  };

  return (
    <Modal open title={initial ? 'تعديل التسجيل' : 'تسجيل جديد'} onClose={onClose}>
      <form onSubmit={submit} className="px-6 py-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">الفعالية</label>
          <select
            value={form.eventId}
            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm focus:outline-none focus:border-burgundy transition-colors"
            required
          >
            <option value="">اختر الفعالية</option>
            {eventsList.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">الاسم الكامل</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm focus:outline-none focus:border-burgundy transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">البريد الإلكتروني</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            dir="ltr"
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm text-start focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">رقم الهاتف</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            dir="ltr"
            className="w-full px-4 py-2.5 bg-white border border-ivory-dark rounded-md text-sm text-start focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">الحالة</label>
          <Select value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={statusOptions} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-burgundy text-ivory py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer">
            {initial ? 'حفظ التعديلات' : 'إضافة التسجيل'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-ivory-dark text-sm text-warm-brown rounded-sm hover:bg-ivory-dark/50 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminRegistrations() {
  const { registrations, deleteRegistration, addToast, content } = useApp();
  const { topSearch, settings, scopedList, isAdmin } = useAdmin();
  const events = scopedList(content.events);
  const scopeIds = new Set(events.map((e) => e.id));
  const scopeRegs = registrations.filter((r) => scopeIds.has(r.eventId));
  const eventByCircle = (eventId) => content.events.find((e) => e.id === eventId)?.circleId;
  const [status, setStatus] = useState('الكل');
  const [eventId, setEventId] = useState('الكل');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = scopeRegs.filter((r) => {
    const matchStatus = status === 'الكل' || r.status === status;
    const matchEvent = eventId === 'الكل' || r.eventId === eventId;
    const q = topSearch.trim();
    const matchSearch = !q || r.name.includes(q) || (r.email || '').includes(q) || r.eventTitle.includes(q);
    return matchStatus && matchEvent && matchSearch;
  });

  const columns = [
    {
      key: 'name',
      label: 'المتسجل',
      sortable: true,
      render: (r) => (
        <div className="min-w-0">
          <p className="font-semibold text-ink text-sm">{r.name}</p>
          <p className="text-[11px] text-warm-brown truncate flex items-center gap-1.5">
            <span>{r.phone || 'بدون هاتف'}</span>
            {r.email && <span className="truncate max-w-[160px]">{r.email}</span>}
          </p>
        </div>
      ),
    },
    { key: 'eventTitle', label: 'الفعالية', render: (r) => <span className="text-sm text-ink min-w-0 leading-snug">{r.eventTitle}</span> },
    {
      key: 'circle',
      label: 'الدائرة',
      render: (r) => <CircleBadge circleKey={eventByCircle(r.eventId)} />,
    },
    { key: 'createdAt', label: 'تاريخ التسجيل', sortable: true, sortValue: (r) => r.createdAt, render: (r) => <span className="text-sm text-warm-brown">{formatFullDate(r.createdAt)}</span> },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewing(r)}
            className="p-2 text-warm-brown hover:text-burgundy hover:bg-ivory-dark/60 rounded-sm transition-colors cursor-pointer"
            aria-label="عرض التفاصيل"
            title="عرض التفاصيل"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => {
              setEditing(r);
              setModalOpen(true);
            }}
            className="p-2 text-warm-brown hover:text-burgundy hover:bg-ivory-dark/60 rounded-sm transition-colors cursor-pointer"
            aria-label="تعديل"
            title="تعديل"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setConfirmDelete(r)}
            className="p-2 text-warm-brown hover:text-burgundy hover:bg-burgundy/10 rounded-sm transition-colors cursor-pointer"
            aria-label="حذف"
            title="حذف"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <div>
      <PageHead
        eyebrow="لإدارة"
        title="إدارة التسجيلات"
        description="التسجيلات الواردة من نموذج الموقع، مع إمكانية الإضافة والتعديل وتغيير الحالة."
        meta={<span className="text-xs text-warm-brown">إجمالي {scopeRegs.length} تسجيل</span>}
      />

      <div className="bg-white border border-ivory-dark p-4 mb-5 flex flex-wrap items-end gap-4">
        <Select label="الحالة" value={status} onChange={setStatus} options={['الكل', ...statusOptions]} className="w-40" />
        <Select label="الفعالية" value={eventId} onChange={setEventId} options={['الكل', ...events.map((e) => [e.id, e.title])]} className="w-64" />
        <p className="text-xs text-warm-brown ms-auto pb-2.5">
          {filtered.length} من {scopeRegs.length} نتائج
        </p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
        >
          <Plus size={16} />
          تسجيل جديد
        </button>
      </div>

      {scopeRegs.length === 0 ? (
        <EmptyState
          title="لا توجد تسجيلات بعد"
          message="عندما يرسل الزوار نموذج الحجز من صفحة الفعاليات ستظهر التسجيلات هنا مباشرة."
          icon={<UserPlus size={24} />}
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
            >
              <Plus size={16} />
              إضافة تسجيل تجريبي
            </button>
          }
        />
      ) : (
        <>
          <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />
          {scopeRegs.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-burgundy/70 hover:text-burgundy underline underline-offset-4 transition-colors cursor-pointer"
              >
                {isAdmin ? 'مسح جميع التسجيلات' : 'مسح تسجيلات هذه الدائرة'}
              </button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <RegistrationFormModal initial={editing} onClose={() => setModalOpen(false)} eventsList={events} />
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="تفاصيل التسجيل" titleIcon={<Eye size={18} className="text-gold-light" />}>
        {viewing && (
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-ink text-lg">{viewing.name}</p>
              <StatusBadge status={viewing.status} />
            </div>
            <dl className="space-y-3 text-sm">
              <Row label="الفعالية" value={viewing.eventTitle} />
              <Row label="موعد الفعالية" value={viewing.eventDate} />
              <Row label="البريد الإلكتروني" value={viewing.email || 'غير وارد'} />
              <Row label="رقم الهاتف" value={viewing.phone || 'غير وارد'} />
              <Row label="تاريخ التسجيل" value={formatFullDate(viewing.createdAt)} />
              <Row label="معرّف التسجيل" value={viewing.id} />
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="حذف التسجيل"
        message={
          <>
            هل أنت متأكد من حذف تسجيل <b className="text-ink">{confirmDelete?.name}</b> في الفعالية
            <b className="text-ink"> {confirmDelete?.eventTitle}</b>؟ لا يمكن التراجع عن هذا الإجراء.
          </>
        }
        confirmLabel="حذف"
        onConfirm={() => {
          if (!confirmDelete) return;
          deleteRegistration(confirmDelete.id);
          addToast('تم حذف التسجيل', 'success');
          setConfirmDelete(null);
        }}
      />

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="مسح التسجيلات"
        message={`سيتم حذف ${scopeRegs.length} تسجيل ${isAdmin ? '' : 'خاص بهذه الدائرة'} نهائياً. لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="مسح الكل"
        onConfirm={() => {
          scopeRegs.forEach((r) => deleteRegistration(r.id));
          addToast('تم مسح التسجيلات', 'success');
          setConfirmClear(false);
        }}
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ivory-dark/50 pb-2.5">
      <dt className="text-warm-brown text-xs font-semibold flex-shrink-0">{label}</dt>
      <dd className="text-ink text-sm text-end break-words">{value}</dd>
    </div>
  );
}