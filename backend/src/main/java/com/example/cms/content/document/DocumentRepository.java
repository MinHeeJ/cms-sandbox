package com.example.cms.content.document;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.Instant;

@Repository
public class DocumentRepository {
    private final JdbcTemplate jdbc;
    public DocumentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    private DocumentDto map(java.sql.ResultSet rs, int i) throws java.sql.SQLException { return new DocumentDto(rs.getLong("id"), rs.getLong("folder_id"), rs.getString("title"), rs.getString("markdown_body"), rs.getString("rendered_html"), DocumentStatus.valueOf(rs.getString("status")), rs.getInt("display_order"), rs.getTimestamp("updated_at").toInstant()); }
    public DocumentDto create(Long folderId, String title, String body, String html, int order) { return jdbc.queryForObject("insert into documents(folder_id,title,markdown_body,rendered_html,status,display_order,created_by,updated_by,created_at,updated_at) values (?,?,?,?, 'DRAFT', ?, 'admin','admin', now(), now()) returning *", this::map, folderId, title, body, html, order); }
    public DocumentDto update(Long id, Long folderId, String title, String body, String html) { return jdbc.queryForObject("update documents set folder_id=?, title=?, markdown_body=?, rendered_html=?, status=case when status='PUBLISHED' then 'REVIEWED' else status end, updated_at=now(), updated_by='admin' where id=? and deleted_at is null returning *", this::map, folderId, title, body, html, id); }
    public DocumentDto transition(Long id, DocumentStatus status) { return jdbc.queryForObject("update documents set status=?, published_at=case when ?='PUBLISHED' then now() else published_at end, updated_at=now() where id=? and deleted_at is null returning *", this::map, status.name(), status.name(), id); }
    public void delete(Long id) { jdbc.update("update documents set status='DELETED', deleted_at=now() where id=?", id); }
    public List<DocumentDto> adminList() { return jdbc.query("select * from documents where deleted_at is null order by display_order,id", this::map); }
    public List<DocumentDto> portalList() { return jdbc.query("select d.* from documents d join folders f on f.id=d.folder_id where d.status='PUBLISHED' and d.deleted_at is null and f.active=true and f.deleted_at is null order by d.display_order,d.id", this::map); }
    public DocumentDto findPortal(Long id) { return jdbc.queryForObject("select d.* from documents d join folders f on f.id=d.folder_id where d.id=? and d.status='PUBLISHED' and d.deleted_at is null and f.active=true and f.deleted_at is null", this::map, id); }
}
