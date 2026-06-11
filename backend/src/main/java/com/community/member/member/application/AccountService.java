package com.community.member.member.application;

import com.community.member.audit.application.AuditService;
import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.Member;
import com.community.member.member.persistence.MemberRepository;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccountService {
    private final MemberRepository memberRepository;
    private final MemberStatePolicy memberStatePolicy;
    private final AuditService auditService;

    public AccountService(MemberRepository memberRepository, MemberStatePolicy memberStatePolicy, AuditService auditService) {
        this.memberRepository = memberRepository;
        this.memberStatePolicy = memberStatePolicy;
        this.auditService = auditService;
    }

    public Member resolveMember(String memberIdHeader) {
        if (memberIdHeader != null && !memberIdHeader.isBlank()) {
            return memberRepository.findById(memberIdHeader.trim())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."));
        }
        return memberRepository.firstMember()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보가 없습니다."));
    }

    public MemberDtos.MemberAccount getAccount(String memberIdHeader) {
        return MemberDtos.toAccount(resolveMember(memberIdHeader));
    }

    public MemberDtos.MemberAccount updateProfile(String memberIdHeader, MemberDtos.ProfileUpdateRequest request) {
        Member member = resolveMember(memberIdHeader);
        member.requireVersion(request.version());
        memberStatePolicy.assertProfileEditable(member);
        String normalizedNickname = request.nickname() == null ? member.getProfile().getNormalizedNickname() : MemberRepository.normalizeNickname(request.nickname());
        if (!normalizedNickname.equals(member.getProfile().getNormalizedNickname()) && memberRepository.nicknameExists(normalizedNickname, member.getMemberId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용할 수 없는 닉네임입니다.");
        }
        member.getProfile().update(request.nickname(), normalizedNickname, request.avatarAssetRef(), request.bio(), request.profileVisibility(), Instant.now());
        member.incrementVersion();
        memberRepository.save(member);
        auditService.record("member:" + member.getMemberId(), member.getMemberId(), "member.profile.update", "allowed", "self service update", false);
        return MemberDtos.toAccount(member);
    }

    public MemberDtos.NotificationPreferences getPreferences(String memberIdHeader) {
        return MemberDtos.toPreferences(resolveMember(memberIdHeader).getNotificationPreference());
    }

    public MemberDtos.NotificationPreferences updatePreferences(String memberIdHeader, MemberDtos.NotificationPreferencesUpdateRequest request) {
        Member member = resolveMember(memberIdHeader);
        memberStatePolicy.assertProfileEditable(member);
        member.getNotificationPreference().update(
                request.marketingEmailEnabled(),
                request.marketingSmsEnabled(),
                request.communityDigestEnabled(),
                Instant.now());
        member.incrementVersion();
        memberRepository.save(member);
        auditService.record("member:" + member.getMemberId(), member.getMemberId(), "member.preferences.update", "allowed", "self service update", false);
        return MemberDtos.toPreferences(member.getNotificationPreference());
    }
}
