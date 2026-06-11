package com.community.member.privacy.api;

import com.community.member.privacy.application.PrivacyCompletionService;
import com.community.member.privacy.application.PrivacyRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/privacy-requests")
public class AdminPrivacyController {
    private final PrivacyRequestService privacyRequestService;
    private final PrivacyCompletionService privacyCompletionService;

    public AdminPrivacyController(PrivacyRequestService privacyRequestService, PrivacyCompletionService privacyCompletionService) {
        this.privacyRequestService = privacyRequestService;
        this.privacyCompletionService = privacyCompletionService;
    }

    @GetMapping
    public PrivacyDtos.PrivacyRequestPage searchPrivacyRequests(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestParam(required = false) String requestType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return privacyRequestService.search(permissions, requestType, status, page, size);
    }

    @GetMapping("/{privacyRequestId}")
    public PrivacyDtos.PrivacyRequestResponse getPrivacyRequest(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @PathVariable String privacyRequestId
    ) {
        return privacyRequestService.get(permissions, privacyRequestId);
    }

    @PostMapping("/{privacyRequestId}/review")
    public PrivacyDtos.PrivacyRequestResponse reviewPrivacyRequest(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String privacyRequestId,
            @Valid @RequestBody PrivacyDtos.PrivacyReviewRequest request
    ) {
        return privacyRequestService.review(permissions, actorId, privacyRequestId, request);
    }

    @PostMapping("/{privacyRequestId}/complete")
    public PrivacyDtos.PrivacyRequestResponse completePrivacyRequest(
            @RequestHeader(value = "X-Operator-Permissions", required = false) String permissions,
            @RequestHeader(value = "X-Operator-Id", defaultValue = "operator-demo") String actorId,
            @PathVariable String privacyRequestId,
            @Valid @RequestBody PrivacyDtos.PrivacyCompletionRequest request
    ) {
        return privacyCompletionService.complete(permissions, actorId, privacyRequestId, request);
    }
}
