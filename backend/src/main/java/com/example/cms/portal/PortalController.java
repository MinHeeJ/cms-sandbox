package com.example.cms.portal;
import com.example.cms.common.response.ApiResponse;
import com.example.cms.content.document.DocumentDto;
import com.example.cms.content.folder.FolderDto;
import com.example.cms.search.SearchService;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
public class PortalController {
 private final PortalTreeService tree; private final PortalDocumentService docs; private final SearchService search;
 public PortalController(PortalTreeService tree, PortalDocumentService docs, SearchService search){this.tree=tree;this.docs=docs;this.search=search;}
 @GetMapping("/api/portal/tree") public ApiResponse<List<FolderDto>> tree(){return ApiResponse.ok("포털 트리", tree.tree());}
 @GetMapping("/api/portal/folders/{folderId}/children") public ApiResponse<List<DocumentDto>> children(@PathVariable Long folderId){return ApiResponse.ok("하위 문서", docs.documents().stream().filter(d->d.folderId().equals(folderId)).toList());}
 @GetMapping("/api/portal/documents/{documentId}") public ApiResponse<DocumentDto> document(@PathVariable Long documentId){return ApiResponse.ok("문서 본문", docs.get(documentId));}
 @GetMapping("/api/portal/search") public ApiResponse<List<Map<String,Object>>> search(@RequestParam String query){return ApiResponse.ok("검색 결과", search.search(query));}
}
