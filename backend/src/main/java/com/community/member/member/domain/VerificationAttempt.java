package com.community.member.member.domain;

import java.time.Instant;

public class VerificationAttempt {
    public static final int MAX_ATTEMPTS = 5;

    private final String verificationAttemptId;
    private final String memberId;
    private final String pendingRegistrationKey;
    private final String channel;
    private final String purpose;
    private final String destinationHash;
    private final String maskedDestination;
    private final String code;
    private final Instant expiresAt;
    private int attemptCount;
    private String outcome;
    private Instant completedAt;

    public VerificationAttempt(
            String verificationAttemptId,
            String memberId,
            String pendingRegistrationKey,
            String channel,
            String purpose,
            String destinationHash,
            String maskedDestination,
            String code,
            Instant expiresAt
    ) {
        this.verificationAttemptId = verificationAttemptId;
        this.memberId = memberId;
        this.pendingRegistrationKey = pendingRegistrationKey;
        this.channel = channel;
        this.purpose = purpose;
        this.destinationHash = destinationHash;
        this.maskedDestination = maskedDestination;
        this.code = code;
        this.expiresAt = expiresAt;
        this.outcome = "pending";
    }

    public boolean confirm(String submittedCode, Instant now) {
        if (!"pending".equals(outcome)) {
            return "passed".equals(outcome);
        }
        if (now.isAfter(expiresAt)) {
            outcome = "expired";
            completedAt = now;
            return false;
        }
        attemptCount++;
        if (attemptCount > MAX_ATTEMPTS) {
            outcome = "rate_limited";
            completedAt = now;
            return false;
        }
        if (code.equals(submittedCode)) {
            outcome = "passed";
            completedAt = now;
            return true;
        }
        if (attemptCount >= MAX_ATTEMPTS) {
            outcome = "rate_limited";
            completedAt = now;
        }
        return false;
    }

    public int remainingAttempts() {
        return Math.max(0, MAX_ATTEMPTS - attemptCount);
    }

    public String getVerificationAttemptId() {
        return verificationAttemptId;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getPendingRegistrationKey() {
        return pendingRegistrationKey;
    }

    public String getChannel() {
        return channel;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getDestinationHash() {
        return destinationHash;
    }

    public String getMaskedDestination() {
        return maskedDestination;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public String getOutcome() {
        return outcome;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
}
