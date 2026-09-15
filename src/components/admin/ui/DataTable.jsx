import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

function compareRows(a, b, col, dir) {
  const getValue = (r) => {
    const v = col.sortValue ? col.sortValue(r) : r[col.key];
    return v === undefined ? '' : v;
  };
  const va = getValue(a);
  const vb = getValue(b);
  let cmp;
  if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb;
  else cmp = String(va).localeCompare(String(vb), 'ar');
  return cmp * dir;
}

export default function DataTable({
  columns,
  rows,
  pageSize = 8,
  emptyMessage = 'لا توجد نتائج مطابقة.',
  emptyNode,
  onRowClick,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);

  const itemsPerPage = Number(pageSize) > 0 ? Number(pageSize) : 8;

  const sorted = [...rows];
  const activeCol = columns.find((c) => c.key === sortKey);
  if (activeCol) sorted.sort((a, b) => compareRows(a, b, activeCol, sortDir));

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const pageRows = sorted.slice(start, start + itemsPerPage);

  const toggleSort = (col) => {
    setPage(1);
    if (sortKey === col.key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(col.key);
      setSortDir(1);
    }
  };

  return (
    <div className="bg-white border border-ivory-dark">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="bg-ivory-dark/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-start px-4 py-3 text-xs font-semibold text-ink border-b border-ivory-dark whitespace-nowrap"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col)}
                      className="inline-flex items-center gap-1.5 hover:text-burgundy transition-colors cursor-pointer"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 1 ? (
                          <ChevronDown size={13} className="text-gold" />
                        ) : (
                          <ChevronUp size={13} className="text-gold" />
                        )
                      ) : (
                        <span className="text-warm-brown/40">⇅</span>
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="px-6 py-14 text-center">
                    {emptyNode || (
                      <div>
                        <Inbox size={28} className="mx-auto mb-3 text-warm-brown/50" />
                        <p className="text-sm text-warm-brown">{emptyMessage}</p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-t border-ivory-dark/50 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-ivory-dark/25' : 'hover:bg-ivory-dark/25'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 align-middle text-ink">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > itemsPerPage && (
        <div className="print:hidden flex items-center justify-between px-4 py-3 border-t border-ivory-dark bg-ivory/40 text-xs text-warm-brown">
          <p>
            عرض {start + 1} إلى {Math.min(start + itemsPerPage, sorted.length)} من {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-sm hover:bg-ivory-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="السابق"
            >
              <ChevronRight size={16} />
            </button>
            <span className="px-2">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-sm hover:bg-ivory-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="التالي"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}