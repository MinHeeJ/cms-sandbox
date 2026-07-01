import { useEffect, useState } from 'react';
import { PortalLayout } from '../../../app/layout/PortalLayout';
import { PortalBreadcrumb } from '../components/PortalBreadcrumb';
import { PortalTree } from '../components/PortalTree';
import { SearchBox } from '../components/SearchBox';
import { SearchResults } from '../components/SearchResults';
import { DocumentViewer } from '../components/DocumentViewer';
import { portalApi, type PortalDocument, type PortalFolder } from '../api/portalApi';

export function PortalHomePage() {
  const [query, setQuery] = useState('');
  const [folders, setFolders] = useState<PortalFolder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<number>();
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<PortalDocument>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    portalApi.tree()
      .then((folderRows) => {
        setFolders(folderRows);
        setActiveFolderId(folderRows[0]?.id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : '포털 트리를 불러오지 못했습니다.'));
  }, []);

  useEffect(() => {
    if (!activeFolderId) return;
    portalApi.children(activeFolderId)
      .then((documentRows) => {
        setDocuments(documentRows);
        const first = documentRows[0];
        if (first) {
          return portalApi.document(first.id).then(setActiveDocument);
        }
        setActiveDocument(undefined);
        return undefined;
      })
      .catch((err) => setError(err instanceof Error ? err.message : '문서를 불러오지 못했습니다.'));
  }, [activeFolderId]);

  async function openDocument(documentId: number) {
    setError(undefined);
    const document = await portalApi.document(documentId);
    setActiveDocument(document);
    setQuery('');
  }

  return (
    <PortalLayout>
      <div className="mb-6 overflow-hidden rounded-md border-0 bg-lightsecondary px-6 py-4">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5"><h2 className="text-xl font-semibold text-dark">사용자 포털</h2><p className="mt-2 text-sm font-medium text-bodytext">게시 문서를 3단계 이내로 탐색하고 검색합니다.</p></div>
          <div className="lg:col-span-7"><SearchBox query={query} onQuery={setQuery} /></div>
        </div>
      </div>
      {error && <div role="alert" className="mb-6 rounded-md bg-lighterror px-4 py-3 text-sm font-semibold text-error">{error}</div>}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <PortalTree folders={folders} activeId={activeFolderId} onSelect={setActiveFolderId} />
          {documents.length > 0 && (
            <div className="mt-4 grid gap-2 rounded-lg border border-ld bg-white p-4">
              {documents.map((document) => <button key={document.id} className="rounded-md px-3 py-2 text-left text-sm font-semibold text-dark hover:bg-lightprimary hover:text-primary" onClick={() => void openDocument(document.id)}>{document.title}</button>)}
            </div>
          )}
        </div>
        <div className="col-span-12 grid gap-6 lg:col-span-9"><PortalBreadcrumb />{query ? <SearchResults query={query} onOpen={(id) => void openDocument(id)} /> : <DocumentViewer document={activeDocument} />}</div>
      </div>
    </PortalLayout>
  );
}
