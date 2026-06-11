package com.community.member.admin.application;

import com.community.member.admin.api.AdminMemberDtos;
import com.community.member.admin.authorization.AdminPermission;
import com.community.member.audit.application.AuditService;
import com.community.member.member.domain.Member;
import com.community.member.member.domain.RoleAssignment;
import com.community.member.member.persistence.MemberRepository;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminRoleService {
    private final MemberRepository memberRepository;
    private final AuditService auditService;

    public AdminRoleService(MemberRepository memberRepository, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.auditService = auditService;
    }

    public List<AdminMemberDtos.RoleAssignmentResponse> replaceRoles(
            String permissionsHeader,
            String actorId,
            String memberId,
            AdminMemberDtos.RoleUpdateRequest request
    ) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        if (!permissions.contains(AdminPermission.ROLE_WRITE)) {
            auditService.recordRoleChange(actorId, memberId, "denied", request.reason());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "역할 관리 권한이 없습니다.");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        member.requireVersion(request.expectedVersion());
        Instant now = Instant.now();
        member.getRoles().clear();
        request.roles().stream()
                .map(role -> new RoleAssignment(MemberRepository.id("RA"), memberId, role, "community", actorId, request.reason(), now, null, null, null))
                .forEach(member.getRoles()::add);
        member.incrementVersion();
        memberRepository.save(member);
        auditService.recordRoleChange(actorId, memberId, "allowed", request.reason());
        return member.getRoles().stream().map(AdminMemberDtos::toRole).toList();
    }
}
