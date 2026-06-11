CREATE TABLE members (
    member_id TEXT PRIMARY KEY,
    public_member_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('pending_verification', 'active', 'dormant', 'suspended', 'withdrawn', 'anonymized')),
    registration_source TEXT NOT NULL,
    verification_level TEXT NOT NULL DEFAULT 'none',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    activated_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    dormant_at TIMESTAMPTZ,
    withdrawn_at TIMESTAMPTZ,
    anonymized_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE member_profiles (
    profile_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE REFERENCES members(member_id),
    nickname TEXT NOT NULL,
    normalized_nickname TEXT NOT NULL UNIQUE,
    avatar_asset_ref TEXT,
    bio TEXT CHECK (char_length(bio) <= 500),
    community_grade TEXT NOT NULL DEFAULT 'new_member',
    profile_visibility TEXT NOT NULL CHECK (profile_visibility IN ('public', 'members_only', 'private')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contact_points (
    contact_point_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(member_id),
    type TEXT NOT NULL CHECK (type IN ('email', 'mobile')),
    value_hash TEXT NOT NULL,
    masked_value TEXT NOT NULL,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'expired', 'replaced')),
    verified_at TIMESTAMPTZ,
    primary_for_login BOOLEAN NOT NULL DEFAULT FALSE,
    notification_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    replaced_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_contact_points_verified_value
    ON contact_points (type, value_hash)
    WHERE verification_status = 'verified';

CREATE TABLE consent_records (
    consent_record_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(member_id),
    consent_type TEXT NOT NULL,
    policy_version TEXT NOT NULL,
    required BOOLEAN NOT NULL,
    granted BOOLEAN NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    captured_source TEXT NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE TABLE verification_attempts (
    verification_attempt_id TEXT PRIMARY KEY,
    member_id TEXT REFERENCES members(member_id),
    pending_registration_key TEXT,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'mobile', 'identity_provider')),
    purpose TEXT NOT NULL CHECK (purpose IN ('registration', 'contact_change', 'recovery', 'privacy_request')),
    destination_hash TEXT NOT NULL,
    masked_destination TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    outcome TEXT NOT NULL CHECK (outcome IN ('pending', 'passed', 'failed', 'expired', 'rate_limited')),
    completed_at TIMESTAMPTZ
);
