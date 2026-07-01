package com.example.cms.content.document;
import java.time.Instant;
public record DocumentDto(Long id, Long folderId, String title, String markdownBody, String renderedHtml, DocumentStatus status, int displayOrder, Instant updatedAt) {}
