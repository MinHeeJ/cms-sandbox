import { CheckCircle2, Send, Trash2 } from 'lucide-react';

export function PublishActionBar({ onPublish }: { onPublish: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ld bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">발행 작업</h3>
        <p className="mt-1 text-sm font-medium text-bodytext">상태 전이를 확인한 뒤 포털 노출을 변경합니다.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-lightprimary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"><CheckCircle2 className="h-4 w-4" />검토 완료</button>
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primaryemphasis" onClick={onPublish}><Send className="h-4 w-4" />발행</button>
        <button className="inline-flex h-10 items-center rounded-md bg-lightwarning px-5 text-sm font-semibold text-[#a66f00] transition-colors hover:bg-warning hover:text-white">게시 중단</button>
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-error px-5 text-sm font-semibold text-white transition-colors hover:bg-red-600"><Trash2 className="h-4 w-4" />삭제</button>
      </div>
    </div>
  );
}
