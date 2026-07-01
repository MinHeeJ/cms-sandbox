import { AlertCircle, Loader2 } from 'lucide-react';

export interface Column<T> { key: string; header: string; render: (row: T) => React.ReactNode; }

export function DataTable<T>({
  columns,
  rows,
  empty = '표시할 데이터가 없습니다.',
  loading = false,
  error,
  caption
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: string;
  loading?: boolean;
  error?: string;
  caption?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-ld bg-white">
      {caption && <div className="border-b border-ld px-4 py-3 text-sm font-medium text-bodytext">{caption}</div>}
      <div className="-m-1.5 overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-ld">
                {columns.map((column) => (
                  <th key={column.key} className="h-10 whitespace-nowrap px-4 text-left align-middle text-sm font-semibold text-dark">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="p-6">
                    <div className="flex items-center justify-center gap-2 rounded-md bg-lightprimary px-4 py-8 text-sm font-medium text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> 데이터를 불러오는 중입니다.
                    </div>
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={columns.length} className="p-6">
                    <div role="alert" className="flex items-center justify-center gap-2 rounded-md bg-lighterror px-4 py-8 text-sm font-medium text-error">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" /> {error}
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="p-6 text-center text-sm font-medium text-bodytext">
                    <div className="rounded-md bg-gray-50 px-4 py-8">{empty}</div>
                  </td>
                </tr>
              )}
              {!loading && !error && rows.map((row, index) => (
                <tr key={index} className="border-b border-ld transition-colors last:border-b-0 hover:bg-lightprimary">
                  {columns.map((column) => <td key={column.key} className="whitespace-nowrap p-4 align-middle text-sm text-dark">{column.render(row)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
