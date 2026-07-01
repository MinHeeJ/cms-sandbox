import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-[2] border-b border-ld bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <Link to="/portal" className="text-xl font-extrabold tracking-tight text-dark">CMS Portal</Link>
          <div className="hidden items-center rounded-xl border border-ld px-3 py-2 text-sm font-medium text-bodytext md:flex">
            <Search className="mr-2 h-4 w-4" aria-hidden="true" /> 게시 문서 검색
          </div>
          <Link className="inline-flex h-10 items-center rounded-md bg-lightprimary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white" to="/admin/content">관리자 화면</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-screen-2xl px-6 py-10">{children}</main>
      <footer className="border-t border-ld px-6 py-6 text-sm font-medium text-bodytext">게시 문서와 첨부파일은 접근 권한 기준으로 제공됩니다.</footer>
    </div>
  );
}
