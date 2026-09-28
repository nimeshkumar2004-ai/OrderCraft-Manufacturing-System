import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  emptyMessage = 'No records found matching your filters.',
  emptySubtext = 'Try adjusting your search criteria or add a new record.',
  pagination = true,
  defaultItemsPerPage = 8,
  onRowClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = defaultItemsPerPage;

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedData = pagination ? data.slice(startIndex, startIndex + itemsPerPage) : data;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600 border-collapse">
          <thead className="bg-slate-50/90 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-4 py-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row[keyField] || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer hover:bg-orange-50/40' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`px-4 py-3.5 align-middle ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                      <Inbox className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
                    <p className="text-xs text-slate-400 mt-1">{emptySubtext}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && data.length > 0 && (
        <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(startIndex + 1, data.length)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{data.length}</span> records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={validCurrentPage <= 1}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-medium text-slate-700">
              Page {validCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={validCurrentPage >= totalPages}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
