import { api } from '../../../shared/api/client';

export interface PortalFolder { id: number; parentId: number | null; name: string; active: boolean; displayOrder: number; }
export interface PortalDocument { id: number; folderId: number; title: string; markdownBody?: string; renderedHtml: string; updatedAt: string; }
export interface SearchResult { id: number; title: string; summary: string; updatedAt?: string; }

export const portalApi = {
  tree: () => api.get<PortalFolder[]>('/api/portal/tree'),
  children: (folderId: number) => api.get<PortalDocument[]>(`/api/portal/folders/${folderId}/children`),
  document: (id: number) => api.get<PortalDocument>(`/api/portal/documents/${id}`),
  search: (query: string) => api.get<SearchResult[]>(`/api/portal/search?query=${encodeURIComponent(query)}`)
};
