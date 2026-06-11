package com.community.member.admin.authorization;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public enum AdminPermission {
    MEMBER_READ("member:read"),
    SENSITIVE_DATA_READ("sensitive:read"),
    STATUS_WRITE("status:write"),
    ROLE_WRITE("role:write"),
    RESTRICTION_WRITE("restriction:write"),
    PRIVACY_REVIEW("privacy:review");

    private final String token;

    AdminPermission(String token) {
        this.token = token;
    }

    public String token() {
        return token;
    }

    public static Set<AdminPermission> parse(String headerValue) {
        if (headerValue == null || headerValue.isBlank()) {
            return Set.of(MEMBER_READ);
        }
        Set<String> tokens = Arrays.stream(headerValue.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toSet());
        return Arrays.stream(values())
                .filter(permission -> tokens.contains(permission.token))
                .collect(Collectors.toSet());
    }
}
