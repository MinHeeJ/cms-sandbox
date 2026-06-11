package com.community.member.admin.application;

import com.community.member.admin.api.AdminMemberDtos;
import com.community.member.admin.authorization.AdminPermission;
import com.community.member.audit.application.AuditService;
import com.community.member.member.domain.Member;
import com.community.member.member.domain.Restriction;
import com.community.member.member.persistence.MemberRepository;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RestrictionService {
    private final MemberRepository memberRepository;
    private final AuditService auditService;

    public RestrictionService(MemberRepository memberRepository, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.auditService = auditService;
    }

    public AdminMemberDtos.RestrictionResponse apply(
            String permissionsHeader,
            String actorId,
            String memberId,
            AdminMemberDtos.RestrictionCreateRequest request
    ) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        if (!permissions.contains(AdminPermission.RESTRICTION_WRITE)) {
            auditService.recordRestrictionChange(actorId, memberId, "denied", request.reasonText());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "제한 관리 권한이 없습니다.");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        Restriction restriction = new Restriction(
                MemberRepository.id("RS"),
                memberId,
                request.restrictionType(),
                request.reasonCode(),
                request.reasonText(),
                request.sourceCaseRef(),
                request.startsAt(),
                request.endsAt(),
                actorId);
        member.getRestrictions().add(restriction);
        member.incrementVersion();
        memberRepository.save(member);
        auditService.recordRestrictionChange(actorId, memberId, "allowed", request.reasonText());
        return AdminMemberDtos.toRestriction(restriction);
    }

    public AdminMemberDtos.RestrictionResponse update(
            String permissionsHeader,
            String actorId,
            String memberId,
            String restrictionId,
            AdminMemberDtos.RestrictionUpdateRequest request
    ) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        if (!permissions.contains(AdminPermission.RESTRICTION_WRITE)) {
            auditService.recordRestrictionChange(actorId, memberId, "denied", request.reasonText());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "제한 관리 권한이 없습니다.");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        Restriction restriction = member.getRestrictions().stream()
                .filter(candidate -> candidate.getRestrictionId().equals(restrictionId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제한 정보를 찾을 수 없습니다."));
        restriction.update(request.status(), request.reasonText(), actorId);
        member.incrementVersion();
        memberRepository.save(member);
        auditService.recordRestrictionChange(actorId, memberId, "allowed", request.reasonText());
        return AdminMemberDtos.toRestriction(restriction);
    }
}
