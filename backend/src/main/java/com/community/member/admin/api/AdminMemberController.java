package com.community.member.admin.api;

import com.community.member.admin.application.AdminMemberSearchService;
import com.community.member.admin.application.AdminRoleService;
import com.community.member.admin.application.RestrictionService;
import com.community.member.audit.application.AuditService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/members")
public class AdminMemberController {
    private final AdminMemberSearchService searchService;
    private final AdminRoleService roleService;
    private final RestrictionService restrictionService;
    private final AuditService auditService;

    public AdminMemberController(
            AdminMemberSearchService searchService,
            AdminRoleService roleService,
            RestrictionService restrictionService,
            AuditService auditService
    ) {
        this.searchService = searchService;
        this.roleService = roleService;
        this.restrictionService = restrictionService;
        this.auditService = auditService;
    }

    @GetMapping
    public AdminMemberDtos.AdminMemberSearchPage searchMembers(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @RequestParam(required = false) String memberId,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String contactHint,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String verificationLevel,
            @RequestParam(required = false) String registeredFrom,
            @RequestParam(required = false) String registeredTo,
            @RequestParam(required = false) String restrictionState,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return searchService.search(permissions, actorId, memberId, nickname, contactHint, status, role, verificationLevel, registeredFrom, registeredTo, restrictionState, page, size);
    }

    @GetMapping("/{memberId}")
    public AdminMemberDtos.AdminMemberDetail getAdminMemberDetail(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String memberId
    ) {
        return searchService.detail(permissions, actorId, memberId);
    }

    @PostMapping("/{memberId}/status-changes")
    public AdminMemberDtos.AdminMemberDetail changeMemberStatus(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String memberId,
            @Valid @RequestBody AdminMemberDtos.StatusChangeRequest request
    ) {
        return searchService.changeStatus(permissions, actorId, memberId, request);
    }

    @PutMapping("/{memberId}/roles")
    public List<AdminMemberDtos.RoleAssignmentResponse> replaceMemberRoles(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String memberId,
            @Valid @RequestBody AdminMemberDtos.RoleUpdateRequest request
    ) {
        return roleService.replaceRoles(permissions, actorId, memberId, request);
    }

    @PostMapping("/{memberId}/restrictions")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminMemberDtos.RestrictionResponse applyRestriction(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String memberId,
            @Valid @RequestBody AdminMemberDtos.RestrictionCreateRequest request
    ) {
        return restrictionService.apply(permissions, actorId, memberId, request);
    }

    @PatchMapping("/{memberId}/restrictions/{restrictionId}")
    public AdminMemberDtos.RestrictionResponse updateRestriction(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String memberId,
            @PathVariable String restrictionId,
            @Valid @RequestBody AdminMemberDtos.RestrictionUpdateRequest request
    ) {
        return restrictionService.update(permissions, actorId, memberId, restrictionId, request);
    }

    @GetMapping("/{memberId}/audit-events")
    public AdminMemberDtos.AuditEventPage listMemberAuditEvents(
            @PathVariable String memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return new AdminMemberDtos.AuditEventPage(
                auditService.findByTarget(memberId, page, size).stream().map(AdminMemberDtos::toAudit).toList(),
                page,
                size,
                auditService.countByTarget(memberId));
    }
}
