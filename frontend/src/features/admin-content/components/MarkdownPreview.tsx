export function MarkdownPreview({ html }: { html: string }) {
  return (
    <div className="markdown-body rounded-lg border border-ld bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">미리보기</h3>
        <p className="mt-1 text-sm font-medium text-bodytext">DocumentViewer와 동일한 본문 폭과 overflow 규칙을 사용합니다.</p>
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html || '<p class="text-bodytext">미리보기 결과가 여기에 표시됩니다.</p>' }} />
    </div>
  );
}
