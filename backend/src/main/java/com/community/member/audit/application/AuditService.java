package com.community.member.audit.application;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final List<AuditEvent> events = new CopyOnWriteArrayList<>();

    public AuditEvent record(
            String actorId,
            String targetMemberId,
            String actionType,
            String outcome,
            String reason,
            boolean sensitiveDataViewed
    ) {
        AuditEvent event = new AuditEvent(
                "AE-" + UUID.randomUUID(),
                actorId == null || actorId.isBlank() ? "system" : actorId,
                targetMemberId,
                actionType,
                outcome,
                reason,
                sensitiveDataViewed,
                Instant.now());
        events.add(event);
        return event;
    }

    public AuditEvent recordStatusChange(String actorId, String targetMemberId, String outcome, String reason) {
        return record(actorId, targetMemberId, "member.status.change", outcome, reason, false);
    }

    public AuditEvent recordRoleChange(String actorId, String targetMemberId, String outcome, String reason) {
        return record(actorId, targetMemberId, "member.roles.replace", outcome, reason, false);
    }

    public AuditEvent recordRestrictionChange(String actorId, String targetMemberId, String outcome, String reason) {
        return record(actorId, targetMemberId, "member.restriction.change", outcome, reason, false);
    }

    public AuditEvent recordPrivacyAction(String actorId, String targetMemberId, String actionType, String outcome, String reason) {
        return record(actorId, targetMemberId, "privacy." + actionType, outcome, reason, false);
    }

    public List<AuditEvent> findByTarget(String targetMemberId, int page, int size) {
        return events.stream()
                .filter(event -> targetMemberId == null || targetMemberId.equals(event.targetMemberId()))
                .sorted(Comparator.comparing(AuditEvent::createdAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    public long countByTarget(String targetMemberId) {
        return events.stream()
                .filter(event -> targetMemberId == null || targetMemberId.equals(event.targetMemberId()))
                .count();
    }

    public List<AuditEvent> recentByTarget(String targetMemberId, int limit) {
        return new ArrayList<>(findByTarget(targetMemberId, 0, limit));
    }

    public record AuditEvent(
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
}
