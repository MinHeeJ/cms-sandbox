import { Folder, FolderOpen } from 'lucide-react';
import type { Folder as FolderType } from '../api/adminContentApi';

export function AdminFolderTree({ folders, activeId, onSelect }: { folders: FolderType[]; activeId?: number; onSelect: (id: number) => void }) {
  return (
    <div className="rounded-lg border border-ld bg-white p-6">
      <h3 className="text-lg font-semibold text-dark">폴더 Tree</h3>
      <p className="mb-4 mt-1 text-sm font-medium text-bodytext">활성 폴더만 포털에 노출됩니다.</p>
      {folders.length === 0 ? (
        <p className="rounded-md bg-gray-50 p-4 text-sm font-medium text-bodytext">폴더를 생성하면 이곳에 표시됩니다.</p>
      ) : (
        <div className="grid gap-2">
          {folders.map((folder) => {
            const selected = folder.id === activeId;
            const Icon = selected ? FolderOpen : Folder;
            return (
              <button key={folder.id} className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${selected ? 'bg-lightprimary text-primary' : 'text-dark hover:bg-lightprimary hover:text-primary'}`} onClick={() => folder.id && onSelect(folder.id)}>
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" aria-hidden="true" />{folder.name}</span>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${folder.active ? 'bg-lightsuccess text-[#079982]' : 'bg-gray-100 text-bodytext'}`}>{folder.active ? '활성' : '비활성'}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
