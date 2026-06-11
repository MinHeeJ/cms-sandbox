package com.community.member.member.domain;

import java.time.Instant;

public record RoleAssignment(
        String roleAssignmentId,
        String memberId,
        String roleKey,
        String scope,
        String grantedBy,
        String reason,
        Instant grantedAt,
        Instant expiresAt,
        Instant revokedAt,
        String revokedBy
) {
}
