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
