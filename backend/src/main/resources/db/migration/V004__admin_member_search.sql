CREATE INDEX idx_members_status_created
    ON members (status, created_at DESC);

CREATE INDEX idx_members_last_activity
    ON members (last_activity_at DESC);

CREATE INDEX idx_member_profiles_nickname_trgm_ready
    ON member_profiles (normalized_nickname);

CREATE INDEX idx_contact_points_member_type
    ON contact_points (member_id, type, verification_status);

CREATE INDEX idx_consent_records_member_type
    ON consent_records (member_id, consent_type, captured_at DESC);
