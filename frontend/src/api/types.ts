export interface VerificationChallenge {
  challengeId: string;
  channel: string;
  purpose: string;
  maskedDestination?: string;
  expiresAt: string;
  remainingAttempts: number;
}

export interface RegistrationResponse {
  registrationId: string;
  verificationChallenge: VerificationChallenge;
}

export interface MemberProfile {
  nickname: string;
  avatarAssetRef?: string | null;
  bio?: string | null;
  communityGrade: string;
  profileVisibility: string;
  updatedAt: string;
}

export interface ContactPoint {
  type: string;
  maskedValue: string;
  verificationStatus: string;
  verifiedAt?: string | null;
  primaryForLogin: boolean;
  notificationAllowed: boolean;
}

export interface ConsentRecord {
  consentType: string;
  policyVersion: string;
  required: boolean;
  granted: boolean;
  capturedAt: string;
  capturedSource: string;
}

export interface NotificationPreferences {
  serviceNoticesEnabled: boolean;
  marketingEmailEnabled: boolean;
  marketingSmsEnabled: boolean;
  communityDigestEnabled: boolean;
  updatedAt: string;
}

export interface MemberAccount {
  memberId: string;
  publicMemberKey: string;
  status: string;
  profile: MemberProfile;
  contacts: ContactPoint[];
  consents: ConsentRecord[];
  notificationPreferences: NotificationPreferences;
  version: number;
}

export interface AdminMemberSummary {
  memberId: string;
  nickname: string;
  maskedEmail?: string | null;
  maskedMobile?: string | null;
  status: string;
  roles: string[];
  verificationLevel: string;
  joinedAt: string;
  lastActivityAt?: string | null;
  version: number;
}

export interface RoleAssignment {
  roleAssignmentId: string;
  roleKey: string;
  scope: string;
  grantedAt: string;
  expiresAt?: string | null;
}

export interface Restriction {
  restrictionId: string;
  restrictionType: string;
  status: string;
  reasonCode: string;
  reasonText: string;
  sourceCaseRef?: string | null;
  startsAt: string;
  endsAt?: string | null;
}

export interface AuditEvent {
  auditEventId: string;
  actorId: string;
  targetMemberId?: string | null;
  actionType: string;
  outcome: string;
  reason?: string | null;
  sensitiveDataViewed: boolean;
  createdAt: string;
}

export interface AdminMemberDetail {
  summary: AdminMemberSummary;
  profile: MemberProfile;
  contacts: ContactPoint[];
  consents: ConsentRecord[];
  roles: RoleAssignment[];
  restrictions: Restriction[];
  recentAuditEvents: AuditEvent[];
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
}

export interface PrivacyRequest {
  privacyRequestId: string;
  memberId: string;
  requestType: string;
  status: string;
  requestedAt: string;
  reviewedAt?: string | null;
  completedAt?: string | null;
  holdReason?: string | null;
  evidenceRef?: string | null;
}
