CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE admin_audit_events (
    audit_event_id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    target_member_id TEXT,
    action_type TEXT NOT NULL,
    outcome TEXT NOT NULL CHECK (outcome IN ('allowed', 'denied', 'conflict', 'failed')),
    reason TEXT,
    sensitive_data_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    request_id TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    source_ip_hash TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_events_target_created
    ON admin_audit_events (target_member_id, created_at DESC);
