package com.community.member.admin.api;

import com.community.member.audit.application.AuditService;
import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.Member;
import com.community.member.member.domain.Restriction;
import com.community.member.member.domain.RoleAssignment;
import com.community.member.privacy.api.PrivacyDtos;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class AdminMemberDtos {
    private AdminMemberDtos() {
    }

    public record AdminMemberSummary(
            String memberId,
            String nickname,
            String maskedEmail,
            String maskedMobile,
            String status,
            List<String> roles,
            String verificationLevel,
            Instant joinedAt,
            Instant lastActivityAt,
            long version
    ) {
    }

    public record AdminMemberSearchPage(List<AdminMemberSummary> items, int page, int size, long totalElements) {
    }

    public record AdminMemberDetail(
            AdminMemberSummary summary,
            MemberDtos.MemberProfileResponse profile,
            List<MemberDtos.ContactPointResponse> contacts,
            List<MemberDtos.ConsentRecordResponse> consents,
            List<RoleAssignmentResponse> roles,
            List<RestrictionResponse> restrictions,
            List<PrivacyDtos.PrivacyRequestResponse> privacyRequests,
            List<AuditEventResponse> recentAuditEvents
    ) {
    }

    public record StatusChangeRequest(
            @NotBlank String targetStatus,
            @NotBlank @Size(min = 5, max = 1000) String reason,
            Instant effectiveUntil,
            @NotNull Long expectedVersion
    ) {
    }

    public record RoleUpdateRequest(
            @NotEmpty List<String> roles,
            @NotBlank @Size(min = 5, max = 1000) String reason,
            @NotNull Long expectedVersion
    ) {
    }

    public record RoleAssignmentResponse(String roleAssignmentId, String roleKey, String scope, Instant grantedAt, Instant expiresAt) {
    }

    public record RestrictionCreateRequest(
            @NotBlank String restrictionType,
            @NotBlank String reasonCode,
            @NotBlank @Size(min = 5, max = 1000) String reasonText,
            String sourceCaseRef,
            @NotNull Instant startsAt,
            Instant endsAt
    ) {
    }

    public record RestrictionUpdateRequest(
            @NotBlank String status,
            @NotBlank @Size(min = 5, max = 1000) String reasonText
    ) {
    }

    public record RestrictionResponse(
            String restrictionId,
            String restrictionType,
            String status,
            String reasonCode,
            String reasonText,
            String sourceCaseRef,
            Instant startsAt,
            Instant endsAt
    ) {
    }

    public record AuditEventResponse(
            String auditEventId,
            String actorId,
            String targetMemberId,
            String actionType,
            String outcome,
            String reason,
            boolean sensitiveDataViewed,
            Instant createdAt
    ) {
    }

    public record AuditEventPage(List<AuditEventResponse> items, int page, int size, long totalElements) {
    }

    public static AdminMemberSummary toSummary(Member member) {
        String maskedEmail = member.getContacts().stream()
                .filter(contact -> "email".equals(contact.getType()))
                .findFirst()
                .map(contact -> contact.getMaskedValue())
                .orElse(null);
        String maskedMobile = member.getContacts().stream()
                .filter(contact -> "mobile".equals(contact.getType()))
                .findFirst()
                .map(contact -> contact.getMaskedValue())
                .orElse(null);
        return new AdminMemberSummary(
                member.getMemberId(),
                member.getProfile().getNickname(),
                maskedEmail,
                maskedMobile,
                member.getStatus(),
                member.getRoles().stream().map(RoleAssignment::roleKey).toList(),
                member.getVerificationLevel(),
                member.getCreatedAt(),
                member.getLastActivityAt(),
                member.getVersion());
    }

    public static RoleAssignmentResponse toRole(RoleAssignment role) {
        return new RoleAssignmentResponse(role.roleAssignmentId(), role.roleKey(), role.scope(), role.grantedAt(), role.expiresAt());
    }

    public static RestrictionResponse toRestriction(Restriction restriction) {
        return new RestrictionResponse(
                restriction.getRestrictionId(),
                restriction.getRestrictionType(),
                restriction.getStatus(),
                restriction.getReasonCode(),
                restriction.getReasonText(),
                restriction.getSourceCaseRef(),
                restriction.getStartsAt(),
                restriction.getEndsAt());
    }

    public static AuditEventResponse toAudit(AuditService.AuditEvent event) {
        return new AuditEventResponse(
                event.auditEventId(),
                event.actorId(),
                event.targetMemberId(),
                event.actionType(),
                event.outcome(),
                event.reason(),
                event.sensitiveDataViewed(),
                event.createdAt());
    }
}
