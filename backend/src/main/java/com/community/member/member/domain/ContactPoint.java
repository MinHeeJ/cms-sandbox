package com.community.member.member.domain;

import java.time.Instant;

public class ContactPoint {
    private final String contactPointId;
    private final String memberId;
    private final String type;
    private final String value;
    private final String valueHash;
    private String maskedValue;
    private String verificationStatus;
    private Instant verifiedAt;
    private boolean primaryForLogin;
    private boolean notificationAllowed;
    private Instant replacedAt;

    public ContactPoint(String contactPointId, String memberId, String type, String value, String valueHash, String maskedValue) {
        this.contactPointId = contactPointId;
        this.memberId = memberId;
        this.type = type;
        this.value = value;
        this.valueHash = valueHash;
        this.maskedValue = maskedValue;
        this.verificationStatus = "pending";
        this.primaryForLogin = true;
        this.notificationAllowed = true;
    }

    public void verify(Instant now) {
        this.verificationStatus = "verified";
        this.verifiedAt = now;
    }

    public void replace(Instant now) {
        this.verificationStatus = "replaced";
        this.primaryForLogin = false;
        this.notificationAllowed = false;
        this.replacedAt = now;
    }

    public String getContactPointId() {
        return contactPointId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getType() {
        return type;
    }

    public String getValue() {
        return value;
    }

    public String getValueHash() {
        return valueHash;
    }

    public String getMaskedValue() {
        return maskedValue;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public Instant getVerifiedAt() {
        return verifiedAt;
    }

    public boolean isPrimaryForLogin() {
        return primaryForLogin;
    }

    public boolean isNotificationAllowed() {
        return notificationAllowed;
    }

    public Instant getReplacedAt() {
        return replacedAt;
    }
}
