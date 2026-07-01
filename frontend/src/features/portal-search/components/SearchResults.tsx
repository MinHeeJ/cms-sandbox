import { useEffect, useState } from 'react';
import { portalApi, type SearchResult } from '../api/portalApi';

export function SearchResults({ query, onOpen }: { query: string; onOpen: (id: number) => void }) {
  const [rows, setRows] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string>();
  const visible = query.trim().length > 1;

  useEffect(() => {
    let cancelled = false;
    if (!visible) {
      setRows([]);
      return;
    }
    portalApi.search(query)
      .then((result) => {
        if (!cancelled) setRows(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '검색에 실패했습니다.');
      });
    return () => {
      cancelled = true;
    };
  }, [query, visible]);

  return (
    <div className="rounded-lg border border-ld bg-white p-6">
      <h3 className="text-lg font-semibold text-dark">검색 결과</h3>
      <p className="mt-1 text-sm font-medium text-bodytext">검색어: {query}</p>
      {!visible && <p className="mt-6 rounded-md bg-gray-50 px-4 py-8 text-center text-sm font-medium text-bodytext">검색어를 2자 이상 입력해 주세요.</p>}
      {visible && error && <p role="alert" className="mt-6 rounded-md bg-lighterror px-4 py-8 text-center text-sm font-medium text-error">{error}</p>}
      {visible && !error && rows.length === 0 && <p className="mt-6 rounded-md bg-gray-50 px-4 py-8 text-center text-sm font-medium text-bodytext">검색 결과가 없습니다.</p>}
      {visible && !error && rows.map((row) => (
        <button key={row.id} className="mt-6 block w-full rounded-md border border-ld p-4 text-left transition-colors hover:bg-lightprimary" onClick={() => onOpen(row.id)}>
          <strong className="text-dark">{row.title}</strong>
          <p className="mt-1 text-sm font-medium text-bodytext">{row.summary}</p>
        </button>
      ))}
    </div>
  );
}
