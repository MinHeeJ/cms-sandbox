package com.community.member.admin.application;

import com.community.member.admin.api.AdminMemberDtos;
import com.community.member.admin.authorization.AdminPermission;
import com.community.member.audit.application.AuditService;
import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.Member;
import com.community.member.member.persistence.MemberRepository;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminMemberSearchService {
    private final MemberRepository memberRepository;
    private final SensitiveDataMaskingService maskingService;
    private final AuditService auditService;

    public AdminMemberSearchService(MemberRepository memberRepository, SensitiveDataMaskingService maskingService, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.maskingService = maskingService;
        this.auditService = auditService;
    }

    public AdminMemberDtos.AdminMemberSearchPage search(
            String permissionsHeader,
            String actorId,
            String memberId,
            String nickname,
            String contactHint,
            String status,
            String role,
            String verificationLevel,
            String registeredFrom,
            String registeredTo,
            String restrictionState,
            int page,
            int size
    ) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        require(permissions, AdminPermission.MEMBER_READ, actorId, null, "member.search");
        MemberRepository.SearchResult result = memberRepository.searchMembers(
                memberId,
                nickname,
                contactHint,
                status,
                role,
                verificationLevel,
                registeredFrom,
                registeredTo,
                restrictionState,
                page,
                size);
        return new AdminMemberDtos.AdminMemberSearchPage(
                result.items().stream().map(AdminMemberDtos::toSummary).toList(),
                page,
                size,
                result.totalElements());
    }

    public AdminMemberDtos.AdminMemberDetail detail(String permissionsHeader, String actorId, String memberId) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        require(permissions, AdminPermission.MEMBER_READ, actorId, memberId, "member.detail");
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        boolean sensitiveViewed = maskingService.canViewSensitive(permissions);
        auditService.record(actorId, memberId, "member.detail.view", "allowed", "operator detail view", sensitiveViewed);
        return toDetail(member, permissions);
    }

    public AdminMemberDtos.AdminMemberDetail changeStatus(
            String permissionsHeader,
            String actorId,
            String memberId,
            AdminMemberDtos.StatusChangeRequest request
    ) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        require(permissions, AdminPermission.STATUS_WRITE, actorId, memberId, request.reason());
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        try {
            member.requireVersion(request.expectedVersion());
            member.changeStatus(request.targetStatus(), java.time.Instant.now());
            memberRepository.save(member);
            auditService.recordStatusChange(actorId, memberId, "allowed", request.reason());
            return toDetail(member, permissions);
        } catch (IllegalStateException exception) {
            auditService.recordStatusChange(actorId, memberId, "conflict", request.reason());
            throw exception;
        }
    }

    public AdminMemberDtos.AdminMemberDetail toDetail(Member member, Set<AdminPermission> permissions) {
        List<MemberDtos.ContactPointResponse> contacts = member.getContacts().stream()
                .map(contact -> maskingService.toContactResponse(contact, permissions))
                .toList();
        return new AdminMemberDtos.AdminMemberDetail(
                AdminMemberDtos.toSummary(member),
                MemberDtos.toProfile(member.getProfile()),
                contacts,
                member.getConsents().stream().map(MemberDtos::toConsent).toList(),
                member.getRoles().stream().map(AdminMemberDtos::toRole).toList(),
                member.getRestrictions().stream().map(AdminMemberDtos::toRestriction).toList(),
                List.of(),
                auditService.recentByTarget(member.getMemberId(), 10).stream().map(AdminMemberDtos::toAudit).toList());
    }

    private void require(Set<AdminPermission> permissions, AdminPermission required, String actorId, String memberId, String reason) {
        if (!permissions.contains(required)) {
            auditService.record(actorId, memberId, "member.permission.denied", "denied", reason, false);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        }
    }
}
