package com.example.cms.content;
import com.example.cms.common.audit.*;
import org.springframework.stereotype.Component;
@Component
public class ContentAuditAdapter {
    private final AuditService auditService;
    public ContentAuditAdapter(AuditService auditService) { this.auditService = auditService; }
    public void changed(String target, Long id, String action) { auditService.record(target, id, action, AuditContext.of("admin", "ADMIN", null), target + " " + action); }
}
