package com.community.member.member.domain;

import java.time.Instant;

public record ConsentRecord(
        String consentRecordId,
        String memberId,
        String consentType,
        String policyVersion,
        boolean required,
        boolean granted,
        Instant capturedAt,
        String capturedSource,
        Instant revokedAt
) {
}
