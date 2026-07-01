package com.example.cms.content.document;

import com.example.cms.common.response.ApiResponse;
import com.example.cms.content.markdown.MarkdownRenderService;
import com.example.cms.content.pdf.PdfImportService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
public class AdminDocumentController {
    private final DocumentService service; private final MarkdownRenderService markdown; private final PdfImportService pdf;
    public AdminDocumentController(DocumentService service, MarkdownRenderService markdown, PdfImportService pdf) { this.service=service; this.markdown=markdown; this.pdf=pdf; }
    @GetMapping("/api/admin/documents") public ApiResponse<List<DocumentDto>> list() { return ApiResponse.ok("문서 목록", service.adminList()); }
    @PostMapping("/api/admin/documents") public ApiResponse<DocumentDto> create(@RequestBody DocumentDto request) { return ApiResponse.ok("문서가 저장되었습니다.", service.create(request)); }
    @PutMapping("/api/admin/documents/{documentId}") public ApiResponse<DocumentDto> update(@PathVariable Long documentId, @RequestBody DocumentDto request) { return ApiResponse.ok("문서가 수정되었습니다.", service.update(documentId, request)); }
    @PostMapping("/api/admin/documents/{documentId}/review") public ApiResponse<DocumentDto> review(@PathVariable Long documentId) { return ApiResponse.ok("검토 완료되었습니다.", service.review(documentId)); }
    @PostMapping("/api/admin/documents/{documentId}/publish") public ApiResponse<DocumentDto> publish(@PathVariable Long documentId) { return ApiResponse.ok("문서가 발행되었습니다.", service.publish(documentId)); }
    @PostMapping("/api/admin/documents/{documentId}/unpublish") public ApiResponse<DocumentDto> unpublish(@PathVariable Long documentId) { return ApiResponse.ok("게시 중단되었습니다.", service.unpublish(documentId)); }
    @DeleteMapping("/api/admin/documents/{documentId}") public ApiResponse<Void> delete(@PathVariable Long documentId) { service.delete(documentId); return ApiResponse.ok("문서가 삭제되었습니다.", null); }
    @PatchMapping("/api/admin/documents/reorder") public ApiResponse<Void> reorder() { return ApiResponse.ok("문서 정렬이 저장되었습니다.", null); }
    @PostMapping("/api/admin/markdown/preview") public ApiResponse<Map<String,String>> preview(@RequestBody Map<String,String> body) { return ApiResponse.ok("미리보기", Map.of("html", markdown.render(body.get("markdown")))); }
    @PostMapping("/api/admin/pdf/inspect") public ApiResponse<Map<String,Object>> pdf(@RequestBody Map<String,Object> body) { return ApiResponse.ok("PDF 처리 범위", pdf.inspect(String.valueOf(body.get("fileName")), Long.parseLong(String.valueOf(body.getOrDefault("size", "0"))))); }
}
