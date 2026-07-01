import { Archive, Database, FileText, FolderTree, Gauge, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { href: '/admin/content', label: '콘텐츠관리', icon: FolderTree },
  { href: '/portal', label: '포털 검색', icon: Search },
  { href: '/admin/attachments', label: '첨부파일관리', icon: Archive },
  { href: '/admin/operations', label: '운영관리', icon: Gauge },
  { href: '/admin/data', label: '데이터관리', icon: Database },
  { href: '/admin/project', label: '프로젝트관리', icon: FileText }
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-10 hidden h-screen w-[270px] border-r border-ld bg-white xl:block" aria-label="관리자 메뉴">
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-8 overflow-hidden">
          <h1 className="text-xl font-extrabold tracking-tight text-dark">Markdown CMS</h1>
          <p className="mt-1 text-xs font-semibold text-bodytext">운영형 콘텐츠 관리</p>
        </div>
        <div className="h-[calc(100vh-100px)] overflow-y-auto">
          <p className="mb-3 text-xs font-bold uppercase text-bodytext">pages</p>
          <nav className="grid gap-2">
            {items.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) => `group flex h-10 items-center gap-3 rounded-full px-3 text-sm font-semibold transition-colors ${isActive ? 'bg-lightprimary text-primary' : 'text-dark hover:bg-lightprimary hover:text-primary'}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-white/70"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-9 overflow-hidden rounded-lg bg-lightprimary p-6">
            <strong className="text-base font-semibold text-dark">운영 기준</strong>
            <p className="mt-2 text-sm font-medium text-bodytext">게시 문서만 포털에 노출됩니다.</p>
            <NavLink to="/admin/content" className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-[13px] font-semibold text-white transition-colors hover:bg-primaryemphasis">검토하러 가기</NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
