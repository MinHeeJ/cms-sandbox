package com.community.member.privacy.domain;

import java.time.Instant;

public class PrivacyRequest {
    public static final String STATUS_SUBMITTED = "submitted";
    public static final String STATUS_VERIFYING = "verifying";
    public static final String STATUS_APPROVED = "approved";
    public static final String STATUS_REJECTED = "rejected";
    public static final String STATUS_ON_HOLD = "on_hold";
    public static final String STATUS_COMPLETED = "completed";
    public static final String STATUS_CANCELED = "canceled";

    private final String privacyRequestId;
    private final String memberId;
    private final String requestType;
    private String requestedBy;
    private String status;
    private final boolean verificationRequired;
    private String holdReason;
    private String reviewerId;
    private final Instant requestedAt;
    private Instant reviewedAt;
    private Instant completedAt;
    private String evidenceRef;
    private String reason;

    public PrivacyRequest(String privacyRequestId, String memberId, String requestType, String requestedBy, String reason, Instant requestedAt) {
        this.privacyRequestId = privacyRequestId;
        this.memberId = memberId;
        this.requestType = requestType;
        this.requestedBy = requestedBy;
        this.reason = reason;
        this.status = STATUS_SUBMITTED;
        this.verificationRequired = true;
        this.requestedAt = requestedAt;
    }

    public void review(String decision, String reviewerId, String reason, String holdReason, Instant now) {
        this.reviewerId = reviewerId;
        this.reason = reason;
        this.reviewedAt = now;
        if ("approve".equals(decision)) {
            this.status = STATUS_APPROVED;
            this.holdReason = null;
        } else if ("hold".equals(decision)) {
            this.status = STATUS_ON_HOLD;
            this.holdReason = holdReason == null || holdReason.isBlank() ? reason : holdReason;
        } else {
            this.status = STATUS_REJECTED;
            this.holdReason = null;
        }
    }

    public void complete(String evidenceRef, Instant now) {
        this.status = STATUS_COMPLETED;
        this.completedAt = now;
        this.evidenceRef = evidenceRef;
    }

    public String getPrivacyRequestId() {
        return privacyRequestId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getRequestType() {
        return requestType;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public String getStatus() {
        return status;
    }

    public boolean isVerificationRequired() {
        return verificationRequired;
    }

    public String getHoldReason() {
        return holdReason;
    }

    public String getReviewerId() {
        return reviewerId;
    }

    public Instant getRequestedAt() {
        return requestedAt;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public String getEvidenceRef() {
        return evidenceRef;
    }

    public String getReason() {
        return reason;
    }
}
