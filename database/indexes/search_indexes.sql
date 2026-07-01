CREATE INDEX IF NOT EXISTS idx_documents_title_trgm ON documents USING gin (title gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_body_search ON documents USING gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(markdown_body,''))) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_portal_visibility_filter ON documents(status, folder_id, updated_at DESC) WHERE deleted_at IS NULL AND status = 'PUBLISHED';

-- 검증 query: 게시 문서 검색은 folders.active=true 및 documents.status='PUBLISHED' 조건을 함께 사용한다.
