import { apiRequest } from '../../api/httpClient';
import { MemberAccount, NotificationPreferences, VerificationChallenge } from '../../api/types';

export function getMyAccount() {
  return apiRequest<MemberAccount>('/api/v1/members/me');
}

export function updateMyProfile(payload: {
  nickname?: string;
  avatarAssetRef?: string | null;
  bio?: string | null;
  profileVisibility?: string;
  version: number;
}) {
  return apiRequest<MemberAccount>('/api/v1/members/me', {
    method: 'PATCH',
    body: payload
  });
}

export function requestContactChange(type: string, newValue: string) {
  return apiRequest<VerificationChallenge>(`/api/v1/members/me/contact-points/${type}/change`, {
    method: 'POST',
    body: { newValue }
  });
}

export function getNotificationPreferences() {
  return apiRequest<NotificationPreferences>('/api/v1/members/me/notification-preferences');
}

export function updateNotificationPreferences(payload: {
  marketingEmailEnabled: boolean;
  marketingSmsEnabled: boolean;
  communityDigestEnabled: boolean;
}) {
  return apiRequest<NotificationPreferences>('/api/v1/members/me/notification-preferences', {
    method: 'PUT',
    body: payload
  });
}
