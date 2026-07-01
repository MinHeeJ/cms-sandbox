package com.example.cms.attachment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public class AttachmentRepository {
 private final JdbcTemplate jdbc; public AttachmentRepository(JdbcTemplate jdbc){this.jdbc=jdbc;}
 AttachmentDto map(java.sql.ResultSet rs,int i)throws java.sql.SQLException{return new AttachmentDto(rs.getLong("id"),rs.getLong("document_id"),rs.getString("original_file_name"),rs.getString("storage_key"),rs.getLong("file_size_bytes"),rs.getString("extension"),rs.getString("mime_type"),rs.getBoolean("deleted"),rs.getTimestamp("created_at").toInstant());}
 public AttachmentDto save(Long doc,String name,String key,long size,String ext,String mime){return jdbc.queryForObject("insert into attachments(document_id,original_file_name,storage_key,file_size_bytes,extension,mime_type,created_by,created_at) values (?,?,?,?,?,?, 'admin', now()) returning *",this::map,doc,name,key,size,ext,mime);}
 public List<AttachmentDto> list(Long doc){return jdbc.query("select * from attachments where document_id=? and deleted=false order by created_at desc",this::map,doc);}
 public AttachmentDto get(Long id){return jdbc.queryForObject("select * from attachments where id=? and deleted=false",this::map,id);}
 public void delete(Long id){jdbc.update("update attachments set deleted=true, deleted_at=now() where id=?",id);}
}
