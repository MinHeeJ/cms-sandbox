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
