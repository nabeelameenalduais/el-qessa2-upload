import { useState } from 'react';
import {
  CalendarDays,
  Users,
  Wallet,
  Activity,
  History,
  Printer,
  Trash2,
} from 'lucide-react';
import PageHead from './ui/PageHead';
import DataTable from './ui/DataTable';
import Select from './ui/Select';
import ConfirmDialog from './ui/ConfirmDialog';
import DonutChart from './charts/DonutChart';
import CostActivityChart from './charts/CostActivityChart';
import { useApp } from '../../context/AppContext';
import { useAdmin } from './context/AdminContext';
import {
  computeEvents,
  computeUsers,
  computeWriters,
  computeCosts,
  buildMonthlySeries,
} from './utils/deriveStats';
import { formatFullDate } from './utils/dateUtils';

const CONTENT_KEYS = [
  'events',
  'writers',
  'publications',
  'workshops',
  'news',
  'archive',
  'gallery',
  'files',
  'users',
  'costCategories',
  'costs',
];

function formatAmount(n) {
  return (Number(n) || 0).toLocaleString('en-US');
}

function formatDateTime(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    return `${formatFullDate(ts)} · ${time}`;
  } catch {
    return '';
  }
}

export default function SystemReport() {
  const { content, auditLog, clearAuditLog, addToast } = useApp();
  const { topSearch, settings, effectiveCircle, isAdmin, scopedList } = useAdmin();

  const [sectionFilter, setSectionFilter] = useState('الكل');
  const [actionFilter, setActionFilter] = useState('الكل');
  const [confirmClear, setConfirmClear] = useState(false);

  const viewEvents = scopedList(content.events);
  const viewNews = scopedList(content.news);
  const viewCosts = scopedList(content.costs || []);
  const eventsStats = computeEvents(viewEvents);
  const writersStats = computeWriters(content.writers);
  const usersStats = computeUsers(content.users);
  const costStats = computeCosts(viewCosts, settings.monthlyBudget);
  const monthly = buildMonthlySeries({
    events: viewEvents,
    news: viewNews,
    costs: viewCosts,
  });

  const auditScope = isAdmin ? auditLog : auditLog.filter((e) => e.circleKey === effectiveCircle);

  const activeSections = CONTENT_KEYS.filter((k) => (content[k] || []).length > 0).length;
  const activityPct = Math.round((activeSections / CONTENT_KEYS.length) * 100);

  const cards = [
    {
      icon: CalendarDays,
      label: 'فعاليات النادي',
      value: eventsStats.total,
      note: `${eventsStats.upcomingCount} قادمة · ${eventsStats.pastCount} سابقة`,
    },
    {
      icon: Users,
      label: 'الكتّاب والمستخدمون',
      value: writersStats.total + usersStats.total,
      note: `${writersStats.total} كاتب · ${usersStats.total} مستخدم في اللوحة`,
    },
    isAdmin
      ? {
          icon: Wallet,
          label: 'إجمالي المصروفات',
          value: formatAmount(costStats.total),
          note: `${viewCosts.length} بند تكلفة · ${formatAmount(costStats.pendingTotal)} معلق`,
        }
      : {
          icon: Wallet,
          label: 'بنود تكلفة الدائرة',
          value: `${viewCosts.length} بند`,
          note: 'المبالغ المالية خاصة بحساب الإدارة',
        },
    {
      icon: Activity,
      label: 'نسبة نشاط اللوحة',
      value: `${activityPct}٪`,
      note: `${activeSections} من ${CONTENT_KEYS.length} أقسام نشطة · ${auditScope.length} عملية مسجلة`,
    },
  ];

  const sectionOptions = ['الكل', ...[...new Set(auditScope.map((e) => e.section))]];
  const actionOptions = ['الكل', ...[...new Set(auditScope.map((e) => e.action))]];

  const q = (topSearch || '').trim();
  const filtered = auditScope.filter((e) => {
    if (sectionFilter !== 'الكل' && e.section !== sectionFilter) return false;
    if (actionFilter !== 'الكل' && e.action !== actionFilter) return false;
    if (
      q &&
      !(
        e.actor.includes(q) ||
        e.section.includes(q) ||
        e.action.includes(q) ||
        e.detail.includes(q)
      )
    ) {
      return false;
    }
    return true;
  });

  const catName = (id) =>
    (content.costCategories || []).find((c) => c.id === id)?.name || 'غير محددة';

  const costDonutData = (costStats.byCategory || []).map((c) => ({
    name: catName(c.id),
    count: c.amount,
  }));

  const columns = [
    {
      key: 'actor',
      label: 'المسؤول',
      sortable: true,
      render: (e) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-7 h-7 flex-shrink-0 bg-ivory-dark text-burgundy flex items-center justify-center text-xs font-bold rounded-sm">
            {e.actor?.charAt(0) || 'م'}
          </span>
          <span className="text-sm font-semibold text-ink">{e.actor}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'الإجراء',
      sortable: true,
      render: (e) => <span className="text-sm text-warm-brown">{e.action}</span>,
    },
    {
      key: 'section',
      label: 'القسم',
      sortable: true,
      render: (e) => <span className="text-sm text-warm-brown">{e.section}</span>,
    },
    {
      key: 'detail',
      label: 'التفاصيل',
      render: (e) => <span className="text-sm text-ink">{e.detail || '—'}</span>,
    },
    {
      key: 'ts',
      label: 'التاريخ والوقت',
      sortable: true,
      sortValue: (e) => e.ts,
      render: (e) => (
        <span className="text-sm text-warm-brown whitespace-nowrap">{formatDateTime(e.ts)}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHead
        eyebrow="لإدارة"
        title="التقرير الشامل للنظام"
        description="نظرة شاملة حول أداء نادي القصة «إلمقه»: مؤشرات المحتوى، سجل أنشطة الإدارة، والمقارنة الشهرية بين النشاط والمصروفات."
        meta={
          <button
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-ivory text-xs font-semibold rounded-sm hover:bg-burgundy-light transition-colors"
          >
            <Printer size={14} />
            طباعة / حفظ PDF
          </button>
        }
      />

      <div className="print-area">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white border border-ivory-dark px-5 py-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={15} className="text-burgundy" />
                  <p className="text-[11px] font-medium tracking-wide text-gold">{card.label}</p>
                </div>
                <p className="text-3xl font-bold leading-none tracking-tight text-burgundy">
                  {card.value}
                </p>
                <div className="w-8 h-0.5 bg-gold/70 my-3" />
                <p className="text-[11px] text-warm-brown leading-relaxed">{card.note}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-ivory-dark mb-8">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-ivory-dark">
            <div>
              <h3 className="font-bold text-ink flex items-center gap-2 text-base">
                <History size={16} className="text-gold" />
                سجل أنشطة الإدارة
              </h3>
              <p className="text-xs text-warm-brown mt-1 leading-relaxed">
                تتبع تلقائي لعمليات الإضافة والتعديل والحذف على كل المحتوى والتسجيلات.
              </p>
            </div>
            {isAdmin && (
            <button
              onClick={() => setConfirmClear(true)}
              className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-warm-brown hover:text-red-600 border border-ivory-dark hover:border-red-200 hover:bg-red-50 rounded-sm transition-colors"
            >
              <Trash2 size={13} />
              مسح السجل
            </button>
          )}
          </div>

          <div className="no-print px-5 py-3 border-b border-ivory-dark flex flex-wrap items-center gap-3">
            <Select
              className="w-48"
              value={sectionFilter}
              onChange={setSectionFilter}
              options={sectionOptions.map((s) => [s, s])}
            />
            <Select
              className="w-48"
              value={actionFilter}
              onChange={setActionFilter}
              options={actionOptions.map((a) => [a, a])}
            />
            <span className="text-xs text-warm-brown">
              تُعرض {filtered.length} من {auditScope.length} عملية
              {q ? ` · بحث: «${q}»` : ''}
            </span>
          </div>

          <DataTable
            columns={columns}
            rows={filtered}
            pageSize={settings.pageSize}
            emptyMessage="لا توجد عمليات مسجلة بعد — أضِف أو عدّل محتوى لتظهر الأنشطة هنا."
          />
        </div>

        {isAdmin ? (
          <div className="grid lg:grid-cols-2 gap-4 mb-8">
            <CostActivityChart data={monthly} />
            <DonutChart
              title="المصروفات حسب الفئة"
              subtitle="توزيع بنود التكلفة المسجلة على الفئات المختلفة."
              centerLabel="إجمالي"
              total={costStats.total}
              data={costDonutData}
              format={(n) => formatAmount(n)}
            />
          </div>
        ) : (
          <div className="mb-8 border border-ivory-dark bg-ivory/40 px-5 py-4">
            <p className="text-xs text-warm-brown leading-relaxed">
              الرسوم البيانية للمقارنة الشهرية بين النشاط والمصروفات، وتفاصيل المبالغ، خاصة
              بحساب الإدارة الرئيسية.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          clearAuditLog();
          addToast('تم مسح سجل الأنشطة');
          setConfirmClear(false);
        }}
        title="مسح سجل الأنشطة"
        message="سيتم حذف جميع العمليات المسجلة نهائياً من اللوحة. هل أنت متأكد؟"
        confirmLabel="مسح السجل"
      />
    </div>
  );
}