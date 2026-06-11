import { apiRequest } from '../../api/httpClient';
import { MemberAccount, RegistrationResponse } from '../../api/types';

export interface RegistrationPayload {
  contactType: 'email' | 'mobile';
  contactValue: string;
  nickname: string;
  password: string;
  consents: Array<{ consentType: string; policyVersion: string; granted: boolean }>;
}

export function startRegistration(payload: RegistrationPayload) {
  return apiRequest<RegistrationResponse>('/api/v1/members/registration', {
    method: 'POST',
    body: payload
  });
}

export async function verifyRegistration(registrationId: string, verificationCode: string) {
  const account = await apiRequest<MemberAccount>(`/api/v1/members/registration/${registrationId}/verify`, {
    method: 'POST',
    body: { verificationCode }
  });
  localStorage.setItem('memberId', account.memberId);
  return account;
}
