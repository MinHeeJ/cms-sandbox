package com.community.member.member.application;

import com.community.member.audit.application.AuditService;
import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.ConsentRecord;
import com.community.member.member.domain.ContactPoint;
import com.community.member.member.domain.Member;
import com.community.member.member.domain.MemberCredential;
import com.community.member.member.domain.MemberProfile;
import com.community.member.member.domain.NotificationPreference;
import com.community.member.member.domain.RoleAssignment;
import com.community.member.member.persistence.MemberRepository;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegistrationService {
    private static final Set<String> REQUIRED_CONSENTS = Set.of("terms", "privacy", "age");

    private final MemberRepository memberRepository;
    private final VerificationService verificationService;
    private final AuditService auditService;

    public RegistrationService(MemberRepository memberRepository, VerificationService verificationService, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.verificationService = verificationService;
        this.auditService = auditService;
    }

    public MemberDtos.RegistrationResponse start(MemberDtos.RegistrationRequest request) {
        String contactType = normalizeContactType(request.contactType());
        String normalizedNickname = MemberRepository.normalizeNickname(request.nickname());
        if (normalizedNickname.length() < 2) {
            throw new IllegalArgumentException("닉네임은 2자 이상이어야 합니다.");
        }
        if (memberRepository.nicknameExists(normalizedNickname, null)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용할 수 없는 닉네임입니다.");
        }
        String contactHash = MemberRepository.contactHash(contactType, request.contactValue());
        if (memberRepository.contactExists(contactType, contactHash, null)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용할 수 없는 연락처입니다.");
        }
        validateRequiredConsents(request.consents());

        String registrationId = MemberRepository.id("REG");
        Instant now = Instant.now();
        List<ConsentRecord> consents = request.consents().stream()
                .map(consent -> new ConsentRecord(
                        MemberRepository.id("CR"),
                        null,
                        consent.consentType(),
                        consent.policyVersion(),
                        REQUIRED_CONSENTS.contains(consent.consentType()),
                        consent.granted(),
                        now,
                        "registration",
                        null))
                .toList();
        var attempt = verificationService.createChallenge(null, registrationId, contactType, "registration", request.contactValue());
        memberRepository.savePending(new MemberRepository.PendingRegistration(
                registrationId,
                contactType,
                request.contactValue(),
                request.nickname().trim(),
                normalizedNickname,
                MemberRepository.hash(request.password()),
                consents,
                attempt,
                now));
        return new MemberDtos.RegistrationResponse(registrationId, verificationService.toChallenge(attempt));
    }

    public MemberDtos.MemberAccount verify(String registrationId, MemberDtos.VerificationConfirmRequest request) {
        MemberRepository.PendingRegistration pending = memberRepository.findPending(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "등록 요청을 찾을 수 없습니다."));
        verificationService.confirm(pending.verificationAttempt(), request.verificationCode());

        Instant now = Instant.now();
        String memberId = memberRepository.nextMemberId();
        Member member = new Member(memberId, "pub-" + memberId.toLowerCase(), "web", now);
        member.setProfile(new MemberProfile(MemberRepository.id("P"), memberId, pending.nickname(), pending.normalizedNickname(), now));
        member.setCredential(new MemberCredential(MemberRepository.id("C"), memberId, pending.passwordHashRef(), now));
        ContactPoint contact = new ContactPoint(
                MemberRepository.id("CP"),
                memberId,
                pending.contactType(),
                pending.contactValue(),
                MemberRepository.contactHash(pending.contactType(), pending.contactValue()),
                MemberRepository.mask(pending.contactType(), pending.contactValue()));
        contact.verify(now);
        member.getContacts().add(contact);
        pending.consents().forEach(consent -> member.getConsents().add(new ConsentRecord(
                MemberRepository.id("CR"),
                memberId,
                consent.consentType(),
                consent.policyVersion(),
                consent.required(),
                consent.granted(),
                now,
                "registration",
                null)));
        member.setNotificationPreference(new NotificationPreference(MemberRepository.id("NP"), memberId, now));
        member.getRoles().add(new RoleAssignment(MemberRepository.id("RA"), memberId, "member", "community", "system", "initial registration", now, null, null, null));
        member.activate(now);
        memberRepository.save(member);
        memberRepository.removePending(registrationId);
        auditService.record("system", memberId, "member.registration.activated", "allowed", "registration verified", false);
        return MemberDtos.toAccount(member);
    }

    private void validateRequiredConsents(List<MemberDtos.ConsentDecision> consents) {
        Set<String> granted = consents.stream()
                .filter(MemberDtos.ConsentDecision::granted)
                .map(MemberDtos.ConsentDecision::consentType)
                .collect(java.util.stream.Collectors.toSet());
        if (!granted.containsAll(REQUIRED_CONSENTS)) {
            throw new IllegalArgumentException("필수 약관 동의가 필요합니다.");
        }
    }

    private String normalizeContactType(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase();
        if (!"email".equals(normalized) && !"mobile".equals(normalized)) {
            throw new IllegalArgumentException("연락처 유형은 email 또는 mobile이어야 합니다.");
        }
        return normalized;
    }
}
