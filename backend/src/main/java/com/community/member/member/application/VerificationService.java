package com.community.member.member.application;

import com.community.member.member.api.MemberDtos;
import com.community.member.member.domain.VerificationAttempt;
import com.community.member.member.persistence.MemberRepository;
import java.time.Duration;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VerificationService {
    private static final String TEST_CODE = "123456";

    private final MemberRepository memberRepository;

    public VerificationService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public VerificationAttempt createChallenge(String memberId, String pendingRegistrationKey, String channel, String purpose, String destination) {
        VerificationAttempt attempt = new VerificationAttempt(
                MemberRepository.id("VA"),
                memberId,
                pendingRegistrationKey,
                channel,
                purpose,
                MemberRepository.contactHash(channel, destination),
                MemberRepository.mask(channel, destination),
                TEST_CODE,
                Instant.now().plus(Duration.ofMinutes(10)));
        return memberRepository.saveVerification(attempt);
    }

    public void confirm(VerificationAttempt attempt, String verificationCode) {
        boolean passed = attempt.confirm(verificationCode, Instant.now());
        if (passed) {
            return;
        }
        if ("rate_limited".equals(attempt.getOutcome())) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "인증 시도 횟수를 초과했습니다.");
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인증 코드가 올바르지 않거나 만료되었습니다.");
    }

    public MemberDtos.VerificationChallenge toChallenge(VerificationAttempt attempt) {
        return new MemberDtos.VerificationChallenge(
                attempt.getVerificationAttemptId(),
                attempt.getChannel(),
                attempt.getPurpose(),
                attempt.getMaskedDestination(),
                attempt.getExpiresAt(),
                attempt.remainingAttempts());
    }
}
