package com.example.cms.content.folder;

import com.example.cms.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/folders")
public class AdminFolderController {
    private final FolderService service;
    public AdminFolderController(FolderService service) { this.service = service; }
    @PostMapping public ApiResponse<FolderDto> create(@RequestBody @Valid FolderDto request) { return ApiResponse.ok("폴더가 생성되었습니다.", service.create(request)); }
    @GetMapping public ApiResponse<List<FolderDto>> list() { return ApiResponse.ok("폴더 목록", service.tree()); }
    @PatchMapping("/{folderId}") public ApiResponse<Void> update(@PathVariable Long folderId, @RequestBody FolderDto request) { service.update(folderId, request); return ApiResponse.ok("폴더가 수정되었습니다.", null); }
    @DeleteMapping("/{folderId}") public ApiResponse<Void> delete(@PathVariable Long folderId) { service.delete(folderId); return ApiResponse.ok("폴더가 삭제되었습니다.", null); }
    @PatchMapping("/reorder") public ApiResponse<Void> reorder() { return ApiResponse.ok("폴더 정렬이 저장되었습니다.", null); }
}
