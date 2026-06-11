import { apiRequest } from '../../api/httpClient';
import { AdminMemberDetail, AdminMemberSummary, Page, Restriction, RoleAssignment } from '../../api/types';

export interface MemberSearchFilters {
  memberId?: string;
  nickname?: string;
  contactHint?: string;
  status?: string;
  role?: string;
  verificationLevel?: string;
  registeredFrom?: string;
  registeredTo?: string;
  restrictionState?: string;
}

export function searchMembers(filters: MemberSearchFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return apiRequest<Page<AdminMemberSummary>>(`/api/v1/admin/members?${params.toString()}`);
}

export function getAdminMemberDetail(memberId: string) {
  return apiRequest<AdminMemberDetail>(`/api/v1/admin/members/${memberId}`);
}

export function changeMemberStatus(memberId: string, payload: { targetStatus: string; reason: string; expectedVersion: number }) {
  return apiRequest<AdminMemberDetail>(`/api/v1/admin/members/${memberId}/status-changes`, {
    method: 'POST',
    body: payload
  });
}

export function replaceMemberRoles(memberId: string, payload: { roles: string[]; reason: string; expectedVersion: number }) {
  return apiRequest<RoleAssignment[]>(`/api/v1/admin/members/${memberId}/roles`, {
    method: 'PUT',
    body: payload
  });
}

export function applyRestriction(
  memberId: string,
  payload: {
    restrictionType: string;
    reasonCode: string;
    reasonText: string;
    sourceCaseRef?: string | null;
    startsAt: string;
    endsAt?: string | null;
  }
) {
  return apiRequest<Restriction>(`/api/v1/admin/members/${memberId}/restrictions`, {
    method: 'POST',
    body: payload
  });
}

export function updateRestriction(memberId: string, restrictionId: string, payload: { status: string; reasonText: string }) {
  return apiRequest<Restriction>(`/api/v1/admin/members/${memberId}/restrictions/${restrictionId}`, {
    method: 'PATCH',
    body: payload
  });
}
