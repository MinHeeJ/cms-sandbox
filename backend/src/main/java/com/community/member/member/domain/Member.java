package com.community.member.member.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Member {
    public static final String STATUS_PENDING_VERIFICATION = "pending_verification";
    public static final String STATUS_ACTIVE = "active";
    public static final String STATUS_DORMANT = "dormant";
    public static final String STATUS_SUSPENDED = "suspended";
    public static final String STATUS_WITHDRAWN = "withdrawn";
    public static final String STATUS_ANONYMIZED = "anonymized";

    private final String memberId;
    private final String publicMemberKey;
    private String status;
    private final String registrationSource;
    private String verificationLevel;
    private final Instant createdAt;
    private Instant activatedAt;
    private Instant lastLoginAt;
    private Instant lastActivityAt;
    private Instant dormantAt;
    private Instant withdrawnAt;
    private Instant anonymizedAt;
    private long version;
    private MemberProfile profile;
    private MemberCredential credential;
    private NotificationPreference notificationPreference;
    private final List<ContactPoint> contacts = new ArrayList<>();
    private final List<ConsentRecord> consents = new ArrayList<>();
    private final List<RoleAssignment> roles = new ArrayList<>();
    private final List<Restriction> restrictions = new ArrayList<>();

    public Member(String memberId, String publicMemberKey, String registrationSource, Instant createdAt) {
        this.memberId = memberId;
        this.publicMemberKey = publicMemberKey;
        this.registrationSource = registrationSource;
        this.status = STATUS_PENDING_VERIFICATION;
        this.verificationLevel = "none";
        this.createdAt = createdAt;
        this.version = 1;
    }

    public void activate(Instant now) {
        this.status = STATUS_ACTIVE;
        this.verificationLevel = "contact";
        this.activatedAt = now;
        this.lastActivityAt = now;
        this.version++;
    }

    public void changeStatus(String targetStatus, Instant now) {
        this.status = targetStatus;
        if (STATUS_DORMANT.equals(targetStatus)) {
            this.dormantAt = now;
        }
        if (STATUS_WITHDRAWN.equals(targetStatus)) {
            this.withdrawnAt = now;
        }
        if (STATUS_ANONYMIZED.equals(targetStatus)) {
            this.anonymizedAt = now;
        }
        this.version++;
    }

    public void touchLogin(Instant now) {
        this.lastLoginAt = now;
        this.lastActivityAt = now;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getPublicMemberKey() {
        return publicMemberKey;
    }

    public String getStatus() {
        return status;
    }

    public String getRegistrationSource() {
        return registrationSource;
    }

    public String getVerificationLevel() {
        return verificationLevel;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getActivatedAt() {
        return activatedAt;
    }

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public Instant getLastActivityAt() {
        return lastActivityAt;
    }

    public Instant getDormantAt() {
        return dormantAt;
    }

    public Instant getWithdrawnAt() {
        return withdrawnAt;
    }

    public Instant getAnonymizedAt() {
        return anonymizedAt;
    }

    public long getVersion() {
        return version;
    }

    public void requireVersion(long expectedVersion) {
        if (this.version != expectedVersion) {
            throw new IllegalStateException("다른 작업자가 먼저 변경했습니다. 최신 상태를 다시 불러와 주세요.");
        }
    }

    public MemberProfile getProfile() {
        return profile;
    }

    public void setProfile(MemberProfile profile) {
        this.profile = profile;
    }

    public MemberCredential getCredential() {
        return credential;
    }

    public void setCredential(MemberCredential credential) {
        this.credential = credential;
    }

    public NotificationPreference getNotificationPreference() {
        return notificationPreference;
    }

    public void setNotificationPreference(NotificationPreference notificationPreference) {
        this.notificationPreference = notificationPreference;
    }

    public List<ContactPoint> getContacts() {
        return contacts;
    }

    public List<ConsentRecord> getConsents() {
        return consents;
    }

    public List<RoleAssignment> getRoles() {
        return roles;
    }

    public List<Restriction> getRestrictions() {
        return restrictions;
    }

    public void incrementVersion() {
        this.version++;
    }
}
