package com.community.member.member.api;

import com.community.member.member.application.AccountService;
import com.community.member.member.application.ContactChangeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members/me")
public class MemberSelfServiceController {
    private final AccountService accountService;
    private final ContactChangeService contactChangeService;

    public MemberSelfServiceController(AccountService accountService, ContactChangeService contactChangeService) {
        this.accountService = accountService;
        this.contactChangeService = contactChangeService;
    }

    @GetMapping
    public MemberDtos.MemberAccount getMyAccount(@RequestHeader(value = "X-Member-Id", required = false) String memberId) {
        return accountService.getAccount(memberId);
    }

    @PatchMapping
    public MemberDtos.MemberAccount updateMyProfile(
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @Valid @RequestBody MemberDtos.ProfileUpdateRequest request
    ) {
        return accountService.updateProfile(memberId, request);
    }

    @PostMapping("/contact-points/{type}/change")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public MemberDtos.VerificationChallenge requestContactChange(
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @PathVariable String type,
            @Valid @RequestBody MemberDtos.ContactChangeRequest request
    ) {
        return contactChangeService.requestChange(memberId, type, request);
    }

    @GetMapping("/notification-preferences")
    public MemberDtos.NotificationPreferences getNotificationPreferences(@RequestHeader(value = "X-Member-Id", required = false) String memberId) {
        return accountService.getPreferences(memberId);
    }

    @PutMapping("/notification-preferences")
    public MemberDtos.NotificationPreferences updateNotificationPreferences(
            @RequestHeader(value = "X-Member-Id", required = false) String memberId,
            @RequestBody MemberDtos.NotificationPreferencesUpdateRequest request
    ) {
        return accountService.updatePreferences(memberId, request);
    }
}
