import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../../app/layout/AdminLayout';
import { DashboardCard } from '../../../shared/components/DashboardCard';
import { DataTable } from '../../../shared/components/DataTable';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { AdminFolderTree } from '../components/AdminFolderTree';
import { DocumentForm } from '../components/DocumentForm';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { PublishActionBar } from '../components/PublishActionBar';
import { FolderReorderPanel } from '../components/FolderReorderPanel';
import { PdfImportStatus } from '../components/PdfImportStatus';
import { adminContentApi, type DocumentItem, type Folder } from '../api/adminContentApi';

export function AdminContentPage() {
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('# 새 문서\n\n표와 코드 블록을 작성하세요.');
  const [activeFolder, setActiveFolder] = useState<number>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number>();
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function loadContent() {
    setLoading(true);
    setError(undefined);
    try {
      const [folderRows, documentRows] = await Promise.all([
        adminContentApi.folders(),
        adminContentApi.documents()
      ]);
      setFolders(folderRows);
      setDocuments(documentRows);
      setActiveFolder((current) => current ?? folderRows[0]?.id);
      setSelectedDocumentId((current) => current ?? documentRows[0]?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '콘텐츠를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  useEffect(() => {
    let cancelled = false;
    adminContentApi.preview(markdown)
      .then((result) => {
        if (!cancelled) setPreviewHtml(result.html);
      })
      .catch(() => {
        if (!cancelled) setPreviewHtml(markdown.replace(/^# (.*)$/m, '<h1>$1</h1>').replace(/\n/g, '<br/>'));
      });
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  const publishedCount = useMemo(() => documents.filter((document) => document.status === 'PUBLISHED').length, [documents]);
  const reviewCount = useMemo(() => documents.filter((document) => document.status === 'DRAFT' || document.status === 'REVIEWED').length, [documents]);

  async function saveDocument() {
    if (!activeFolder) {
      setError('문서를 저장할 폴더를 선택해 주세요.');
      return;
    }
    if (!title.trim()) {
      setError('문서 제목을 입력해 주세요.');
      return;
    }
    setError(undefined);
    const saved = await adminContentApi.saveDocument({
      folderId: activeFolder,
      title: title.trim(),
      markdownBody: markdown,
      status: 'DRAFT',
      displayOrder: Date.now() % 1000000
    });
    setSelectedDocumentId(saved.id);
    setMessage('문서가 저장되었습니다.');
    await loadContent();
  }

  async function publishSelectedDocument() {
    if (!selectedDocumentId) {
      setError('발행할 문서를 먼저 저장하거나 목록에서 선택해 주세요.');
      return;
    }
    setError(undefined);
    const published = await adminContentApi.publish(selectedDocumentId);
    setSelectedDocumentId(published.id);
    setMessage('문서가 발행되었습니다.');
    await loadContent();
  }

  return (
    <AdminLayout title="콘텐츠관리" action={<button className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primaryemphasis" onClick={() => { setTitle(''); setMarkdown('# 새 문서\n\n표와 코드 블록을 작성하세요.'); setSelectedDocumentId(undefined); }}>새 문서</button>}>
      <div className="mb-6 overflow-hidden rounded-md border-0 bg-lightsecondary px-6 py-4">
        <h3 className="text-xl font-semibold text-dark">콘텐츠 운영</h3>
        <p className="mt-2 text-sm font-medium text-bodytext">폴더, 마크다운 문서, 발행 상태를 한 화면에서 관리합니다.</p>
      </div>
      {(error || message) && <div role="alert" className={`mb-6 rounded-md px-4 py-3 text-sm font-semibold ${error ? 'bg-lighterror text-error' : 'bg-lightsuccess text-[#079982]'}`}>{error || message}</div>}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-3">
          <AdminFolderTree folders={folders} activeId={activeFolder} onSelect={setActiveFolder} />
          <FolderReorderPanel />
        </div>
        <div className="col-span-12 grid gap-6 lg:col-span-9">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DashboardCard title="게시 문서" value={`${publishedCount}건`} tone="success" caption="포털 노출 대상" />
            <DashboardCard title="검토 대기" value={`${reviewCount}건`} tone="info" caption="발행 전 확인 필요" />
            <DashboardCard title="삭제 비노출" value="100%" tone="warning" caption="삭제 문서 차단" />
          </div>
          <section className="rounded-lg border border-ld bg-white p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-dark">문서 목록</h3>
                <p className="mt-1 text-sm font-medium text-bodytext">상태별 badge와 최근 수정일을 확인합니다.</p>
              </div>
              <input className="h-10 min-w-full rounded-lg border border-ld bg-transparent px-3 py-2 text-sm text-dark placeholder:text-bodytext focus:border-primary focus:outline-none sm:min-w-[320px]" placeholder="문서 제목 검색" />
            </div>
            <DataTable rows={documents} loading={loading} error={error} columns={[
              { key: 'title', header: '제목', render: (row) => <button className="font-semibold text-primary" onClick={() => { setSelectedDocumentId(row.id); setTitle(row.title); setMarkdown(row.markdownBody); setActiveFolder(row.folderId); }}>{row.title}</button> },
              { key: 'status', header: '상태', render: (row) => <StatusBadge status={row.status || 'DRAFT'} /> },
              { key: 'updated', header: '수정일', render: (row) => row.updatedAt || '-' }
            ]} />
          </section>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DocumentForm title={title} markdown={markdown} onTitle={setTitle} onMarkdown={setMarkdown} onSave={() => void saveDocument()} />
            <MarkdownPreview html={previewHtml} />
          </div>
          <PublishActionBar onPublish={() => void publishSelectedDocument()} />
          <PdfImportStatus />
        </div>
      </div>
    </AdminLayout>
  );
}
