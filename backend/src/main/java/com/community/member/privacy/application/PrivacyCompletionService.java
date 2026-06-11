package com.community.member.privacy.application;

import com.community.member.admin.authorization.AdminPermission;
import com.community.member.audit.application.AuditService;
import com.community.member.member.domain.Member;
import com.community.member.member.persistence.MemberRepository;
import com.community.member.privacy.api.PrivacyDtos;
import com.community.member.privacy.domain.PrivacyRequest;
import java.time.Instant;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrivacyCompletionService {
    private final MemberRepository memberRepository;
    private final PrivacyRequestService privacyRequestService;
    private final AuditService auditService;

    public PrivacyCompletionService(MemberRepository memberRepository, PrivacyRequestService privacyRequestService, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.privacyRequestService = privacyRequestService;
        this.auditService = auditService;
    }

    public PrivacyDtos.PrivacyRequestResponse complete(
            String permissionsHeader,
            String actorId,
            String privacyRequestId,
            PrivacyDtos.PrivacyCompletionRequest request
    ) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        if (!permissions.contains(AdminPermission.PRIVACY_REVIEW)) {
            auditService.recordPrivacyAction(actorId, null, "permission.denied", "denied", request.completionNote());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "개인정보 요청 처리 권한이 없습니다.");
        }
        PrivacyRequest privacyRequest = privacyRequestService.find(privacyRequestId);
        if (!PrivacyRequest.STATUS_APPROVED.equals(privacyRequest.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "승인된 개인정보 요청만 완료할 수 있습니다.");
        }
        privacyRequest.complete(request.evidenceRef(), Instant.now());
        memberRepository.savePrivacyRequest(privacyRequest);
        Member member = memberRepository.findById(privacyRequest.getMemberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        if ("withdrawal".equals(privacyRequest.getRequestType())) {
            member.changeStatus(Member.STATUS_WITHDRAWN, Instant.now());
        }
        if ("anonymization".equals(privacyRequest.getRequestType())) {
            member.changeStatus(Member.STATUS_ANONYMIZED, Instant.now());
        }
        memberRepository.save(member);
        auditService.recordPrivacyAction(actorId, member.getMemberId(), "request.completed", "allowed", request.completionNote());
        return PrivacyDtos.toResponse(privacyRequest);
    }
}
