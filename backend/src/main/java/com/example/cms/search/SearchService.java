package com.example.cms.search;
import com.example.cms.content.document.*;
import com.example.cms.common.error.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class SearchService {
  private final JdbcTemplate jdbc;
  public SearchService(JdbcTemplate jdbc){this.jdbc=jdbc;}
  public List<Map<String,Object>> search(String query){
    if(query==null || query.trim().length()<2) throw new BusinessException(ErrorCode.VALIDATION_ERROR,"검색어는 2자 이상 입력해 주세요.");
    String q="%"+query.trim()+"%";
    return jdbc.queryForList("select d.id,d.title,left(d.markdown_body,160) summary,d.updated_at from documents d join folders f on f.id=d.folder_id where d.status='PUBLISHED' and d.deleted_at is null and f.active=true and f.deleted_at is null and (d.title ilike ? or d.markdown_body ilike ?) order by d.updated_at desc", q, q);
  }
}
