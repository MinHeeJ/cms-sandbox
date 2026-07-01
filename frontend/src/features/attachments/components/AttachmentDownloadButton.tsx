import { useState } from 'react';
import { attachmentApi } from '../api/attachmentApi';

export function AttachmentDownloadButton({ attachmentId }: { attachmentId?: number }) {
  const [message, setMessage] = useState<string>();

  async function download() {
    if (!attachmentId) return;
    const attachment = await attachmentApi.download(attachmentId);
    setMessage(`${attachment.originalFileName} 다운로드 준비 완료`);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button className="inline-flex h-9 items-center rounded-md bg-lightprimary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white" onClick={() => void download()}>다운로드</button>
      {message && <span className="text-xs font-semibold text-primary">{message}</span>}
    </span>
  );
}
