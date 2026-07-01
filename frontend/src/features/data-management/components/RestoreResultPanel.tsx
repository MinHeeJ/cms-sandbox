import { StatusBadge } from '../../../shared/components/StatusBadge';

export function RestoreResultPanel() {
  return (
    <div className="h-full rounded-lg border border-ld bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4"><h3 className="text-lg font-semibold text-dark">복구 정합성</h3><StatusBadge status="SUCCESS" /></div>
      <p className="mt-2 text-sm font-medium text-bodytext">복구 후 DB 참조와 파일 저장소 정합성을 검증합니다.</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-lightsuccess px-4 py-3"><p className="text-xs font-semibold text-bodytext">참조</p><strong className="text-[#079982]">정상</strong></div>
        <div className="rounded-md bg-lightsuccess px-4 py-3"><p className="text-xs font-semibold text-bodytext">파일</p><strong className="text-[#079982]">정상</strong></div>
        <div className="rounded-md bg-lightprimary px-4 py-3"><p className="text-xs font-semibold text-bodytext">요청자</p><strong className="text-primary">ADMIN</strong></div>
      </div>
    </div>
  );
}
