const labelMap: Record<string, string> = {
  DRAFT: '초안',
  REVIEWED: '검토완료',
  PUBLISHED: '게시중',
  UNPUBLISHED: '게시중단',
  DELETED: '삭제됨',
  SUCCESS: '성공',
  FAILED: '실패',
  PARTIAL_FAILED: '부분 실패',
  HEALTHY: '정상',
  IN_SCOPE: '범위 포함',
  OUT_OF_SCOPE: '범위 제외',
  REVIEW_REQUIRED: '검토 필요',
  LOW: '낮음',
  MEDIUM: '중간',
  HIGH: '높음',
  CRITICAL: '긴급'
};

const classMap: Record<string, string> = {
  PUBLISHED: 'bg-lightsuccess text-[#079982]',
  SUCCESS: 'bg-lightsuccess text-[#079982]',
  HEALTHY: 'bg-lightsuccess text-[#079982]',
  IN_SCOPE: 'bg-lightsuccess text-[#079982]',
  REVIEWED: 'bg-lightinfo text-info',
  REVIEW_REQUIRED: 'bg-lightinfo text-info',
  UNPUBLISHED: 'bg-lightwarning text-[#a66f00]',
  PARTIAL_FAILED: 'bg-lightwarning text-[#a66f00]',
  MEDIUM: 'bg-lightwarning text-[#a66f00]',
  FAILED: 'bg-lighterror text-error',
  DELETED: 'bg-lighterror text-error',
  OUT_OF_SCOPE: 'bg-lighterror text-error',
  HIGH: 'bg-lighterror text-error',
  CRITICAL: 'bg-lighterror text-error',
  DRAFT: 'bg-gray-100 text-bodytext',
  LOW: 'bg-lightprimary text-primary'
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border-0 px-2.5 py-1 text-xs font-semibold transition-colors ${classMap[status] || 'bg-gray-100 text-bodytext'}`}>
      {labelMap[status] || status}
    </span>
  );
}
