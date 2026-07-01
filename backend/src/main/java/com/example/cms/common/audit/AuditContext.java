package com.example.cms.common.audit;

import java.time.Instant;

public record AuditContext(String actorId, String role, String requestId, Instant occurredAt) {
    public static AuditContext of(String actorId, String role, String requestId) { return new AuditContext(actorId == null ? "system" : actorId, role == null ? "ADMIN" : role, requestId, Instant.now()); }
}
