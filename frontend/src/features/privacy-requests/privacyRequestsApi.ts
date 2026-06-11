import { apiRequest } from '../../api/httpClient';
import { Page, PrivacyRequest } from '../../api/types';

export function listMyPrivacyRequests() {
  return apiRequest<Page<PrivacyRequest>>('/api/v1/members/me/privacy-requests');
}

export function createMyPrivacyRequest(payload: { requestType: string; reason: string }) {
  return apiRequest<PrivacyRequest>('/api/v1/members/me/privacy-requests', {
    method: 'POST',
    body: payload
  });
}

export function requestWithdrawal(reason: string) {
  return apiRequest<PrivacyRequest>('/api/v1/members/me/withdrawal', {
    method: 'POST',
    body: { confirmWithdrawal: true, reason }
  });
}

export function searchPrivacyRequests(filters: { requestType?: string; status?: string }) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return apiRequest<Page<PrivacyRequest>>(`/api/v1/admin/privacy-requests?${params.toString()}`);
}

export function getPrivacyRequest(privacyRequestId: string) {
  return apiRequest<PrivacyRequest>(`/api/v1/admin/privacy-requests/${privacyRequestId}`);
}

export function reviewPrivacyRequest(privacyRequestId: string, payload: { decision: string; reason: string; holdReason?: string }) {
  return apiRequest<PrivacyRequest>(`/api/v1/admin/privacy-requests/${privacyRequestId}/review`, {
    method: 'POST',
    body: payload
  });
}

export function completePrivacyRequest(privacyRequestId: string, payload: { completionNote: string; evidenceRef?: string }) {
  return apiRequest<PrivacyRequest>(`/api/v1/admin/privacy-requests/${privacyRequestId}/complete`, {
    method: 'POST',
    body: payload
  });
}
