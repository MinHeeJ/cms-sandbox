# Schema 적용 순서

1. `database/schema/001_core_content.sql`
2. `database/schema/002_attachment_audit.sql`
3. `database/schema/003_operations_data.sql`
4. `database/schema/004_project_management.sql`
5. `database/indexes/search_indexes.sql`
6. `database/seeds/local_seed.sql` (로컬 검증 전용)

모든 CREATE TABLE/INDEX는 `IF NOT EXISTS`를 사용하므로 반복 실행이 가능하다. PostgreSQL 16 기준으로 검증한다.
