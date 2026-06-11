package com.community.member.member.application;

import com.community.member.audit.application.AuditService;
import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.Member;
import com.community.member.member.persistence.MemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContactChangeService {
    private final AccountService accountService;
    private final MemberRepository memberRepository;
    private final VerificationService verificationService;
    private final MemberStatePolicy memberStatePolicy;
    private final AuditService auditService;

    public ContactChangeService(
            AccountService accountService,
            MemberRepository memberRepository,
            VerificationService verificationService,
            MemberStatePolicy memberStatePolicy,
            AuditService auditService
    ) {
        this.accountService = accountService;
        this.memberRepository = memberRepository;
        this.verificationService = verificationService;
        this.memberStatePolicy = memberStatePolicy;
        this.auditService = auditService;
    }

    public MemberDtos.VerificationChallenge requestChange(String memberIdHeader, String type, MemberDtos.ContactChangeRequest request) {
        String normalizedType = type == null ? "" : type.trim().toLowerCase();
        if (!"email".equals(normalizedType) && !"mobile".equals(normalizedType)) {
            throw new IllegalArgumentException("연락처 유형은 email 또는 mobile이어야 합니다.");
        }
        Member member = accountService.resolveMember(memberIdHeader);
        memberStatePolicy.assertProfileEditable(member);
        if (memberRepository.contactExists(normalizedType, MemberRepository.contactHash(normalizedType, request.newValue()), member.getMemberId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용할 수 없는 연락처입니다.");
        }
        var attempt = verificationService.createChallenge(member.getMemberId(), null, normalizedType, "contact_change", request.newValue());
        auditService.record("member:" + member.getMemberId(), member.getMemberId(), "member.contact_change.requested", "allowed", "verification challenge created", false);
        return verificationService.toChallenge(attempt);
    }
}
