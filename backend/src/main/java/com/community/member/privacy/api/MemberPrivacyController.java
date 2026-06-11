package com.community.member.privacy.api;

import com.community.member.privacy.application.PrivacyRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members/me")
public class MemberPrivacyController {
    private final PrivacyRequestService privacyRequestService;

    public MemberPrivacyController(PrivacyRequestService privacyRequestService) {
        this.privacyRequestService = privacyRequestService;
    }

    @GetMapping("/privacy-requests")
    public PrivacyDtos.PrivacyRequestPage listMyPrivacyRequests(
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return privacyRequestService.listMine(memberId, page, size);
    }

    @PostMapping("/privacy-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public PrivacyDtos.PrivacyRequestResponse createMyPrivacyRequest(
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @Valid @RequestBody PrivacyDtos.CreatePrivacyRequest request
    ) {
        return privacyRequestService.createMine(memberId, request);
    }

    @PostMapping("/withdrawal")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public PrivacyDtos.PrivacyRequestResponse requestWithdrawal(
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @Valid @RequestBody PrivacyDtos.WithdrawalRequest request
    ) {
        return privacyRequestService.requestWithdrawal(memberId, request);
    }
}
