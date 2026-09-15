import { useState } from 'react';
import { Trash2, Bell, PanelLeft, Wallet, CircleDot, Plus, Pencil } from 'lucide-react';
import PageHead from './ui/PageHead';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import { CIRCLES } from './circles';

const PALETTE = [
  '#5B2028',
  '#7a2e38',
  '#3d151b',
  '#8a3a2a',
  '#9c6644',
  '#B08A52',
  '#795548',
  '#4a2c2a',
];
const FIXED_CIRCLE_KEYS = CIRCLES.map((c) => c.key);
const USAGE_SECTIONS = ['events', 'workshops', 'news', 'files', 'tasks', 'costs'];

function SettingToggle({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 px-5">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-burgundy/10 text-burgundy rounded-sm">
          <Icon size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="text-xs text-warm-brown mt-0.5 leading-relaxed">{desc}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-sm transition-colors cursor-pointer ${
          checked ? 'bg-burgundy' : 'bg-warm-brown/40'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-sm transition-all ${
            checked ? 'start-[calc(100%-20px)]' : 'start-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const { registrations, clearRegistrations, addToast, content } = useApp();
  const { settings, setSetting, resetSettings, circles, isAdmin, addCircle, updateCircle, deleteCircle } =
    useAdmin();
  const [confirmClear, setConfirmClear] = useState(false);

  const [circleFormOpen, setCircleFormOpen] = useState(false);
  const [editingCircleKey, setEditingCircleKey] = useState(null);
  const [circleForm, setCircleForm] = useState({ name: '', color: PALETTE[0] });
  const [circleErrors, setCircleErrors] = useState({});
  const [delCircleTarget, setDelCircleTarget] = useState(null);

  const usageOf = (key) =>
    USAGE_SECTIONS.reduce(
      (acc, section) => acc + (content[section] || []).filter((i) => i.circleId === key).length,
      0
    );

  const isFixed = (key) => FIXED_CIRCLE_KEYS.includes(key);

  const openAddCircle = () => {
    setEditingCircleKey(null);
    setCircleForm({ name: '', color: PALETTE[0] });
    setCircleErrors({});
    setCircleFormOpen(true);
  };

  const openEditCircle = (circle) => {
    setEditingCircleKey(circle.key);
    setCircleForm({ name: circle.name, color: circle.color });
    setCircleErrors({});
    setCircleFormOpen(true);
  };

  const saveCircle = () => {
    const errs = {};
    const name = circleForm.name.trim();
    if (!name) errs.name = 'اسم الدائرة مطلوب';
    const dup = circles.some(
      (c) => (editingCircleKey ? c.key !== editingCircleKey : true) && c.name.trim() === name
    );
    if (dup && !errs.name) errs.name = 'يوجد دائرة بهذا الاسم بالفعل';
    if (Object.keys(errs).length) { setCircleErrors(errs); return; }

    if (editingCircleKey) {
      updateCircle(editingCircleKey, { name, color: circleForm.color });
      addToast('تم تحديث الدائرة');
    } else {
      addCircle({ key: `new_c_${Date.now()}`, name, color: circleForm.color });
      addToast('أُضيفت دائرة جديدة وتصبح تلقائياً تصنيفاً للفعاليات');
    }
    setCircleFormOpen(false);
  };

  const confirmDeleteCircle = () => {
    if (!delCircleTarget) return;
    deleteCircle(delCircleTarget.key);
    addToast('تم حذف الدائرة');
    setDelCircleTarget(null);
  };

  return (
    <div className="max-w-3xl">
      <PageHead
        eyebrow="لإدارة"
        title="إعدادات اللوحة"
        description="تخصيصات تعمل على لوحة الإدارة فقط ولا تغير محتوى الموقع العام."
      />

      {isAdmin && (
        <div className="bg-white border border-ivory-dark mb-6">
          <header className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-burgundy/10 text-burgundy rounded-sm">
                <CircleDot size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">الدوائر (تصنيفات الفعاليات)</p>
                <p className="text-xs text-warm-brown mt-0.5 leading-relaxed">
                  الدوائر الخمس هي تصنيفات الفعاليات. أي دائرة جديدة تصبح تلقائياً تصنيفاً
                  متاحاً عند إنشاء الفعاليات دون نظام تصنيفات منفصل.
                </p>
              </div>
            </div>
            <button
              onClick={openAddCircle}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors cursor-pointer"
            >
              <Plus size={14} />
              إضافة دائرة
            </button>
          </header>
          <ul className="divide-y divide-ivory-dark/60">
            {circles.map((c) => {
              const usage = usageOf(c.key);
              const fixed = isFixed(c.key);
              return (
                <li key={c.key} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className="w-6 h-6 rounded-[2px] flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-[11px] text-warm-brown mt-0.5">
                      {fixed ? 'دائرة أساسية · ' : ''}
                      {usage} عنصر مرتبط
                    </p>
                  </div>
                  <button
                    onClick={() => openEditCircle(c)}
                    className="p-1.5 text-warm-brown hover:text-burgundy hover:bg-ivory-dark rounded-sm transition-colors cursor-pointer"
                    aria-label={`تعديل ${c.name}`}
                    title="تعديل"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDelCircleTarget(c)}
                    disabled={fixed || usage > 0}
                    className="p-1.5 text-warm-brown hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`حذف ${c.name}`}
                    title={
                      fixed
                        ? 'الدوائر الأساسية لا تُحذف'
                        : usage > 0
                          ? 'لا يُحذف الدائرة المرتبط بها محتوى'
                          : 'حذف'
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="bg-white border border-ivory-dark divide-y divide-ivory-dark/60">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-burgundy/10 text-burgundy rounded-sm">
              <Wallet size={16} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">الميزانية الشهرية</p>
              <p className="text-xs text-warm-brown mt-0.5">
                الحد المحدد للمصاريف الشهرية، يُستخدم لحساب الرصيد المتبقي وتنبيهات تجاوز الميزانية.
              </p>
            </div>
            <input
              type="number"
              min="0"
              value={settings.monthlyBudget || 0}
              onChange={(e) => setSetting('monthlyBudget', Math.max(0, Number(e.target.value) || 0))}
              className="input w-28 text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <SettingToggle
          icon={PanelLeft}
          title="القائمة الجانبية مطوية"
          desc="عرض أيقونات القائمة فقط عند الدخول للوحة."
          checked={settings.collapsedSidebar}
          onChange={(v) => setSetting('collapsedSidebar', v)}
        />
        <SettingToggle
          icon={Bell}
          title="الإشعارات"
          desc="عرض مؤشر التنبيهات على الجرس في الشريط العلوي."
          checked={settings.notifications}
          onChange={(v) => setSetting('notifications', v)}
        />
      </div>

      <div className="mt-6 bg-white border border-burgundy/20">
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-burgundy/10 text-burgundy rounded-sm">
              <Trash2 size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">مسح جميع التسجيلات وإعادة ضبط الإعدادات</p>
              <p className="text-xs text-warm-brown mt-0.5 leading-relaxed">
                حذف {registrations.length} تسجيل محفوظ في متصفحك نهائياً وإعادة ضبط إعدادات اللوحة إلى
                قيمها الافتراضية.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfirmClear(true)}
            disabled={registrations.length === 0}
            className="flex-shrink-0 px-4 py-2.5 border border-burgundy text-burgundy text-sm font-semibold rounded-sm hover:bg-burgundy hover:text-ivory transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            مسح الكل
          </button>
        </div>
      </div>

      <Modal
        open={circleFormOpen}
        onClose={() => setCircleFormOpen(false)}
        title={editingCircleKey ? 'تعديل الدائرة' : 'إضافة دائرة جديدة'}
      >
        <div className="px-6 py-5 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">
              اسم الدائرة
              <span className="text-burgundy me-1">*</span>
            </span>
            <input
              value={circleForm.name}
              onChange={(e) => setCircleForm((f) => ({ ...f, name: e.target.value }))}
              className="input"
              placeholder="مثال: إبداع متجدد"
            />
            {circleErrors.name && (
              <span className="block text-[11px] text-red-600 mt-1">{circleErrors.name}</span>
            )}
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-ink mb-1.5">اللون</span>
            <div className="flex items-center gap-2 pt-1">
              {PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCircleForm((f) => ({ ...f, color }))}
                  className={`w-8 h-8 rounded-sm border transition-transform ${
                    circleForm.color === color
                      ? 'border-ink scale-110 shadow-md'
                      : 'border-ivory-dark'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`لون الدائرة ${color}`}
                />
              ))}
            </div>
          </label>
          <p className="text-[11px] text-warm-brown/80 leading-relaxed">
            ستظهر الدائرة الجديدة تلقائياً كتصنيف عند إنشاء الفعاليات، وفي خيارات التصفية على
            صفحة الفعاليات العامة.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-ivory-dark flex items-center justify-end gap-3">
          <button
            onClick={() => setCircleFormOpen(false)}
            className="px-5 py-2.5 text-sm font-medium text-warm-brown hover:text-ink border border-ivory-dark hover:border-warm-brown transition-colors rounded-sm cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={saveCircle}
            className="px-5 py-2.5 text-sm font-medium bg-burgundy text-ivory hover:bg-burgundy-light transition-colors rounded-sm cursor-pointer"
          >
            {editingCircleKey ? 'حفظ التعديلات' : 'إضافة الدائرة'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!delCircleTarget}
        onClose={() => setDelCircleTarget(null)}
        title="حذف الدائرة"
        message={`هل أنت متأكد من حذف "${delCircleTarget?.name}"؟ سيصبح تصنيفها غير متاح للفعاليات الجديدة. لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        onConfirm={confirmDeleteCircle}
      />

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="مسح جميع التسجيلات"
        message={`سيتم حذف ${registrations.length} تسجيل نهائياً من قاعدة اللوحة وإعادة ضبط إعدادات اللوحة المخزنة في متصفحك. لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="مسح الكل"
        onConfirm={() => {
          clearRegistrations();
          resetSettings();
          addToast('تم مسح جميع التسجيلات وإعادة ضبط الإعدادات', 'success');
          setConfirmClear(false);
        }}
      />
    </div>
  );
}