import { UploadCloud } from 'lucide-react';
import { attachmentApi } from '../api/attachmentApi';

export function AttachmentUploadPanel({ compact = false, documentId, onUploaded }: { compact?: boolean; documentId?: number; onUploaded?: () => void }) {
  async function upload(file?: File) {
    if (!file || !documentId) return;
    await attachmentApi.upload(documentId, { fileName: file.name, size: file.size, mimeType: file.type || 'application/octet-stream' });
    onUploaded?.();
  }

  return (
    <div className={`${compact ? 'rounded-md border border-dashed border-ld bg-gray-50 p-4' : 'rounded-lg border border-ld bg-white p-6'}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primary"><UploadCloud className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-dark">첨부파일 업로드</h3>
          <p className="mt-1 text-sm font-medium text-bodytext">PDF, Markdown, 이미지 등 허용 확장자와 10MB 제한을 검증합니다.</p>
          {!documentId && <p className="mt-3 text-xs font-semibold text-error">첨부할 문서를 먼저 선택해 주세요.</p>}
          <input className="mt-4 block w-full rounded-lg border border-ld bg-transparent px-3 py-2 text-sm text-dark file:mr-4 file:rounded-md file:border-0 file:bg-lightprimary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary focus:border-primary focus:outline-none" type="file" disabled={!documentId} onChange={(event) => void upload(event.target.files?.[0])} />
        </div>
      </div>
    </div>
  );
}
