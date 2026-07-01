INSERT INTO folders(id, parent_id, name, active, display_order, created_by, created_at, updated_at)
VALUES (1, NULL, '운영 가이드', TRUE, 1, 'seed', now(), now()), (2, NULL, '비공개 준비', FALSE, 2, 'seed', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO documents(id, folder_id, title, markdown_body, rendered_html, status, display_order, created_by, updated_by, created_at, updated_at)
VALUES
(1, 1, '마크다운 작성 표준', '# 마크다운 작성 표준

|항목|상태|
|---|---|
|표|지원|', '<h1>마크다운 작성 표준</h1>', 'PUBLISHED', 1, 'seed', 'seed', now(), now()),
(2, 1, '미게시 검증 문서', '# 미게시', '<h1>미게시</h1>', 'UNPUBLISHED', 2, 'seed', 'seed', now(), now()),
(3, 1, '삭제 검증 문서', '# 삭제', '<h1>삭제</h1>', 'DELETED', 3, 'seed', 'seed', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO attachments(id, document_id, original_file_name, storage_key, file_size_bytes, extension, mime_type, storage_location, deleted, created_by, created_at)
VALUES (1, 1, 'sample-guide.pdf', 'seed/sample-guide.pdf', 1024, 'pdf', 'application/pdf', 'LOCAL', FALSE, 'seed', now()),
(2, 1, 'deleted-file.pdf', 'seed/deleted-file.pdf', 2048, 'pdf', 'application/pdf', 'LOCAL', TRUE, 'seed', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO deployment_records(version, source_commit, build_number, test_result, environment, approver, rollback_available)
VALUES ('0.1.0', 'local-seed', 'B-001', 'PASSED', 'LOCAL', 'operator', TRUE);

INSERT INTO software_components(name, version, license, usage_scope, review_status)
VALUES ('Spring Boot', '3.3.5', 'Apache-2.0', 'backend api', 'APPROVED'), ('React', '18.3.1', 'MIT', 'frontend ui', 'APPROVED');

INSERT INTO vulnerability_records(component_name, severity, impact_scope, action_plan, status)
VALUES ('Spring Boot', 'LOW', '로컬 검증', '정기 점검 유지', 'CLOSED');

INSERT INTO backup_records(backup_type, status, target_scope, storage_location, consistency_result, performed_by)
VALUES ('MANUAL', 'SUCCESS', 'DATABASE_FILES', '/var/backups/cms/local', 'SUCCESS', 'operator');

INSERT INTO migration_records(source_name, source_format, status, total_count, success_count, failed_count, duplicate_count)
VALUES ('local-import', 'MARKDOWN', 'SUCCESS', 3, 3, 0, 0);

INSERT INTO project_schedules(phase, task_name, owner_id, start_date, end_date, progress_percent, status)
VALUES ('MVP', '콘텐츠 관리 구현', 'pm-1', current_date, current_date + 14, 45, 'IN_PROGRESS');

INSERT INTO requirement_traces(requirement_code, source, scope_status)
VALUES ('FR-005', 'RFP', 'IN_SCOPE') ON CONFLICT (requirement_code) DO NOTHING;

INSERT INTO project_members(member_name, organization, project_role, start_date, end_date, allocation_percent, approval_status)
VALUES ('김PM', 'AIOps', 'PM', current_date, current_date + 90, 100, 'APPROVED');

INSERT INTO risk_issues(title, issue_type, severity, cause, impact, owner_id, due_date, status)
VALUES ('검색 성능 목표 미확정', 'RISK', 'MEDIUM', '목표 데이터 규모 미확정', '검색 튜닝 지연 가능', 'pm-1', current_date + 7, 'OPEN');

INSERT INTO deliverables(deliverable_name, deliverable_type, due_date, owner_id, version, approval_status)
VALUES ('CMS 설계서', 'DESIGN', current_date + 10, 'pm-1', 'v0.1', 'SUBMITTED');

INSERT INTO change_requests(target_type, reason, requester_id, expected_effect, impact_analysis, approval_status)
VALUES ('REQUIREMENT', 'PDF 변환 범위 확정', 'pm-1', '처리 실패 사유 명확화', '일정 영향 낮음', 'ANALYZING');

SELECT setval(pg_get_serial_sequence('folders', 'id'), coalesce((SELECT max(id) FROM folders), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('documents', 'id'), coalesce((SELECT max(id) FROM documents), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('attachments', 'id'), coalesce((SELECT max(id) FROM attachments), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('deployment_records', 'id'), coalesce((SELECT max(id) FROM deployment_records), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('software_components', 'id'), coalesce((SELECT max(id) FROM software_components), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('vulnerability_records', 'id'), coalesce((SELECT max(id) FROM vulnerability_records), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('backup_records', 'id'), coalesce((SELECT max(id) FROM backup_records), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('migration_records', 'id'), coalesce((SELECT max(id) FROM migration_records), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('project_schedules', 'id'), coalesce((SELECT max(id) FROM project_schedules), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('requirement_traces', 'id'), coalesce((SELECT max(id) FROM requirement_traces), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('project_members', 'id'), coalesce((SELECT max(id) FROM project_members), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('risk_issues', 'id'), coalesce((SELECT max(id) FROM risk_issues), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('deliverables', 'id'), coalesce((SELECT max(id) FROM deliverables), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('change_requests', 'id'), coalesce((SELECT max(id) FROM change_requests), 0) + 1, false);
