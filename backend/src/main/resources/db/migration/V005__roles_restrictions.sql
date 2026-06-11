CREATE TABLE role_assignments (
    role_assignment_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(member_id),
    role_key TEXT NOT NULL,
    scope TEXT NOT NULL,
    granted_by TEXT NOT NULL,
    reason TEXT,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by TEXT
);

CREATE INDEX idx_role_assignments_member_active
    ON role_assignments (member_id, role_key)
    WHERE revoked_at IS NULL;

CREATE TABLE restrictions (
    restriction_id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(member_id),
    restriction_type TEXT NOT NULL CHECK (restriction_type IN ('login', 'posting', 'commenting', 'messaging', 'profile_edit', 'full_account')),
    status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'lifted')),
    reason_code TEXT NOT NULL,
    reason_text TEXT NOT NULL CHECK (char_length(reason_text) <= 1000),
    source_case_ref TEXT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    created_by TEXT NOT NULL,
    lifted_by TEXT
);

CREATE INDEX idx_restrictions_member_status
    ON restrictions (member_id, status, restriction_type);
