CREATE TABLE IF NOT EXISTS deployment_records (
  id BIGSERIAL PRIMARY KEY,
  version VARCHAR(100) NOT NULL,
  source_commit VARCHAR(100) NOT NULL,
  build_number VARCHAR(100) NOT NULL,
  test_result VARCHAR(30) NOT NULL,
  environment VARCHAR(50) NOT NULL,
  approver VARCHAR(100) NOT NULL,
  rollback_available BOOLEAN NOT NULL DEFAULT TRUE,
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE deployment_records IS '배포 버전, 소스 커밋, 빌드·테스트 결과, 승인자, 롤백 가능 여부를 추적한다.';
COMMENT ON COLUMN deployment_records.test_result IS 'PASSED:통과|FAILED:실패|SKIPPED:미실행';
COMMENT ON COLUMN deployment_records.environment IS 'LOCAL:로컬|DEV:개발|TEST:테스트|PROD:운영';
COMMENT ON COLUMN deployment_records.rollback_available IS 'TRUE:롤백가능|FALSE:롤백불가';

CREATE TABLE IF NOT EXISTS software_components (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  version VARCHAR(100) NOT NULL,
  license VARCHAR(100) NOT NULL,
  usage_scope VARCHAR(200) NOT NULL,
  review_status VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE software_components IS '오픈소스와 상용 소프트웨어의 버전, 라이선스, 사용 범위, 검토 상태를 관리한다.';
COMMENT ON COLUMN software_components.review_status IS 'APPROVED:승인|CONDITIONAL:조건부승인|RESTRICTED:사용제한|PROHIBITED:사용금지';

CREATE TABLE IF NOT EXISTS vulnerability_records (
  id BIGSERIAL PRIMARY KEY,
  component_id BIGINT REFERENCES software_components(id),
  component_name VARCHAR(200) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  impact_scope TEXT NOT NULL,
  action_plan TEXT NOT NULL,
  status VARCHAR(30) NOT NULL,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE vulnerability_records IS '소프트웨어 취약점의 심각도, 영향 범위, 조치 계획과 진행 상태를 기록한다.';
COMMENT ON COLUMN vulnerability_records.component_id IS 'software_components.id 참조 의도 (컴포넌트 삭제 정책상 FK 허용)';
COMMENT ON COLUMN vulnerability_records.severity IS 'LOW:낮음|MEDIUM:중간|HIGH:높음|CRITICAL:긴급';
COMMENT ON COLUMN vulnerability_records.status IS 'OPEN:조치대기|IN_PROGRESS:조치중|MITIGATED:완화|ACCEPTED:위험수용|CLOSED:종료';

CREATE TABLE IF NOT EXISTS backup_records (
  id BIGSERIAL PRIMARY KEY,
  backup_type VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL,
  target_scope VARCHAR(100) NOT NULL,
  storage_location VARCHAR(500) NOT NULL,
  consistency_result VARCHAR(30),
  performed_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE backup_records IS '데이터베이스와 파일 저장소 백업·복구 실행 결과와 정합성 검증 결과를 보존한다.';
COMMENT ON COLUMN backup_records.backup_type IS 'MANUAL:수동|SCHEDULED:정기|PRE_RESTORE:복구전';
COMMENT ON COLUMN backup_records.status IS 'SUCCESS:성공|PARTIAL_FAILED:부분실패|FAILED:실패';
COMMENT ON COLUMN backup_records.consistency_result IS 'SUCCESS:정상|PARTIAL_FAILED:일부불일치|FAILED:불일치|PENDING:검증대기';

CREATE TABLE IF NOT EXISTS migration_records (
  id BIGSERIAL PRIMARY KEY,
  source_name VARCHAR(200) NOT NULL,
  source_format VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL,
  total_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  duplicate_count INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE migration_records IS '기존 콘텐츠 또는 제공 자료의 초기 이관 결과, 오류, 중복 처리 내역을 관리한다.';
COMMENT ON COLUMN migration_records.status IS 'SUCCESS:성공|PARTIAL_FAILED:부분실패|FAILED:실패|PENDING:대기';

CREATE INDEX IF NOT EXISTS idx_deployment_records_time ON deployment_records(deployed_at DESC);
CREATE INDEX IF NOT EXISTS idx_software_components_name ON software_components(name, version);
CREATE INDEX IF NOT EXISTS idx_vulnerability_records_status ON vulnerability_records(status, severity);
CREATE INDEX IF NOT EXISTS idx_backup_records_time ON backup_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_migration_records_time ON migration_records(created_at DESC);
