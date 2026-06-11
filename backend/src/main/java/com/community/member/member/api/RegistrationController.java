package com.community.member.member.api;

import com.community.member.member.application.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members/registration")
public class RegistrationController {
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberDtos.RegistrationResponse startRegistration(@Valid @RequestBody MemberDtos.RegistrationRequest request) {
        return registrationService.start(request);
    }

    @PostMapping("/{registrationId}/verify")
    public MemberDtos.MemberAccount verifyRegistration(
            @PathVariable String registrationId,
            @Valid @RequestBody MemberDtos.VerificationConfirmRequest request
    ) {
        return registrationService.verify(registrationId, request);
    }
}
