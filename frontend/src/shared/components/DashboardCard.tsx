import { ArrowUpRight, Circle } from 'lucide-react';

const toneMap = {
  info: 'bg-lightinfo text-info',
  success: 'bg-lightsuccess text-[#079982]',
  warning: 'bg-lightwarning text-[#a66f00]',
  error: 'bg-lighterror text-error'
};

export function DashboardCard({ title, value, tone = 'info', caption }: { title: string; value: string; tone?: 'info'|'success'|'warning'|'error'; caption?: string }) {
  return (
    <section className="flex h-full w-full flex-col gap-4 rounded-lg border border-ld bg-white p-6 shadow-none transition-colors hover:bg-lightprimary/40">
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${toneMap[tone]}`}>
          <Circle className="h-2 w-2 fill-current" aria-hidden="true" /> {title}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full text-bodytext transition-colors hover:bg-lightprimary hover:text-primary">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-dark">{value}</h3>
        {caption && <p className="mt-2 text-sm font-normal text-bodytext">{caption}</p>}
      </div>
    </section>
  );
}
