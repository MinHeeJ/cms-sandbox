import { useEffect, useState } from 'react';
import { AttachmentDownloadButton } from './AttachmentDownloadButton';
import { attachmentApi, type Attachment } from '../api/attachmentApi';

export function AttachmentList({ documentId, refreshKey = 0, onDeleted }: { documentId?: number; refreshKey?: number; onDeleted?: () => void }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState<string>();

  async function loadAttachments() {
    if (!documentId) {
      setAttachments([]);
      return;
    }
    try {
      setError(undefined);
      setAttachments(await attachmentApi.list(documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '첨부파일을 불러오지 못했습니다.');
    }
  }

  useEffect(() => {
    void loadAttachments();
  }, [documentId, refreshKey]);

  async function deleteAttachment(id: number) {
    await attachmentApi.delete(id);
    await loadAttachments();
    onDeleted?.();
  }

  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-dark">첨부파일</h3>
      <div className="mt-3 overflow-hidden rounded-md border border-ld bg-white">
        <table className="w-full text-sm">
          <tbody>
            {error && <tr><td className="p-4 text-error" colSpan={3}>{error}</td></tr>}
            {!error && attachments.length === 0 && <tr><td className="p-4 text-bodytext" colSpan={3}>등록된 첨부파일이 없습니다.</td></tr>}
            {!error && attachments.map((attachment) => (
              <tr key={attachment.id} className="border-b border-ld transition-colors hover:bg-lightprimary">
                <td className="whitespace-nowrap p-4 font-medium text-dark">{attachment.originalFileName}</td>
                <td className="whitespace-nowrap p-4"><span className="inline-flex rounded-full bg-lightsuccess px-2.5 py-1 text-xs font-semibold text-[#079982]">사용 가능</span></td>
                <td className="whitespace-nowrap p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <AttachmentDownloadButton attachmentId={attachment.id} />
                    <button className="inline-flex h-9 items-center rounded-md bg-error px-3 text-xs font-semibold text-white" onClick={() => void deleteAttachment(attachment.id)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
