package com.example.cms.attachment;
import java.time.Instant;
public record Attachment(Long id, Long documentId, String originalFileName, String storageKey, long fileSizeBytes, String extension, String mimeType, boolean deleted, Instant createdAt) {}
