import { Sidebar } from '../../shared/components/Sidebar';
import { AppHeader } from '../../shared/components/AppHeader';

export function AdminLayout({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className="w-full transition-all duration-200 ease-in xl:ml-[270px]">
        <AppHeader title={title} action={action} />
        <main className="mx-auto max-w-screen-2xl px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
