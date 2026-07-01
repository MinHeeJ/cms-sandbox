import { Copy } from 'lucide-react';
import { AttachmentList } from '../../attachments/components/AttachmentList';
import type { PortalDocument } from '../api/portalApi';

export function DocumentViewer({ document }: { document?: PortalDocument }) {
  if (!document) {
    return (
      <article className="markdown-body rounded-lg border border-ld bg-white p-6">
        <p className="rounded-md bg-gray-50 px-4 py-8 text-center text-sm font-medium text-bodytext">열람할 게시 문서를 선택해 주세요.</p>
      </article>
    );
  }

  return (
    <article className="markdown-body rounded-lg border border-ld bg-white p-6">
      <div className="mb-6 border-b border-ld pb-6">
        <h1 className="text-2xl font-semibold text-dark">{document.title}</h1>
        <p className="mt-2 text-sm font-medium text-bodytext">최종 수정일 {document.updatedAt || '-'} · 게시 상태 확인 완료</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: document.renderedHtml }} />
      <div className="relative my-6"><button className="absolute right-3 top-3 inline-flex h-8 items-center gap-2 rounded-md bg-white/10 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/20"><Copy className="h-3.5 w-3.5" />복사</button></div>
      <AttachmentList documentId={document.id} />
    </article>
  );
}
