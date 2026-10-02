import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Coins,
  Target,
  Scale,
  AlertTriangle,
} from 'lucide-react';
import PageHead from './ui/PageHead';
import Select from './ui/Select';
import DataTable from './ui/DataTable';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import EmptyState from './ui/EmptyState';
import StatusBadge from './ui/StatusBadge';
import DatePicker from './ui/DatePicker';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import { computeCosts } from './utils/deriveStats';
import CircleBadge from './ui/CircleBadge';

const COST_STATUSES = ['مدفوع', 'قيد الانتظار'];

function todayInputDate() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function emptyForm(circleId) {
  return {
    title: '',
    description: '',
    categoryId: '',
    amount: '',
    date: todayInputDate(),
    status: 'مدفوع',
    circleId: circleId || '',
  };
}

function formatAmount(n) {
  return (Number(n) || 0).toLocaleString('en-US');
}

function formatCostDate(iso) {
  if (!iso) return '';
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  try {
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function CostManagement() {
  const { content, addItem, updateItem, deleteItem, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList, circles } = useAdmin();

  const costs = scopedList(content.costs);
  const costCategories = scopedList(content.costCategories);
  const showAmounts = isAdmin;

  const [catFilter, setCatFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(() => emptyForm(effectiveCircle));
  const [errors, setErrors] = useState({});
  const [delTarget, setDelTarget] = useState(null);

  const computed = computeCosts(costs, settings.monthlyBudget);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setCat = (c, name) => ({
    categoryId: c.categoryId || '',
    categoryName: name || '—',
  });

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(isAdmin ? '' : effectiveCircle));
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (c) => {
    setEditId(c.id);
    setForm({
      title: c.title || '',
      description: c.description || '',
      categoryId: c.categoryId || '',
      amount: String(c.amount ?? ''),
      date: c.date || todayInputDate(),
      status: c.status || 'مدفوع',
      circleId: c.circleId || '',
      _origAmount: c.amount ?? 0,
    });
    setErrors({});
    setFormOpen(true);
  };

  const submit = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'هذا الحقل مطلوب';
    if (!form.categoryId) errs.categoryId = 'اختر فئة التكلفة';
    const amount = Number(form.amount);
    if (showAmounts && (!Number.isFinite(amount) || amount <= 0)) errs.amount = 'أدخل مبلغاً صحيحاً أكبر من صفر';
    if (!form.date) errs.date = 'هذا الحقل مطلوب';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      amount: showAmounts ? Math.round(amount) : (editId ? form._origAmount : 0),
      date: form.date,
      status: form.status,
      circleId: effectiveCircle || form.circleId || '',
    };
    if (editId) {
      updateItem('costs', editId, payload);
      addToast('تم تعديل بند التكلفة بنجاح');
    } else {
      addItem('costs', { ...payload, createdAt: Date.now() });
      addToast('تمت إضافة بند التكلفة بنجاح');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!delTarget) return;
    deleteItem('costs', delTarget.id);
    addToast('تم حذف بند التكلفة');
    setDelTarget(null);
  };

  const q = topSearch.trim();
  const filtered = costs.filter((c) => {
    const catName = setCat(c).categoryName;
    const matchCat = catFilter === 'الكل' || c.categoryId === catFilter;
    const matchStatus = statusFilter === 'الكل' || c.status === statusFilter;
    const matchRange =
      (!fromDate || (c.date || '') >= fromDate) && (!toDate || (c.date || '') <= toDate);
    const matchSearch =
      !q ||
      c.title.includes(q) ||
      (c.description || '').includes(q) ||
      catName.includes(q);
    return matchCat && matchStatus && matchRange && matchSearch;
  });

  const cards = [
    {
      icon: Coins,
      label: 'إجمالي المصروفات الشهرية',
      value: computed.monthlyTotal,
      note: `${costs.length} بند تكلفة مسجل · ${computed.pendingTotal.toLocaleString('en-US')} معلق`,
    },
    {
      icon: Target,
      label: 'الميزانية المحددة',
      value: computed.budget,
      note: computed.budget > 0 ? 'الحد الشهري للإدارة' : 'لم يتم تحديد ميزانية بعد',
    },
    {
      icon: Scale,
      label: 'الرصيد المتبقي',
      value: computed.remaining,
      note: computed.overBudget
        ? 'تجاوز الميزانية'
        : computed.budget > 0
          ? 'المتبقي من الميزانية الشهرية'
          : 'حدد الميزانية لحساب الرصيد',
      danger: computed.overBudget,
    },
  ];

  const columns = [
    {
      key: 'title',
      label: 'البند',
      sortable: true,
      render: (c) => (
        <div className="min-w-0">
          <p className="font-semibold text-ink text-sm">{c.title}</p>
          {c.description && (
            <p className="text-[11px] text-warm-brown mt-0.5 truncate max-w-[280px]">{c.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'categoryId',
      label: 'الفئة',
      sortable: true,
      sortValue: (c) => setCat(c).categoryName,
      render: (c) => <span className="text-sm text-warm-brown">{setCat(c).categoryName}</span>,
    },
    ...(showAmounts
      ? [
          {
            key: 'amount',
            label: 'المبلغ',
            sortable: true,
            sortValue: (c) => Number(c.amount) || 0,
            render: (c) => (
              <span className="text-sm font-semibold text-ink whitespace-nowrap">
                {formatAmount(c.amount)}
              </span>
            ),
          },
        ]
      : []),
    {
      key: 'date',
      label: 'التاريخ',
      sortable: true,
      render: (c) => (
        <span className="text-sm text-warm-brown whitespace-nowrap">{formatCostDate(c.date)}</span>
      ),
    },
    ...(showAmounts
      ? [
          {
            key: 'circleId',
            label: 'الدائرة',
            sortable: true,
            render: (c) => <CircleBadge circleKey={c.circleId} />,
          },
        ]
      : []),
    {
      key: 'status',
      label: 'الحالة',
      render: (c) =>
        c.status === 'مدفوع' ? (
          <StatusBadge status="مدفوع" tone="gold" />
        ) : (
          <StatusBadge status="قيد الانتظار" tone="amber" />
        ),
    },
    {
      key: 'actions',
      label: '',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(c)}
            className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors"
            aria-label="تعديل بند التكلفة"
            title="تعديل"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDelTarget(c)}
            className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
            aria-label="حذف بند التكلفة"
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
        title="إدارة التكاليف"
        description="حصر مصروفات النادي شهرياً حسب الفئة والحالة، مع متابعة الميزانية المحددة."
        meta={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Plus size={14} />
            إضافة بند تكلفة
          </button>
        }
      />

      {computed.overBudget && showAmounts && (
        <div className="mb-5 flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">تم تجاوز الميزانية الشهرية</p>
            <p className="text-xs text-red-600 leading-relaxed mt-0.5">
              المصروفات الحالية ({formatAmount(computed.monthlyTotal)}) تجاوزت الميزانية المحددة (
              {formatAmount(computed.budget)}) بمبلغ {formatAmount(computed.overAmount)}.
            </p>
          </div>
        </div>
      )}

      {showAmounts ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white border border-ivory-dark px-5 py-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    size={15}
                    className={card.danger ? 'text-red-600' : 'text-burgundy'}
                  />
                  <p
                    className={`text-[11px] font-medium tracking-wide ${
                      card.danger ? 'text-red-600' : 'text-gold'
                    }`}
                  >
                    {card.label}
                  </p>
                </div>
                <p
                  className={`text-3xl font-bold leading-none tracking-tight ${
                    card.danger ? 'text-red-600' : 'text-burgundy'
                  }`}
                >
                  {formatAmount(card.value)}
                </p>
                <div className="w-8 h-0.5 bg-gold/70 my-3" />
                <p className="text-[11px] text-warm-brown leading-relaxed">{card.note}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-5 border border-ivory-dark bg-ivory/40 px-5 py-4">
          <p className="text-xs text-warm-brown leading-relaxed">
            تفاصيل المبالغ والميزانية الشهرية خاصة بحساب الإدارة الرئيسية. حساب الدائرة يتابع
            هنا بنود التكاليف الخاصة بدائرته فقط دون أرقام الأسعار.
          </p>
        </div>
      )}

      {costs.length === 0 ? (
        <EmptyState
          title="لا توجد سجلات تكلفة بعد"
          message="أضف أول بند تكلفة لبدء حصر مصروفات النادي ومتابعة الميزانية الشهرية."
          icon={<Wallet size={24} />}
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-burgundy text-ivory px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-burgundy-dark transition-colors cursor-pointer"
            >
              <Plus size={16} />
              إضافة بند تكلفة
            </button>
          }
        />
      ) : (
        <>
          <div className="bg-white border border-ivory-dark p-4 mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              label="الفئة"
              value={catFilter}
              onChange={setCatFilter}
              options={[['الكل', 'كل الفئات'], ...costCategories.map((c) => [c.id, c.name])]}
            />
            <Select
              label="الحالة"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[['الكل', 'كل الحالات'], ...COST_STATUSES.map((s) => [s, s])]}
            />
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">من تاريخ</span>
              <DatePicker
                format="iso"
                value={fromDate}
                onChange={setFromDate}
                placeholder="اختر التاريخ"
                allowClear
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">إلى تاريخ</span>
              <DatePicker
                format="iso"
                value={toDate}
                onChange={setToDate}
                placeholder="اختر التاريخ"
                allowClear
              />
            </label>
          </div>

          <div className="bg-white border border-ivory-dark p-4 mb-5">
            <p className="text-xs text-warm-brown">
              {filtered.length} من {costs.length} بند تكلفة
            </p>
          </div>

          <DataTable columns={columns} rows={filtered} pageSize={settings.pageSize} />
        </>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'تعديل بند التكلفة' : 'إضافة بند تكلفة'}
        titleIcon={<Wallet size={18} className="text-gold-light" />}
      >
        <div className="px-6 py-5 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">
              العنوان <span className="text-burgundy">*</span>
            </span>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input"
              placeholder="مثال: طباعة الإصدار الجديد"
            />
            {errors.title && (
              <span className="block text-[11px] text-red-600 mt-1">{errors.title}</span>
            )}
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">الوصف</span>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="وصف مختصر لهذا البند (اختياري)"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">
                الفئة <span className="text-burgundy">*</span>
              </span>
              <Select
                value={form.categoryId}
                onChange={(v) => set('categoryId', v)}
                options={costCategories.map((c) => [c.id, c.name])}
              />
              {errors.categoryId && (
                <span className="block text-[11px] text-red-600 mt-1">{errors.categoryId}</span>
              )}
            </label>
            {showAmounts ? (
              <label className="block">
                <span className="block text-xs font-semibold text-ink mb-1.5">
                  المبلغ <span className="text-burgundy">*</span>
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  className="input"
                  placeholder="مثال: 50000"
                />
                {errors.amount && (
                  <span className="block text-[11px] text-red-600 mt-1">{errors.amount}</span>
                )}
              </label>
            ) : (
              <div>
                <span className="block text-xs font-semibold text-ink mb-1.5">المبلغ</span>
                <div className="border border-ivory-dark bg-ivory-dark/30 px-4 py-2.5 rounded-sm text-[11px] text-warm-brown">
                  يُسجَّل من حساب الإدارة الرئيسية
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">
                التاريخ <span className="text-burgundy">*</span>
              </span>
              <DatePicker
                format="iso"
                value={form.date}
                onChange={(v) => set('date', v)}
                placeholder="اختر التاريخ"
              />
              {errors.date && (
                <span className="block text-[11px] text-red-600 mt-1">{errors.date}</span>
              )}
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink mb-1.5">الحالة</span>
              <Select
                value={form.status}
                onChange={(v) => set('status', v)}
                options={COST_STATUSES.map((s) => [s, s])}
              />
            </label>
          </div>
          {showAmounts && (
            <div>
              <span className="block text-xs font-semibold text-ink mb-1.5">الدائرة</span>
              <Select
                value={form.circleId}
                onChange={(v) => set('circleId', v)}
                options={circles.map((c) => [c.key, `دائرة ${c.name}`])}
              />
            </div>
          )}
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
            {editId ? 'حفظ التعديلات' : 'إضافة البند'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={confirmDelete}
        title="حذف بند التكلفة"
        message={`هل أنت متأكد من حذف "${delTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
      />
    </div>
  );
}