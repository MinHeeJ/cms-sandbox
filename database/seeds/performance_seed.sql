-- 목표 데이터 규모 검증용 seed 예시. 운영 데이터로 사용하지 않는다.
INSERT INTO folders(parent_id, name, active, display_order, created_by, created_at, updated_at)
SELECT NULL, '성능 폴더 ' || g, TRUE, g, 'perf', now(), now() FROM generate_series(1, 100) g;
