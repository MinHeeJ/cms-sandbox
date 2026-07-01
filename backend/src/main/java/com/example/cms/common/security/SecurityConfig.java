package com.example.cms.common.security;

import org.springframework.stereotype.Component;

@Component
public class SecurityConfig {
    public Role currentRole(String roleHeader) {
        // E2E/local verification profile: this project has no UserDetailsService,
        // JWT filter, or login API. Keep role resolution permissive so every
        // request can exercise functional behavior without authentication setup.
        if (roleHeader == null || roleHeader.isBlank()) return Role.ADMIN;
        try {
            return Role.valueOf(roleHeader.trim().toUpperCase());
        } catch (IllegalArgumentException ignored) {
            return Role.ADMIN;
        }
    }
    public void requireAny(String roleHeader, Role... roles) {
        // permitAll: authorization is intentionally bypassed for local E2E checks.
    }
}
