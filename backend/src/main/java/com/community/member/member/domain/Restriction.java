package com.community.member.member.domain;

import java.time.Instant;

public class Restriction {
    private final String restrictionId;
    private final String memberId;
    private final String restrictionType;
    private String status;
    private final String reasonCode;
    private String reasonText;
    private final String sourceCaseRef;
    private final Instant startsAt;
    private final Instant endsAt;
    private final String createdBy;
    private String liftedBy;

    public Restriction(
            String restrictionId,
            String memberId,
            String restrictionType,
            String reasonCode,
            String reasonText,
            String sourceCaseRef,
            Instant startsAt,
            Instant endsAt,
            String createdBy
    ) {
        this.restrictionId = restrictionId;
        this.memberId = memberId;
        this.restrictionType = restrictionType;
        this.status = "active";
        this.reasonCode = reasonCode;
        this.reasonText = reasonText;
        this.sourceCaseRef = sourceCaseRef;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.createdBy = createdBy;
    }

    public void update(String status, String reasonText, String actorId) {
        this.status = status;
        this.reasonText = reasonText;
        if ("lifted".equals(status)) {
            this.liftedBy = actorId;
        }
    }

    public String getRestrictionId() {
        return restrictionId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getRestrictionType() {
        return restrictionType;
    }

    public String getStatus() {
        return status;
    }

    public String getReasonCode() {
        return reasonCode;
    }

    public String getReasonText() {
        return reasonText;
    }

    public String getSourceCaseRef() {
        return sourceCaseRef;
    }

    public Instant getStartsAt() {
        return startsAt;
    }

    public Instant getEndsAt() {
        return endsAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getLiftedBy() {
        return liftedBy;
    }
}
