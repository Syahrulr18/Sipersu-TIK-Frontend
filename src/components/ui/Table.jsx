/**
 * Generic Table component with header and row rendering.
 * 
 * @param {Array<{key: string, label: string, className?: string}>} columns
 * @param {Array} data
 * @param {function} renderRow
 * @param {boolean} loading
 * @param {React.ReactNode} emptyState
 */
const Table = ({
  columns = [],
  data = [],
  renderRow,
  loading = false,
  emptyState,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
                  px-4 py-3
                  ${col.className || ''}
                `}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                {emptyState || (
                  <div className="text-gray-400 text-sm">Tidak ada data</div>
                )}
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
