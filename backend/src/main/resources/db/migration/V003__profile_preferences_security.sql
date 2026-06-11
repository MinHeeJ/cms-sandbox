CREATE TABLE member_credentials (
    credential_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE REFERENCES members(member_id),
    password_hash_ref TEXT,
    password_changed_at TIMESTAMPTZ,
    failed_login_count INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    security_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_preferences (
    preference_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE REFERENCES members(member_id),
    service_notices_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_email_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    community_digest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
