package com.community.member.privacy.api;

import com.community.member.privacy.domain.PrivacyRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public final class PrivacyDtos {
    private PrivacyDtos() {
    }

    public record CreatePrivacyRequest(@NotBlank String requestType, @Size(max = 1000) String reason) {
    }

    public record WithdrawalRequest(boolean confirmWithdrawal, @Size(max = 1000) String reason) {
    }

    public record PrivacyReviewRequest(
            @NotBlank String decision,
            @NotBlank @Size(min = 5, max = 1000) String reason,
            String holdReason
    ) {
    }

    public record PrivacyCompletionRequest(@NotBlank @Size(min = 5, max = 1000) String completionNote, String evidenceRef) {
    }

    public record PrivacyRequestResponse(
            String privacyRequestId,
            String memberId,
            String requestType,
            String status,
            Instant requestedAt,
            Instant reviewedAt,
            Instant completedAt,
            String holdReason,
            String evidenceRef
    ) {
    }

    public record PrivacyRequestPage(List<PrivacyRequestResponse> items, int page, int size, long totalElements) {
    }

    public static PrivacyRequestResponse toResponse(PrivacyRequest request) {
        return new PrivacyRequestResponse(
                request.getPrivacyRequestId(),
                request.getMemberId(),
                request.getRequestType(),
                request.getStatus(),
                request.getRequestedAt(),
                request.getReviewedAt(),
                request.getCompletedAt(),
                request.getHoldReason(),
                request.getEvidenceRef());
    }
}
