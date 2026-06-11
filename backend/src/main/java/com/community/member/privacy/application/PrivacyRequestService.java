package com.community.member.privacy.application;

import com.community.member.admin.authorization.AdminPermission;
import com.community.member.audit.application.AuditService;
import com.community.member.member.application.AccountService;
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
public class PrivacyRequestService {
    private final MemberRepository memberRepository;
    private final AccountService accountService;
    private final AuditService auditService;

    public PrivacyRequestService(MemberRepository memberRepository, AccountService accountService, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.accountService = accountService;
        this.auditService = auditService;
    }

    public PrivacyDtos.PrivacyRequestPage listMine(String memberIdHeader, int page, int size) {
        Member member = accountService.resolveMember(memberIdHeader);
        var all = memberRepository.privacyRequestsForMember(member.getMemberId());
        var items = all.stream().skip((long) page * size).limit(size).map(PrivacyDtos::toResponse).toList();
        return new PrivacyDtos.PrivacyRequestPage(items, page, size, all.size());
    }

    public PrivacyDtos.PrivacyRequestResponse createMine(String memberIdHeader, PrivacyDtos.CreatePrivacyRequest request) {
        Member member = accountService.resolveMember(memberIdHeader);
        PrivacyRequest privacyRequest = new PrivacyRequest(
                memberRepository.nextPrivacyRequestId(),
                member.getMemberId(),
                request.requestType(),
                "member:" + member.getMemberId(),
                request.reason(),
                Instant.now());
        memberRepository.savePrivacyRequest(privacyRequest);
        auditService.recordPrivacyAction("member:" + member.getMemberId(), member.getMemberId(), "request.created", "allowed", request.reason());
        return PrivacyDtos.toResponse(privacyRequest);
    }

    public PrivacyDtos.PrivacyRequestResponse requestWithdrawal(String memberIdHeader, PrivacyDtos.WithdrawalRequest request) {
        if (!request.confirmWithdrawal()) {
            throw new IllegalArgumentException("탈퇴 확인이 필요합니다.");
        }
        return createMine(memberIdHeader, new PrivacyDtos.CreatePrivacyRequest("withdrawal", request.reason()));
    }

    public PrivacyDtos.PrivacyRequestPage search(String permissionsHeader, String requestType, String status, int page, int size) {
        requirePrivacyPermission(permissionsHeader, null, "privacy.search");
        MemberRepository.SearchResultPrivacy result = memberRepository.searchPrivacyRequests(requestType, status, page, size);
        return new PrivacyDtos.PrivacyRequestPage(
                result.items().stream().map(PrivacyDtos::toResponse).toList(),
                page,
                size,
                result.totalElements());
    }

    public PrivacyDtos.PrivacyRequestResponse get(String permissionsHeader, String privacyRequestId) {
        requirePrivacyPermission(permissionsHeader, null, "privacy.detail");
        return PrivacyDtos.toResponse(find(privacyRequestId));
    }

    public PrivacyDtos.PrivacyRequestResponse review(
            String permissionsHeader,
            String actorId,
            String privacyRequestId,
            PrivacyDtos.PrivacyReviewRequest request
    ) {
        requirePrivacyPermission(permissionsHeader, actorId, request.reason());
        PrivacyRequest privacyRequest = find(privacyRequestId);
        privacyRequest.review(request.decision(), actorId, request.reason(), request.holdReason(), Instant.now());
        memberRepository.savePrivacyRequest(privacyRequest);
        auditService.recordPrivacyAction(actorId, privacyRequest.getMemberId(), "request.reviewed", "allowed", request.reason());
        return PrivacyDtos.toResponse(privacyRequest);
    }

    PrivacyRequest find(String privacyRequestId) {
        return memberRepository.findPrivacyRequest(privacyRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "개인정보 요청을 찾을 수 없습니다."));
    }

    private void requirePrivacyPermission(String permissionsHeader, String actorId, String reason) {
        Set<AdminPermission> permissions = AdminPermission.parse(permissionsHeader);
        if (!permissions.contains(AdminPermission.PRIVACY_REVIEW)) {
            auditService.recordPrivacyAction(actorId, null, "permission.denied", "denied", reason);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "개인정보 요청 처리 권한이 없습니다.");
        }
    }
}
