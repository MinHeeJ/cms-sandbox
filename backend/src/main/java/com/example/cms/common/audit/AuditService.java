package com.example.cms.common.audit;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final JdbcTemplate jdbc;
    public AuditService(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public void record(String targetType, Long targetId, String action, AuditContext context, String summary) {
        jdbc.update("insert into audit_logs(target_type,target_id,action_type,actor_id,actor_role,summary,created_at) values (?,?,?,?,?,?,now())", targetType, targetId, action, context.actorId(), context.role(), summary);
    }
}
