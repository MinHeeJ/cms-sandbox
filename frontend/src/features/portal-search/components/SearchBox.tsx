import { Search } from 'lucide-react';

export function SearchBox({ query, onQuery }: { query: string; onQuery: (v:string)=>void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodytext" aria-hidden="true" /><input className="h-10 w-full rounded-xl border border-ld bg-white pl-10 pr-3 text-sm text-dark placeholder:text-bodytext focus:border-primary focus:outline-none" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="문서 제목 또는 본문 검색" /></div>
      <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primaryemphasis">검색</button>
    </div>
  );
}
