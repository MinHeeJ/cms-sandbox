package com.example.cms.portal;
import com.example.cms.content.document.DocumentDto;
import com.example.cms.content.document.DocumentStatus;
import org.springframework.stereotype.Component;
@Component
public class ContentVisibilityPolicy { public boolean visible(DocumentDto d) { return d.status() == DocumentStatus.PUBLISHED; } }
