package com.example.cms.content.folder;

import com.example.cms.common.error.BusinessException;
import com.example.cms.common.error.ErrorCode;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FolderService {
    private final FolderRepository repository;
    public FolderService(FolderRepository repository) { this.repository = repository; }
    public FolderDto create(FolderDto request) {
        if (request.name() == null || request.name().isBlank()) throw new BusinessException(ErrorCode.VALIDATION_ERROR, "폴더명은 필수입니다.");
        if (request.id() != null && request.id().equals(request.parentId())) throw new BusinessException(ErrorCode.CONFLICT, "상위 폴더를 자기 자신으로 지정할 수 없습니다.");
        return repository.create(request.parentId(), request.name(), request.active(), request.displayOrder());
    }
    public List<FolderDto> tree() { return repository.listActive(); }
    public void update(Long id, FolderDto request) { repository.rename(id, request.name(), request.active()); }
    public void delete(Long id) { repository.delete(id); }
}
