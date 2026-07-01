import { Bell, Menu, Search, UserRound } from 'lucide-react';

export function AppHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-[2] border-b border-ld bg-white/95 backdrop-blur">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-dark transition-colors hover:bg-lightprimary hover:text-primary xl:hidden" aria-label="메뉴 열기">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="m-0 text-xs font-semibold uppercase text-bodytext">CMS workspace</p>
            <h2 className="m-0 mt-1 text-xl font-semibold text-dark">{title === '콘텐츠관리' ? '콘텐츠 관리' : title}</h2>
          </div>
        </div>
        <div className="hidden min-w-[280px] items-center rounded-xl border border-ld bg-white px-3 py-2 text-sm text-bodytext lg:flex">
          <Search className="mr-2 h-4 w-4" aria-hidden="true" /> 문서, 배포, 감사 로그 검색
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button className="hidden h-10 w-10 items-center justify-center rounded-full text-dark transition-colors hover:bg-lightprimary hover:text-primary sm:flex" aria-label="알림">
            <Bell className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-2 rounded-full bg-lightinfo px-3 py-2 text-xs font-semibold text-info">
            <UserRound className="h-4 w-4" aria-hidden="true" /> ADMIN
          </span>
        </div>
      </nav>
    </header>
  );
}
