package com.community.member.member.api;

import com.community.member.member.domain.ConsentRecord;
import com.community.member.member.domain.ContactPoint;
import com.community.member.member.domain.Member;
import com.community.member.member.domain.MemberProfile;
import com.community.member.member.domain.NotificationPreference;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class MemberDtos {
    private MemberDtos() {
    }

    public record RegistrationRequest(
            @NotBlank String contactType,
            @NotBlank String contactValue,
            @NotBlank @Size(min = 2, max = 20) String nickname,
            @NotBlank @Size(min = 10) String password,
            @NotEmpty List<@Valid ConsentDecision> consents
    ) {
    }

    public record ConsentDecision(
            @NotBlank String consentType,
            @NotBlank String policyVersion,
            boolean granted
    ) {
    }

    public record RegistrationResponse(String registrationId, VerificationChallenge verificationChallenge) {
    }

    public record VerificationConfirmRequest(@NotBlank @Size(min = 4, max = 12) String verificationCode) {
    }

    public record VerificationChallenge(
            String challengeId,
            String channel,
            String purpose,
            String maskedDestination,
            Instant expiresAt,
            int remainingAttempts
    ) {
    }

    public record MemberAccount(
            String memberId,
            String publicMemberKey,
            String status,
            MemberProfileResponse profile,
            List<ContactPointResponse> contacts,
            List<ConsentRecordResponse> consents,
            NotificationPreferences notificationPreferences,
            long version
    ) {
    }

    public record MemberProfileResponse(
            String nickname,
            String avatarAssetRef,
            String bio,
            String communityGrade,
            String profileVisibility,
            Instant updatedAt
    ) {
    }

    public record ProfileUpdateRequest(
            @Size(min = 2, max = 20) String nickname,
            String avatarAssetRef,
            @Size(max = 500) String bio,
            String profileVisibility,
            @NotNull Long version
    ) {
    }

    public record ContactPointResponse(
            String type,
            String maskedValue,
            String verificationStatus,
            Instant verifiedAt,
            boolean primaryForLogin,
            boolean notificationAllowed
    ) {
    }

    public record ContactChangeRequest(@NotBlank String newValue) {
    }

    public record ConsentRecordResponse(
            String consentType,
            String policyVersion,
            boolean required,
            boolean granted,
            Instant capturedAt,
            String capturedSource
    ) {
    }

    public record NotificationPreferences(
            boolean serviceNoticesEnabled,
            boolean marketingEmailEnabled,
            boolean marketingSmsEnabled,
            boolean communityDigestEnabled,
            Instant updatedAt
    ) {
    }

    public record NotificationPreferencesUpdateRequest(
            boolean marketingEmailEnabled,
            boolean marketingSmsEnabled,
            boolean communityDigestEnabled
    ) {
    }

    public static MemberAccount toAccount(Member member) {
        return new MemberAccount(
                member.getMemberId(),
                member.getPublicMemberKey(),
                member.getStatus(),
                toProfile(member.getProfile()),
                member.getContacts().stream().map(MemberDtos::toContact).toList(),
                member.getConsents().stream().map(MemberDtos::toConsent).toList(),
                toPreferences(member.getNotificationPreference()),
                member.getVersion());
    }

    public static MemberProfileResponse toProfile(MemberProfile profile) {
        return new MemberProfileResponse(
                profile.getNickname(),
                profile.getAvatarAssetRef(),
                profile.getBio(),
                profile.getCommunityGrade(),
                profile.getProfileVisibility(),
                profile.getUpdatedAt());
    }

    public static ContactPointResponse toContact(ContactPoint contact) {
        return new ContactPointResponse(
                contact.getType(),
                contact.getMaskedValue(),
                contact.getVerificationStatus(),
                contact.getVerifiedAt(),
                contact.isPrimaryForLogin(),
                contact.isNotificationAllowed());
    }

    public static ContactPointResponse toContact(ContactPoint contact, String displayValue) {
        return new ContactPointResponse(
                contact.getType(),
                displayValue,
                contact.getVerificationStatus(),
                contact.getVerifiedAt(),
                contact.isPrimaryForLogin(),
                contact.isNotificationAllowed());
    }

    public static ConsentRecordResponse toConsent(ConsentRecord consent) {
        return new ConsentRecordResponse(
                consent.consentType(),
                consent.policyVersion(),
                consent.required(),
                consent.granted(),
                consent.capturedAt(),
                consent.capturedSource());
    }

    public static NotificationPreferences toPreferences(NotificationPreference preference) {
        return new NotificationPreferences(
                preference.isServiceNoticesEnabled(),
                preference.isMarketingEmailEnabled(),
                preference.isMarketingSmsEnabled(),
                preference.isCommunityDigestEnabled(),
                preference.getUpdatedAt());
    }
}
