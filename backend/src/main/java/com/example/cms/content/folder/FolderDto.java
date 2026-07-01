package com.example.cms.content.folder;
public record FolderDto(Long id, Long parentId, String name, boolean active, int displayOrder) {}
