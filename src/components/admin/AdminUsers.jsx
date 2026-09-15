import { useState } from 'react';
import { Plus, Pencil, Trash2, Power, Users } from 'lucide-react';
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

export const USER_ROLES = ['زائر', 'حاضر', 'أدمن'];

const roleTone = {
  'أدمن': 'burgundy',
  'حاضر': 'gold',
  'زائر': 'slate',
};

function emptyForm() {
  return { name: '', email: '', role: 'زائر', active: true };
}

export default function AdminUsers() {
  const { content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings } = useAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const users = content.users;
  const adminsCount = users.filter((u) => u.role === 'أدمن' && u.active).length;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (u) => {
    setEditId(u.id);
    setForm({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'زائر',
      active: !!u.active,
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    const email = form.email.trim().toLowerCase();
    if (!email) errs.email = 'البريد الإلكتروني مطلوب';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'صيغة البريد غير صحيحة';
    else if (users.some((u) => u.email?.toLowerCase() === email && u.id !== editId)) {
      errs.email = 'يوجد مستخدم بهذا البريد بالفعل';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload = { name: form.name.trim(), email, role: form.role, active: !!form.active };
    if (editId) {
      updateItem('users', editId, payload);
      addToast('تم تعديل المستخدم بنجاح');
    } else {
      addItem('users', { ...payload, createdAt: Date.now() });
      addToast('تمت إضافة المستخدم بنجاح');
    }
    setFormOpen(false);
  };

  const toggleActive = (u) => {
    if (u.active && u.role === 'أدمن' && adminsCount <= 1) {
      addToast('لا يمكن إيقاف آخر أدمن نشط في اللوحة', 'error');
      return;
    }
    updateItem('users', u.id, { active: !u.active });
    addToast(u.active ? 'تم إيقاف المستخدم' : 'تم تفعيل المستخدم');
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('users', delTarget.id);
    addToast('تم حذف المستخدم');
    setDelTarget(null);
  };

  const q = topSearch.trim();
  const filtered = users.filter(
    (u) => !q || u.name.includes(q) || (u.email || '').includes(q) || u.role.includes(q)
  );

  const columns = [
    {
      key: 'name',
      label: 'المستخدم',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 bg-burgundy/10 text-burgundy flex items-center justify-center text-sm font-bold rounded-sm flex-shrink-0">
            {u.name.trim().charAt(0) || '؟'}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-ink text-sm truncate">{u.name}</p>
            {u.email && (
              <p className="text-[11px] text-warm-brown truncate" dir="ltr">
                {u.email}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'الدور',
      sortable: true,
      render: (u) => <StatusBadge status={u.role} tone={roleTone[u.role] || 'slate'} />,
    },
    {
      key: 'active',
      label: 'الحالة',
      render: (u) => (
        <StatusBadge
          status={u.active ? 'مفعّل' : 'موقوف'}
          tone={u.active ? 'gold' : 'slate'}
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإضافة',
      sortable: true,
      sortValue: (u) => u.createdAt || 0,
      render: (u) => (
        <span className="text-sm text-warm-brown whitespace-nowrap">
          {formatFullDate(u.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (u) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleActive(u)}
            className={`p-1.5 rounded-sm transition-colors ${
              u.active
                ? 'text-warm-brown hover:text-red-600 hover:bg-red-50'
                : 'text-warm-brown hover:text-burgundy hover:bg-ivory-dark'
            }`}
            aria-label={u.active ? 'إيقاف المستخدم' : 'تفعيل المستخدم'}
            title={u.active ? 'إيقاف' : 'تفعيل'}
          >
            <Power size={14} />
          </button>
          <button
            onClick={() => openEdit(u)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label="تعديل المستخدم"
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(u)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label="حذف المستخدم"
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
        title="إدارة المستخدمين"
        description="أدوار الموقع ثلاثة فقط: زائر، حاضر، أدمن."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة مستخدم
          </button>
        }
      />

      {users.length === 0 ? (
        <EmptyState
          title="لا يوجد مستخدمون بعد"
          message="أضف المستخدمين وحدد دور كل منهم: زائر، حاضر، أو أدمن."
          icon={<Users size={24} />}
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
            >
              <Plus size={16} />
              إضافة مستخدم
            </button>
          }
        />
      ) : (
        <>
          <div className="bg-white border border-ivory-dark p-4 mb-5">
            <p className="text-xs text-warm-brown">
              {filtered.length} من {users.length} مستخدم · {adminsCount} أدمن نشط
            </p>
          </div>
          <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />
        </>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل المستخدم' : 'إضافة مستخدم'}
      >
        <div className="px-6 py-5 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">
              الاسم <span className="text-burgundy">*</span>
            </span>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input"
              placeholder="الاسم الكامل"
            />
            {errors.name && (
              <span className="block text-[11px] text-red-600 mt-1">{errors.name}</span>
            )}
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">
              البريد الإلكتروني <span className="text-burgundy">*</span>
            </span>
            <input
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              dir="ltr"
              className="input text-start"
              placeholder="email@example.com"
            />
            {errors.email && (
              <span className="block text-[11px] text-red-600 mt-1">{errors.email}</span>
            )}
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">الدور</span>
            <Select value={form.role} onChange={(v) => set('role', v)} options={USER_ROLES} />
            <span className="block text-[11px] text-warm-brown mt-1">
              الدخول للوحة الإدارة متاح للأدمن فقط، بينما الحاضر يسجّل حضوره ويعرض تسجيلاته.
            </span>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">الحالة</span>
            <Select
              value={form.active ? 'مفعّل' : 'موقوف'}
              onChange={(v) => set('active', v === 'مفعّل')}
              options={[['مفعّل', 'مفعّل'], ['موقوف', 'موقوف']]}
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
            {editId ? 'حفظ التعديلات' : 'إضافة المستخدم'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف المستخدم"
        message={
          <>
            هل أنت متأكد من حذف المستخدم <b className="text-ink">{delTarget?.name}</b>؟
            {delTarget?.role === 'أدمن' && (
              <span className="block mt-1 text-burgundy">هذا حساب أدمن. تأكد قبل الحذف.</span>
            )}
            لا يمكن التراجع عن هذا الإجراء.
          </>
        }
        confirmLabel="حذف"
      />
    </div>
  );
}