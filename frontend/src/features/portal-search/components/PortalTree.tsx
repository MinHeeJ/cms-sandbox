import { ChevronRight, FolderOpen } from 'lucide-react';
import type { PortalFolder } from '../api/portalApi';

export function PortalTree({ folders, activeId, onSelect }: { folders: PortalFolder[]; activeId?: number; onSelect: (id: number) => void }) {
  return (
    <aside className="rounded-lg border border-ld bg-white p-6">
      <h3 className="text-lg font-semibold text-dark">문서 Tree</h3>
      <p className="mb-4 mt-1 text-sm font-medium text-bodytext">게시된 폴더만 표시됩니다.</p>
      <div className="grid gap-2">
        {folders.length === 0 ? (
          <p className="rounded-md bg-gray-50 p-4 text-sm font-medium text-bodytext">게시된 폴더가 없습니다.</p>
        ) : folders.map((folder) => (
          <button key={folder.id} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${folder.id === activeId ? 'bg-lightprimary text-primary' : 'text-dark hover:bg-lightprimary hover:text-primary'}`} onClick={() => onSelect(folder.id)}>
            <span className="flex items-center gap-2"><FolderOpen className="h-4 w-4" aria-hidden="true" />{folder.name}</span><ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
    </aside>
  );
}
