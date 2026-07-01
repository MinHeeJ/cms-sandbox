package com.example.cms.content.document;

import com.example.cms.common.error.BusinessException;
import com.example.cms.common.error.ErrorCode;
import com.example.cms.content.markdown.MarkdownRenderService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository repository;
    private final MarkdownRenderService markdown;
    public DocumentService(DocumentRepository repository, MarkdownRenderService markdown) { this.repository = repository; this.markdown = markdown; }
    public DocumentDto create(DocumentDto request) { validate(request); return repository.create(request.folderId(), request.title(), request.markdownBody(), markdown.render(request.markdownBody()), request.displayOrder()); }
    public DocumentDto update(Long id, DocumentDto request) { validate(request); return repository.update(id, request.folderId(), request.title(), request.markdownBody(), markdown.render(request.markdownBody())); }
    public DocumentDto review(Long id) { return repository.transition(id, DocumentStatus.REVIEWED); }
    public DocumentDto publish(Long id) { return repository.transition(id, DocumentStatus.PUBLISHED); }
    public DocumentDto unpublish(Long id) { return repository.transition(id, DocumentStatus.UNPUBLISHED); }
    public void delete(Long id) { repository.delete(id); }
    public List<DocumentDto> adminList() { return repository.adminList(); }
    private void validate(DocumentDto request) { if (request.folderId()==null || request.title()==null || request.title().isBlank()) throw new BusinessException(ErrorCode.VALIDATION_ERROR, "폴더와 제목은 필수입니다."); }
}
