package com.community.member.member.domain;

import java.time.Instant;

public class MemberCredential {
    private final String credentialId;
    private final String memberId;
    private String passwordHashRef;
    private Instant passwordChangedAt;
    private int failedLoginCount;
    private Instant lockedUntil;
    private boolean mfaEnabled;
    private Instant securityUpdatedAt;

    public MemberCredential(String credentialId, String memberId, String passwordHashRef, Instant now) {
        this.credentialId = credentialId;
        this.memberId = memberId;
        this.passwordHashRef = passwordHashRef;
        this.passwordChangedAt = now;
        this.securityUpdatedAt = now;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getPasswordHashRef() {
        return passwordHashRef;
    }

    public Instant getPasswordChangedAt() {
        return passwordChangedAt;
    }

    public int getFailedLoginCount() {
        return failedLoginCount;
    }

    public Instant getLockedUntil() {
        return lockedUntil;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public Instant getSecurityUpdatedAt() {
        return securityUpdatedAt;
    }
}
