CREATE TABLE privacy_requests (
    privacy_request_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(member_id),
    request_type TEXT NOT NULL CHECK (request_type IN ('withdrawal', 'export', 'anonymization', 'correction', 'retention_hold_review')),
    requested_by TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('submitted', 'verifying', 'approved', 'rejected', 'on_hold', 'completed', 'canceled')),
    verification_required BOOLEAN NOT NULL DEFAULT TRUE,
    hold_reason TEXT,
    reviewer_id TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    evidence_ref TEXT,
    reason TEXT
);

CREATE INDEX idx_privacy_requests_status_type_requested
    ON privacy_requests (status, request_type, requested_at DESC);

CREATE INDEX idx_privacy_requests_member_requested
    ON privacy_requests (member_id, requested_at DESC);
