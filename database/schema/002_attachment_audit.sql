CREATE TABLE IF NOT EXISTS attachments (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL REFERENCES documents(id),
  original_file_name VARCHAR(500) NOT NULL,
  storage_key VARCHAR(700) NOT NULL UNIQUE,
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
  extension VARCHAR(30) NOT NULL,
  mime_type VARCHAR(200) NOT NULL,
  storage_location VARCHAR(200) NOT NULL DEFAULT 'LOCAL',
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
COMMENT ON TABLE attachments IS '문서에 연결된 첨부파일 메타데이터와 저장 키, 삭제 상태를 관리한다.';
COMMENT ON COLUMN attachments.storage_location IS 'LOCAL:로컬파일|MINIO:MinIO|NAS:NAS|OBJECT_STORAGE:오브젝트스토리지';
COMMENT ON COLUMN attachments.deleted IS 'FALSE:사용가능|TRUE:삭제됨';

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  target_type VARCHAR(100) NOT NULL,
  target_id BIGINT,
  action_type VARCHAR(50) NOT NULL,
  actor_id VARCHAR(100) NOT NULL,
  actor_role VARCHAR(50) NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE audit_logs IS '콘텐츠, 첨부파일, 운영, 프로젝트 데이터의 생성·수정·삭제 행위를 감사 목적으로 기록한다.';
COMMENT ON COLUMN audit_logs.target_id IS '대상 테이블의 id 참조 의도 (다형 감사 로그)';
COMMENT ON COLUMN audit_logs.action_type IS 'CREATE:생성|UPDATE:수정|DELETE:삭제|PUBLISH:발행|UNPUBLISH:게시중단|BACKUP:백업|RESTORE:복구|MIGRATE:이관';
COMMENT ON COLUMN audit_logs.actor_role IS 'ADMIN:관리자|USER:일반사용자|OPERATOR:운영자|REVIEWER:검수자|PM:PM';

CREATE INDEX IF NOT EXISTS idx_attachments_document_visible ON attachments(document_id, deleted, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_time ON audit_logs(target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_time ON audit_logs(actor_id, created_at DESC);
