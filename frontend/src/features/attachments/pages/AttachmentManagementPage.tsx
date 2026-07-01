import { useEffect, useState } from 'react';
import { AdminLayout } from '../../../app/layout/AdminLayout';
import { AttachmentUploadPanel } from '../components/AttachmentUploadPanel';
import { AttachmentList } from '../components/AttachmentList';
import { adminContentApi, type DocumentItem } from '../../admin-content/api/adminContentApi';

export function AttachmentManagementPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string>();

  useEffect(() => {
    adminContentApi.documents()
      .then((rows) => {
        setDocuments(rows);
        setSelectedDocumentId(rows[0]?.id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : '문서 목록을 불러오지 못했습니다.'));
  }, []);

  return (
    <AdminLayout title="첨부파일관리" action={<button className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primaryemphasis">파일 등록</button>}>
      <div className="mb-6 overflow-hidden rounded-md border-0 bg-lightsecondary px-6 py-4">
        <h3 className="text-xl font-semibold text-dark">첨부파일 운영</h3>
        <p className="mt-2 text-sm font-medium text-bodytext">문서별 첨부파일 상태, 다운로드 가능 여부, 오류 사유를 관리합니다.</p>
      </div>
      {error && <div role="alert" className="mb-6 rounded-md bg-lighterror px-4 py-3 text-sm font-semibold text-error">{error}</div>}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <label className="mb-3 block text-sm font-semibold text-dark" htmlFor="attachment-document">연결 문서</label>
          <select id="attachment-document" className="mb-4 h-10 w-full rounded-lg border border-ld bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none" value={selectedDocumentId ?? ''} onChange={(event) => setSelectedDocumentId(Number(event.target.value))}>
            {documents.map((document) => <option key={document.id} value={document.id}>{document.title}</option>)}
          </select>
          <AttachmentUploadPanel documentId={selectedDocumentId} onUploaded={() => setRefreshKey((value) => value + 1)} />
        </div>
        <section className="col-span-12 rounded-lg border border-ld bg-white p-6 lg:col-span-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-dark">첨부파일 목록</h3>
              <p className="mt-1 text-sm font-medium text-bodytext">삭제 파일과 권한 오류는 다운로드 시점에 별도 상태로 표시됩니다.</p>
            </div>
            <input className="h-10 min-w-full rounded-lg border border-ld bg-transparent px-3 py-2 text-sm text-dark placeholder:text-bodytext focus:border-primary focus:outline-none sm:min-w-[320px]" placeholder="파일명 검색" />
          </div>
          <AttachmentList documentId={selectedDocumentId} refreshKey={refreshKey} onDeleted={() => setRefreshKey((value) => value + 1)} />
        </section>
      </div>
    </AdminLayout>
  );
}
