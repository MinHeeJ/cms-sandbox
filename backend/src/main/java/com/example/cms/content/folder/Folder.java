package com.example.cms.content.folder;
public record Folder(Long id, Long parentId, String name, boolean active, int displayOrder) {}
