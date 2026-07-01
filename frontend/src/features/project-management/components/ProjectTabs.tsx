const tabs = ['일정', '범위', '인력', '위험·이슈', '산출물', '변경요청'];

export function ProjectTabs({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="프로젝트 관리 탭">
      {tabs.map((tab) => <button key={tab} role="tab" aria-selected={active === tab} className={`inline-flex h-10 items-center rounded-md px-5 text-sm font-semibold transition-colors ${active === tab ? 'bg-primary text-white' : 'bg-lightprimary text-primary hover:bg-primary hover:text-white'}`} onClick={() => onChange(tab)}>{tab}</button>)}
    </div>
  );
}
