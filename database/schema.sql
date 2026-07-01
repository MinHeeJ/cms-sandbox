CREATE TABLE IF NOT EXISTS folders (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES folders(id),
  name VARCHAR(200) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT folders_no_self_parent CHECK (parent_id IS NULL OR parent_id <> id)
);
COMMENT ON TABLE folders IS '콘텐츠를 계층적으로 분류하는 폴더 구조와 포털 노출 활성 상태를 관리한다.';
COMMENT ON COLUMN folders.parent_id IS 'folders.id 참조 의도 (상위 폴더)';
COMMENT ON COLUMN folders.active IS 'TRUE:활성|FALSE:비활성';

CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  folder_id BIGINT NOT NULL REFERENCES folders(id),
  title VARCHAR(300) NOT NULL,
  markdown_body TEXT NOT NULL,
  rendered_html TEXT NOT NULL DEFAULT '',
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','REVIEWED','PUBLISHED','UNPUBLISHED','DELETED')),
  display_order INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_by VARCHAR(100) NOT NULL,
  updated_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
COMMENT ON TABLE documents IS '마크다운 본문, 발행 상태, 폴더 연결, 표시 순서를 포함하는 핵심 콘텐츠를 저장한다.';
COMMENT ON COLUMN documents.status IS 'DRAFT:초안|REVIEWED:검토완료|PUBLISHED:게시중|UNPUBLISHED:게시중단|DELETED:삭제됨';
COMMENT ON COLUMN documents.rendered_html IS 'MarkdownRenderService 저장·수정 시 애플리케이션에서 갱신';

CREATE INDEX IF NOT EXISTS idx_folders_parent_order ON folders(parent_id, display_order, id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_folder_order ON documents(folder_id, display_order, id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_status_visibility ON documents(status, folder_id) WHERE deleted_at IS NULL;


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


CREATE TABLE IF NOT EXISTS project_schedules (
  id BIGSERIAL PRIMARY KEY,
  phase VARCHAR(100) NOT NULL,
  task_name VARCHAR(200) NOT NULL,
  owner_id VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  status VARCHAR(30) NOT NULL,
  delay_reason TEXT,
  action_plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
COMMENT ON TABLE project_schedules IS '사업 단계별 일정, 마일스톤, 진행률, 지연 사유와 조치 방안을 관리한다.';
COMMENT ON COLUMN project_schedules.owner_id IS 'project_members.id 참조 의도 (외부 인력 기준 가능성으로 FK 미선언)';
COMMENT ON COLUMN project_schedules.status IS 'PLANNED:계획됨|IN_PROGRESS:진행중|DELAYED:지연|COMPLETED:완료|CANCELLED:취소';

CREATE TABLE IF NOT EXISTS requirement_traces (
  id BIGSERIAL PRIMARY KEY,
  requirement_code VARCHAR(100) NOT NULL UNIQUE,
  source VARCHAR(200) NOT NULL,
  scope_status VARCHAR(30) NOT NULL,
  change_request_id BIGINT,
  linked_schedule_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE requirement_traces IS '요구사항 식별자, 출처, 범위 상태, 변경 요청 및 일정 연결 정보를 추적한다.';
COMMENT ON COLUMN requirement_traces.scope_status IS 'IN_SCOPE:범위내|OUT_OF_SCOPE:범위외|REVIEW_REQUIRED:검토필요|APPROVED_CHANGE:변경승인';
COMMENT ON COLUMN requirement_traces.change_request_id IS 'change_requests.id 참조 의도 (순환 생성 순서로 FK 미선언)';
COMMENT ON COLUMN requirement_traces.linked_schedule_id IS 'project_schedules.id 참조 의도 (FK 미선언)';

CREATE TABLE IF NOT EXISTS project_members (
  id BIGSERIAL PRIMARY KEY,
  member_name VARCHAR(100) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  project_role VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  allocation_percent INTEGER NOT NULL CHECK (allocation_percent BETWEEN 1 AND 100),
  approval_status VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
COMMENT ON TABLE project_members IS '프로젝트 투입 인력, 역할, 투입 기간, 투입률, 주요 인력 변경 승인 상태를 관리한다.';
COMMENT ON COLUMN project_members.project_role IS 'PM:PM|DEV:개발|QA:품질|OPS:운영|SECURITY:보안|REVIEWER:검수';
COMMENT ON COLUMN project_members.approval_status IS 'PENDING:승인대기|APPROVED:승인|REJECTED:반려';

CREATE TABLE IF NOT EXISTS risk_issues (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  issue_type VARCHAR(30) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  cause TEXT NOT NULL,
  impact TEXT NOT NULL,
  owner_id VARCHAR(100) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL,
  resolution TEXT,
  verification TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE risk_issues IS '위험과 이슈의 원인, 영향, 담당자, 기한, 조치 및 검증 결과를 관리한다.';
COMMENT ON COLUMN risk_issues.issue_type IS 'RISK:위험|ISSUE:이슈';
COMMENT ON COLUMN risk_issues.severity IS 'LOW:낮음|MEDIUM:중간|HIGH:높음|CRITICAL:긴급';
COMMENT ON COLUMN risk_issues.status IS 'OPEN:접수|IN_PROGRESS:조치중|RESOLVED:해결|CLOSED:종료';
COMMENT ON COLUMN risk_issues.owner_id IS 'project_members.id 참조 의도 (FK 미선언)';

CREATE TABLE IF NOT EXISTS deliverables (
  id BIGSERIAL PRIMARY KEY,
  deliverable_name VARCHAR(200) NOT NULL,
  deliverable_type VARCHAR(100) NOT NULL,
  due_date DATE NOT NULL,
  owner_id VARCHAR(100) NOT NULL,
  approver_id VARCHAR(100),
  version VARCHAR(50) NOT NULL,
  approval_status VARCHAR(30) NOT NULL,
  rejection_reason TEXT,
  requirement_trace_id BIGINT,
  schedule_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE deliverables IS '산출물명, 유형, 버전, 제출 일정, 승인 상태와 반려 사유를 관리한다.';
COMMENT ON COLUMN deliverables.approval_status IS 'DRAFT:초안|SUBMITTED:제출|APPROVED:승인|REJECTED:반려';
COMMENT ON COLUMN deliverables.owner_id IS 'project_members.id 참조 의도 (FK 미선언)';
COMMENT ON COLUMN deliverables.approver_id IS 'project_members.id 참조 의도 (FK 미선언)';
COMMENT ON COLUMN deliverables.requirement_trace_id IS 'requirement_traces.id 참조 의도 (FK 미선언)';
COMMENT ON COLUMN deliverables.schedule_id IS 'project_schedules.id 참조 의도 (FK 미선언)';

CREATE TABLE IF NOT EXISTS change_requests (
  id BIGSERIAL PRIMARY KEY,
  target_type VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  requester_id VARCHAR(100) NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expected_effect TEXT NOT NULL,
  impact_analysis TEXT,
  approval_status VARCHAR(30) NOT NULL,
  implementation_result TEXT,
  verification_done BOOLEAN NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE change_requests IS '요구사항, 설계, 일정, 산출물 변경 요청의 영향도 분석, 승인, 반영, 검증 절차를 관리한다.';
COMMENT ON COLUMN change_requests.target_type IS 'REQUIREMENT:요구사항|DESIGN:설계|SCHEDULE:일정|DELIVERABLE:산출물';
COMMENT ON COLUMN change_requests.requester_id IS 'project_members.id 참조 의도 (FK 미선언)';
COMMENT ON COLUMN change_requests.approval_status IS 'REQUESTED:요청|ANALYZING:영향분석중|APPROVED:승인|REJECTED:반려|IMPLEMENTED:반영완료';
COMMENT ON COLUMN change_requests.verification_done IS 'TRUE:검증완료|FALSE:검증미완료';

CREATE INDEX IF NOT EXISTS idx_project_schedules_status ON project_schedules(status, end_date);
CREATE INDEX IF NOT EXISTS idx_requirement_traces_scope ON requirement_traces(scope_status);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON project_members(project_role, approval_status);
CREATE INDEX IF NOT EXISTS idx_risk_issues_status_due ON risk_issues(status, due_date);
CREATE INDEX IF NOT EXISTS idx_deliverables_status_due ON deliverables(approval_status, due_date);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON change_requests(approval_status, requested_at DESC);
