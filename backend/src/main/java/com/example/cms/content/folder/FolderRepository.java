package com.example.cms.content.folder;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class FolderRepository {
    private final JdbcTemplate jdbc;
    public FolderRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public FolderDto create(Long parentId, String name, boolean active, int order) {
        return jdbc.queryForObject("insert into folders(parent_id,name,active,display_order,created_by,created_at,updated_at) values (?,?,?,?, 'admin', now(), now()) returning id,parent_id,name,active,display_order", (rs, i) -> new FolderDto(rs.getLong(1), (Long)rs.getObject(2), rs.getString(3), rs.getBoolean(4), rs.getInt(5)), parentId, name, active, order);
    }
    public List<FolderDto> listActive() { return jdbc.query("select id,parent_id,name,active,display_order from folders where active=true and deleted_at is null order by display_order,id", (rs,i)->new FolderDto(rs.getLong(1),(Long)rs.getObject(2),rs.getString(3),rs.getBoolean(4),rs.getInt(5))); }
    public void rename(Long id, String name, boolean active) { jdbc.update("update folders set name=?, active=?, updated_at=now() where id=? and deleted_at is null", name, active, id); }
    public void delete(Long id) { jdbc.update("update folders set deleted_at=now(), active=false where id=?", id); }
}
